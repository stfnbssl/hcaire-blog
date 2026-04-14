# HCAIRE Blog — Server

Express.js REST API in TypeScript. Serves content from MongoDB Atlas, authenticates via Clerk, and handles Lemon Squeezy subscription webhooks.

## Stack

- **Runtime**: Node.js + TypeScript (`ts-node` in dev, compiled JS in prod)
- **Framework**: Express.js 4
- **Database**: MongoDB Atlas via Mongoose
- **Auth**: Clerk (`@clerk/express`, `@clerk/backend`)
- **Subscriptions**: Lemon Squeezy
- **Notifications**: Telegram Bot, Redis Cloud pub/sub
- **Port**: `3018`

## Project Structure

```
server/
├── src/
│   ├── index.ts                  # Entry point, middleware setup
│   ├── config/
│   │   └── db.ts                 # MongoDB connection
│   ├── middleware/
│   │   └── clerkAuth.ts          # authenticateClerk, requireAdmin, optionalClerkAuth
│   ├── models/
│   │   ├── Content.ts
│   │   ├── Navigation.ts
│   │   ├── ArticleRequest.ts
│   │   ├── UserSubscription.ts
│   │   └── WorkflowLog.ts
│   ├── controllers/
│   │   ├── contentController.ts
│   │   ├── authController.ts
│   │   └── subscriptionController.ts
│   ├── routes/
│   │   ├── content.ts            # /api/contents
│   │   ├── nav.ts                # /api/navigation
│   │   ├── auth.ts               # /api/login, /api/logout
│   │   ├── articleRequests.ts    # /api/article-requests
│   │   ├── subscriptions.ts      # /api/subscriptions
│   │   └── webhooks.ts           # /webhooks (Lemon Squeezy)
│   ├── services/
│   │   └── telegramBot.ts
│   └── types/
│       └── index.ts
├── .env.example
└── tsconfig.json
```

## API Endpoints

### Public

```
GET  /api/contents              # list articles (paginated)
GET  /api/contents/:slug        # single article
GET  /api/navigation            # navigation menu
POST /api/login                 # legacy JWT login
```

### Authenticated (Clerk session required)

```
GET  /api/subscriptions/status  # current user subscription status
POST /api/article-requests      # submit an article request
```

### Admin only (`role: admin` in Clerk publicMetadata)

```
POST   /api/contents            # create article
PUT    /api/contents/:id        # update article
DELETE /api/contents/:id        # delete article
GET    /api/admin/contents      # full article list (admin view)
GET    /api/article-requests    # list all article requests
GET    /api/workflow-logs       # workflow execution logs
```

### Internal

```
POST /webhooks/lemonsqueezy     # Lemon Squeezy event webhook
GET  /health                    # DB + server health check
```

## Environment Variables

Create `server/.env` from `.env.example`:

```env
NODE_ENV=development
PORT=3018

# MongoDB Atlas
MONGODB_PASSWORD=your_password
MONGODB_URL=mongodb+srv://user:{password}@cluster0.xxx.mongodb.net/?appName=Cluster0

# Clerk
CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# Lemon Squeezy
LEMONSQUEEZY_API_KEY=...
LEMONSQUEEZY_STORE_ID=...
LEMONSQUEEZY_VARIANT_ID=...
LEMONSQUEEZY_WEBHOOK_SECRET=...

# Redis Cloud
REDIS_HOST=redis-xxxxx.xxx.eu-west3-1.gcp.cloud.redislabs.com
REDIS_PORT=11976
REDIS_PASSWORD=...

# Telegram Bot (admin notifications)
TELEGRAM_TOKEN=...
TELEGRAM_ID=...

# Internal API key (coworker authentication)
COWORK_API_KEY=...

# CORS
CORS_ORIGIN=http://localhost:5173
```

## Auth Middleware

Three middleware functions are available in `src/middleware/clerkAuth.ts`:

| Middleware | Behaviour |
|---|---|
| `authenticateClerk` | Returns 401 if no valid Clerk session |
| `requireAdmin` | Returns 403 if user does not have `role: admin` in Clerk `publicMetadata` |
| `optionalClerkAuth` | Attaches `req.clerkUserId` if signed in, continues anyway |

## Commands

```bash
npm run dev     # nodemon + ts-node (hot reload)
npm run build   # compile TypeScript → dist/
npm run start   # run compiled dist/index.js
```
