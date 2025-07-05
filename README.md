# Mentorny Frontend

An AI-powered career development platform frontend built with React, TypeScript, and Tailwind CSS.

## Features

- 🎯 **AI-Powered Career Recommendations** - Get personalized career path suggestions
- 📚 **Learning Roadmaps** - Structured learning paths for different tech careers
- 📊 **Progress Tracking** - Monitor your learning progress and achievements
- 🏆 **Achievements System** - Earn badges and certificates as you learn
- 👥 **Role-Based Access** - Different interfaces for users and administrators
- 💻 **Modern UI/UX** - Beautiful, responsive design with Tailwind CSS
- 🔐 **Secure Authentication** - JWT-based authentication with role management

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS
- **State Management**: React Context + React Query
- **Routing**: React Router DOM
- **Forms**: React Hook Form
- **HTTP Client**: Axios
- **Icons**: Lucide React
- **Notifications**: React Hot Toast
- **Charts**: Chart.js + React Chart.js 2 (for future analytics)

## Prerequisites

- Node.js 16+ and npm
- Backend API running (see backend setup)

## Getting Started

### 1. Clone and Install Dependencies

```bash
cd mentorny-frontend
npm install
```

### 2. Environment Variables

Create a `.env` file in the root directory:

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:3000

# Environment
VITE_NODE_ENV=development

# App Configuration
VITE_APP_NAME=Mentorny
VITE_APP_VERSION=1.0.0
```

### 3. Start Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### 4. Demo Credentials

The application includes demo credentials for testing:

**Admin User:**

- Email: `admin@mentorny.com`
- Password: `password123`

**Regular User:**

- Email: `user@mentorny.com`
- Password: `password123`

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Layout.tsx      # Main layout with navigation
│   ├── LoadingSpinner.tsx
│   └── ProtectedRoute.tsx
├── contexts/           # React contexts
│   └── AuthContext.tsx # Authentication state management
├── pages/              # Page components
│   ├── LoginPage.tsx
│   ├── RegisterPage.tsx
│   ├── DashboardPage.tsx
│   ├── AdminDashboardPage.tsx
│   └── CareerTracksPage.tsx
├── services/           # API and external services
│   └── api.ts         # HTTP client and API calls
├── types/              # TypeScript type definitions
│   └── index.ts       # All application types
├── App.tsx            # Main application component
├── main.tsx           # Application entry point
└── index.css          # Global styles and Tailwind imports
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

## Key Features

### User Dashboard

- Learning progress overview
- Current roadmap status
- Achievements and activity feed
- Quick action buttons
- Personalized recommendations

### Career Tracks

- AI-powered career path suggestions
- Detailed track information with salary ranges
- Skill requirements and difficulty levels
- Search and filtering capabilities
- Industry demand indicators

### Admin Dashboard

- User management and analytics
- Platform statistics and growth metrics
- Recent activity monitoring
- Role-based access control

### Authentication

- Secure JWT-based authentication
- Role-based route protection
- Automatic token refresh
- Persistent sessions

## Environment Variables

| Variable            | Description          | Default                 |
| ------------------- | -------------------- | ----------------------- |
| `VITE_API_BASE_URL` | Backend API base URL | `http://localhost:3000` |
| `VITE_NODE_ENV`     | Environment mode     | `development`           |
| `VITE_APP_NAME`     | Application name     | `Mentorny`              |
| `VITE_APP_VERSION`  | Application version  | `1.0.0`                 |

## API Integration

The frontend integrates with the backend through a centralized API service (`src/services/api.ts`) that handles:

- Authentication endpoints (login, register, profile)
- User management (CRUD operations)
- Career tracks and learning resources (mock data for now)
- Dashboard data and analytics

## Styling

The application uses Tailwind CSS with custom utility classes:

- **Component Classes**: `.btn`, `.input`, `.card`, etc.
- **Custom Animations**: Fade-in, slide-up, bounce-in
- **Theme Colors**: Primary (blue) and secondary (purple) gradients
- **Responsive Design**: Mobile-first approach

## Future Enhancements

- Real-time notifications with WebSocket
- Advanced analytics with Chart.js
- Learning progress gamification
- Social features and community
- Mobile app with React Native
- AI-powered content recommendations
- Integration with external learning platforms

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please open an issue in the GitHub repository.
