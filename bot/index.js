const { Telegraf } = require('telegraf');
const express = require('express');
const { setupPayments } = require('./payments.js');

const BOT_TOKEN = process.env.BOT_TOKEN || '';
const PORT = process.env.PORT || 3000;
const WEBAPP_URL = process.env.WEBAPP_URL || 'https://celestial-oracle.web.app';

if (!BOT_TOKEN) {
  console.error('BOT_TOKEN is required!');
  process.exit(1);
}

const bot = new Telegraf(BOT_TOKEN);
const app = express();

// Setup payment handlers
setupPayments(bot, BOT_TOKEN);

// Session management (in-memory for demo, use Redis for production)
const sessions = new Map();

function getSession(userId) {
  if (!sessions.has(userId)) {
    sessions.set(userId, {
      step: 'idle',
      data: {},
      createdAt: new Date(),
    });
  }
  return sessions.get(userId);
}

function updateSession(userId, updates) {
  const session = getSession(userId);
  Object.assign(session, updates);
  sessions.set(userId, session);
  return session;
}

function clearSession(userId) {
  sessions.delete(userId);
}

// Welcome keyboard
function getMainKeyboard() {
  return {
    reply_markup: {
      keyboard: [
        [{ text: '🔮 Рассчитать нумерологию', web_app: { url: WEBAPP_URL } }],
        [{ text: '💎 Тарифы' }, { text: '❓ О проекте' }],
      ],
      resize_keyboard: true,
    },
  };
}

// /start command - emotional welcome
bot.start((ctx) => {
  const userId = ctx.from.id;
  const firstName = ctx.from.first_name || 'Друг';

  clearSession(userId);

  const welcomeMessage = `
✨ *Добро пожаловать в Celestial Oracle*, ${firstName}!

Ты здесь не случайно. Всё суть — это закономерность.

*Перестаньте гадать. Начните декодировать свою судьбу.*

Я помогу вам понять:
— 🎯 Куда вам двигаться
— 💫 Почему повторяются сценарии
— 🔮 Какие энергии активны сейчас
— 💎 Что несут ваши числа

Нажми кнопку ниже для первого расчёта 📊
  `.trim();

  ctx.replyWithMarkdownV2(welcomeMessage, getMainKeyboard());
});

// /calculate command
bot.command('calculate', (ctx) => {
  const userId = ctx.from.id;
  updateSession(userId, { step: 'awaiting_date' });

  ctx.reply(
    '🔮 Введите дату рождения в формате ДД.ММ.ГГГГ\n\nПример: 15.04.1990',
    { reply_markup: { force_reply: true } }
  );
});

// Handle date input
bot.on('text', (ctx) => {
  const userId = ctx.from.id;
  const session = getSession(userId);
  const text = ctx.message.text.trim();

  // Handle button callbacks
  if (text === '💎 Тарифы') {
    ctx.replyWithMarkdownV2(getPricingMessage());
    return;
  }

  if (text === '❓ О проекте') {
    ctx.replyWithMarkdownV2(getAboutMessage());
    return;
  }

  // Handle date calculation flow
  if (session.step === 'awaiting_date') {
    const dateMatch = text.match(/^(\d{2})\.(\d{2})\.(\d{4})$/);

    if (!dateMatch) {
      ctx.reply(
        '❌ Неверный формат. Используйте ДД.ММ.ГГГГ\n\nПример: 15.04.1990',
        { reply_markup: { force_reply: true } }
      );
      return;
    }

    const [, day, month, year] = dateMatch;
    const birthDate = new Date(year, month - 1, day);

    // Basic numerology calculation
    const lifePathNumber = calculateLifePathNumber(day, month, year);
    const destinyNumber = calculateDestinyNumber(day, month, year);

    updateSession(userId, {
      step: 'idle',
      data: { birthDate: text, lifePathNumber, destinyNumber },
    });

    ctx.replyWithMarkdownV2(
      getNumerologyResult(lifePathNumber, destinyNumber),
      getMainKeyboard()
    );
  }
});

// /pay command - transparent pricing
bot.command('pay', (ctx) => {
  ctx.replyWithMarkdownV2(getPricingMessage());
});

// Numerology calculations
function calculateLifePathNumber(day, month, year) {
  let sum = parseInt(day) + parseInt(month) + parseInt(year);

  while (sum > 9 && sum !== 11 && sum !== 22 && sum !== 33) {
    sum = String(sum).split('').reduce((a, b) => a + parseInt(b), 0);
  }

  return sum;
}

function calculateDestinyNumber(day, month, year) {
  const dateStr = `${day}${month}${year}`;
  let sum = dateStr.split('').reduce((a, b) => a + parseInt(b), 0);

  while (sum > 9 && sum !== 11 && sum !== 22 && sum !== 33) {
    sum = String(sum).split('').reduce((a, b) => a + parseInt(b), 0);
  }

  return sum;
}

function getNumerologyResult(lifePath, destiny) {
  const lifePathMeanings = {
    1: 'Лидер и новатор. Ваш путь — independence и pioneering.',
    2: 'Дипломат и посредник. Ваша сила — в гармонии и сотрудничестве.',
    3: 'Творец и самовыражение. Ваш путь — через искусство и коммуникацию.',
    4: 'Строитель. Ваша сила — в стабильности и hard work.',
    5: 'Исследователь. Ваш путь — через перемены и свободу.',
    6: 'Опекун. Ваша сила — в семье и ответственности.',
    7: 'Искатель истины. Ваш путь — через знания и introspection.',
    8: 'Властелин материи. Ваша сила — в достижении и abundance.',
    9: 'Гуманист. Ваш путь — через compassion и selflessness.',
    11: 'Мастер-интуитив. Высшее духовное осознание.',
    22: 'Мастер-строитель. Реализация глобальных vision.',
    33: 'Мастер-учитель. Служение через love и wisdom.',
  };

  return `
✨ *Ваша нумерологическая матрица*

🎯 *Число жизненного пути:* ${lifePath}
${lifePathMeanings[lifePath] || 'Уникальный путь.'}

💎 *Число судьбы:* ${destiny}
Ваши скрытые таланты и потенциал находятся здесь.

_
Для полного анализа откройте WebApp 👇
  `.trim();
}

function getPricingMessage() {
  return `
💎 *Тарифы Celestial Oracle*

🌱 *FREE* — навсегда
• Базовый расчёт
• Ежедневные энергии
• Сообщество

💫 *PREMIUM* — 367 ⭐/мес
• Глубокий анализ личности
• Прогноз на 90 дней
• Compatibility карты
• Приоритетная поддержка

👑 *LIFETIME* — 3667 ⭐
• Всегда доступно
• Все функции навсегда
• Эксклюзивные insights
• Персональные консультации

/premium — оформить Premium
/lifetime — оформить Lifetime
/status — проверить статус
  `.trim();
}

function getAboutMessage() {
  return `
🔮 *О Celestial Oracle*

Понимание без мистики. Рост без сверхусилий.

Мы декодируем паттерны вашей судьбы через:
— Нумерологию
— Транзиты планет
— Архетипические карты

• 50,000+ пользователей
• 98% чувствуют большей ясностью
• 4.9★ средняя оценка

Перестаньте гадать. Начните декодировать 🔮
  `.trim();
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Webhook endpoint for Telegram
app.use(bot.webhookCallback('/telegram'));

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Webhook URL: https://your-domain.com/telegram`);
});

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));

module.exports = bot;
