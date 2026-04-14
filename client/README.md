# HCAIRE Blog — Client

React 18 SPA built with Vite and TypeScript. Deployed on Cloudflare Pages. Communicates with the Express backend for content and authentication.

## Stack

- **Framework**: React 18 + TypeScript
- **Build**: Vite 8 + `@cloudflare/vite-plugin`
- **Routing**: React Router v6
- **Styling**: Tailwind CSS + Material UI (MUI)
- **Auth**: Clerk (`@clerk/clerk-react`)
- **Markdown**: `react-markdown` + `remark-gfm`
- **Hosting**: Cloudflare Pages

## Project Structure

```
client/
├── src/
│   ├── main.tsx
│   ├── App.tsx                   # ClerkProvider, routes, theme
│   ├── pages/
│   │   ├── Home.tsx              # latest articles
│   │   ├── About.tsx             # static about page
│   │   ├── BlogPost.tsx          # single article (markdown)
│   │   ├── Pricing.tsx           # subscription page (Lemon Squeezy)
│   │   ├── AdminDashboard.tsx    # content CRUD (admin only)
│   │   ├── AdminRequests.tsx     # article request management (admin only)
│   │   ├── WorkflowLog.tsx       # workflow logs viewer (admin only)
│   │   └── NotFound.tsx
│   ├── components/
│   │   ├── Navigation.tsx
│   │   ├── UserNav.tsx           # Clerk sign-in/user button
│   │   ├── AdminLayout.tsx       # admin sidebar layout
│   │   ├── MarkdownRenderer.tsx
│   │   ├── Header.tsx
│   │   └── Footer.tsx
│   ├── hooks/
│   │   ├── useFetchContent.ts
│   │   ├── useFetchNavigation.ts
│   │   └── useSubscription.ts
│   ├── services/
│   │   ├── apiClient.ts          # axios/fetch base config
│   │   ├── contentService.ts
│   │   └── authService.ts
│   ├── context/
│   │   └── AuthContext.tsx
│   └── types/
│       ├── content.ts
│       └── navigation.ts
├── public/
├── wrangler.jsonc                # Cloudflare Pages config
├── .env.example
└── vite.config.ts
```

## Pages & Routes

| Route | Page | Auth |
|---|---|---|
| `/` | Home | Public |
| `/about` | About | Public |
| `/blog/:slug` | BlogPost | Public (gated content requires subscription) |
| `/pricing` | Pricing | Public |
| `/admin` | AdminDashboard | Admin only |
| `/admin/requests` | AdminRequests | Admin only |
| `/admin/workflow` | WorkflowLog | Admin only |
| `*` | NotFound | — |

## Environment Variables

### Local development — `client/.env`

```env
VITE_API_URL=http://localhost:3018/api
VITE_APP_NAME=HCAIRE Blog
VITE_CLERK_PUBLISHABLE_KEY=pk_test_...
```

### Local Cloudflare simulation — `client/.dev.vars`

Cloudflare Pages uses `.dev.vars` for secrets when running locally via Wrangler:

```env
VITE_CLERK_PUBLISHABLE_KEY=pk_test_...
```

### Production (Cloudflare Pages dashboard)

Set these in the Cloudflare Pages project → Settings → Environment Variables:

```
VITE_API_URL=https://your-api-domain.com/api
VITE_CLERK_PUBLISHABLE_KEY=pk_live_...
```

## Commands

```bash
npm run dev       # Vite dev server on port 5173
npm run build     # TypeScript check + Vite production build
npm run preview   # build + local Wrangler preview (Cloudflare simulation)
npm run deploy    # build + wrangler deploy to Cloudflare Pages
```

## Notes

- Admin pages are lazy-loaded (`React.lazy`) to keep the main bundle small.
- The `@cloudflare/vite-plugin` runs the app inside a Cloudflare Worker context locally; use `.dev.vars` (not `.env`) for secrets that need to be available in that context.
- Clerk `pk_test_` keys work on `localhost`; use `pk_live_` keys in production.
