# Vercel Production Setup Guide

## 🔴 Common Errors in Vercel Production

Vercel production এ error হওয়ার প্রধান কারণগুলো:

1. **Missing Environment Variables** - সবচেয়ে কমন
2. **Build Errors** - Code compilation issues
3. **Runtime Errors** - Missing dependencies বা configuration

## ✅ Required Environment Variables

Vercel Dashboard এ এই environment variables গুলো **অবশ্যই** add করতে হবে:

### 1. **MongoDB Connection (Required)**
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority
```
⚠️ **Critical:** এইটা না থাকলে build fail হবে!

### 2. **NextAuth Configuration (Required)**
```
NEXTAUTH_SECRET=your-secret-key-here-min-32-characters
NEXTAUTH_URL=https://your-domain.vercel.app
```
⚠️ **Critical:** NEXTAUTH_SECRET না থাকলে authentication কাজ করবে না!

### 3. **Email Configuration (Optional but Recommended)**
```
EMAIL_USER=tanimkhalifa55@gmail.com
EMAIL_PASS=vyri tbpi qrby dpbm ei
```
💡 Email sending এর জন্য (optional, না থাকলে email send হবে না)

### 4. **Google OAuth (Optional)**
```
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```
💡 Google sign in এর জন্য (optional)

### 5. **Image Upload (Optional)**
```
NEXT_PUBLIC_IMGBB_KEY=your-imgbb-api-key
```
💡 Image upload এর জন্য (optional)

### 6. **Database Name (Optional)**
```
DB_NAME=blood-donation
```
💡 Default: "blood-donation" (optional)

## 📝 Vercel এ Environment Variables Add করার Steps

### Method 1: Vercel Dashboard (Recommended)

1. **Vercel Dashboard** এ যান: https://vercel.com/dashboard
2. আপনার project select করুন
3. **Settings** → **Environment Variables** এ যান
4. নিচের variables গুলো add করুন:

```
Key: MONGODB_URI
Value: mongodb+srv://...
Environment: Production, Preview, Development (সব select করুন)
```

5. প্রতিটি variable এর জন্য **Add** button click করুন
6. সব variables add করার পর **Redeploy** করুন

### Method 2: Vercel CLI

```bash
# Install Vercel CLI (if not installed)
npm i -g vercel

# Login
vercel login

# Add environment variables
vercel env add MONGODB_URI production
vercel env add NEXTAUTH_SECRET production
vercel env add NEXTAUTH_URL production
vercel env add EMAIL_USER production
vercel env add EMAIL_PASS production

# Redeploy
vercel --prod
```

## 🔑 NEXTAUTH_SECRET Generate করা

```bash
# Terminal এ run করুন
openssl rand -base64 32
```

অথবা online tool ব্যবহার করুন: https://generate-secret.vercel.app/32

## 🌐 NEXTAUTH_URL Setup

Production URL:
```
NEXTAUTH_URL=https://your-project-name.vercel.app
```

Preview URL (auto-generated):
```
NEXTAUTH_URL=https://your-project-name-git-branch.vercel.app
```

## ✅ Checklist

Deploy করার আগে নিশ্চিত করুন:

- [ ] `MONGODB_URI` add করা হয়েছে
- [ ] `NEXTAUTH_SECRET` add করা হয়েছে (minimum 32 characters)
- [ ] `NEXTAUTH_URL` add করা হয়েছে (production URL)
- [ ] `EMAIL_USER` add করা হয়েছে (optional)
- [ ] `EMAIL_PASS` add করা হয়েছে (optional)
- [ ] সব variables **Production, Preview, Development** environment এ add করা হয়েছে
- [ ] Redeploy করা হয়েছে

## 🚀 Redeploy Steps

1. Vercel Dashboard → Your Project
2. **Deployments** tab
3. Latest deployment → **⋯** (three dots)
4. **Redeploy** click করুন

## 🐛 Error Debugging

### Build Error দেখলে:

1. Vercel Dashboard → **Deployments**
2. Failed deployment click করুন
3. **Build Logs** দেখুন
4. Error message check করুন

### Runtime Error দেখলে:

1. Vercel Dashboard → **Functions** tab
2. Error logs দেখুন
3. Environment variables check করুন

## 📞 Common Issues

### Issue 1: "Please add your Mongo URI to .env"
**Solution:** `MONGODB_URI` environment variable add করুন

### Issue 2: "NEXTAUTH_SECRET is missing"
**Solution:** `NEXTAUTH_SECRET` generate করে add করুন

### Issue 3: "Email sending failed"
**Solution:** `EMAIL_USER` এবং `EMAIL_PASS` add করুন (optional)

### Issue 4: "Image upload failed"
**Solution:** `NEXT_PUBLIC_IMGBB_KEY` add করুন (optional)

## 💡 Pro Tips

1. **Environment Variables** সব environment (Production, Preview, Development) এ add করুন
2. **Sensitive data** কখনো code এ commit করবেন না
3. **NEXTAUTH_SECRET** strong password ব্যবহার করুন
4. **MongoDB URI** এ special characters properly encode করুন
5. Variables add করার পর **always redeploy** করুন

## 🔒 Security Notes

- Environment variables Vercel এ **encrypted** থাকে
- `.env.local` file কখনো Git এ commit করবেন না
- Production secrets কখনো share করবেন না

