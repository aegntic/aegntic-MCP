# Contributing to Aegntic MCP Collection

Thank you for your interest in contributing to the Aegntic MCP Collection! This document provides guidelines for contributing to this project.

## 🚀 Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork** locally
3. **Create a branch** for your feature or bug fix
4. **Make your changes** following our guidelines
5. **Test your changes** thoroughly
6. **Submit a pull request**

## 📋 Development Guidelines

### Code Style
- **TypeScript/JavaScript**: Use ESLint and Prettier configurations
- **Python**: Follow PEP 8 standards, use type hints
- **Documentation**: Include JSDoc/docstrings for all public APIs
- **Tests**: Write tests for new functionality

### MCP Server Standards
All MCP servers should follow these patterns:

```typescript
// TypeScript servers
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';

class MyMCPServer {
  server: Server;
  
  constructor() {
    this.server = new Server({
      name: 'my-mcp-server',
      version: '1.0.0',
      description: 'Description of what this server does'
    });
  }
}
```

```python
# Python servers
import asyncio
from mcp.server.fastmcp import FastMCP

mcp = FastMCP(
    'My MCP Server',
    instructions='Clear instructions for AI agents'
)

@mcp.tool()
async def my_tool(param: str) -> dict:
    """Tool description for AI agents"""
    return {"result": "success"}
```

### Security Requirements
- **No hardcoded secrets** - Use environment variables
- **Input validation** - Validate all user inputs
- **Error handling** - Graceful error handling with informative messages
- **Rate limiting** - Implement appropriate rate limiting
- **Authentication** - Secure API key handling

## 🔧 Adding a New MCP Server

1. **Create directory structure**:
   ```
   my-new-server/
   ├── README.md
   ├── package.json (or pyproject.toml)
   ├── src/
   │   └── index.ts (or main.py)
   ├── dist/ (for built files)
   └── tests/
   ```

2. **Required files**:
   - `README.md` - Server documentation
   - `package.json` or `pyproject.toml` - Dependencies
   - Source code with MCP implementation
   - Tests for your functionality

3. **README.md template**:
   ```markdown
   # My MCP Server
   
   Description of what this server does.
   
   ## Installation
   [Installation instructions]
   
   ## Configuration
   [Configuration options]
   
   ## Tools
   [List of available tools]
   
   ## Examples
   [Usage examples]
   ```

## 🧪 Testing

### Unit Tests
- Write tests for all tools and functionality
- Use Jest for TypeScript/JavaScript
- Use pytest for Python
- Aim for >80% code coverage

### Integration Tests
- Test MCP protocol compliance
- Test with actual MCP clients
- Verify tool schemas and responses

### Manual Testing
- Test with Claude Desktop
- Verify tool descriptions are clear
- Check error handling

## 📦 Building and Packaging

### TypeScript Servers
```bash
npm install
npm run build
npm test
```

### Python Servers
```bash
uv sync
uv run python -m pytest
uv build
```

## 📚 Documentation

### Code Documentation
- Document all public APIs
- Include parameter descriptions
- Provide usage examples
- Document error conditions

### Tool Documentation
- Clear tool descriptions for AI agents
- Document all parameters with types
- Provide example usage
- Include error responses

## 🐛 Bug Reports

When reporting bugs, include:
- Clear description of the issue
- Steps to reproduce
- Expected vs actual behavior
- Environment details (OS, Node.js/Python version)
- Relevant logs or error messages

## 💡 Feature Requests

For new features:
- Describe the use case
- Explain the expected behavior
- Consider backward compatibility
- Provide implementation suggestions if possible

## 🔍 Code Review Process

1. **Automated checks** must pass (linting, tests)
2. **Manual review** by maintainers
3. **Testing** in development environment
4. **Documentation** review
5. **Approval** and merge

## 📝 Commit Guidelines

Use conventional commits:
```
feat: add new tool for data analysis
fix: handle edge case in authentication
docs: update README with new examples
test: add unit tests for new functionality
```

## 🏗️ Architecture Guidelines

### MCP Server Architecture
- Keep servers focused on specific domains
- Use dependency injection where appropriate
- Implement proper error boundaries
- Follow MCP protocol specifications

### Tool Design
- Make tools atomic and focused
- Provide clear success/error responses
- Include helpful error messages
- Design for AI agent usage

## 🤝 Community

- Be respectful and inclusive
- Help others learn and contribute
- Share knowledge and best practices
- Participate in discussions

## 📄 License

By contributing, you agree that your contributions will be licensed under the MIT License.

## 🆘 Getting Help

- Check existing issues and discussions
- Ask questions in GitHub issues
- Review documentation thoroughly
- Contact maintainers if needed

Thank you for contributing to the Aegntic MCP Collection! 🚀