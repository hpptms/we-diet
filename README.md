# We-Diet Frontend

A modern SNS community platform for diet & fitness enthusiasts, built with React + TypeScript.

## Live Application

**Official Site:** [https://we-diet.net/](https://we-diet.net/)

---

## Features

### Core Features
- **Food Logging** — Record meals with photos and track nutritional information
- **Exercise Tracking** — Log strength training, cardio, and various workouts
- **Weight Management** — Visualize weight and body fat trends with interactive charts
- **Profile Settings** — Customizable user profiles with avatar support
- **SNS Community** — Post, like, comment, and connect with diet companions

### Authentication
- **Social Login** — Google, LINE, X (Twitter)
- **Email Auth** — Traditional email/password authentication
- **Admin System** — Role-based permission management

### Internationalization & Accessibility
- **Multi-language** — Japanese, English, Chinese, Korean, Spanish
- **PWA Support** — Add to home screen, offline capabilities, shortcuts
- **Responsive Design** — Fully optimized for desktop and mobile

### Advanced Features
- **Notifications** — Real-time notification management
- **Messaging** — Direct messaging between users
- **Hashtags & Mentions** — Tag posts and mention users
- **Trending** — Discover popular posts and trends
- **SEO Optimized** — IndexNow API, sitemap, AMP pages
- **Analytics** — Google Analytics integration

---

## Tech Stack

### Framework & Build Tools
| Category | Technology | Version |
|----------|------------|---------|
| Framework | React | 18.3.1 |
| Language | TypeScript | 5.4.5 |
| Build Tool | Vite | 6.3.5 |
| UI Framework | Material-UI (MUI) | 5.13.7 |
| State Management | Recoil | 0.7.7 |
| Routing | React Router DOM | 6.23.1 |

### Data & Services
| Category | Technology | Version |
|----------|------------|---------|
| HTTP Client | Axios | 1.11.0 |
| Protocol Buffers | @protobuf-ts/runtime | 2.11.1 |
| Charts | Chart.js + react-chartjs-2 | 4.5.0 / 5.3.0 |
| Image Management | Cloudinary | 2.6.1 |
| Analytics | react-ga4 | 2.1.0 |

### Styling & UI
| Category | Technology |
|----------|------------|
| CSS-in-JS | Emotion (@emotion/react, @emotion/styled) |
| Icons | React Icons, MUI Icons |
| Carousel | React Slick |
| SEO | react-helmet-async |
| Performance | Web Vitals |

---

## Project Structure

```
frontend/
├── public/                      # Static assets
│   ├── amp/                     # AMP pages
│   ├── blog/                    # Blog pages
│   ├── fonts/                   # Font files
│   ├── manifest.json            # PWA manifest
│   ├── robots.txt               # SEO config
│   ├── sitemap.xml              # Sitemap
│   ├── sitemap_multilang.xml    # Multilingual sitemap
│   ├── sw.js                    # Service Worker
│   ├── _headers                 # CDN headers config
│   ├── _redirects               # Redirect rules
│   └── *.html                   # Static HTML pages
│
├── src/
│   ├── api/                     # API client functions
│   ├── component/               # Reusable components
│   │   ├── Dieter/              # SNS feed components
│   │   ├── ExerciseRecord/      # Exercise tracking
│   │   ├── FoodLog/             # Food logging
│   │   ├── ProfileSettings/     # Profile management
│   │   ├── TopPage/             # Landing page
│   │   ├── WeightManagement/    # Weight tracking
│   │   ├── authLogin/           # Auth components
│   │   ├── common/              # Shared components
│   │   ├── Header.tsx           # App header
│   │   ├── Footer.tsx           # App footer
│   │   ├── LanguageSelector.tsx # Language picker
│   │   ├── NotificationSettings.tsx
│   │   ├── SEOHelmet.tsx        # SEO meta tags
│   │   └── *LoginButton.tsx     # Social login buttons
│   ├── context/                 # React Context providers
│   ├── hooks/                   # Custom hooks
│   │   ├── useAdminPermission.ts
│   │   ├── useDashboardAnimation.ts
│   │   ├── useDieterLogic.ts
│   │   ├── useDieterState.ts
│   │   ├── useFollowCounts.ts
│   │   ├── useHashtagSuggestion.ts
│   │   ├── useMentionSuggestion.ts
│   │   ├── useMessageManager.ts
│   │   ├── useNotificationManager.ts
│   │   ├── usePWAInstall.ts
│   │   ├── usePostManager.ts
│   │   ├── useResponsive.ts
│   │   ├── useToast.ts
│   │   ├── useTranslation.ts
│   │   └── useUnifiedPollingManager.ts
│   ├── i18n/                    # Internationalization
│   │   ├── index.ts             # i18n config
│   │   ├── languages/           # Translation files
│   │   ├── moduleLoader.ts      # Dynamic loader
│   │   └── tools/               # Translation utilities
│   ├── image/                   # Image assets
│   ├── page/                    # Page components
│   │   ├── DashboardPage.tsx    # Main dashboard
│   │   ├── LoginPage.tsx        # Login page
│   │   ├── TopPage.tsx          # Landing page
│   │   ├── FAQPage.tsx          # FAQ
│   │   ├── PrivacyPolicy.tsx    # Privacy policy
│   │   ├── TermsOfService.tsx   # Terms of service
│   │   ├── VerifyEmailPage.tsx  # Email verification
│   │   └── MainContent/         # Dashboard content
│   ├── proto/                   # Protocol Buffers
│   ├── recoil/                  # Recoil atoms & selectors
│   ├── styles/                  # Global styles
│   ├── types/                   # TypeScript types
│   ├── utils/                   # Utility functions
│   ├── App.tsx                  # App entry
│   ├── index.tsx                # React entry point
│   └── index.css                # Global CSS
│
├── scripts/                     # Build scripts
│   └── minify-html.js           # HTML minifier
│
├── build/                       # Build output
├── package.json
├── vite.config.ts
├── tsconfig.json
├── Dockerfile
├── index.html
├── .env
└── .env.development
```

---

## Development

```bash
# Start dev server
npm run dev

# Production build
npm run build

# Production build (with NODE_ENV)
npm run build:prod

# Build with HTML minification
npm run build:minify

# Watch mode
npm run build:watch

# Preview build
npm run preview

# Bundle analysis
npm run analyze

# Generate Protocol Buffers
npm run proto:generate
```

---

## Environment Variables

Configure the following in `.env`:

- API connection settings
- Authentication credentials
- External services (Cloudinary, Google Analytics, etc.)

See `.env.development` for reference.

---

## PWA Features

- Add to home screen
- Offline support via Service Worker
- App shortcuts (food, exercise, weight logging)
- Share target (receive shared content from other apps)
