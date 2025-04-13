# JBC NEWS

A sophisticated multilingual AI-driven news platform offering comprehensive content discovery and engagement through advanced technological integrations.

## Key Features

- **Multi-portal System**: Admin, User, and Staff portals with role-specific permissions
- **Telegram Integration**: Four specialized bots for main interactions, news delivery, support, and staff operations
- **Premium Subscriptions**: Monetization through Stripe payment processing
- **Multilingual Support**: Content in English, Hindi, and Urdu
- **Regional Focus**: Dedicated live sections for India and Pakistan news
- **AI-powered Content**: Advanced content discovery and processing

## Technology Stack

- **Frontend**: React.js with Tailwind CSS
- **Backend**: Node.js with Express
- **Database**: Memory storage with optional PostgreSQL integration
- **Authentication**: Session-based with role-specific security
- **APIs**: Telegram Bot API, Stripe API

## Setup Instructions

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
   - Copy `.env.example` to `.env`
   - Fill in the required values for admin security, session secret, and Telegram bot tokens

4. Start the development server:
   ```
   npm run dev
   ```

5. Access the platform:
   - Main site: http://localhost:5000
   - Admin portal: http://localhost:5000/admin
   - Staff portal: http://localhost:5000/staff

## Admin Access

To access the admin portal, you'll need:
- Admin ID (email)
- Password
- Security Key (from .env file)

## Telegram Bot Integration

The platform uses four different Telegram bots:
1. **Main Bot**: User registration and general interaction
2. **News Bot**: Delivers news updates to subscribers
3. **Support Bot**: Handles user support requests
4. **Staff Bot**: Internal communications for staff members

Set the corresponding tokens in your `.env` file to enable these features.

## Deployment

The project is deployed using GitHub Actions, which automatically builds and deploys changes to the production environment.

## License

© 2024 AYYAN CORPORATION. All rights reserved.