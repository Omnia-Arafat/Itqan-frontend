# Jitsi as a Service (JaaS) Setup Guide

## What is JaaS?
JaaS (Jitsi as a Service) is the official hosted Jitsi solution by 8x8. It provides:
- ✅ No lobby restrictions
- ✅ Reliable video conferencing
- ✅ Better quality and performance
- ✅ Free tier available (up to 10,000 minutes/month)

## Setup Steps

### 1. Sign Up for JaaS
1. Go to https://jaas.8x8.vc/
2. Click "Sign Up" and create an account
3. After login, you'll see your dashboard

### 2. Get Your App ID
1. In the JaaS dashboard, go to "Apps" or "Application Credentials"
2. Copy your **App ID** (format: `vpaas-magic-cookie-xxxxxxxxx`)
3. You'll also see your **Tenant** ID

### 3. Configure Environment Variables
1. Copy `.env.local.example` to `.env.local`:
   ```bash
   cp .env.local.example .env.local
   ```

2. Edit `.env.local` and add your App ID:
   ```env
   NEXT_PUBLIC_JAAS_APP_ID=vpaas-magic-cookie-YOUR_ACTUAL_APP_ID
   ```

### 4. Restart Development Server
```bash
npm run dev
```

## Pricing
- **Free Tier**: 10,000 participant minutes/month
- **Paid Plans**: Available for more usage

## Testing
After setup:
1. Start a live session
2. Video should load without "membersOnly" errors
3. No lobby restrictions

## Troubleshooting

### Still Getting Errors?
- Double-check your App ID is correct
- Ensure `.env.local` file is in the root of Itqan-frontend folder
- Restart the dev server after adding environment variables

### Need More Help?
- JaaS Documentation: https://developer.8x8.com/jaas/docs
- Support: https://jaas.8x8.vc/support
