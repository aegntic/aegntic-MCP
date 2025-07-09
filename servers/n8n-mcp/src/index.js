/**
 * Entry point for n8n MCP Server
 * 
 * Created by aegntic.ai - Limitless n8n MCP Server
 * https://aegntic.ai
 */

const { exec } = require('child_process');
const os = require('os');
const cluster = require('cluster');
const server = require('./server');
const fs = require('fs-extra');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

// Try to use shared utilities if available
let findAvailablePort;
try {
  const portUtils = require('../../shared/utils/port-utils');
  findAvailablePort = portUtils.findAvailablePort;
} catch (error) {
  // Fallback implementation if shared utils aren't available
  findAvailablePort = async (port) => {
    const net = require('net');
    return new Promise((resolve) => {
      const server = net.createServer();
      server.listen(port, () => {
        server.close(() => resolve(port));
      });
      server.on('error', () => {
        // Port is taken, try the next one
        resolve(findAvailablePort(port + 1));
      });
    });
  };
}

// Default port and environment variable
const DEFAULT_PORT = 3000;
const PORT_ENV_VAR = 'MCP_PORT';

// Load or generate API key
let apiKey = '';
const keyPath = path.join(process.env.HOME || process.env.USERPROFILE, '.n8n-mcp-key');
if (fs.existsSync(keyPath)) {
  apiKey = fs.readFileSync(keyPath, 'utf8').trim();
} else {
  apiKey = uuidv4();
  fs.writeFileSync(keyPath, apiKey);
  console.log(`Generated new API key: ${apiKey}`);
  console.log(`Saved to: ${keyPath}`);
}

// Set environment variables
process.env.API_KEY = apiKey;

// Parse command line arguments
const yargs = require('yargs/yargs');
const argv = yargs(process.argv.slice(2))
  .option('port', {
    alias: 'p',
    description: 'Port to run the server on',
    type: 'number',
    default: parseInt(process.env[PORT_ENV_VAR], 10) || DEFAULT_PORT
  })
  .option('data-dir', {
    alias: 'd',
    description: 'Directory to store n8n data',
    type: 'string',
    default: path.join(process.env.HOME || process.env.USERPROFILE, '.n8n-mcp-data')
  })
  .option('workers', {
    alias: 'w',
    description: 'Number of worker processes (default: auto)',
    type: 'number',
    default: 0
  })
  .option('memory-mode', {
    alias: 'm',
    description: 'Run in high-performance memory mode',
    type: 'boolean',
    default: false
  })
  .help()
  .version()
  .alias('help', 'h')
  .alias('version', 'v')
  .argv;

// Function to get local IP addresses
function getLocalIpAddresses() {
  const interfaces = os.networkInterfaces();
  const addresses = [];
  
  for (const interfaceName in interfaces) {
    const interfaceInfo = interfaces[interfaceName];
    for (const info of interfaceInfo) {
      // Skip internal and non-IPv4 addresses
      if (!info.internal && info.family === 'IPv4') {
        addresses.push(info.address);
      }
    }
  }
  
  return addresses;
}

// Show aegntic.ai banner
function showBanner() {
  console.log('');
  console.log('\x1b[38;5;39m █████╗ ███████╗ ██████╗ ███╗   ██╗████████╗██╗ ██████╗\x1b[0m');
  console.log('\x1b[38;5;39m██╔══██╗██╔════╝██╔════╝ ████╗  ██║╚══██╔══╝██║██╔════╝\x1b[0m');
  console.log('\x1b[38;5;39m███████║█████╗  ██║  ███╗██╔██╗ ██║   ██║   ██║██║     \x1b[0m');
  console.log('\x1b[38;5;39m██╔══██║██╔══╝  ██║   ██║██║╚██╗██║   ██║   ██║██║     \x1b[0m');
  console.log('\x1b[38;5;39m██║  ██║███████╗╚██████╔╝██║ ╚████║   ██║   ██║╚██████╗\x1b[0m');
  console.log('\x1b[38;5;39m╚═╝  ╚═╝╚══════╝ ╚═════╝ ╚═╝  ╚═══╝   ╚═╝   ╚═╝ ╚═════╝\x1b[0m');
  console.log('\x1b[38;5;247m                                             n8n-mcp v1.0.0\x1b[0m');
  console.log('');
}

// Ensure data directory exists with proper permissions
fs.ensureDirSync(argv.dataDir);
fs.ensureDirSync(path.join(argv.dataDir, 'workflows'));
fs.ensureDirSync(path.join(argv.dataDir, 'credentials'));
fs.ensureDirSync(path.join(argv.dataDir, 'executions'));
fs.ensureDirSync(path.join(argv.dataDir, 'storage'));

// Start server with flexible port
async function startServer() {
  try {
    // Determine worker count
    const numWorkers = argv.workers || os.cpus().length;
    
    // Multi-process scaling for maximum performance
    if (cluster.isMaster && numWorkers > 1) {
      showBanner();
      console.log(`🔄 Master process ${process.pid} starting ${numWorkers} workers...`);
      
      // Fork workers for multi-core processing
      for (let i = 0; i < numWorkers; i++) {
        cluster.fork();
      }
      
      // Restart workers if they die
      cluster.on('exit', (worker, code, signal) => {
        console.log(`💔 Worker ${worker.process.pid} died (${signal || code}), restarting...`);
        cluster.fork();
      });
      
      console.log(`🔑 API Key: ${apiKey}`);
      console.log(`📂 Data directory: ${argv.dataDir}`);
      console.log(`💾 Memory mode: ${argv.memoryMode ? 'enabled' : 'disabled'}`);
      
      return;
    }
    
    // Worker process or single process mode
    // Find an available port
    const port = await findAvailablePort(argv.port);
    
    // Start the server
    await server.start({ 
      port, 
      dataDir: argv.dataDir,
      memoryMode: argv.memoryMode,
      apiKey
    });
    
    // Only show banner in single process mode or from first worker
    if (cluster.isMaster || process.env.NODE_APP_INSTANCE === '0') {
      showBanner();
      console.log(`🚀 n8n MCP Server running on port ${port} (PID: ${process.pid})`);
      
      // If we're using a different port than preferred, show a notice
      if (port !== argv.port) {
        console.log(`ℹ️  Note: Port ${argv.port} was not available, using port ${port} instead.`);
        console.log(`ℹ️  You can set a different starting port with the ${PORT_ENV_VAR} environment variable.`);
      }
      
      // Show connection URLs
      console.log('\n📋 Connection URL for Claude:');
      console.log(`   http://localhost:${port}`);
      
      // Show IP-based URLs (helpful for mobile or other devices)
      const ipAddresses = getLocalIpAddresses();
      if (ipAddresses.length > 0) {
        console.log('\n📱 Connection URLs for other devices on the same network:');
        ipAddresses.forEach(ip => {
          console.log(`   http://${ip}:${port}`);
        });
      }
      
      // Print configuration details
      console.log('\n⚙️  Configuration:');
      console.log(`   Data directory: ${argv.dataDir}`);
      console.log(`   Workers: ${numWorkers}`);
      console.log(`   Memory mode: ${argv.memoryMode ? 'enabled' : 'disabled'}`);
      console.log(`   API Key: ${apiKey.substring(0, 8)}...${apiKey.substring(apiKey.length - 4)}`);
      
      // List available methods
      console.log('\n🔧 Available methods:');
      server.methods.forEach(method => {
        console.log(` - ${method.name}: ${method.description}`);
      });
      
      console.log('\n📚 Documentation: https://github.com/aegntic/aegntic-MCP/tree/main/servers/n8n-mcp');
      console.log('');
    }
  } catch (error) {
    console.error('\n❌ Failed to start server:', error);
    process.exit(1);
  }
}

// Start the server
startServer();

// Handle graceful shutdown
process.on('SIGINT', async () => {
  try {
    console.log('\n🛑 Shutting down n8n MCP server...');
    if (server.shutdown) {
      await server.shutdown();
    }
    process.exit(0);
  } catch (error) {
    console.error('Error during shutdown:', error);
    process.exit(1);
  }
});

process.on('SIGTERM', async () => {
  try {
    console.log('\n🛑 Termination signal received. Shutting down...');
    if (server.shutdown) {
      await server.shutdown();
    }
    process.exit(0);
  } catch (error) {
    console.error('Error during shutdown:', error);
    process.exit(1);
  }
});
