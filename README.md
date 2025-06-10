# Aegntic MCP Servers

This repository contains a collection of Model Context Protocol (MCP) servers for various tasks and integrations. Each server resides in its own subdirectory and can be used independently.

## Available MCP Servers

| Server | Description | Installation |
|--------|-------------|-------------|
| [Aegntic Knowledge Engine](servers/aegntic-knowledge-engine) | **Zero-cost unified knowledge engine** with web crawling, RAG, memory graph, task management, and documentation context (20 tools) | `uv run --project servers/aegntic-knowledge-engine python src/crawl4ai_mcp.py` |
| [Claude Export MCP](servers/claude-export-mcp) | Export Claude Desktop projects, conversations, and artifacts to Markdown format | `npx @aegntic/claude-export-mcp` |
| [Firebase Studio MCP](servers/firebase-studio-mcp) | Complete access to Firebase and Google Cloud services | `npx @aegntic/firebase-studio-mcp` |
| [n8n MCP](servers/n8n-mcp) | Limitless n8n workflow automation with no restrictions | `npx @aegntic/n8n-mcp` |
| [Docker MCP](servers/docker-mcp) | Comprehensive Docker container and image management with Docker Hub integration | `npx @aegntic/docker-mcp` |

## What is MCP?

The Model Context Protocol (MCP) is a standard for extending the capabilities of AI assistants like Claude by giving them access to external tools and services. These servers implement the MCP standard to provide specialized functionality that can be used directly from within Claude conversations.

## Using These Servers

Each server in this repository can be installed and run independently. See the README in each server's directory for specific installation and usage instructions.

### Runtime Requirements

- **Python Servers** (Aegntic Knowledge Engine): Requires Python 3.12+ and UV package manager
- **Node.js Servers** (All others): Requires Node.js 14+ and npm/npx

### General Usage

1. **Install and run the server** using the appropriate command from the table above
2. **In Claude**, add the server by adding the server URL (typically a localhost address)
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
npx @aegntic/n8n-mcp
npx @aegntic/docker-mcp
```

## Predictive Prompt Templates

To maximize the effectiveness of each MCP server, use these optimized prompt templates:

### Aegntic Knowledge Engine
**Use Case:** Comprehensive knowledge management and research
```
Required Resources:
- Python 3.12+, UV package manager
- 100MB+ disk space for databases
- Optional: OpenRouter API key for enhanced models

Prompt Templates:
1. "Crawl and analyze the documentation at [URL], then create a knowledge graph of the key concepts and their relationships"
2. "Search my crawled knowledge base for information about [topic] and provide a comprehensive summary with sources"
3. "Create a task to research [topic], then use sequential thinking to break it down into actionable steps"
4. "Extract all code examples from [documentation URL] and organize them by programming language and functionality"
5. "Build a knowledge graph connecting [concept A] to [concept B] through their shared relationships and dependencies"
```

### Claude Export MCP
**Use Case:** Backup and documentation of Claude conversations
```
Required Resources:
- Node.js 14+, 50MB+ disk space
- Read access to Claude Desktop data directory
- Write permissions to export directory

Prompt Templates:
1. "Export all my Claude projects to Markdown format, organizing by project structure"
2. "Export only conversations from the last 30 days to ~/claude-backup/"
3. "Create a backup of my current project's conversations and artifacts"
4. "Export and analyze my conversation patterns to identify the most productive discussion topics"
5. "Generate a project report from my exported Claude conversations, highlighting key decisions and outcomes"
```

### Firebase Studio MCP
**Use Case:** Firebase and Google Cloud operations
```
Required Resources:
- Node.js 14+, Firebase CLI, Google Cloud SDK
- Firebase service account key
- Appropriate Firebase/GCP project permissions

Prompt Templates:
1. "List all my Firebase projects and show the current authentication users for [project-name]"
2. "Deploy my website to Firebase Hosting and configure custom domain settings"
3. "Query my Firestore database for users where status='active' and created_date > last week"
4. "Create a new Firebase Authentication user with email [email] and send verification"
5. "Set up Firebase emulators for local development and test my Firestore security rules"
```

### n8n MCP
**Use Case:** Workflow automation and integration
```
Required Resources:
- Node.js 16+, 200MB+ memory
- Internet connection for node downloads
- API keys for integrated services (optional)

Prompt Templates:
1. "Create an n8n workflow that monitors [data source] and sends alerts to Slack when [condition] is met"
2. "Build an automation that processes CSV files from [source] and updates my database with the results"
3. "Set up a workflow to sync data between [service A] and [service B] every hour"
4. "Create a credential for [API service] and build a workflow that fetches daily reports"
5. "Design a multi-step workflow that: fetches data → processes it → sends notifications → logs results"
```

### Docker MCP
**Use Case:** Container and infrastructure management
```
Required Resources:
- Docker installed and running
- Appropriate Docker permissions
- Docker Hub account (optional for registry operations)

Prompt Templates:
1. "Show me all running containers and their resource usage, then stop any that aren't essential"
2. "Build a Docker image from my Dockerfile, tag it, and push to Docker Hub"
3. "Create a new container from [image] with environment variables [vars] and port mapping [ports]"
4. "Set up a Docker Compose stack for [application] with database, web server, and cache layers"
5. "Monitor Docker container logs for [container-name] and alert me if any errors occur"
```

## Server-Specific Resources

### Development Requirements

| Server | Runtime | Memory | Storage | Network | Special Requirements |
|--------|---------|--------|---------|---------|---------------------|
| **Aegntic Knowledge Engine** | Python 3.12+ + UV | 80MB+ | 100MB+ | Optional* | SQLite, sentence-transformers |
| **Claude Export MCP** | Node.js 14+ | 30MB+ | 50MB+ | None | Claude Desktop read access |
| **Firebase Studio MCP** | Node.js 14+ | 40MB+ | 20MB+ | Required | Firebase CLI, GCloud SDK |
| **n8n MCP** | Node.js 16+ | 200MB+ | 100MB+ | Required | npm registry access |
| **Docker MCP** | Node.js 14+ | 50MB+ | Variable | Optional | Docker daemon access |

*Network required for OpenRouter models, optional for local models

### API Keys and Authentication

| Server | Required Keys | Setup Instructions |
|--------|---------------|-------------------|
| **Aegntic Knowledge Engine** | OpenRouter API (optional) | Set `OPENROUTER_API_KEY` env var |
| **Firebase Studio MCP** | Firebase Service Account | Download JSON key from Firebase Console |
| **n8n MCP** | Service-specific APIs | Configure via n8n credential manager |
| **Docker MCP** | Docker Hub (optional) | Set `DOCKER_HUB_USERNAME` and `DOCKER_HUB_PASSWORD` |

### Performance Optimization

| Server | Optimization Tips | Resource Scaling |
|--------|------------------|------------------|
| **Aegntic Knowledge Engine** | Use contextual embeddings sparingly | Scales with document corpus size |
| **Claude Export MCP** | Export in batches for large datasets | Linear scaling with conversation count |
| **Firebase Studio MCP** | Use emulators for development | Depends on Firebase project size |
| **n8n MCP** | Enable memory mode, increase workers | CPU cores × worker multiplier |
| **Docker MCP** | Use multi-stage builds, layer caching | Scales with container complexity |

### Troubleshooting Resources

#### Common Issues
1. **Port conflicts**: Each server needs a unique port (3000, 8052, etc.)
2. **Permission errors**: Ensure proper file/directory access permissions
3. **Memory limits**: Increase Node.js heap size with `--max-old-space-size=4096`
4. **Network timeouts**: Configure appropriate timeout values for API calls

#### Debug Commands
```bash
# Check server health
curl http://localhost:[PORT]/health

# View server logs
npx @aegntic/[server-name] --verbose

# Test specific tools
npx @aegntic/[server-name] --test-tools
```

## Contributing

When contributing a new MCP server, please follow these requirements:

### Mandatory Components
1. **Predictive Prompt Templates**: 5+ optimized prompts showing effective usage patterns
2. **Resource Requirements**: Detailed runtime, memory, storage, and dependency specifications  
3. **Authentication Setup**: Clear instructions for API keys and credentials
4. **Performance Guidelines**: Optimization tips and scaling considerations
5. **Troubleshooting Section**: Common issues and debug commands

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
- **Predictive Prompt Templates** section with 5+ usage examples
- **Required Resources** table with runtime/memory/storage specs
- **API Keys and Authentication** setup instructions
- **Performance Optimization** guidelines
- **Troubleshooting** section with common issues and solutions

See existing servers as examples of the expected documentation quality and completeness.

## License

MIT

[![Verified on MseeP](https://mseep.ai/badge.svg)](https://mseep.ai/app/3833fc27-d161-4dd3-82d7-bdc7e5d6e6de)
