# Environment Variables Setup

Create a `.env` file in the root of the `mentorny-frontend` directory with the following variables:

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:3000

# Environment
VITE_NODE_ENV=development

# App Configuration
VITE_APP_NAME=Mentorny
VITE_APP_VERSION=1.0.0

# Optional: Analytics or third-party services (uncomment as needed)
# VITE_GOOGLE_ANALYTICS_ID=your_ga_id_here
# VITE_SENTRY_DSN=your_sentry_dsn_here
# VITE_STRIPE_PUBLIC_KEY=your_stripe_public_key_here
```

## Important Notes

1. **VITE_API_BASE_URL**: This should point to your backend API server. Default is `http://localhost:3000`
2. All environment variables in Vite must be prefixed with `VITE_` to be accessible in the client-side code
3. Never commit sensitive keys or secrets to version control
4. The `.env` file should be added to your `.gitignore` file

## Backend Setup

Make sure your backend server is running on `http://localhost:3000` or update the `VITE_API_BASE_URL` accordingly.

## Demo Credentials

The application includes demo credentials for testing:

**Admin User:**

- Email: `admin@mentorny.com`
- Password: `password123`

**Regular User:**

- Email: `user@mentorny.com`
- Password: `password123`

Note: These are for testing purposes only. In production, implement proper user seeding and admin account creation.
