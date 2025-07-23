#!/bin/bash

# Claude Code Shortcuts Installation Script
# This script sets up aliases and functions for Claude Code development

SHORTCUTS_DIR="$HOME/cldcde-shortcuts"
BASHRC="$HOME/.bashrc"

echo "🚀 Installing Claude Code Shortcuts..."

# Create aliases for common commands
echo "
# Claude Code Shortcuts - Added by cldcde installation
alias cldcde-dev='bun dev'
alias cldcde-build='bun build'
alias cldcde-start='bun start'
alias cldcde-deploy='bun run deploy'
alias cldcde-setup='$SHORTCUTS_DIR/scripts/setup-quick.sh'
alias cldcde-gh-setup='$SHORTCUTS_DIR/scripts/setup-claude-gh-features.sh'
alias cldcde-openrouter='$SHORTCUTS_DIR/scripts/setup-openrouter.sh'
alias cldcde-docs='cat $SHORTCUTS_DIR/CLAUDE_CODE_SHORTCUTS.md'
alias cldcde-help='cat $SHORTCUTS_DIR/CLAUDE_CODE_SHORTCUTS.md'
alias cldcde-internal='cat $SHORTCUTS_DIR/CLAUDE_CODE_INTERNAL_SHORTCUTS.md'
alias cldcde-keys='cat $SHORTCUTS_DIR/CLAUDE_CODE_INTERNAL_SHORTCUTS.md'

# Claude Code functions
cldcde-init() {
    echo '📋 Initializing Claude Code project...'
    git clone https://github.com/aegntic/cldcde.git \${1:-cldcde-project}
    cd \${1:-cldcde-project}
    bun install
    cp .env.example .env
    echo '✅ Project initialized! Edit .env file and run: bun dev'
}

cldcde-db-setup() {
    echo '💾 Setting up database...'
    bun scripts/supabase-setup.ts
    bun scripts/init-db.ts
    echo '✅ Database setup complete!'
}

cldcde-quick-deploy() {
    echo '🚀 Quick deployment...'
    bun run build
    wrangler deploy
    echo '✅ Deployment complete!'
}

cldcde-health() {
    echo '🔍 Checking health...'
    curl -s http://localhost:8787/health | jq 2>/dev/null || curl -s http://localhost:8787/health
}

cldcde-api-info() {
    echo '📡 API Information...'
    curl -s http://localhost:8787/api | jq 2>/dev/null || curl -s http://localhost:8787/api
}

" >> "$BASHRC"

# Create a quick reference command
echo "
cldcde-ref() {
    echo '🔗 Claude Code Quick Reference:'
    echo '  cldcde-dev       - Start development server'
    echo '  cldcde-build     - Build for production'
    echo '  cldcde-deploy    - Deploy to Cloudflare'
    echo '  cldcde-setup     - Run quick setup'
    echo '  cldcde-init      - Initialize new project'
    echo '  cldcde-db-setup  - Setup database'
    echo '  cldcde-health    - Check health status'
    echo '  cldcde-docs      - View full documentation'
    echo '  cldcde-help      - View help'
    echo '  cldcde-ref       - Show this reference'
}
" >> "$BASHRC"

echo "✅ Claude Code shortcuts installed!"
echo "📝 Added aliases and functions to $BASHRC"
echo "🔄 Run 'source ~/.bashrc' or restart your terminal to use them"
echo ""
echo "Quick commands:"
echo "  cldcde-ref   - Show quick reference"
echo "  cldcde-help  - View full documentation"
echo "  cldcde-init  - Initialize new project"
echo ""
echo "📚 View full shortcuts reference: cldcde-docs"
