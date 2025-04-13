# JBC News Platform

A premium multilingual AI-powered news platform with integrated Telegram bot ecosystem for subscribers, featuring admin, user, and staff portals with Stripe subscriptions and Google AdSense integration.

## Features

- **Multi-Portal System**: Admin, User, and Staff portals with role-specific permissions
- **Telegram Integration**: Four specialized Telegram bots (main, news, support, staff)
- **Premium Content**: Subscription-based access to premium news content
- **Multilingual Support**: Content available in English, Hindi, and Urdu
- **Live News Coverage**: Real-time news updates for breaking stories
- **Regional Focus**: Dedicated sections for Indian and Pakistani news

## Technology Stack

- **Frontend**: React with TypeScript and Tailwind CSS
- **Backend**: Node.js with Express
- **State Management**: React Query
- **UI Components**: Shadcn UI
- **Payment Processing**: Stripe
- **Monetization**: Google AdSense
- **Bot Framework**: Telegram Bot API

## Setup Instructions

### Prerequisites

- Node.js (v20 or higher)
- npm (v9 or higher)
- Telegram Bot API tokens

### Installation

1. Clone the repository:
```
git clone https://github.com/JSBNEWS0010/JBC-NEWS.git
cd JBC-NEWS
```

2. Install dependencies:
```
npm install
```

3. Set up environment variables:
Create a `.env` file in the root directory with the following variables:
```
TELEGRAM_MAIN_BOT_TOKEN=your_main_bot_token
TELEGRAM_NEWS_BOT_TOKEN=your_news_bot_token
TELEGRAM_SUPPORT_BOT_TOKEN=your_support_bot_token
TELEGRAM_STAFF_BOT_TOKEN=your_staff_bot_token
```

4. Start the development server:
```
npm run dev
```

### Deployment

The application is set up to deploy automatically to GitHub Pages when changes are pushed to the main branch. The deployment process is managed by GitHub Actions.

To manually deploy:

1. Build the project:
```
npm run build
```

2. The built files will be in the `dist` directory and can be deployed to any static hosting service.

## Admin Access

Access the admin portal with the following credentials:
- Email: ayyan@jbc.com.pk
- Password: 9045CcF2

## Telegram Bot Commands

- `/start` - Initialize the bot
- `/help` - Display available commands
- `/subscribe [category]` - Subscribe to a specific news category
- `/unsubscribe [category]` - Unsubscribe from a specific news category
- `/support [message]` - Send a support request

## License

This project is proprietary and confidential. Unauthorized copying, distribution, or use is strictly prohibited.

© 2023 AYYAN CORPORATION. All rights reserved.
