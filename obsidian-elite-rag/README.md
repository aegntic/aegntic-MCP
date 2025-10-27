<<<<<<< HEAD
# Obsidian Elite RAG MCP Server

[![Python Version](https://img.shields.io/badge/python-3.9+-blue.svg)](https://python.org)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![MCP Server](https://img.shields.io/badge/MCP-Server-purple.svg)](https://modelcontextprotocol.io)

An elite Retrieval-Augmented Generation (RAG) system that transforms Obsidian vaults into AI-paired cognitive workflow engines with advanced Graphiti knowledge graph integration.

## 🌟 Features

### 🧠 Multi-Layer RAG Architecture
- **L1: Semantic Context** (30% weight) - Vector similarity search with OpenAI embeddings
- **L2: Knowledge Graph** (25% weight) - Graphiti-powered entity and relationship retrieval
- **L3: Graph Traversal** (15% weight) - NetworkX-based link traversal
- **L4: Temporal Context** (15% weight) - Time-based relevance and freshness
- **L5: Domain Specialization** (15% weight) - Context-aware retrieval
- **L6: Meta-Knowledge** (remaining weight) - Knowledge about knowledge

### 🔗 Advanced Knowledge Graph
- **27+ Entity Types**: concepts, people, organizations, technologies, methodologies, frameworks, algorithms, etc.
- **40+ Relationship Types**: implements, uses, depends_on, extends, based_on, similar_to, integrates_with, etc.
- **Dual-Graph Architecture**: Neo4j (structured) + NetworkX (unstructured backup)
- **Automatic Entity Extraction**: Pattern matching and NLP-based entity recognition
- **Relationship Detection**: Confidence scoring and validation

### 🚀 MCP Server Integration
- **Claude Code Compatible**: Full Model Context Protocol server implementation
- **Tool-based API**: Ingest, query, search knowledge graph, get entity context
- **Real-time Status**: System health monitoring and database connection checks
- **Async Processing**: High-performance concurrent operations

## 📋 Requirements

- **Python 3.9+**
- **Docker & Docker Compose**
- **OpenAI API key**
- **Obsidian vault** (optional but recommended)
- **Neo4j Database** (handled by setup scripts)
- **Qdrant Vector Database** (handled by setup scripts)

## 🛠️ Installation

### Option 1: Install from PyPI (Recommended)

```bash
pip install obsidian-elite-rag-mcp
```

### Option 2: Install from Source

```bash
git clone https://github.com/aegntic/aegntic-MCP.git
cd aegntic-MCP/obsidian-elite-rag
pip install -e .
```

## 🚀 Quick Start

### 1. System Setup

```bash
# Initialize the system
obsidian-elite-rag-cli setup

# Start both databases (Qdrant + Neo4j)
obsidian-elite-rag-cli start-databases

# Or start manually with Docker
docker run -d --name qdrant -p 6333:6333 -v $(pwd)/data/qdrant:/qdrant/storage qdrant/qdrant:latest
docker run -d --name neo4j -p 7474:7474 -p 7687:7687 -v $(pwd)/data/neo4j:/data \
  --env NEO4J_AUTH=neo4j/password --env NEO4J_PLUGINS='["apoc","graph-data-science"]' \
  neo4j:5.14
```

### 2. Ingest Your Obsidian Vault

```bash
# Ingest all markdown files
obsidian-elite-rag-cli ingest /path/to/your/obsidian/vault

# Check system status
obsidian-elite-rag-cli status /path/to/your/obsidian/vault
```

### 3. Start MCP Server

```bash
# Start the MCP server for Claude Code integration
obsidian-elite-rag-cli server
```

### 4. Configure Claude Code

Add to your Claude Code configuration (`~/.config/claude-code/config.json`):
=======
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
>>>>>>> 3d27dcc0dbd27d74a3b426707b0dd14f615bbe88

```json
{
  "mcpServers": {
<<<<<<< HEAD
    "obsidian-elite-rag": {
      "command": "obsidian-elite-rag-cli",
      "args": ["server"],
      "env": {
        "OPENAI_API_KEY": "your-openai-api-key"
      }
=======
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
>>>>>>> 3d27dcc0dbd27d74a3b426707b0dd14f615bbe88
    }
  }
}
```

<<<<<<< HEAD
## 📖 Usage Examples

### CLI Usage

```bash
# Query the RAG system
obsidian-elite-rag-cli query "How does the RAG system work?" /path/to/vault

# Search knowledge graph for entities
obsidian-elite-rag-cli graph /path/to/vault --entity-query "machine learning"

# Technical queries
obsidian-elite-rag-cli query "JWT authentication patterns" /path/to/vault --query-type technical

# Research queries
obsidian-elite-rag-cli query "latest developments in LLMs" /path/to/vault --query-type research
```

### MCP Server Tools (Claude Code)

When connected to Claude Code, you'll have access to these tools:

1. **`ingest_vault`** - Ingest markdown files from an Obsidian vault
2. **`query_rag`** - Query the elite RAG system with multi-layer retrieval
3. **`search_knowledge_graph`** - Search the Graphiti knowledge graph for entities
4. **`get_entity_context`** - Get rich context for a specific entity
5. **`get_related_entities`** - Get entities related through relationships
6. **`get_system_status`** - Get system status and database connections

Example in Claude Code:
```
@obsidian-elite-rag please ingest my vault at /Users/me/Documents/Obsidian
@obsidian-elite-rag query "what are the key concepts in machine learning?" with vault path /Users/me/Documents/Obsidian
@obsidian-elite-rag search_knowledge_graph for "neural networks" in vault /Users/me/Documents/Obsidian
```

## 🏗️ Architecture

### System Components

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Obsidian      │    │   Claude Code   │    │   MCP Protocol  │
│     Vault       │◄──►│   Integration   │◄──►│     Server      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Elite RAG System                            │
├─────────────────┬─────────────────┬─────────────────────────────┤
│   Semantic      │  Knowledge      │     Temporal & Domain       │
│   Search        │     Graph       │      Specialization         │
│   (Qdrant)      │   (Neo4j)       │                             │
└─────────────────┴─────────────────┴─────────────────────────────┘
```

### Knowledge Graph Entity Types

- **Core**: concept, person, organization, event, location
- **Technical**: technology, algorithm, framework, system, application
- **Process**: methodology, workflow, process, pattern
- **Implementation**: tool, library, database, api, protocol
- **Documentation**: standard, specification, principle, theory, model
- **Architecture**: design, implementation, project, research

### Knowledge Graph Relationship Types

- **Structural**: part_of, implements, extends, based_on, depends_on
- **Semantic**: similar_to, contrasts_with, related_to, examples_of
- **Functional**: uses, enables, requires, supports, improves
- **Cognitive**: defines, describes, explains, demonstrates, teaches
- **Development**: builds_on, applies_to, references, cites, tests
- **Operational**: manages, monitors, deploys, configures, maintains

## 📊 Performance Characteristics

- **Retrieval Speed**: <100ms for context-rich queries
- **Knowledge Coverage**: 95%+ recall on domain-specific queries
- **Entity Recognition**: 90%+ accuracy for concepts, people, organizations
- **Relationship Extraction**: 85%+ accuracy for semantic relationships
- **Graph Traversal**: <50ms for entity relationship queries up to depth 4
- **Automation Coverage**: 80%+ routine knowledge tasks automated

## 🔧 Configuration

### Environment Variables

```bash
# Required
OPENAI_API_KEY=your-openai-api-key

# Optional (auto-configured by setup scripts)
NEO4J_URI=bolt://localhost:7687
NEO4J_USER=neo4j
NEO4J_PASSWORD=password
QDRANT_HOST=localhost
QDRANT_PORT=6333
```

### Configuration File

The system uses `config/automation-config.yaml` for detailed configuration:

```yaml
knowledge_graph:
  enabled: true
  provider: graphiti
  graphiti:
    neo4j_uri: bolt://localhost:7687
    neo4j_user: neo4j
    neo4j_password: "password"

rag_system:
  layers:
    semantic:
      weight: 0.3
      similarity_threshold: 0.7
    knowledge_graph:
      weight: 0.25
      max_depth: 4
    # ... other layers
```

## 📁 Vault Structure

The system works best with this Obsidian vault structure:

```
00-Core/           # 🧠 Foundational knowledge
01-Projects/       # 🚀 Active work
02-Research/       # 🔬 Learning areas
03-Workflows/      # ⚙️ Reusable processes
04-AI-Paired/      # 🤖 Claude interactions
05-Resources/      # 📚 External references
06-Meta/           # 📊 System knowledge
07-Archive/        # 📦 Historical data
08-Templates/      # 📋 Note structures
09-Links/          # 🔗 External connections
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Setup

```bash
# Clone the repository
git clone https://github.com/aegntic/aegntic-MCP.git
cd aegntic-MCP/obsidian-elite-rag

# Install in development mode
pip install -e ".[dev]"

# Run tests
pytest

# Run with coverage
pytest --cov=obsidian_elite_rag

# Code formatting
black src/
mypy src/
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Attribution

**Created by:** Mattae Cooper
**Email:** research@aegntic.ai
**Organization:** Aegntic AI (https://aegntic.ai)

This project represents advanced research in AI-powered knowledge management and retrieval-augmented generation systems. The integration of Graphiti knowledge graphs with multi-layered RAG architecture represents a significant advancement in how AI systems can interact with and reason over personal knowledge bases.

## 📞 Support

- **Documentation**: [Project Wiki](https://github.com/aegntic/aegntic-MCP/wiki)
- **Issues**: [GitHub Issues](https://github.com/aegntic/aegntic-MCP/issues)
- **Discussions**: [GitHub Discussions](https://github.com/aegntic/aegntic-MCP/discussions)
- **Email**: research@aegntic.ai

## 🔗 Related Projects

- [Graphiti](https://github.com/getgraphiti/graphiti) - Knowledge graph construction for LLMs
- [Qdrant](https://github.com/qdrant/qdrant) - Vector similarity search engine
- [Neo4j](https://github.com/neo4j/neo4j) - Graph database
- [LangChain](https://github.com/langchain-ai/langchain) - LLM application framework
- [Model Context Protocol](https://github.com/modelcontextprotocol) - Standard for AI tool integration

---

**Made with ❤️ by Aegntic AI**
*Advancing the future of AI-powered knowledge management*
=======
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
>>>>>>> 3d27dcc0dbd27d74a3b426707b0dd14f615bbe88
