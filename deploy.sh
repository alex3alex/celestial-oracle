#!/bin/bash
# Celestial Oracle - Deploy to Vercel

echo "🚀 Deploying Celestial Oracle to Vercel..."

# Check if vercel is installed
if ! command -v vercel &> /dev/null; then
    echo "📦 Installing Vercel CLI..."
    npm install -g vercel
fi

# Login to Vercel (will open browser)
echo "🔐 Login to Vercel..."
vercel login

# Deploy to production
echo "🌐 Deploying to production..."
vercel --prod \
  --env BOT_TOKEN=8247561274:AAFvn-nP6NlH-cUx3yMXUhqB95LH75r77vs \
  --env WEBAPP_URL=https://celestial-oracle.vercel.app/app \
  --env PORT=3000

echo ""
echo "✅ Deploy complete!"
echo ""
echo "📍 URLs:"
echo "  Landing:  https://celestial-oracle.vercel.app/"
echo "  MiniApp:  https://celestial-oracle.vercel.app/app"
echo ""
echo "🔧 Next steps:"
echo "  1. Open BotFather in Telegram"
echo "  2. /setmenubutton → choose your bot"
echo "  3. Button text: 🔮 Открыть Oracle"
echo "  4. URL: https://celestial-oracle.vercel.app/app"
