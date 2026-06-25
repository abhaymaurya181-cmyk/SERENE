# BetterAuth - Next.js Authentication System

A complete, production-ready authentication system built with Next.js 14+ (App Router), featuring OTP-based email verification, password reset, and optional Google OAuth integration.

## ✨ Features

- 🔐 **Secure Authentication**
  - Email + password signup with OTP verification
  - Email-based login with session management
  - OTP-based password reset flow
  - Google OAuth integration (optional)

- 📧 **Email Verification**
  - 6-digit OTP codes sent via Gmail SMTP
  - 10-minute expiration window
  - Maximum 5 verification attempts
  - Rate limiting to prevent abuse

- 🛡️ **Security Best Practices**
  - Argon2id password hashing (with bcrypt fallback)
  - OTP hashing before storage
  - Constant-time comparison to prevent timing attacks
  - CSRF protection
  - Rate limiting (IP and email-based)
  - Secure session management with HTTP-only cookies

- 🎨 **Modern UI/UX**
  - Responsive design with Tailwind CSS
  - Dark mode support
  - Smooth animations and transitions
  - Glassmorphism effects
  - Custom OTP input with auto-advance and paste support

- 🧪 **Development Tools**
  - Dev-only email viewer to see sent OTPs
  - Comprehensive error handling
  - TypeScript for type safety

## 📋 Prerequisites

- Node.js 18+ and npm
- PostgreSQL database
- Gmail account (for SMTP)
- Google Cloud project (optional, for OAuth)

## 🚀 Quick Start

### 1. Clone and Install

```bash
cd /home/abhay/Desktop/BetterAuth
npm install
```

### 2. Configure Environment Variables

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Edit `.env` and configure:

```bash
# Database - Replace with your PostgreSQL connection string
DATABASE_URL="postgresql://user:password@localhost:5432/betterauth"

# App URLs
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NODE_ENV="development"

# BetterAuth - Generate a random secret (32+ characters)
BETTER_AUTH_SECRET="your-super-secret-random-string-min-32-chars"
BETTER_AUTH_URL="http://localhost:3000"

# Gmail SMTP (see setup instructions below)
GMAIL_USER="your-email@gmail.com"
GMAIL_PASS="your-16-char-app-password"

# Google OAuth (optional)
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
```

### 3. Set Up Gmail SMTP

#### Option A: Gmail with App Password (Recommended)

1. Enable 2-Factor Authentication on your Google account
2. Go to [Google App Passwords](https://myaccount.google.com/apppasswords)
3. Generate an app password for "Mail"
4. Copy the 16-character password to `GMAIL_PASS` in `.env`

#### Option B: Gmail with Less Secure App Access

⚠️ **Not recommended** - Only use for testing

1. Go to [Less secure app access](https://myaccount.google.com/lesssecureapps)
2. Turn on "Allow less secure apps"
3. Use your regular Gmail password in `GMAIL_PASS`

#### Gmail Sending Limits

- **Free Gmail**: ~500 emails/day
- **Google Workspace**: ~2000 emails/day

For production, consider migrating to:
- AWS SES
- SendGrid
- Postmark
- Mailgun

### 4. Set Up Database

Create your PostgreSQL database, then run:

```bash
# Generate Prisma client
npm run db:generate

# Run migrations
npm run db:migrate

# (Optional) Seed test data
npm run db:seed
```

### 5. Run Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## 🔧 Google OAuth Setup (Optional)

### 1. Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Enable "Google+ API"

### 2. Create OAuth Credentials

1. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client ID"
2. Application type: "Web application"
3. Authorized redirect URIs:
   - Development: `http://localhost:3000/api/auth/callback/google`
   - Production: `https://yourdomain.com/api/auth/callback/google`
4. Copy Client ID and Client Secret to `.env`

### 3. Configure OAuth Consent Screen

1. Go to "OAuth consent screen"
2. Add your app information
3. Add scopes: `email`, `profile`
4. Add test users (for development)

**Note**: Google OAuth is currently a placeholder in the UI. Full BetterAuth integration can be added based on the official BetterAuth Google provider documentation.

## 📁 Project Structure

```
/home/abhay/Desktop/BetterAuth/
├── app/
│   ├── (auth)/              # Auth pages (signup, login, forgot, verify)
│   │   ├── signup/
│   │   ├── login/
│   │   ├── verify-otp/
│   │   ├── forgot/
│   │   └── dev-emails/      # Dev-only OTP viewer
│   ├── dashboard/           # Protected dashboard
│   ├── api/auth/            # API routes
│   │   ├── signup/
│   │   ├── verify-otp/
│   │   ├── login/
│   │   ├── forgot/
│   │   └── logout/
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── components/
│   └── ui/                  # Reusable UI components
│       ├── Button.tsx
│       ├── Input.tsx
│       └── OtpInput.tsx
├── lib/
│   ├── prisma.ts            # Prisma client
│   ├── utils.ts             # Auth utilities
│   ├── otp.ts               # OTP generation/verification
│   ├── email.ts             # Gmail SMTP
│   └── rate-limit.ts        # Rate limiting
├── prisma/
│   └── schema.prisma        # Database schema
├── .env.example
├── package.json
├── tsconfig.json
└── README.md
```

## 🔐 Security Features

### Password Hashing

- **Argon2id** (primary): Memory-hard, resistant to GPU attacks
- **bcrypt** (fallback): Industry-standard hashing
- Automatic salt generation
- Minimum 12 rounds for bcrypt

### OTP Security

- **Hashed Storage**: OTPs are hashed with Argon2id before database storage
- **Short Expiry**: 10-minute window
- **Attempt Limiting**: Maximum 5 verification attempts
- **Constant-Time Comparison**: Prevents timing attacks
- **Auto-Cleanup**: Expired OTPs removed automatically

### Rate Limiting

Current implementation (in-memory):
- **Email**: 1 OTP per 60 seconds
- **IP**: 5 OTPs per hour
- **Login**: 5 attempts per 15 minutes

> ⚠️ **Production Note**: Migrate to Redis for distributed rate limiting when running multiple instances.

### Session Management

- HTTP-only cookies (not accessible via JavaScript)
- Secure flag in production (HTTPS only)
- SameSite: Lax (CSRF protection)
- 7-day expiration
- Session revocation on password reset

## 🧪 Development Features

### Dev Email Viewer

Visit [http://localhost:3000/dev-emails](http://localhost:3000/dev-emails) to see recently sent OTP codes.

**Features**:
- Shows last 10 OTPs sent
- Displays purpose (signup/reset)
- Timestamp for each email
- **Automatically disabled in production**

### Console Logging

In development mode, OTPs are logged to console:
```
[DEV] OTP sent to user@example.com: 123456
```

## 🚀 Production Deployment

### 1. Environment Variables

```bash
NODE_ENV="production"
DATABASE_URL="postgresql://..."  # Production database
BETTER_AUTH_SECRET="strong-random-secret"  # Generate new secret!
GMAIL_USER="..."  # Or use production email service
GMAIL_PASS="..."
```

### 2. Security Checklist

- [ ] Generate a strong `BETTER_AUTH_SECRET` (32+ characters)
- [ ] Use HTTPS (enforced automatically for cookies)
- [ ] Migrate to production email service (AWS SES, SendGrid, etc.)
- [ ] Implement Redis-based rate limiting
- [ ] Enable database connection pooling
- [ ] Set up error logging (Sentry, LogRocket, etc.)
- [ ] Configure CORS if needed
- [ ] Review and update security headers
- [ ] Run security audit: `npm audit`

### 3. Database Migrations

```bash
# In production, use push or manual migrations
npm run db:push
```

### 4. Build and Deploy

```bash
npm run build
npm start
```

### 5. Recommended Services

- **Hosting**: Vercel, Railway, Fly.io
- **Database**: Neon, Supabase, Railway PostgreSQL
- **Email**: AWS SES, SendGrid, Postmark
- **Rate Limiting**: Upstash Redis, Redis Cloud
- **Monitoring**: Sentry, LogRocket, Datadog

## 📚 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/signup` | Create account + send OTP |
| POST | `/api/auth/verify-otp` | Verify signup OTP |
| POST | `/api/auth/login` | Email/password login |
| POST | `/api/auth/forgot` | Request password reset OTP |
| POST | `/api/auth/forgot/verify` | Verify reset OTP + new password |
| POST | `/api/auth/logout` | Logout and clear session |

### Example: Signup

**Request**:
```bash
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "SecurePass123",
    "name": "John Doe"
  }'
```

**Response**:
```json
{
  "success": true,
  "message": "Account created! Please check your email for the verification code."
}
```

## 🐛 Troubleshooting

### Gmail SMTP Not Working

**Error**: "Invalid login" or "Username and Password not accepted"

**Solutions**:
1. Verify 2FA is enabled
2. Use an App Password, not your regular password
3. Check "Less secure app access" is turned on (if not using App Password)
4. Ensure `GMAIL_USER` and `GMAIL_PASS` are correct in `.env`

### Database Connection Failed

**Error**: "Can't reach database server"

**Solutions**:
1. Verify PostgreSQL is running
2. Check `DATABASE_URL` format
3. Ensure database exists
4. Verify firewall/network settings

### Rate Limit Issues in Development

**Solution**: Restart the dev server to reset in-memory rate limits, or wait for the cooldown period.

### OTP Not Received

**Check**:
1. Spam folder
2. Console logs for `[DEV] OTP sent to...`
3. `/dev-emails` page (development only)
4. Gmail sending limits not exceeded

## 🧩 Customization

### Change OTP Length

Edit `lib/otp.ts` and update `components/ui/OtpInput.tsx`:

```typescript
// lib/otp.ts
export function generateOtp(): string {
  // Change to 4-digit or 8-digit
  const min = 100000
  const max = 999999
  // ...
}
```

### Modify Session Expiry

Edit `lib/utils.ts`:

```typescript
const expires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
```

### Change Email Template

Edit `lib/email.ts` to customize the HTML email template.

### Add More OAuth Providers

Follow BetterAuth documentation to add GitHub, Twitter, etc.

## 📝 Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run test         # Run tests (if configured)
npm run db:generate  # Generate Prisma client
npm run db:push      # Push schema to database
npm run db:migrate   # Run migrations
npm run db:studio    # Open Prisma Studio
```

## 🤝 Contributing

This is a proof-of-concept project. Feel free to fork and customize for your needs!

## 📄 License

MIT License - feel free to use in your projects!

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - React framework
- [BetterAuth](https://better-auth.com/) - Authentication library concept
- [Prisma](https://www.prisma.io/) - Database ORM
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Nodemailer](https://nodemailer.com/) - Email sending
- [@noble/hashes](https://github.com/paulmillr/noble-hashes) - Argon2 implementation

## 📞 Support

For issues or questions:
1. Check the troubleshooting section above
2. Review the code comments
3. Check environment variables are set correctly

---

**Built with ❤️ using Next.js, TypeScript, and modern security practices**
# SERENE
