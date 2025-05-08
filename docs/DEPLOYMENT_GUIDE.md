# Atlantic Enterprise Deployment Guide

This guide provides step-by-step instructions for deploying both the frontend and backend of the Atlantic Enterprise application to production.

## Prerequisites

- Node.js v14 or higher
- npm v6 or higher
- A Supabase account (for database)
- A Razorpay account (for payments)
- Vercel, Netlify, or any static hosting service for the frontend
- Heroku, DigitalOcean, or any Node.js hosting for the backend

## Deployment Preparation

We've already prepared the application for deployment by running:
```bash
npm run build
node deploy.js
```

This has created a `dist` folder with:
- Frontend files in the root
- Backend files in the `server` subdirectory
- Deployment configuration files

## Frontend Deployment (Vercel)

1. **Create a Vercel Account**:
   - Sign up at [vercel.com](https://vercel.com)

2. **Install Vercel CLI**:
   ```bash
   npm install -g vercel
   ```

3. **Deploy to Vercel**:
   ```bash
   cd dist
   vercel login
   vercel --prod
   ```

4. **Alternative: Deploy via Dashboard**:
   - Go to [vercel.com/new](https://vercel.com/new)
   - Import your Git repository
   - Set the build directory to `dist`
   - Deploy

## Frontend Deployment (Netlify)

1. **Create a Netlify Account**:
   - Sign up at [netlify.com](https://netlify.com)

2. **Deploy using Netlify CLI**:
   ```bash
   npm install -g netlify-cli
   cd dist
   netlify login
   netlify deploy --prod
   ```

3. **Alternative: Drag and Drop**:
   - Go to [app.netlify.com](https://app.netlify.com)
   - Drag and drop the `dist` folder into the deployment zone

## Backend Deployment (Heroku)

1. **Create a Heroku Account**:
   - Sign up at [heroku.com](https://heroku.com)

2. **Install Heroku CLI**:
   ```bash
   npm install -g heroku
   ```

3. **Create a new Heroku App**:
   ```bash
   cd dist/server
   heroku login
   heroku create atlantic-enterprise-api
   ```

4. **Set Environment Variables**:
   ```bash
   heroku config:set PORT=3005
   heroku config:set RAZORPAY_KEY_ID=your_razorpay_key_id
   heroku config:set RAZORPAY_KEY_SECRET=your_razorpay_key_secret
   heroku config:set SUPABASE_URL=your_supabase_url
   heroku config:set SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

5. **Create a Procfile**:
   ```
   echo "web: node api-server.js" > Procfile
   ```

6. **Deploy to Heroku**:
   ```bash
   git init
   git add .
   git commit -m "Initial deploy"
   git push heroku master
   ```

7. **Run Setup Script**:
   ```bash
   heroku run npm run setup
   ```

## Backend Deployment (DigitalOcean App Platform)

1. **Create a DigitalOcean Account**:
   - Sign up at [digitalocean.com](https://digitalocean.com)

2. **Create a New App**:
   - Go to App Platform
   - Create a new app
   - Select your Git repository or upload the `dist/server` folder
   - Configure as Node.js app

3. **Environment Variables**:
   - Add the same environment variables as listed in the Heroku section

4. **Deploy the App**:
   - Click Deploy

## Database Setup (Supabase)

1. **Create a Supabase Project**:
   - Sign up at [supabase.com](https://supabase.com)
   - Create a new project

2. **Get API Keys**:
   - Go to Project Settings > API
   - Copy URL and anon public key

3. **Set Up Tables**:
   - Go to Table Editor
   - Create the following tables: `applications`, `internships`, `users`
   - Set up RLS policies

4. **Storage Setup**:
   - Go to Storage
   - Create a bucket named `resumes`
   - Set up appropriate bucket policies

5. **Run SQL Scripts**:
   - The SQL scripts needed are already in the `dist/server` directory
   - Run them via the SQL editor in Supabase Dashboard, or
   - They will be executed automatically when you run the setup script

## Connecting Frontend and Backend

After deploying both frontend and backend, you need to update the API URL in the frontend:

1. **Find the file**:
   In the frontend codebase, locate the API configuration file (likely `src/config.js` or similar)

2. **Update the URL**:
   ```javascript
   export const API_URL = 'https://your-backend-url.herokuapp.com';
   ```

3. **Rebuild and Redeploy**:
   ```bash
   npm run build
   cd dist
   vercel --prod  # or netlify deploy --prod
   ```

## Razorpay Setup

1. **Create a Razorpay Account**:
   - Sign up at [razorpay.com](https://razorpay.com)

2. **Get API Keys**:
   - Go to Dashboard > Settings > API Keys
   - Generate Key ID and Secret

3. **Update Environment Variables**:
   - Add these keys to your backend environment variables

## Domain Configuration

1. **Purchase Domain**:
   - Buy a domain from any domain registrar (GoDaddy, Namecheap, etc.)

2. **Point Domain to Frontend**:
   - In your domain registrar, update DNS settings
   - Create an A record pointing to your Vercel/Netlify IP
   - Or follow custom domain setup for your hosting provider

3. **Set Up SSL**:
   - Most hosting providers (Vercel, Netlify, Heroku) handle SSL automatically
   - If not, use Let's Encrypt to get free SSL certificates

## Maintenance and Monitoring

1. **Regular Backups**:
   - Supabase provides automatic backups
   - Set up additional backup procedures if needed

2. **Monitoring**:
   - Use hosting provider's built-in monitoring
   - Consider adding services like Sentry for error tracking

3. **Updates**:
   - Regularly update dependencies for security fixes

## Troubleshooting

- **API Connection Issues**:
  - Check CORS configuration in the API server
  - Verify environment variables are set correctly

- **Database Connectivity Issues**:
  - Check Supabase URL and keys
  - Ensure IP restrictions are configured properly

- **Payment Issues**:
  - Verify Razorpay configuration
  - Check webhook endpoints

## Contact

If you encounter any issues during deployment, contact the development team at:
- Email: your-support-email@atlanticenterprise.in 