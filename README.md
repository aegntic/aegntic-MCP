# Aegntic MCP Servers

This repository contains a collection of Model Context Protocol (MCP) servers for various tasks and integrations. Each server resides in its own subdirectory and can be used independently.

## Available MCP Servers

| Server | Description | Installation |
|--------|-------------|-------------|
| [Claude Export MCP](servers/claude-export-mcp) | Export Claude Desktop projects, conversations, and artifacts to Markdown format | `npx @aegntic/claude-export-mcp` |

## What is MCP?

The Model Context Protocol (MCP) is a standard for extending the capabilities of AI assistants like Claude by giving them access to external tools and services. These servers implement the MCP standard to provide specialized functionality that can be used directly from within Claude conversations.

## Using These Servers

Each server in this repository can be installed and run independently. See the README in each server's directory for specific installation and usage instructions.

Generally, to use an MCP server:

1. Install and run the server using `npx` or `npm`
2. In Claude, add the server by adding the server URL (typically a localhost address)
3. Use the tools provided by the server directly in your Claude conversation

## Contributing

Contributions are welcome! If you'd like to add a new MCP server or improve an existing one, please submit a pull request.

When contributing a new server, please follow the established directory structure pattern:

```
servers/your-server-name/
├── README.md          # Documentation for your server
├── package.json       # npm package configuration  
├── src/               # Source code
│   └── index.js       # Entry point
└── ...
```

## License

MIT
