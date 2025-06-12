# Aegntic MCP Servers

This repository contains a collection of Model Context Protocol (MCP) servers for various tasks and integrations. Each server resides in its own subdirectory and can be used independently through our unified global configuration.

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
    // NPM-based servers
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
    
    // Local Python servers with UV
    "ai-collaboration-hub": {
      "command": "uv",
      "args": ["run", "python", "-m", "ai_collaboration_hub.server"],
      "cwd": "/home/tabs/ae-co-system/aegntic-MCP/servers/ai-collaboration-hub",
      "env": {
        "OPENROUTER_API_KEY": "your-key-here"
      }
    },
    
    // Local Node.js servers
    "dailydoco-pro": {
      "command": "node",
      "args": ["/home/tabs/.mcp-servers/dailydoco-pro/dist/index.js"],
      "env": {}
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

### Quick Start Examples

**Python Server (Aegntic Knowledge Engine):**
```bash
# Install UV if not already installed
curl -LsSf https://astral.sh/uv/install.sh | sh

# Run the server
cd servers/aegntic-knowledge-engine
uv sync
uv run python src/crawl4ai_mcp.py
```

**Node.js Servers:**
```bash
# Run any Node.js server directly
npx @aegntic/claude-export-mcp
npx @aegntic/firebase-studio-mcp
npx @leonardsellem/n8n-mcp-server
uvx mcp-server-docker
```

**Local Development Servers:**
```bash
# Build and run local servers
cd ~/.mcp-servers/dailydoco-pro
npm install && npm run build
# Server will be available via the unified config
```

## Tool-Specific Prompt Templates

Each MCP server provides specific tools. Use these optimized prompt templates for each individual tool:

### Aegntic Knowledge Engine (20 tools)

**Required Resources:** Python 3.12+, UV package manager, 100MB+ disk space, Optional: OpenRouter API key

#### Web Crawling & RAG Tools
**`crawl_single_page`**
```
"Crawl the documentation page at https://docs.example.com/api/authentication and store it for later analysis"
```

**`smart_crawl_url`** 
```
"Smart crawl https://docs.python.org/sitemap.xml with max_depth=2 and max_concurrent=5 to build a comprehensive Python documentation database"
```

**`get_available_sources`**
```
"Show me all available sources in my knowledge base so I can see what domains have been crawled"
```

**`perform_rag_query`**
```
"Search my crawled knowledge base for 'authentication patterns' and filter by source='docs.fastapi.tiangolo.com' with match_count=3"
```

**`search_code_examples`**
```
"Find code examples related to 'async database connections' from source='docs.sqlalchemy.org' and return 5 matches"
```

#### Knowledge Graph Tools  
**`create_entities`**
```
"Create entities for: [{'name': 'FastAPI', 'entityType': 'framework', 'observations': ['High-performance web framework', 'Built on Starlette and Pydantic']}]"
```

**`create_relations`**
```
"Create relations: [{'from': 'FastAPI', 'to': 'Pydantic', 'relationType': 'depends_on'}, {'from': 'FastAPI', 'to': 'Starlette', 'relationType': 'built_on'}]"
```

**`add_observations`**
```
"Add observations to FastAPI entity: [{'entityName': 'FastAPI', 'contents': ['Supports automatic API documentation', 'Type hints for validation']}]"
```

**`read_graph`**
```
"Show me the complete knowledge graph with all entities and their relationships"
```

**`search_nodes`**
```
"Search knowledge graph for entities related to 'web framework performance' to understand the ecosystem"
```

**`open_nodes`**
```
"Open specific entities: ['FastAPI', 'Django', 'Flask'] to compare their details and relationships"
```

#### Task Management Tools
**`create_tasks`**
```
"Create tasks: [{'content': 'Research FastAPI authentication patterns', 'status': 'pending', 'priority': 'high', 'project': 'api_redesign'}]"
```

**`update_task_status`**
```
"Update task ID 'task-123' status to 'completed' after finishing the authentication research"
```

**`get_tasks`**
```
"Get all pending tasks for project 'api_redesign' with limit=10 to see current workload"
```

**`get_task_summary`**
```
"Show me task statistics including counts by status and priority across all projects"
```

**`sequential_thinking`**
```
"Start sequential thinking: thought='Let me analyze the authentication requirements for our API', thought_number=1, total_thoughts=5"
```

#### Documentation Context Tools
**`resolve_library_id`**
```
"Resolve library name 'react' to get the correct Context7-compatible library ID for documentation lookup"
```

**`get_library_docs`**
```
"Get React documentation for library_id='/facebook/react' focusing on 'hooks' with tokens=5000"
```

**`get_context_cache_stats`**
```
"Show me documentation cache statistics to understand storage usage and hit rates"
```

**`clear_expired_context_cache`**
```
"Clean up expired documentation cache entries to free storage space"
```

### Claude Export MCP (2 tools)

**Required Resources:** Node.js 14+, 50MB+ disk space, Claude Desktop read access

**`export_chats`**
```
"Export all my Claude projects to ~/claude-backup/ maintaining the full project structure with conversations and artifacts"
```

**`server_info`**
```
"Get information about the Claude Export MCP server including available tools and version"
```

### Firebase Studio MCP (15+ tools)

**Required Resources:** Node.js 14+, Firebase CLI, Google Cloud SDK, Firebase service account key

**`initializeFirebase`**
```
"Initialize Firebase Admin SDK with serviceAccountPath='./service-account.json' and databaseURL='https://my-project.firebaseio.com'"
```

**`firebaseCommand`**
```
"Execute Firebase command 'deploy' with args=['--only', 'hosting'] in cwd='/path/to/project'"
```

**`listProjects`**
```
"List all my Firebase projects to see available project IDs and their status"
```

**`gcloudCommand`**
```
"Execute gcloud command: service='compute', command='instances list', project='my-project-id', json=true"
```

**`startEmulators`**
```
"Start Firebase emulators for services=['auth', 'firestore', 'functions'] with importData='./firebase-data'"
```

### n8n MCP (15+ tools)

**Required Resources:** Node.js 16+, 200MB+ memory, internet connection

**`createWorkflow`**
```
"Create workflow with name='Data Sync' and nodes=[{name: 'HTTP Request', type: 'httpRequest', parameters: {url: 'https://api.example.com/data'}}]"
```

**`executeWorkflow`**
```
"Execute workflow ID 'workflow-123' with input data and executionMode='cli' and timeout=0"
```

**`listWorkflows`**
```
"List all available workflows to see what automation processes are configured"
```

**`createCredential`**
```
"Create credential with name='API Key', type='httpHeaderAuth', data={name: 'X-API-Key', value: 'secret-key'}"
```

**`getExecutionResult`**
```
"Get execution result for execution ID 'exec-456' to check the workflow output and status"
```

### Docker MCP (10+ tools)

**Required Resources:** Docker installed, appropriate permissions, optional Docker Hub account

**`listContainers`**
```
"List all Docker containers including stopped ones to see current container status"
```

**`createContainer`**
```
"Create container from image 'nginx:latest' with name='web-server' and ports={'80/tcp': 8080}"
```

**`buildImage`**
```
"Build Docker image from './Dockerfile' with tag='my-app:v1.0' in current directory"
```

**`startContainer`**
```
"Start container 'web-server' and confirm it's running properly"
```

**`getContainerLogs`**
```
"Get logs from container 'web-server' with tail=100 to troubleshoot recent issues"
```

## Server-Specific Resources

### Development Requirements

| Server | Runtime | Memory | Storage | Network | Special Requirements |
|--------|---------|--------|---------|---------|---------------------|
| **Aegntic Knowledge Engine** | Python 3.12+ + UV | 80MB+ | 100MB+ | Optional* | SQLite, sentence-transformers |
| **AI Collaboration Hub** | Python 3.12+ + UV | 100MB+ | 150MB+ | Required | OpenRouter API key |
| **Claude Export MCP** | Node.js 14+ | 30MB+ | 50MB+ | None | Claude Desktop read access |
| **Firebase Studio MCP** | Node.js 14+ | 40MB+ | 20MB+ | Required | Firebase CLI, GCloud SDK |
| **n8n MCP** | Node.js 16+ | 200MB+ | 100MB+ | Required | npm registry access |
| **Docker MCP** | Python 3.9+ + UVX | 50MB+ | Variable | Optional | Docker daemon access |
| **Just Prompt** | Python 3.12+ + UV | 150MB+ | 200MB+ | Required | Model API keys |
| **Quick Data** | Python 3.12+ + UV | 100MB+ | 150MB+ | Optional | Data processing libraries |
| **DailyDoco Pro** | Node.js 16+ | 150MB+ | 200MB+ | Required | Various API integrations |

*Network required for OpenRouter models, optional for local models

### API Keys and Authentication

| Server | Required Keys | Setup Instructions |
|--------|---------------|-------------------|
| **Aegntic Knowledge Engine** | OpenRouter API (optional) | Set `OPENROUTER_API_KEY` env var |
| **AI Collaboration Hub** | OpenRouter API | Set `OPENROUTER_API_KEY` in config |
| **Firebase Studio MCP** | Firebase Service Account | Download JSON key from Firebase Console |
| **n8n MCP** | Service-specific APIs | Configure via n8n credential manager |
| **Docker MCP** | Docker Hub (optional) | Set `DOCKER_HUB_USERNAME` and `DOCKER_HUB_PASSWORD` |
| **Just Prompt** | Various model APIs | Configure in server settings |
| **Quick Data** | API keys (optional) | Configure for external data sources |

### Performance Optimization

| Server | Optimization Tips | Resource Scaling |
|--------|------------------|------------------|
| **Aegntic Knowledge Engine** | Use contextual embeddings sparingly | Scales with document corpus size |
| **AI Collaboration Hub** | Batch AI operations when possible | Scales with concurrent requests |
| **Claude Export MCP** | Export in batches for large datasets | Linear scaling with conversation count |
| **Firebase Studio MCP** | Use emulators for development | Depends on Firebase project size |
| **n8n MCP** | Enable memory mode, increase workers | CPU cores × worker multiplier |
| **Docker MCP** | Use multi-stage builds, layer caching | Scales with container complexity |
| **Just Prompt** | Use appropriate models for tasks | Scales with prompt complexity |
| **Quick Data** | Stream large datasets | Memory scales with data size |

### Troubleshooting Resources

#### Common Issues
1. **Port conflicts**: Each server needs a unique port (3000, 8052, etc.)
2. **Permission errors**: Ensure proper file/directory access permissions
3. **Memory limits**: Increase Node.js heap size with `--max-old-space-size=4096`
4. **Network timeouts**: Configure appropriate timeout values for API calls
5. **Path issues**: Use absolute paths in configuration files

#### Debug Commands
```bash
# Check server health
curl http://localhost:[PORT]/health

# View server logs
npx @aegntic/[server-name] --verbose

# Test specific tools
npx @aegntic/[server-name] --test-tools

# Check UV installation
uv --version

# Verify Python environment
uv run python --version

# Check Node.js servers
node ~/.mcp-servers/[server-name]/dist/index.js --test
```

## Unified Configuration Files

### Directory Structure
```
~/.mcp-servers/                    # Global MCP servers directory
├── dailydoco-pro/                 # Local Node.js server
├── aegnt-27/                      # Local Node.js server
└── aegnt-27-lib/                  # Local Node.js server

~/.config/
├── Claude/
│   └── claude_desktop_config.json # Claude Desktop MCP config
└── claude-code/
    └── mcp_servers.json           # Claude Code MCP config

~/ae-co-system/
├── aegntic-MCP/                   # This repository
│   └── servers/                   # Server implementations
├── CLAEM/
│   └── just-prompt-orchestration/ # Just Prompt server
└── DAILYDOCO/
    └── quick-data-mcp/            # Quick Data server
```

### Adding New Servers

To add a new server to the unified configuration:

1. **For NPM servers:**
```json
"server-name": {
  "command": "npx",
  "args": ["-y", "@package/name"],
  "env": {}
}
```

2. **For UVX servers:**
```json
"server-name": {
  "command": "uvx",
  "args": ["package-name"],
  "env": {}
}
```

3. **For local Python servers:**
```json
"server-name": {
  "command": "uv",
  "args": ["run", "python", "-m", "module.name"],
  "cwd": "/absolute/path/to/server",
  "env": {
    "API_KEY": "your-key"
  }
}
```

4. **For local Node.js servers:**
```json
"server-name": {
  "command": "node",
  "args": ["/home/tabs/.mcp-servers/server-name/dist/index.js"],
  "env": {}
}
```

## Contributing

When contributing a new MCP server, please follow these requirements:

### Mandatory Components
1. **Tool-Specific Prompt Templates**: Optimized prompt template for each individual tool showing exact usage patterns
2. **Resource Requirements**: Detailed runtime, memory, storage, and dependency specifications  
3. **Authentication Setup**: Clear instructions for API keys and credentials
4. **Performance Guidelines**: Optimization tips and scaling considerations
5. **Troubleshooting Section**: Common issues and debug commands
6. **Unified Configuration Example**: Show how to add the server to the global config

### Directory Structure Pattern
```
servers/your-server-name/
├── README.md          # Documentation with all mandatory components
├── package.json       # npm package configuration  
├── index.js           # Entry point
└── src/               # Source code
    ├── index.js       # Main implementation
    └── ...            # Additional modules
```

### README Template Requirements
Your server's README.md must include:
- **Tool-Specific Prompt Templates** section with optimized prompt for each individual tool
- **Required Resources** table with runtime/memory/storage specs
- **API Keys and Authentication** setup instructions
- **Performance Optimization** guidelines
- **Troubleshooting** section with common issues and solutions
- **Unified Configuration** example showing how to add to global config

**Format for Tool Templates:**
```
#### Tool Category
**`tool_name`**
```
"Optimized prompt showing exact tool usage with realistic parameters"
```
```

See existing servers as examples of the expected documentation quality and completeness.

## License

MIT

[![Verified on MseeP](https://mseep.ai/badge.svg)](https://mseep.ai/app/3833fc27-d161-4dd3-82d7-bdc7e5d6e6de)