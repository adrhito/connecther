# ConnectHer Deployment Guide

This guide walks through deploying ConnectHer to production using Supabase as the backend database and Vercel for hosting.

## Prerequisites

- Node.js 18+ installed
- A Supabase account (https://supabase.com)
- A Vercel account (https://vercel.com)
- Git repository connected to GitHub

## Step 1: Supabase Project Setup

### 1.1 Create Supabase Project

1. Go to https://supabase.com and sign in
2. Click "New Project"
3. Fill in project details:
   - **Name**: connecther-production
   - **Database Password**: Generate a strong password (save this securely)
   - **Region**: Select the region closest to your users
4. Wait for the project to finish provisioning (2-3 minutes)

### 1.2 Get API Credentials

1. Go to **Project Settings > API** in your Supabase dashboard
2. Copy the following values:
   - **Project URL** (e.g., `https://xxx.supabase.co`)
   - **anon public** key (under "Project API keys")
   - **service_role** key (under "Project API keys" - keep this secret!)

### 1.3 Run Database Migration

1. In your Supabase dashboard, go to **SQL Editor**
2. Click "New Query"
3. Open `supabase/migrations/001_initial_schema.sql` from your project
4. Copy and paste the entire contents into the SQL Editor
5. Click "Run" to execute the migration
6. Verify success: You should see "Success. No rows returned" message
7. Check tables created: Go to **Table Editor** and verify all 26 tables exist

## Step 2: Local Environment Configuration

### 2.1 Configure Environment Variables

1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Edit `.env.local` and add your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
   ```

3. **Important**: Never commit `.env.local` to git (already in `.gitignore`)

### 2.2 Test Locally

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start development server:
   ```bash
   npm run dev
   ```

3. Open http://localhost:3000 in your browser

4. Test the following:
   - Sign up for a new account
   - Log in with the new account
   - Create a post
   - Browse jobs
   - Search for companies

5. Verify data in Supabase:
   - Go to **Table Editor** in Supabase dashboard
   - Check `users`, `posts`, etc. tables for your test data

## Step 3: Configure Supabase Authentication

### 3.1 Set Up Auth Redirect URLs

1. In Supabase dashboard, go to **Authentication > URL Configuration**
2. Add the following URLs:

   **Site URL** (for production):
   ```
   https://your-domain.vercel.app
   ```

   **Redirect URLs** (add both):
   ```
   http://localhost:3000/**
   https://your-domain.vercel.app/**
   ```

3. Click "Save"

### 3.2 Email Templates (Optional)

1. Go to **Authentication > Email Templates**
2. Customize email templates for:
   - Confirm Signup
   - Magic Link
   - Reset Password

## Step 4: Deploy to Vercel

### 4.1 Connect Repository to Vercel

1. Go to https://vercel.com and sign in
2. Click "Add New..." > "Project"
3. Import your GitHub repository
4. Vercel will auto-detect Next.js configuration

### 4.2 Configure Environment Variables

1. In the Vercel project setup, scroll to **Environment Variables**
2. Add the following variables:

   | Name | Value | Environments |
   |------|-------|--------------|
   | `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL | Production, Preview |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anon key | Production, Preview |
   | `SUPABASE_SERVICE_ROLE_KEY` | Your Supabase service role key | Production, Preview |

3. Click "Deploy"

### 4.3 Wait for Deployment

1. Vercel will build and deploy your application (3-5 minutes)
2. Monitor the build logs for any errors
3. Once complete, you'll get a deployment URL

### 4.4 Update Supabase Auth URLs

1. Copy your Vercel deployment URL (e.g., `https://connecther.vercel.app`)
2. Go back to Supabase dashboard > **Authentication > URL Configuration**
3. Update the **Site URL** with your Vercel production URL
4. Add your Vercel URL to **Redirect URLs**:
   ```
   https://connecther.vercel.app/**
   ```
5. Click "Save"

## Step 5: Production Testing

### 5.1 Test Critical Flows

Visit your deployed application and test:

1. **Authentication**:
   - Sign up with a new email
   - Check email for confirmation (if email confirmation enabled)
   - Log in
   - Log out

2. **User Profile**:
   - View profile
   - Edit profile information
   - Upload profile photo (if implemented)

3. **Posts & Feed**:
   - Create a new post
   - Like a post
   - Comment on a post
   - View feed

4. **Jobs**:
   - Browse jobs listing
   - View job details
   - Filter jobs

5. **Companies**:
   - Browse companies
   - View company details
   - Submit a review

6. **Mentorship**:
   - Browse mentors
   - Send mentorship request

7. **Search**:
   - Search for users
   - Search for jobs
   - Search for companies

### 5.2 Verify Database

1. Go to Supabase dashboard > **Table Editor**
2. Check that new data appears in respective tables
3. Verify relationships are working (e.g., posts show author info)

### 5.3 Monitor Performance

1. In Vercel dashboard, go to **Analytics**
2. Monitor:
   - Page load times
   - API response times
   - Error rates

3. In Supabase dashboard, go to **Database > Query Performance**
4. Check for slow queries and add indexes if needed

## Step 6: Optional Enhancements

### 6.1 Enable Row Level Security (RLS)

For better security, enable RLS on Supabase tables:

1. Go to **Authentication > Policies** in Supabase
2. For each table, create policies like:

```sql
-- Example: Users table
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Allow everyone to view all profiles
CREATE POLICY "Public profiles are viewable by everyone"
  ON users FOR SELECT
  USING (true);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  USING (auth.uid() = id);

-- Repeat for other tables...
```

### 6.2 Set Up Database Backups

1. Go to **Database > Backups** in Supabase
2. Enable automatic daily backups
3. Configure backup retention period

### 6.3 Add Custom Domain

1. In Vercel dashboard, go to **Settings > Domains**
2. Add your custom domain (e.g., `connecther.com`)
3. Follow Vercel's instructions to update DNS records
4. Update Supabase Auth URLs with your custom domain

### 6.4 Enable Email Provider

By default, Supabase uses their email service with rate limits. For production:

1. Go to **Authentication > Providers** in Supabase
2. Configure a custom SMTP provider (SendGrid, AWS SES, etc.)
3. Test email delivery

## Step 7: Seed Initial Data (Optional)

If you want to populate the database with sample data:

1. Create a `supabase/seed.sql` file with INSERT statements
2. Run it in Supabase SQL Editor
3. Example seed data might include:
   - Sample companies (Google, Microsoft, etc.)
   - Sample job postings
   - Sample communities

## Troubleshooting

### Build Fails on Vercel

- Check build logs for specific errors
- Ensure all dependencies are in `package.json`
- Verify TypeScript types are correct
- Check that environment variables are set correctly

### Authentication Not Working

- Verify Supabase URL and keys are correct in Vercel
- Check Supabase Auth redirect URLs include your Vercel domain
- Test locally first with `.env.local`
- Check browser console for CORS errors

### Database Queries Failing

- Verify migration ran successfully
- Check Supabase logs: **Database > Logs**
- Ensure RLS policies don't block legitimate requests
- Check network requests in browser DevTools

### Slow Performance

- Add database indexes on frequently queried columns
- Enable Vercel Edge Caching for static assets
- Optimize images with Next.js Image component
- Use Supabase connection pooling for high traffic

## Monitoring & Maintenance

### Regular Tasks

1. **Weekly**:
   - Check Supabase database size
   - Review error logs in Vercel
   - Monitor user feedback

2. **Monthly**:
   - Review and optimize slow queries
   - Update dependencies: `npm update`
   - Check for security updates

3. **As Needed**:
   - Scale Supabase plan if hitting limits
   - Add more database indexes for performance
   - Implement caching strategies

### Useful Commands

```bash
# Check for outdated packages
npm outdated

# Update dependencies
npm update

# Build locally to test before deploying
npm run build

# Run type checking
npm run type-check

# Run linting
npm run lint
```

## Support & Resources

- **Supabase Docs**: https://supabase.com/docs
- **Vercel Docs**: https://vercel.com/docs
- **Next.js Docs**: https://nextjs.org/docs
- **Supabase Discord**: https://discord.supabase.com
- **Vercel Discord**: https://vercel.com/discord

## Security Checklist

Before going live, ensure:

- [ ] Environment variables are set in Vercel (not hardcoded)
- [ ] `.env.local` is in `.gitignore`
- [ ] Service role key is never exposed to client
- [ ] HTTPS is enforced (automatic with Vercel)
- [ ] Row Level Security (RLS) is enabled on sensitive tables
- [ ] Input validation is implemented in API routes
- [ ] Content moderation is working for user-generated content
- [ ] Rate limiting is configured for API routes
- [ ] User passwords are properly hashed (handled by Supabase Auth)
- [ ] CORS is properly configured

---

**Congratulations!** 🎉 ConnectHer is now deployed to production!

For questions or issues, refer to the documentation links above or contact the development team.
