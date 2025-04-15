/**
 * Entry point for Claude Export MCP Server
 */

const server = require('./server');

// Get port from environment or use default
const PORT = process.env.PORT || 3000;

// Start the server
server.startServer(PORT);
