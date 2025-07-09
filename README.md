[![MseeP.ai Security Assessment Badge](https://mseep.net/pr/aegntic-claude-export-mcp-badge.png)](https://mseep.ai/app/aegntic-claude-export-mcp)

# Aegntic MCP Collection

A comprehensive collection of Model Context Protocol (MCP) servers for AI agents, providing advanced capabilities for documentation, authentication, data analysis, image generation, and more.

## 🚀 Quick Start

```bash
# Clone the repository
git clone https://github.com/aegntic/aegntic-mcp.git
cd aegntic-mcp

# Run the automated setup script
./setup.sh

# Configure your Claude Desktop or other MCP client
```

## Unified MCP Configuration

We maintain a unified MCP configuration approach that works seamlessly across both Claude Desktop and Claude Code. This configuration lives in:

- **Claude Desktop**: `~/.config/Claude/claude_desktop_config.json`
- **Claude Code**: `~/.config/claude-code/mcp_servers.json`
- **Global MCP Servers**: `~/.mcp-servers/` (for locally developed servers)

### Benefits of Unified Configuration

1. **Single Source of Truth**: One configuration works across all Claude environments
2. **Easy Management**: Add or update servers in one place
3. **Consistent Paths**: Servers work regardless of which Claude interface you're using
4. **Development Friendly**: Local servers are stored in a dedicated global directory

## 📦 MCP Servers Included

### 🎬 Content Creation & Documentation
- **[dailydoco-pro](./dailydoco-pro/)** - Elite automated documentation platform with AI test audiences
- **[comfyui-mcp](./comfyui-mcp/)** - AI image generation, video creation, and editing via ComfyUI

### 🔐 Authentication & User Management  
- **[aegntic-auth](./aegntic-auth/)** - User registration, licensing, and email management system
- **[aegnt-27](./aegnt-27/)** - Human authenticity engine for AI detection resistance

### 🧠 Knowledge & Memory
- **[graphiti-mcp](./graphiti-mcp/)** - Temporal knowledge graph memory system for AI agents
- **[n8n-pro](./n8n-pro/)** - Comprehensive n8n workflow documentation and management (525+ nodes)

### 🔨 Development & Automation
- **[just-prompt](./just-prompt/)** - Multi-LLM prompt orchestration with CEO/board decision making
- **[quick-data](./quick-data/)** - Quick data analysis, visualization, and insights

## Available MCP Servers

| Server | Type | Description | Installation Path |
|--------|------|-------------|-------------------|
| [Aegntic Knowledge Engine](servers/aegntic-knowledge-engine) | Local/UV | **Zero-cost unified knowledge engine** with web crawling, RAG, memory graph, task management, and documentation context (20 tools) | `servers/aegntic-knowledge-engine` |
| [AI Collaboration Hub](servers/ai-collaboration-hub) | Local/UV | AI-powered collaboration tools with OpenRouter integration | `~/.mcp-servers/ai-collaboration-hub` |
| [Claude Export MCP](servers/claude-export-mcp) | NPM | Export Claude Desktop projects, conversations, and artifacts to Markdown format | `npx @aegntic/claude-export-mcp` |
| [Firebase Studio MCP](servers/firebase-studio-mcp) | NPM | Complete access to Firebase and Google Cloud services | `npx @aegntic/firebase-studio-mcp` |
| [n8n MCP](servers/n8n-mcp) | NPM | Limitless n8n workflow automation with no restrictions | `npx @leonardsellem/n8n-mcp-server` |
| [Docker MCP](servers/docker-mcp) | UVX | Comprehensive Docker container and image management with Docker Hub integration | `uvx mcp-server-docker` |
| [Just Prompt](external) | Local/UV | Advanced prompt orchestration and model routing | `/home/tabs/ae-co-system/CLAEM/just-prompt-orchestration/just-prompt` |
| [Quick Data](external) | Local/UV | Fast data processing and analysis tools | `/home/tabs/ae-co-system/DAILYDOCO/quick-data-mcp` |
| [DailyDoco Pro](local) | Local/Node | Professional documentation and project management | `~/.mcp-servers/dailydoco-pro` |
| [Aegnt-27](local) | Local/Node | Advanced AI agent capabilities | `~/.mcp-servers/aegnt-27` |
| [Aegnt-27-lib](local) | Local/Node | AI agent library and utilities | `~/.mcp-servers/aegnt-27-lib` |

### Additional Integrated Servers

These servers are included in our unified configuration:

| Server | Type | Description |
|--------|------|-------------|
| filesystem | NPM | File system operations |
| memory | NPM | Memory and knowledge management |
| context7 | NPM | Context management for AI conversations |
| puppeteer | NPM | Browser automation with Playwright |
| sequentialthinking | NPM | Sequential thinking and reasoning tools |
| github | Smithery | GitHub integration and operations |
| exa | Smithery | Advanced search capabilities |
| smithery | Smithery | Smithery toolbox utilities |
| desktop-commander | Smithery | Desktop automation and control |
| ppick | UVX | Process picking and management |
| notionApi | NPM | Notion API integration |
| supabase | NPM | Supabase database integration |

## Installation & Setup

### 1. Global MCP Servers Directory

First, ensure you have the global MCP servers directory:

```bash
mkdir -p ~/.mcp-servers
```

### 2. Install Runtime Requirements

#### Python Servers (UV)
```bash
# Install UV package manager
curl -LsSf https://astral.sh/uv/install.sh | sh
```

#### Node.js Servers
```bash
# Ensure Node.js 14+ is installed
node --version
npm --version
```

### 3. Configure Unified MCP Settings

#### For Claude Desktop

Create or update `~/.config/Claude/claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "dailydoco-pro": {
      "command": "node",
      "args": ["/path/to/aegntic-MCP/dailydoco-pro/dist/index.js"],
      "env": {
        "USER_EMAIL": "your-email@example.com"
      }
    },
    "aegnt-27": {
      "command": "node", 
      "args": ["/path/to/aegntic-MCP/aegnt-27/dist/index.js"],
      "env": {
        "USER_EMAIL": "your-email@example.com"
      }
    },
    "comfyui": {
      "command": "node",
      "args": ["/path/to/aegntic-MCP/comfyui-mcp/dist/index.js"],
      "env": {
        "COMFYUI_HOST": "http://localhost:8188",
        "USER_EMAIL": "your-email@example.com"
      }
    },
    "aegntic-auth": {
      "command": "node",
      "args": ["/path/to/aegntic-MCP/aegntic-auth/dist/index.js"],
      "env": {
        "SUPABASE_URL": "your-supabase-url",
        "SUPABASE_ANON_KEY": "your-supabase-key"
      }
    },
    "graphiti": {
      "command": "uv",
      "args": [
        "run", "--directory", "/path/to/aegntic-MCP/graphiti-mcp",
        "python", "graphiti_mcp_server.py", "--transport", "stdio"
      ],
      "env": {
        "NEO4J_URI": "bolt://localhost:7687",
        "NEO4J_USER": "neo4j", 
        "NEO4J_PASSWORD": "your-password",
        "OPENAI_API_KEY": "your-openai-key"
      }
    },
    "n8n-pro": {
      "command": "node",
      "args": ["/path/to/aegntic-MCP/n8n-pro/dist/mcp/index.js"],
      "env": {
        "N8N_API_URL": "http://localhost:5678",
        "N8N_API_KEY": "your-n8n-api-key"
      }
    },
    "just-prompt": {
      "command": "uv",
      "args": [
        "run", "--directory", "/path/to/aegntic-MCP/just-prompt",
        "just-prompt"
      ],
      "env": {
        "OPENROUTER_API_KEY": "your-openrouter-key"
      }
    },
    "quick-data": {
      "command": "uv", 
      "args": [
        "run", "--directory", "/path/to/aegntic-MCP/quick-data",
        "python", "main.py"
      ]
    },
    
    // Additional NPM-based servers
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "/home/tabs"],
      "env": {}
    },
    
    // UVX-based servers
    "docker": {
      "command": "uvx",
      "args": ["mcp-server-docker"],
      "env": {}
    },
    
    // Additional integrated servers
    "ai-collaboration-hub": {
      "command": "uv",
      "args": ["run", "python", "-m", "ai_collaboration_hub.server"],
      "cwd": "/home/tabs/ae-co-system/aegntic-MCP/servers/ai-collaboration-hub",
      "env": {
        "OPENROUTER_API_KEY": "your-key-here"
      }
    }
    }
  }
}
```

#### For Claude Code

Create or update `~/.config/claude-code/mcp_servers.json` with the same structure.

### 4. Server-Specific Setup

#### Local Development Servers

For servers like DailyDoco Pro, Aegnt-27:
```bash
cd ~/.mcp-servers/server-name
npm install
npm run build
```

#### Python UV Servers

For servers like AI Collaboration Hub:
```bash
cd /path/to/server
uv sync
uv run python -m module_name.server
```

## 🔧 Development Setup

Each MCP server has its own development environment:

### TypeScript/Node.js Servers
```bash
cd server-directory
npm install
npm run build
npm start
```

### Python Servers  
```bash
cd server-directory
uv sync
uv run python main.py  # or specific entry point
```

## 📚 Server Capabilities

| Server | Language | Capabilities |
|--------|----------|-------------|
| dailydoco-pro | TypeScript | Project analysis, video capture, AI test audiences, brand management |
| aegnt-27 | TypeScript | Mouse/typing authenticity, AI detection resistance, audio processing |
| comfyui-mcp | TypeScript | Image generation, video creation, background removal, logo design |
| aegntic-auth | TypeScript | User registration, Stripe payments, email campaigns, usage tracking |
| graphiti-mcp | Python | Knowledge graphs, memory storage, entity extraction, temporal data |
| n8n-pro | TypeScript | n8n documentation (525+ nodes), workflow validation, node information, AI tool detection |
| just-prompt | Python | Multi-LLM prompting, model comparison, CEO decision making |
| quick-data | Python | Data analysis, visualization, statistical insights, ML features |

## 🌟 Key Features

### Advanced AI Capabilities
- **Temporal Knowledge Graphs** - Store and retrieve contextual memory over time
- **Multi-LLM Orchestration** - Compare responses across different AI models
- **Human Authenticity** - Generate human-like interactions resistant to AI detection
- **Automated Documentation** - AI-powered documentation generation with test audiences

### Enterprise Ready
- **User Management** - Complete authentication and licensing system
- **Usage Tracking** - Monitor API usage and enforce limits
- **Payment Integration** - Stripe-powered subscription management
- **Data Analysis** - Professional data visualization and insights

### Developer Tools
- **Workflow Automation** - Comprehensive n8n integration and management
- **Image/Video Generation** - Professional media creation workflows
- **Project Analysis** - Automated code documentation and insights

## What is MCP?

The Model Context Protocol (MCP) is a standard for extending the capabilities of AI assistants like Claude by giving them access to external tools and services. These servers implement the MCP standard to provide specialized functionality that can be used directly from within Claude conversations.

## Using These Servers

Each server in this repository can be installed and run independently. See the README in each server's directory for specific installation and usage instructions.

### Runtime Requirements

- **Python Servers** (Aegntic Knowledge Engine, AI Collaboration Hub): Requires Python 3.12+ and UV package manager
- **Node.js Servers** (All others): Requires Node.js 14+ and npm/npx
- **Local Servers**: Built and stored in `~/.mcp-servers/`

### General Usage

1. **Configure the server** in your Claude Desktop or Claude Code configuration file
2. **Restart Claude** to load the new configuration
3. **Use the tools** provided by the server directly in your Claude conversation

## 🔒 Security & Authentication

All servers include built-in security features:
- API key authentication
- Rate limiting and usage tracking
- Secure environment variable handling
- Input validation and sanitization

## 📖 Documentation

Each server includes comprehensive documentation:
- Setup and installation guides
- API reference and examples
- Configuration options
- Troubleshooting guides

See individual server README files for detailed information.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see individual server LICENSE files for details.

## 🆘 Support

- Create an issue for bug reports
- Check individual server documentation
- Join our community discussions

---

**Built with ❤️ for the AI agent ecosystem**
