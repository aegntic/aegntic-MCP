# Claude Code Shortcuts & Commands Reference

This reference is compiled from the [cldcde repository](https://github.com/aegntic/cldcde) - the unofficial community hub for Claude Code extensions and MCP servers.

## 📋 Table of Contents
- [Development Commands](#development-commands)
- [Database Commands](#database-commands)
- [Deployment Commands](#deployment-commands)
- [Setup Scripts](#setup-scripts)
- [Utility Commands](#utility-commands)
- [API Endpoints](#api-endpoints)
- [Architecture Overview](#architecture-overview)
- [Quick Start](#quick-start)

## 🔧 Development Commands

### Basic Development
```bash
# Start development server with hot reload
bun dev

# Build frontend for production
bun build

# Run production server
bun start

# Run tests (when implemented)
bun test

# Build with watch mode
bun run --watch server.ts

# Cloudflare Workers development
wrangler dev
```

### Frontend Development
```bash
# Build frontend specifically
bun build --minify --target browser --format esm --splitting --outdir ./dist ./frontend/src/index.tsx

# Build worker
bun build ./src/worker.ts --outdir ./dist --target=browser --format=esm
```

## 💾 Database Commands

### Database Setup
```bash
# Initialize database
bun scripts/init-db.ts

# Run migrations
wrangler d1 execute cldcde-content --file=./migrations/001_initial_schema.sql

# Setup Supabase
bun scripts/supabase-setup.ts
```

### Search & Indexing
```bash
# Index search data
bun scripts/index-search.ts

# Check search health
curl -s $MEILISEARCH_HOST/health | jq
```

## 🚀 Deployment Commands

### Cloudflare Deployment
```bash
# Deploy everything
bun run deploy

# Deploy to Cloudflare Pages
bun run deploy:pages

# Deploy to Cloudflare Workers
wrangler deploy

# Deploy Pages specifically
bun run build && wrangler pages deploy dist --project-name=cldcde
```

### Secrets Management
```bash
# Set secrets
bun run scripts/set-secrets.ts

# Configure environment variables
cp .env.example .env
```

## ⚙️ Setup Scripts

### Quick Setup
```bash
# Quick setup script
./scripts/setup-quick.sh

# Full setup wizard
bun scripts/setup-assistant-ultra.ts

# Setup Claude GitHub features
./scripts/setup-claude-gh-features.sh

# Setup OpenRouter integration
./scripts/setup-openrouter.sh
```

### Environment Setup
```bash
# Preflight checks
bun scripts/preflight-check.ts

# Setup monitoring
bun scripts/setup-monitoring.ts

# Initialize database
bun scripts/init-db.ts
```

## 🛠️ Utility Commands

### Monitoring & Health
```bash
# Health check
curl -s http://localhost:8787/health

# API info
curl -s http://localhost:8787/api

# Warm cache
bun scripts/warm-cache.ts
```

### Content Management
```bash
# Add featured resources
bun scripts/add-featured-resources.ts

# Update ASCII headers
bun update-ascii-headers.ts

# Backup D1 database
bun scripts/backup-d1.ts

# Seed D1 database
bun scripts/seed-d1.ts
```

## 🌐 API Endpoints

### Authentication
```bash
# User registration
POST /api/auth/register

# User login
POST /api/auth/login

# Get current user
GET /api/auth/me
```

### Extensions
```bash
# List extensions
GET /api/extensions

# Get extension details
GET /api/extensions/:id

# Create extension (auth required)
POST /api/extensions
```

### MCP Servers
```bash
# List MCP servers
GET /api/mcp

# Get server details
GET /api/mcp/:id
```

### Users
```bash
# Check username availability
GET /api/users/check-username

# Update user profile
PUT /api/users/profile
```

## 🏗️ Architecture Overview

### Technology Stack
- **Runtime**: Bun
- **Backend Framework**: Hono
- **Frontend**: React + TypeScript
- **Database**: Supabase (PostgreSQL)
- **Deployment**: Cloudflare Workers + Pages
- **Styling**: styled-components
- **AI Integration**: OpenRouter

### Key Files
- `server.ts` - Main server entry point
- `src/api/*` - API route handlers
- `src/db/neo4j.ts` - Database operations
- `frontend/src/App.tsx` - Main React app
- `frontend/src/components/` - UI components

## 🚀 Quick Start

1. **Clone and Setup**
   ```bash
   git clone https://github.com/aegntic/cldcde.git
   cd cldcde
   bun install
   ```

2. **Environment Configuration**
   ```bash
   cp .env.example .env
   # Edit .env with your credentials
   ```

3. **Database Setup**
   ```bash
   bun scripts/supabase-setup.ts
   bun scripts/init-db.ts
   ```

4. **Development**
   ```bash
   bun dev
   ```

5. **Deploy**
   ```bash
   bun run deploy
   ```

## 📝 Environment Variables

```env
# Supabase
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_KEY=your_service_key

# OpenRouter (for AI features)
OPENROUTER_API_KEY=your_openrouter_key

# GitHub OAuth (optional)
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
```

## 🎨 Available Themes

- **Claude Code Dark**: Default dark theme
- **Claude Light**: Matches Claude.ai's exact color palette
- **Futuristic Monochrome**: Cyberpunk-inspired theme
- **Dracula**: Popular dark theme
- **Monokai**: Developer favorite
- **Solarized**: Eye-friendly theme
- **Nord**: Arctic-inspired theme
- **Gruvbox**: Retro groove theme

## 📚 Additional Resources

- **Live Site**: [https://cldcde.cc](https://cldcde.cc)
- **Repository**: [https://github.com/aegntic/cldcde](https://github.com/aegntic/cldcde)
- **Documentation**: Check the `docs/` folder for detailed guides
- **Community**: Join the Claude Code community discussions

---

*This reference is maintained by the Claude Code community. For updates and contributions, visit the [cldcde repository](https://github.com/aegntic/cldcde).*
