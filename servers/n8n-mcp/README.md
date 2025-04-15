# n8n MCP Server

This server provides a Model Context Protocol (MCP) interface for [n8n](https://n8n.io/) workflow automation platform with no limitations. It allows AI assistants to create, manage, and execute n8n workflows programmatically.

<div align="center">
  <img src="https://raw.githubusercontent.com/aegntic/aegntic-MCP/main/servers/n8n-mcp/logo.png" alt="aegntic.ai n8n MCP Server" width="180" />
  <p><em>Powered by <a href="https://aegntic.ai">aegntic.ai</a></em></p>
</div>

## Features

- **Unlimited Execution**: No timeouts or resource restrictions
- **Multi-Core Scaling**: Automatic scaling across all available CPU cores
- **Workflow Management**: Create, edit, execute, and delete workflows
- **Credential Management**: Securely store and manage credentials
- **File Operations**: Read and write files for workflows
- **High Performance**: Memory mode for ultra-fast processing
- **Smart Error Handling**: Detailed error feedback with suggestions
- **Zero Configuration**: Works out of the box with reasonable defaults

## Installation

```bash
# Install with npx (recommended)
npx @aegntic/n8n-mcp

# Or install globally
npm install -g @aegntic/n8n-mcp
```

## Usage

1. Start the server:
   ```bash
   npx @aegntic/n8n-mcp
   ```

2. In Claude, add the server using the MCP toolbox:
   ```
   http://localhost:3000
   ```

3. Use the n8n tools directly in your Claude conversation

### Advanced Options

```bash
# Run with maximum performance (in-memory mode)
npx @aegntic/n8n-mcp --memory-mode

# Run with specific number of worker processes
npx @aegntic/n8n-mcp --workers 8

# Run on a different port
npx @aegntic/n8n-mcp --port 8000

# Specify a custom data directory
npx @aegntic/n8n-mcp --data-dir ~/n8n-data
```

## Available Methods

### Workflow Management

- `listWorkflows`: List all available workflows
- `createWorkflow`: Create a new workflow
- `getWorkflow`: Get workflow details
- `updateWorkflow`: Update an existing workflow
- `deleteWorkflow`: Delete a workflow
- `exportWorkflow`: Export workflow to JSON
- `importWorkflow`: Import workflow from JSON

### Workflow Execution

- `executeWorkflow`: Execute a workflow with input data
- `getExecutionResult`: Get the result of a workflow execution
- `stopExecution`: Stop a running workflow execution

### Credential Management

- `listCredentials`: List all available credentials
- `createCredential`: Create new credential
- `getCredential`: Get credential details
- `updateCredential`: Update existing credential
- `deleteCredential`: Delete a credential

### File Operations

- `readWorkflowFile`: Read file for use in workflow
- `writeWorkflowFile`: Write file from workflow result
- `listWorkflowFiles`: List files in workflow directory

### Server Administration

- `getServerStatus`: Get n8n server status
- `restartServer`: Restart the n8n server
- `updateSettings`: Update server settings

## Examples

### Create and Execute a Simple Workflow

```javascript
// First, create a workflow
const workflow = {
  name: "Simple HTTP Request",
  nodes: [
    {
      "name": "Start",
      "type": "n8n-nodes-base.start",
      "position": [100, 300],
      "parameters": {}
    },
    {
      "name": "HTTP Request",
      "type": "n8n-nodes-base.httpRequest",
      "position": [280, 300],
      "parameters": {
        "url": "https://jsonplaceholder.typicode.com/todos/1",
        "method": "GET"
      }
    }
  ],
  connections: {
    "Start": {
      "main": [
        [
          {
            "node": "HTTP Request",
            "type": "main",
            "index": 0
          }
        ]
      ]
    }
  }
};

const { workflowId } = await createWorkflow({ workflow });

// Then execute it
const result = await executeWorkflow({ 
  workflowId,
  executionMode: "cli",
  timeout: 0  // No timeout
});

// Process the result
console.log(result.data);
```

### Work with Credentials

```javascript
// Create a credential for HTTP Basic Auth
const credential = {
  name: "My API Credential",
  type: "httpBasicAuth",
  data: {
    user: "username",
    password: "password"
  }
};

const { credentialId } = await createCredential({ credential });

// Use the credential in a workflow
const workflow = {
  // ... workflow definition
  nodes: [
    // ...
    {
      "name": "Authenticated Request",
      "type": "n8n-nodes-base.httpRequest",
      "position": [280, 300],
      "parameters": {
        "url": "https://api.example.com/data",
        "authentication": "basicAuth",
        "credentials": {
          "httpBasicAuth": {
            "id": credentialId
          }
        }
      }
    }
  ]
};
```

## Requirements

- Node.js 16 or higher
- 200MB+ free memory
- Internet connection (for n8n node downloads)

## Performance Considerations

- Memory mode (`--memory-mode`) provides the fastest performance but data is only periodically saved to disk
- For production use, consider running with `--workers` set to match your CPU core count
- Workflows with many nodes may benefit from additional memory allocation

## Troubleshooting

- If you encounter permissions issues, ensure your user has write access to the data directory
- For firewalled environments, ensure outbound access to npm registry is available for node downloads
- When running in containers, ensure the container has appropriate CPU and memory allocations

## License

MIT

---

<div align="center">
  <p>
    <a href="https://aegntic.ai">aegntic.ai</a> |
    <a href="https://github.com/aegntic/aegntic-MCP">GitHub</a> |
    <a href="https://twitter.com/aegntic">Twitter</a>
  </p>
  <p><small>© 2025 aegntic. All rights reserved.</small></p>
</div>
