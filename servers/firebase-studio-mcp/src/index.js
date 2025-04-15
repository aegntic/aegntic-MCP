/**
 * Entry point for Firebase Studio MCP Server
 */

const { exec } = require('child_process');
const server = require('./server');

// Get port from environment or use default
const PORT = process.env.PORT || 3000;

// Start the server
server.start({ port: PORT }).then(() => {
  console.log(`Firebase Studio MCP Server running on port ${PORT}`);
  console.log('Available methods:');
  
  // List all methods
  server.methods.forEach(method => {
    console.log(` - ${method.name}: ${method.description}`);
  });
  
  // Check if required tools are available
  exec('firebase --version', (error) => {
    if (error) {
      console.log('\nWARNING: Firebase CLI not found in PATH');
      console.log('Run ./setup.sh to install the required tools');
    }
  });
  
  exec('gcloud --version', (error) => {
    if (error) {
      console.log('\nWARNING: Google Cloud SDK not found in PATH');
      console.log('Run ./setup.sh to install the required tools');
    }
  });
});