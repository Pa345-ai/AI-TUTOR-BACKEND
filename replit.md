# EduAI - Premium AI Tutoring Platform

## Overview
EduAI is a comprehensive AI-powered tutoring platform built with React, Express, Supabase (PostgreSQL), and OpenAI GPT-5. The platform supports students (grades 1-13), teachers, parents, and administrators with a complete learning management system.

## Technology Stack
- **Frontend**: React + TypeScript, Wouter (routing), TanStack Query, Shadcn UI, Tailwind CSS
- **Backend**: Express.js, Drizzle ORM
- **Database**: Supabase PostgreSQL
- **AI**: OpenAI GPT-5 API
- **Real-time**: WebSocket for live chat
- **Payment**: PayHere integration (pending credentials)

## Core Features

### 1. User Authentication & Roles
- Multi-role support: Student, Teacher, Parent, Admin
- Secure password hashing with bcrypt
- Role-based access control
- Email/password authentication

### 2. AI Tutor Chat
- Real-time chat with OpenAI GPT-5
- Step-by-step explanations for any subject
- Multi-language support (English, Sinhala, Tamil)
- Persistent chat history
- WebSocket support for live responses

### 3. Assignments & Homework
- Teachers create and publish assignments
- Students submit with file attachments
- AI-powered hints and feedback
- Automatic grading capabilities
- Deadline tracking and reminders

### 4. Quizzes & Exams
- Multiple choice, true/false, short answer questions
- AI-generated practice questions
- Auto-grading functionality
- Adaptive difficulty based on performance
- Progress tracking dashboards

### 5. Reports & Analytics
- Student performance tracking
- Visual charts and graphs using Recharts
- Teacher dashboards for class overview
- Parent dashboards for child monitoring
- Admin analytics for system metrics

### 6. Learning Paths & Recommendations
- Personalized learning journeys
- AI-recommended next topics
- Resource suggestions
- Progress visualization

### 7. Flashcards & Study Materials
- Create custom flashcards
- AI-generated flashcards from lessons
- Spaced repetition practice mode
- Subject categorization

### 8. Gamification & Engagement
- XP system for completing activities
- Achievement badges
- Student leaderboards
- Daily streak tracking
- Level progression

### 9. Feedback & Ratings
- Student/parent feedback system
- Teacher engagement ratings
- AI-powered improvement suggestions

### 10. Multi-language Support
- English, Sinhala, Tamil
- AI translation for content
- Language preference settings

### 11. Notifications & Reminders
- In-app notifications
- Assignment deadline alerts
- Achievement notifications
- Email notifications (planned)

## Project Structure

```
/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   │   ├── ui/       # Shadcn UI components
│   │   │   ├── theme-provider.tsx
│   │   │   ├── theme-toggle.tsx
│   │   │   └── app-sidebar.tsx
│   │   ├── pages/        # Page components
│   │   │   ├── auth/     # Login, Register
│   │   │   ├── student/  # Student pages
│   │   │   ├── teacher/  # Teacher pages
│   │   │   ├── parent/   # Parent pages
│   │   │   └── admin/    # Admin pages
│   │   ├── lib/          # Utilities and helpers
│   │   ├── hooks/        # Custom React hooks
│   │   ├── App.tsx       # Main app component
│   │   └── index.css     # Global styles
│   └── index.html
├── server/                # Backend Express application
│   ├── routes.ts         # API endpoints
│   ├── storage.ts        # Database operations
│   ├── db.ts            # Database connection
│   └── index.ts          # Server entry point
├── shared/               # Shared types and schemas
│   └── schema.ts        # Drizzle ORM schemas
├── design_guidelines.md  # UI/UX design guidelines
└── README.md

```

## API Endpoints

### Authentication
- POST `/api/auth/register` - Create new user
- POST `/api/auth/login` - User login
- GET `/api/auth/me` - Get current user

### AI Chat
- GET `/api/chat/history?userId={id}` - Get chat history
- POST `/api/chat/message` - Send message to AI tutor
- WebSocket `/ws` - Real-time chat

### Assignments
- GET `/api/assignments` - List assignments
- POST `/api/assignments` - Create assignment
- POST `/api/assignments/:id/submit` - Submit assignment
- POST `/api/assignments/submissions/:id/grade` - Grade submission

### Quizzes
- GET `/api/quizzes` - List quizzes
- POST `/api/quizzes` - Create quiz
- GET `/api/quizzes/:id/questions` - Get quiz questions
- POST `/api/quizzes/:id/submit` - Submit quiz attempt
- POST `/api/quizzes/generate` - AI-generate quiz questions

### Flashcards
- GET `/api/flashcards?userId={id}` - Get user flashcards
- POST `/api/flashcards` - Create flashcard
- POST `/api/flashcards/generate` - AI-generate flashcards

### Gamification
- GET `/api/progress/:userId` - Get user progress
- GET `/api/leaderboard` - Get leaderboard
- GET `/api/achievements` - List all achievements
- GET `/api/achievements/:userId` - Get user achievements

### Learning Paths
- GET `/api/learning-paths/:userId` - Get user learning paths

### Feedback
- POST `/api/feedback` - Submit feedback

### Notifications
- GET `/api/notifications/:userId` - Get user notifications
- POST `/api/notifications/:id/read` - Mark as read

## Environment Variables

Required secrets:
- `DATABASE_URL` - Supabase PostgreSQL connection string
- `OPENAI_API_KEY` - OpenAI API key for GPT-5
- `SESSION_SECRET` - Session encryption secret
- `PAYHERE_MERCHANT_ID` - PayHere merchant ID (optional)
- `PAYHERE_MERCHANT_SECRET` - PayHere secret (optional)

## Design System

Following Material Design 3 principles with EdTech enhancements:
- **Colors**: Education blue (#3b82f6), Success green, Warning orange
- **Gamification**: XP Gold, Badge Purple, Streak Fire
- **Typography**: Inter font family
- **Dark Mode**: Full theme support with proper contrast
- **Components**: Shadcn UI with custom extensions
- **Animations**: Subtle, functional only (150-200ms)

## Database Schema

Main tables:
- `users` - All user types with roles
- `user_progress` - XP, levels, streaks
- `achievements` - Available badges
- `user_achievements` - Unlocked badges
- `chat_messages` - AI chat history
- `assignments` - Homework assignments
- `assignment_submissions` - Student submissions
- `quizzes` - Quiz definitions
- `quiz_questions` - Quiz questions
- `quiz_attempts` - Student quiz attempts
- `flashcards` - Study flashcards
- `flashcard_progress` - Spaced repetition tracking
- `learning_paths` - Personalized paths
- `feedback` - User feedback
- `notifications` - System notifications
- `subscriptions` - Payment subscriptions

## Recent Changes

**October 2025**: Initial development
- Implemented all 16 core MVP features
- Created comprehensive database schema
- Built responsive UI with dark mode
- Integrated OpenAI GPT-5 for AI tutoring
- Set up WebSocket for real-time chat
- Configured Supabase database
- Designed gamification system

## Development Notes

### Running the App
- The workflow "Start application" runs `npm run dev`
- Frontend accessible at port 5000
- WebSocket available at `/ws` path
- Auto-restart on file changes

### Key Design Decisions
- Used Wouter for lightweight routing
- Shadcn UI for consistent component library
- TanStack Query v5 for data fetching
- Drizzle ORM for type-safe database queries
- WebSocket for real-time AI chat responses

### Known Limitations
- PayHere integration pending credentials
- Email notifications not yet implemented
- Session-based auth to be enhanced
- File upload storage configuration needed

## Future Enhancements
- Live video tutoring sessions
- AI homework checker with plagiarism detection
- AI lesson generation
- Offline mode with downloadable resources
- Advanced seasonal gamification challenges
- Multi-tenant support for schools
- GDPR/CCPA compliance features
