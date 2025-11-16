# Email Setup Guide (Free Options)

## ✅ nodemailer সম্পূর্ণ FREE

`nodemailer` package নিজেই সম্পূর্ণ free এবং open source। Email পাঠানোর জন্য আপনাকে শুধু একটি free SMTP service ব্যবহার করতে হবে।

## 🆓 Free SMTP Options

### 1. **Gmail (সবচেয়ে সহজ - Free)**
- **Daily Limit:** 500 emails/day
- **Setup:**
  1. Google Account → Security
  2. 2-Step Verification চালু করুন
  3. App Passwords → Generate করুন
  4. `.env.local` এ যোগ করুন:

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-16-digit-app-password
```

### 2. **SendGrid (Free Forever)**
- **Daily Limit:** 100 emails/day
- **Monthly Limit:** 3,000 emails/month
- **Setup:**
  1. https://sendgrid.com এ account তৈরি করুন
  2. API Key তৈরি করুন
  3. `.env.local` এ যোগ করুন:

```env
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASSWORD=your-sendgrid-api-key
```

### 3. **Resend (Free Tier)**
- **Monthly Limit:** 3,000 emails/month
- **Setup:**
  1. https://resend.com এ account তৈরি করুন
  2. API Key তৈরি করুন
  3. `.env.local` এ যোগ করুন:

```env
SMTP_HOST=smtp.resend.com
SMTP_PORT=587
SMTP_USER=resend
SMTP_PASSWORD=your-resend-api-key
```

### 4. **Mailgun (Free Trial)**
- **Monthly Limit:** 5,000 emails/month (first 3 months)
- **Setup:**
  1. https://mailgun.com এ account তৈরি করুন
  2. SMTP credentials নিন
  3. `.env.local` এ যোগ করুন:

```env
SMTP_HOST=smtp.mailgun.org
SMTP_PORT=587
SMTP_USER=your-mailgun-username
SMTP_PASSWORD=your-mailgun-password
```

## 📝 Environment Variables Example

`.env.local` ফাইলে যোগ করুন:

```env
# Gmail Example (Free)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=xxxx xxxx xxxx xxxx

# SendGrid Example (Free)
# SMTP_HOST=smtp.sendgrid.net
# SMTP_PORT=587
# SMTP_USER=apikey
# SMTP_PASSWORD=SG.xxxxxxxxxxxxx
```

## 🚀 Quick Start (Gmail)

1. Gmail account এ যান
2. Security → 2-Step Verification চালু করুন
3. App Passwords → Generate করুন
4. `.env.local` ফাইলে credentials যোগ করুন
5. Server restart করুন

## ⚠️ Important Notes

- **nodemailer package:** সম্পূর্ণ FREE ✅
- **SMTP Service:** Free tier available ✅
- **Gmail:** সবচেয়ে সহজ, 500 emails/day free
- **SendGrid:** Best for production, 100 emails/day free forever
- **Resend:** Modern service, 3,000 emails/month free

## 🔒 Security

- `.env.local` file কখনো Git এ commit করবেন না
- App passwords ব্যবহার করুন, main password নয়
- Production এ environment variables properly set করুন

