# ConnectHer

A professional networking platform for women in tech, built with Next.js 16, Supabase, and Tailwind CSS.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Database Schema](#database-schema)
- [Deployment](#deployment)
- [Verification](#verification)
- [Project Structure](#project-structure)
- [API Routes](#api-routes)

---

## Overview

ConnectHer is a full-stack social networking platform designed to empower women in technology through connections, mentorship, career opportunities, and community support. The application features:

- User authentication and profiles
- Social feed with posts, comments, and likes
- Job board with application tracking
- Company reviews and salary transparency
- Mentorship matching system
- Direct messaging
- Communities and networking
- Universal search

**Status:** ✅ Production-ready with Supabase backend integration

---

## Features

### Core Features
- **Authentication System** - Secure signup/login with Supabase Auth
- **User Profiles** - Comprehensive profiles with experience, education, skills
- **Social Feed** - Create posts, like, comment, repost
- **Job Board** - Browse jobs, track applications, recruiting timelines
- **Company Reviews** - Rate companies on culture, work-life balance, growth
- **Mentorship** - Find mentors, send requests, schedule sessions
- **Messaging** - Direct messages with conversation threads
- **Networking** - Send connection requests, build your network
- **Communities** - Join communities by interest or industry
- **Search** - Universal search across users, jobs, companies, posts

### Admin Features
- User management
- Content moderation
- Analytics dashboard
- Featured content management
- Review moderation

---

## Tech Stack

### Frontend
- **Framework:** Next.js 16.2.6 (App Router)
- **Language:** TypeScript 5
- **Styling:** Tailwind CSS 4
- **UI Components:** Radix UI primitives
- **Icons:** Lucide React
- **Charts:** Recharts

### Backend
- **Database:** PostgreSQL (via Supabase)
- **Auth:** Supabase Auth
- **API:** Next.js API Routes
- **ORM:** Supabase JavaScript Client

### Deployment
- **Hosting:** Vercel
- **Database:** Supabase Cloud
- **Storage:** Supabase Storage (for uploads)

---

## Getting Started

### Prerequisites
- Node.js 18+
- A Supabase account (https://supabase.com)
- A Vercel account (https://vercel.com) for deployment

### 1. Clone and Install

```bash
git clone https://github.com/adrhito/connecther.git
cd connecther
npm install
```

### 2. Set Up Supabase

#### Create Supabase Project
1. Go to https://supabase.com and sign in
2. Click "New Project"
3. Fill in project details and wait for provisioning

#### Run Database Migration
1. Go to **SQL Editor** in your Supabase dashboard
2. Click "New Query"
3. Copy contents from `supabase/migrations/001_initial_schema.sql`
4. Paste and click "Run"
5. Verify all 26 tables were created in **Table Editor**

#### Get API Credentials
1. Go to **Project Settings > API**
2. Copy these values:
   - **Project URL**
   - **anon public** key
   - **service_role** key (keep secret!)

#### Configure Auth URLs
1. Go to **Authentication > URL Configuration**
2. Set **Site URL**: Your production URL (update after deployment)
3. Add **Redirect URLs**:
   - `http://localhost:3000/**`
   - Your production URL (update after deployment)

### 3. Environment Configuration

Create `.env.local` from `.env.example`:

```bash
cp .env.example .env.local
```

Edit `.env.local` with your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

### 4. Run Development Server

```bash
npm run dev
```

Open http://localhost:3000 to see the application.

### 5. Test Locally

1. Sign up with a test email
2. Create a post
3. Browse jobs and companies
4. Check Supabase **Table Editor** to verify data is being saved

---

## Database Schema

The application uses 26 PostgreSQL tables:

### Core Tables
- **users** - User profiles and authentication
- **experiences** - Work experience
- **education** - Educational background
- **connections** - User connections/network

### Jobs & Companies
- **jobs** - Job listings
- **job_applications** - Application tracking
- **recruiting_timelines** - Company hiring timelines
- **companies** - Company profiles
- **salary_entries** - Salary transparency data
- **promotion_timelines** - Promotion data
- **reviews** - Company reviews

### Social Features
- **posts** - User posts
- **comments** - Post comments
- **likes** - Post likes
- **reposts** - Post shares

### Community Features
- **mentorship_requests** - Mentorship connections
- **messages** - Direct messages
- **conversations** - Message threads
- **communities** - Interest-based groups
- **community_memberships** - Group members
- **community_posts** - Group posts

### Other
- **notifications** - User notifications
- **profile_views** - Profile analytics
- **endorsements** - Skill endorsements
- **recommendations** - User recommendations

Full schema available in `supabase/migrations/001_initial_schema.sql`

---

## Deployment

### Deploy to Vercel

#### 1. Push to GitHub

```bash
git add .
git commit -m "Deploy ConnectHer application"
git push origin main
```

#### 2. Connect to Vercel

1. Go to https://vercel.com
2. Click "Add New..." > "Project"
3. Import your GitHub repository
4. Vercel will auto-detect Next.js

#### 3. Configure Environment Variables

In Vercel project settings, add these environment variables:

| Variable | Value | Environments |
|----------|-------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase URL | Production, Preview |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your anon key | Production, Preview |
| `SUPABASE_SERVICE_ROLE_KEY` | Your service role key | Production, Preview |

**Important:** Toggle "Permanently hides values" ON for the service role key.

#### 4. Deploy

Click "Deploy" and wait 3-5 minutes.

#### 5. Update Supabase Auth URLs

After deployment:
1. Copy your Vercel URL
2. Go to Supabase > **Authentication > URL Configuration**
3. Update **Site URL** with your Vercel URL
4. Add Vercel URL to **Redirect URLs**

### Testing Production

Visit your deployed site and test:
- ✅ Sign up and login
- ✅ Create posts
- ✅ Browse jobs
- ✅ Send messages
- ✅ Search functionality

---

## Verification

### Quick Verification Checklist

After setup, verify:

- [ ] Supabase packages installed
- [ ] `.env.local` configured with credentials
- [ ] All Supabase client files exist
- [ ] API routes use Supabase (not mock data)
- [ ] TypeScript compiles without errors
- [ ] Local dev server runs
- [ ] Can sign up/login locally
- [ ] Data appears in Supabase dashboard

### Build Test

```bash
npm run build
```

Should complete without errors.

### TypeScript Check

```bash
npx tsc --noEmit
```

Should pass without errors.

---

## Project Structure

```
connecther/
├── app/
│   ├── (auth)/              # Auth pages (login, signup)
│   ├── (main)/              # Main app pages (feed, jobs, etc.)
│   ├── admin/               # Admin dashboard
│   ├── api/                 # API routes
│   │   ├── auth/           # Authentication endpoints
│   │   ├── users/          # User management
│   │   ├── jobs/           # Job listings
│   │   ├── companies/      # Company data
│   │   ├── posts/          # Social feed
│   │   ├── mentorship/     # Mentorship system
│   │   ├── messages/       # Messaging
│   │   ├── connections/    # User connections
│   │   ├── communities/    # Communities
│   │   ├── reviews/        # Company reviews
│   │   └── search/         # Universal search
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Landing page
│   └── providers.tsx       # Context providers
├── components/
│   ├── auth/               # Auth components
│   ├── landing/            # Landing page sections
│   ├── layout/             # Navigation, sidebar
│   ├── feed/               # Social feed components
│   ├── jobs/               # Job board components
│   ├── companies/          # Company components
│   ├── mentorship/         # Mentorship components
│   ├── messages/           # Messaging components
│   ├── profile/            # Profile components
│   ├── shared/             # Reusable components
│   └── ui/                 # Base UI components
├── lib/
│   ├── supabase/           # Supabase clients
│   │   ├── client.ts      # Browser client
│   │   ├── server.ts      # Server client
│   │   └── middleware.ts  # Auth middleware
│   ├── context/            # React contexts
│   ├── hooks/              # Custom hooks
│   ├── services/           # Business logic
│   ├── types/              # TypeScript types
│   └── utils/              # Utility functions
├── supabase/
│   └── migrations/         # Database migrations
├── public/
│   └── images/             # Static images
├── middleware.ts           # Next.js middleware (auth)
├── .env.example           # Environment template
└── .env.local             # Local config (gitignored)
```

---

## API Routes

All API routes migrated to Supabase backend (29 total routes):

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Sign in user
- `POST /api/auth/logout` - Sign out user

### Users
- `GET /api/users` - List users (with filters)
- `GET /api/users/[id]` - Get user profile
- `PUT /api/users/[id]` - Update user profile

### Jobs
- `GET /api/jobs` - List jobs with filters
- `GET /api/jobs/[id]` - Get job details
- `GET /api/jobs/tracker` - Get user's job applications
- `POST /api/jobs/tracker` - Track job application
- `GET /api/jobs/timelines` - Get recruiting timelines

### Companies
- `GET /api/companies` - List companies
- `GET /api/companies/[id]` - Get company details (with reviews, salaries)

### Posts
- `GET /api/posts` - Get feed posts
- `POST /api/posts` - Create post
- `POST /api/posts/[id]` - Like/comment/repost

### Mentorship
- `GET /api/mentors` - List all mentors
- `GET /api/mentorship` - List mentorship requests
- `POST /api/mentorship` - Create mentorship request
- `PUT /api/mentorship/[id]` - Update request status

### Messages
- `GET /api/messages` - Get conversations
- `GET /api/messages/[id]` - Get messages in conversation
- `POST /api/messages` - Send message

### Other
- `GET /api/connections` - Manage user connections
- `GET /api/communities` - Browse communities
- `POST /api/reviews` - Submit company review
- `GET /api/notifications` - Get user notifications
- `GET /api/search` - Universal search
- `GET /api/admin/*` - Admin endpoints

---

## Important Notes

### Next.js Version
This project uses **Next.js 16** which has breaking changes from previous versions. APIs, conventions, and file structure may differ from older Next.js documentation.

### Security
- ✅ Environment variables properly configured
- ✅ Service role key only used server-side
- ✅ Auth middleware on protected routes
- ✅ Input validation and sanitization
- ✅ Content moderation for user-generated content
- ⚠️ **Recommended:** Enable Row Level Security (RLS) on Supabase tables

### Performance Optimizations (Optional)
- Add database indexes on frequently queried columns
- Enable Supabase Realtime for live updates
- Implement Redis caching for frequently accessed data
- Use PostgreSQL full-text search

---

## Troubleshooting

### Build Fails
- Check build logs in Vercel
- Verify all dependencies in `package.json`
- Ensure TypeScript types are correct
- Check environment variables

### Authentication Not Working
- Verify Supabase credentials in environment variables
- Check Supabase Auth redirect URLs
- Check browser console for errors
- Verify `.env.local` is configured correctly

### Database Errors
- Ensure migration ran successfully
- Check Supabase logs in dashboard
- Verify table structure matches schema
- Check for missing environment variables

### Slow Performance
- Add database indexes
- Enable Vercel Edge caching
- Optimize images with Next.js Image component
- Use Supabase connection pooling

---

## Resources

- **Supabase Docs:** https://supabase.com/docs
- **Vercel Docs:** https://vercel.com/docs
- **Next.js Docs:** https://nextjs.org/docs
- **Supabase Discord:** https://discord.supabase.com
- **Vercel Discord:** https://vercel.com/discord

---

## License

This project is private and proprietary.

---

## Support

For questions or issues:
1. Check browser console for errors
2. Review Supabase dashboard logs
3. Check Vercel deployment logs
4. Review this documentation

---

**Built with ❤️ for women in tech**
