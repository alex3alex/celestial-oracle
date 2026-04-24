const { Telegraf } = require('telegraf');

// Pricing in Telegram Stars
// 1 Star ≈ $0.015, so 499₽ ≈ $5.50 ≈ 367 Stars
const PRICING = {
  premium_monthly: {
    stars: 367,
    title: 'Premium на 30 дней',
    description: 'Полный доступ: анализ, прогнозы, compatibility',
  },
  lifetime: {
    stars: 3667,
    title: 'Lifetime доступ',
    description: 'Навсегда: все функции + консультации',
  }
};

// User subscriptions storage (use DB in production)
const subscriptions = new Map();

function hasPremium(userId) {
  const sub = subscriptions.get(userId);
  if (!sub) return false;
  if (sub.type === 'lifetime') return true;
  return sub.expiresAt > new Date();
}

function setSubscription(userId, type, duration) {
  const expiresAt = type === 'lifetime'
    ? null
    : new Date(Date.now() + duration * 24 * 60 * 60 * 1000);

  subscriptions.set(userId, { type, expiresAt, createdAt: new Date() });
}

function setupPayments(bot, botToken) {
  // Premium payment
  bot.command('premium', (ctx) => {
    const userId = ctx.from.id;

    ctx.replyWithInvoice('Premium подписка',
      'Полный доступ на 30 дней: анализ личности, прогноз на 90 дней, compatibility карты',
      'premium_monthly',
      botToken, // provider token (empty for Stars)
      'XTR', // Stars currency
      [{
        description: 'Premium на 30 дней',
        amount: PRICING.premium_monthly.stars * 100 // in smallest units
      }]
    );
  });

  // Lifetime payment
  bot.command('lifetime', (ctx) => {
    ctx.replyWithInvoice('Lifetime доступ',
      'Навсегда: все функции + эксклюзивные insights + консультации',
      'lifetime',
      botToken,
      'XTR',
      [{
        description: 'Lifetime навсегда',
        amount: PRICING.lifetime.stars * 100
      }]
    );
  });

  // Pre-checkout query (confirm payment is possible)
  bot.on('pre_checkout_query', (ctx) => {
    ctx.answerPreCheckoutQuery(true);
  });

  // Successful payment
  bot.on('successful_payment', (ctx) => {
    const userId = ctx.from.id;
    const payload = ctx.message.successful_payment.invoice_payload;

    if (payload === 'premium_monthly') {
      setSubscription(userId, 'premium', 30);
      ctx.reply(`
✅ *Оплата прошла успешно!*

🎉 У вас теперь Premium на 30 дней!

Откройте WebApp для доступа ко всем функциям 👇
      `.trim());
    } else if (payload === 'lifetime') {
      setSubscription(userId, 'lifetime', null);
      ctx.reply(`
✅ *Оплата прошла успешно!*

👑 Добро пожаловать в Lifetime!

Доступ навсегда ко всем функциям + консультации.
      `.trim());
    }
  });

  // Check subscription status
  bot.command('status', (ctx) => {
    const userId = ctx.from.id;
    const sub = subscriptions.get(userId);

    if (!sub) {
      ctx.reply('У вас Free тариф. Для полного доступа:\n/premium — 367 ⭐/мес\n/lifetime — 3667 ⭐ навсегда');
      return;
    }

    if (sub.type === 'lifetime') {
      ctx.reply('👑 У вас Lifetime доступ навсегда!');
    } else {
      const daysLeft = Math.ceil((sub.expiresAt - new Date()) / (1000 * 60 * 60 * 24));
      ctx.reply(`✨ У вас Premium, осталось ${daysLeft} дней`);
    }
  });
}

module.exports = { setupPayments, hasPremium, PRICING, subscriptions };
