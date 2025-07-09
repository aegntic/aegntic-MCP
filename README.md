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

## 📦 MCP Servers Included

### 🎬 Content Creation & Documentation
- **[dailydoco-pro](./dailydoco-pro/)** - Elite automated documentation platform with AI test audiences
- **[comfyui-mcp](./comfyui-mcp/)** - AI image generation, video creation, and editing via ComfyUI

### 🔐 Authentication & User Management  
- **[aegntic-auth](./aegntic-auth/)** - User registration, licensing, and email management system
- **[aegnt-27](./aegnt-27/)** - Human authenticity engine for AI detection resistance

### 🧠 Knowledge & Memory
- **[graphiti-mcp](./graphiti-mcp/)** - Temporal knowledge graph memory system for AI agents
- **[n8n-pro](./n8n-pro/)** - Comprehensive n8n workflow documentation and management

### 🔨 Development & Automation
- **[just-prompt](./just-prompt/)** - Multi-LLM prompt orchestration with CEO/board decision making
- **[quick-data](./quick-data/)** - Quick data analysis, visualization, and insights

## 🛠 Installation & Configuration

### Global MCP Configuration

Add to your Claude Desktop configuration (`~/Library/Application Support/Claude/claude_desktop_config.json` on macOS):

```json
{
  "mcpServers": {
    "dailydoco-pro": {
      "command": "node",
      "args": ["/path/to/aegntic-MCP/dailydoco-pro/dist/index.js"]
    },
    "aegnt-27": {
      "command": "node", 
      "args": ["/path/to/aegntic-MCP/aegnt-27/dist/index.js"]
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
      "args": ["/path/to/aegntic-MCP/n8n-pro/dist/mcp/index.js"]
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
    }
  }
}
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
| n8n-pro | TypeScript | n8n documentation, workflow validation, node information |
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