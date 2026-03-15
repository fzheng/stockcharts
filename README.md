# StockCharts

Interactive stock price charts with candlestick and volume visualization.

## Tech Stack

**Frontend:** React 19, TypeScript, TanStack Query, Lightweight Charts (TradingView), Tailwind CSS, Vite

**Backend:** Fastify, TypeScript, Alpha Vantage API, Redis/in-memory cache

## Quick Start

```sh
# Install dependencies
npm install

# Copy environment config
cp .env.example .env
# Edit .env to add your Alpha Vantage API key (free at https://www.alphavantage.co/support/#api-key)

# Start development (frontend + backend)
npm run dev
```

Then visit http://localhost:5173/ (Vite dev server proxies API calls to the backend on port 3000).

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start frontend (Vite) + backend (Fastify) concurrently |
| `npm run dev:frontend` | Start Vite dev server only |
| `npm run dev:backend` | Start Fastify backend only |
| `npm run build` | Production build (frontend + server) |
| `npm start` | Run production server |
| `npm run lint` | Run ESLint |
| `npm run format` | Format code with Prettier |
| `npm run typecheck` | TypeScript type checking |
| `npm test` | Run unit tests (Vitest) |
| `npm run test:e2e` | Run end-to-end tests (Playwright) |

## Docker

```sh
docker compose up
```

This starts the app on port 3000 with a Redis cache.

## Environment Variables

See [.env.example](.env.example) for all available options:

- `PORT` — Server port (default: 3000)
- `ALPHA_VANTAGE_API_KEY` — API key for stock data (free tier: 25 requests/day)
- `REDIS_URL` — Redis connection URL (optional, falls back to in-memory cache)
- `CACHE_TTL` — Cache duration in seconds (default: 28800 / 8 hours)

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/v1/stock/:symbol/history?days=365` | GET | Fetch OHLCV historical data |
| `/api/v1/health` | GET | Health check |

## Project Structure

```
├── server/                 # Backend (Fastify + TypeScript)
│   ├── index.ts           # Server entry point
│   ├── app.ts             # Fastify app factory
│   ├── config.ts          # Environment configuration
│   ├── routes/            # API route handlers
│   ├── services/          # Business logic (data fetching, caching)
│   ├── utils/             # Error classes, utilities
│   └── types/             # Shared TypeScript types
├── src/                   # Frontend (React + TypeScript)
│   ├── main.tsx          # Entry point
│   ├── App.tsx           # Root component
│   ├── api/              # API client functions
│   ├── components/       # React components
│   ├── hooks/            # Custom hooks (data fetching)
│   └── types/            # TypeScript types
├── index.html            # Vite HTML entry
├── vite.config.ts        # Vite configuration
├── tsconfig.json         # Frontend TypeScript config
└── tsconfig.server.json  # Backend TypeScript config
```

## License

MIT
