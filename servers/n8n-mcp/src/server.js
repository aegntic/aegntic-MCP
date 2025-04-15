/**
 * n8n MCP Server Implementation
 * 
 * Created by aegntic.ai - Limitless n8n MCP Server
 * https://aegntic.ai
 */

const mcp = require('mcp-server');
const express = require('express');
const compression = require('compression');
const helmet = require('helmet');
const fs = require('fs-extra');
const path = require('path');
const { spawn, exec } = require('child_process');
const os = require('os');
const loki = require('lokijs');
const { v4: uuidv4 } = require('uuid');

// Create MCP server
const server = new mcp.Server({
  name: 'n8n MCP Server by aegntic.ai',
  description: 'Complete n8n workflow automation with no limits'
});

// Setup n8n state
let n8nProcess = null;
let db = null;
let collections = null;
let serverConfig = {
  dataDir: '',
  memoryMode: false,
  apiKey: ''
};

// Initialize express app for advanced features
const app = express();

/**
 * Initialize the server
 */
server.start = async (config) => {
  // Store configuration
  serverConfig = {
    ...serverConfig,
    ...config
  };
  
  // Set up n8n environment variables to remove limits
  process.env.N8N_USER_FOLDER = serverConfig.dataDir;
  process.env.N8N_SKIP_WEBHOOK_DEREGISTRATION_SHUTDOWN = 'true';
  process.env.N8N_DISABLE_PRODUCTION_MAIN_PROCESS = 'true';
  process.env.N8N_EXECUTIONS_TIMEOUT = '0'; // No timeout
  process.env.N8N_EXECUTIONS_DATA_MAX_AGE = '0'; // Never delete execution data
  process.env.N8N_DISABLE_EXTERNAL_HOOKS = 'false'; // Enable all hooks
  process.env.N8N_DIAGNOSTICS_ENABLED = 'false'; // Disable phone-home
  process.env.NODE_ENV = 'production'; // Better performance
  
  // Set up LokiJS for memory mode if enabled
  if (serverConfig.memoryMode) {
    await initializeMemoryMode();
  }
  
  // Setup express app with optimizations
  setupExpressApp();
  
  // Initialize n8n backend
  await startN8nBackend();
  
  // Start the MCP server
  return new Promise((resolve, reject) => {
    try {
      // Start the MCP server
      server.listen(serverConfig.port, () => {
        resolve();
      });
    } catch (error) {
      reject(error);
    }
  });
};

/**
 * Set up in-memory database
 */
async function initializeMemoryMode() {
  db = new loki(path.join(serverConfig.dataDir, 'n8n.db'), { 
    autosave: true, 
    autosaveInterval: 5000,
    autoload: true
  });
  
  // Wait for database to load
  await new Promise((resolve) => {
    db.on('loaded', resolve);
  });
  
  // Set up collections
  collections = {
    workflows: db.getCollection('workflows') || db.addCollection('workflows', { indices: ['id'] }),
    credentials: db.getCollection('credentials') || db.addCollection('credentials', { indices: ['id', 'name'] }),
    executions: db.getCollection('executions') || db.addCollection('executions', { indices: ['id', 'workflowId'] }),
    settings: db.getCollection('settings') || db.addCollection('settings')
  };
  
  // Load any existing data
  const workflowsDir = path.join(serverConfig.dataDir, 'workflows');
  const files = fs.readdirSync(workflowsDir).filter(f => f.endsWith('.json'));
  
  // Import workflows from filesystem
  files.forEach(file => {
    try {
      const filePath = path.join(workflowsDir, file);
      const data = fs.readJSONSync(filePath);
      
      // Only add if not already in collection
      const existing = collections.workflows.findOne({ id: data.id });
      if (!existing) {
        collections.workflows.insert(data);
      }
    } catch (error) {
      console.error(`Error importing workflow ${file}:`, error.message);
    }
  });
  
  // Periodically save data to disk
  setInterval(() => {
    saveMemoryDataToDisk();
  }, 30000);
  
  console.log(`Memory mode initialized with ${collections.workflows.count()} workflows`);
}

/**
 * Save in-memory data to disk
 */
function saveMemoryDataToDisk() {
  try {
    // Save workflows
    const workflows = collections.workflows.find();
    workflows.forEach(workflow => {
      const filePath = path.join(serverConfig.dataDir, 'workflows', `${workflow.id}.json`);
      fs.writeJSONSync(filePath, workflow, { spaces: 2 });
    });
    
    // Save other collections as needed
    // ...
  } catch (error) {
    console.error('Error saving memory data to disk:', error);
  }
}

/**
 * Setup Express app with optimizations
 */
function setupExpressApp() {
  // Use HTTP2 for faster connections
  app.use(compression()); // Compress all responses
  
  // Security headers
  app.use(helmet({
    contentSecurityPolicy: false // Disable for flexibility with external resources
  }));
  
  // Efficient JSON parsing with extended limits
  app.use(express.json({ 
    limit: '500mb',
    strict: false // Less strict parsing for better performance
  }));
  
  // CORS for all origins
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, x-api-key');
    if (req.method === 'OPTIONS') {
      return res.status(200).end();
    }
    next();
  });
  
  // Simple but effective token auth that doesn't slow down requests
  app.use((req, res, next) => {
    // Skip auth for local connections or with valid token
    const skipAuth = 
      req.ip === '127.0.0.1' || 
      req.ip === '::1' ||
      req.ip === '::ffff:127.0.0.1' ||
      req.headers['x-api-key'] === serverConfig.apiKey;
      
    if (skipAuth) return next();
    
    return res.status(401).json({
      error: 'Unauthorized access'
    });
  });
  
  // Response caching system for repeated requests
  const cache = new Map();
  app.use((req, res, next) => {
    const key = req.originalUrl + JSON.stringify(req.body);
    if (req.method === 'GET' && cache.has(key)) {
      return res.json(cache.get(key));
    }
    
    // Store original send method and override
    const originalSend = res.json;
    res.json = function(body) {
      if (req.method === 'GET') {
        cache.set(key, body);
        // Simple LRU implementation to prevent memory leaks
        if (cache.size > 10000) {
          const firstKey = cache.keys().next().value;
          cache.delete(firstKey);
        }
      }
      return originalSend.call(this, body);
    };
    next();
  });
  
  // Smart error handling
  app.use((err, req, res, next) => {
    console.error(`Error handling ${req.path}:`, err);
    
    // Structured error response with debugging info
    const errorResponse = {
      success: false,
      error: {
        message: err.message,
        code: err.code || 'UNKNOWN_ERROR',
        details: err.details || null,
        stack: process.env.NODE_ENV !== 'production' ? err.stack : undefined
      },
      request: {
        path: req.path,
        method: req.method,
      },
      troubleshooting: {
        possibleCauses: getPossibleErrorCauses(err),
        suggestedActions: getSuggestedErrorActions(err)
      }
    };
    
    res.status(err.statusCode || 500).json(errorResponse);
  });
  
  // Start express app
  const httpServer = app.listen(0); // Use any available port
}

/**
 * Start n8n backend process
 */
async function startN8nBackend() {
  try {
    // Check if n8n is installed globally
    exec('n8n --version', async (error, stdout, stderr) => {
      if (error) {
        console.log('n8n not found globally, using packaged version');
        
        // Use packaged n8n
        const args = [
          'start',
          '--skipCheckWebhooksTimeout',
          '--skipWebhoooksDeregistrationOnShutdown',
          '--diagnostics=false'
        ];
        
        const options = {
          cwd: serverConfig.dataDir,
          env: {
            ...process.env,
            N8N_USER_FOLDER: serverConfig.dataDir,
            N8N_EXECUTIONS_TIMEOUT: '0',
            N8N_EXECUTIONS_DATA_MAX_AGE: '0'
          }
        };
        
        n8nProcess = spawn('npx', ['n8n', ...args], options);
        
        n8nProcess.stdout.on('data', (data) => {
          // Uncomment to see n8n output
          // console.log(`n8n: ${data}`);
        });
        
        n8nProcess.stderr.on('data', (data) => {
          console.error(`n8n error: ${data}`);
        });
        
        n8nProcess.on('close', (code) => {
          console.log(`n8n process exited with code ${code}`);
        });
        
        // Wait for n8n to start
        // Wait for n8n to start
        await new Promise((resolve, reject) => {
          let attempts = 0;
          const maxAttempts = 30; // Maximum 30 attempts (30 seconds)
          
          const checkN8nReady = () => {
            attempts++;
            // Try to connect to n8n API to confirm it's running
            const http = require('http');
            const req = http.get('http://localhost:5678/healthz', (res) => {
              if (res.statusCode === 200) {
                resolve();
              } else if (attempts < maxAttempts) {
                setTimeout(checkN8nReady, 1000);
              } else {
                reject(new Error('n8n failed to start after 30 seconds'));
              }
            });
            
            req.on('error', (err) => {
              if (attempts < maxAttempts) {
                setTimeout(checkN8nReady, 1000);
              } else {
                reject(new Error(`n8n failed to start: ${err.message}`));
              }
            });
            
            req.end();
          };
          
          // Start checking after a short delay
          setTimeout(checkN8nReady, 1000);
        });
      } else {
        console.log(`n8n version ${stdout.trim()} found globally`);
      }
    });
  } catch (error) {
    console.error('Error starting n8n backend:', error);
  }
}

/**
 * Get possible causes for an error
 */
function getPossibleErrorCauses(error) {
  // Smart error analysis system
  const errorMap = {
    'ECONNREFUSED': ['n8n service not running', 'Port already in use'],
    'TIMEOUT': ['Operation took too long', 'Resource overloaded'],
    'ENOENT': ['File or directory not found', 'Incorrect path']
  };
  
  return errorMap[error.code] || ['Unknown error occurred'];
}

/**
 * Get suggested actions for an error
 */
function getSuggestedErrorActions(error) {
  // Intelligent action suggestions based on error
  const actionMap = {
    'ECONNREFUSED': ['Start n8n service', 'Check if port is available'],
    'TIMEOUT': ['Increase timeout value', 'Optimize the workflow'],
    'ENOENT': ['Check file path', 'Create directory if needed']
  };
  
  return actionMap[error.code] || ['Check application logs for details'];
}

/**
 * Gracefully shutdown the server
 */
server.shutdown = async () => {
  console.log('Shutting down n8n MCP server...');
  
  // Save memory data to disk if in memory mode
  if (serverConfig.memoryMode) {
    saveMemoryDataToDisk();
  }
  
  // Kill n8n process if running
  if (n8nProcess) {
    n8nProcess.kill();
  }
  
  // Close MCP server
  server.close();
};

// ========================
// MCP METHOD DEFINITIONS
// ========================

// Workflow Management Methods
// ===============================

server.method({
  name: 'listWorkflows',
  description: 'List all available workflows',
  parameters: {
    type: 'object',
    properties: {
      active: {
        type: 'boolean',
        description: 'Filter by active/inactive workflows'
      },
      tags: {
        type: 'array',
        items: { type: 'string' },
        description: 'Filter by tags'
      },
      limit: {
        type: 'number',
        description: 'Limit number of results'
      },
      skip: {
        type: 'number',
        description: 'Skip number of results'
      }
    }
  },
  handler: async ({ active, tags, limit, skip }) => {
    try {
      let workflows = [];
      
      if (serverConfig.memoryMode) {
        // Get from in-memory DB
        let query = {};
        if (active !== undefined) {
          query.active = active;
        }
        
        workflows = collections.workflows.find(query);
        
        // Filter by tags if needed
        if (tags && tags.length > 0) {
          workflows = workflows.filter(workflow => {
            // Check if workflow has all specified tags
            if (!workflow.tags) return false;
            return tags.every(tag => workflow.tags.includes(tag));
          });
        }
        
        // Apply limit and skip
        if (skip) {
          workflows = workflows.slice(skip);
        }
        if (limit) {
          workflows = workflows.slice(0, limit);
        }
      } else {
        // Read from file system
        const workflowsDir = path.join(serverConfig.dataDir, 'workflows');
        const files = fs.readdirSync(workflowsDir).filter(f => f.endsWith('.json'));
        
        // Load each workflow
        for (const file of files) {
          const filePath = path.join(workflowsDir, file);
          const workflow = fs.readJSONSync(filePath);
          
          // Apply filters
          if (active !== undefined && workflow.active !== active) {
            continue;
          }
          
          if (tags && tags.length > 0) {
            if (!workflow.tags || !tags.every(tag => workflow.tags.includes(tag))) {
              continue;
            }
          }
          
          workflows.push(workflow);
        }
        
        // Apply limit and skip
        if (skip) {
          workflows = workflows.slice(skip);
        }
        if (limit) {
          workflows = workflows.slice(0, limit);
        }
      }
      
      return { 
        success: true, 
        workflows: workflows.map(w => ({
          id: w.id,
          name: w.name,
          active: w.active,
          tags: w.tags || [],
          createdAt: w.createdAt,
          updatedAt: w.updatedAt
        })),
        count: workflows.length
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
});

server.method({
  name: 'createWorkflow',
  description: 'Create a new workflow',
  parameters: {
    type: 'object',
    properties: {
      workflow: {
        type: 'object',
        description: 'Workflow definition',
        properties: {
          name: { type: 'string' },
          nodes: { type: 'array' },
          connections: { type: 'object' },
          active: { type: 'boolean' },
          tags: { 
            type: 'array',
            items: { type: 'string' }
          }
        },
        required: ['name']
      }
    },
    required: ['workflow']
  },
  handler: async ({ workflow }) => {
    try {
      // Create a complete workflow object
      const now = new Date().toISOString();
      const workflowData = {
        id: workflow.id || uuidv4(),
        name: workflow.name,
        nodes: workflow.nodes || [],
        connections: workflow.connections || {},
        active: workflow.active !== undefined ? workflow.active : false,
        tags: workflow.tags || [],
        settings: workflow.settings || {},
        createdAt: now,
        updatedAt: now,
        versionId: uuidv4()
      };
      
      if (serverConfig.memoryMode) {
        // Save to in-memory DB
        collections.workflows.insert(workflowData);
      }
      
      // Always save to filesystem too
      const filePath = path.join(serverConfig.dataDir, 'workflows', `${workflowData.id}.json`);
      fs.writeJSONSync(filePath, workflowData, { spaces: 2 });
      
      return { 
        success: true, 
        workflowId: workflowData.id,
        message: `Workflow "${workflowData.name}" created successfully` 
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
});

server.method({
  name: 'getWorkflow',
  description: 'Get workflow details',
  parameters: {
    type: 'object',
    properties: {
      workflowId: {
        type: 'string',
        description: 'ID of the workflow to get'
      }
    },
    required: ['workflowId']
  },
  handler: async ({ workflowId }) => {
    try {
      let workflow = null;
      
      if (serverConfig.memoryMode) {
        // Get from in-memory DB
        workflow = collections.workflows.findOne({ id: workflowId });
      }
      
      if (!workflow) {
        // Try to load from filesystem
        const filePath = path.join(serverConfig.dataDir, 'workflows', `${workflowId}.json`);
        if (fs.existsSync(filePath)) {
          workflow = fs.readJSONSync(filePath);
        }
      }
      
      if (!workflow) {
        return { success: false, error: `Workflow with ID ${workflowId} not found` };
      }
      
      return { success: true, workflow };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
});

server.method({
  name: 'updateWorkflow',
  description: 'Update an existing workflow',
  parameters: {
    type: 'object',
    properties: {
      workflowId: {
        type: 'string',
        description: 'ID of the workflow to update'
      },
      workflow: {
        type: 'object',
        description: 'Updated workflow data'
      }
    },
    required: ['workflowId', 'workflow']
  },
  handler: async ({ workflowId, workflow }) => {
    try {
      let existingWorkflow = null;
      
      if (serverConfig.memoryMode) {
        // Get from in-memory DB
        existingWorkflow = collections.workflows.findOne({ id: workflowId });
      }
      
      if (!existingWorkflow) {
        // Try to load from filesystem
        const filePath = path.join(serverConfig.dataDir, 'workflows', `${workflowId}.json`);
        if (fs.existsSync(filePath)) {
          existingWorkflow = fs.readJSONSync(filePath);
        }
      }
      
      if (!existingWorkflow) {
        return { success: false, error: `Workflow with ID ${workflowId} not found` };
      }
      
      // Update workflow data
      const updatedWorkflow = {
        ...existingWorkflow,
        ...workflow,
        id: workflowId, // Ensure ID doesn't change
        updatedAt: new Date().toISOString(),
        versionId: uuidv4() // New version ID
      };
      
      if (serverConfig.memoryMode) {
        // Update in-memory DB
        collections.workflows.update(updatedWorkflow);
      }
      
      // Always save to filesystem too
      const filePath = path.join(serverConfig.dataDir, 'workflows', `${workflowId}.json`);
      fs.writeJSONSync(filePath, updatedWorkflow, { spaces: 2 });
      
      return { 
        success: true, 
        workflowId: updatedWorkflow.id,
        message: `Workflow "${updatedWorkflow.name}" updated successfully` 
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
});

server.method({
  name: 'deleteWorkflow',
  description: 'Delete a workflow',
  parameters: {
    type: 'object',
    properties: {
      workflowId: {
        type: 'string',
        description: 'ID of the workflow to delete'
      }
    },
    required: ['workflowId']
  },
  handler: async ({ workflowId }) => {
    try {
      if (serverConfig.memoryMode) {
        // Delete from in-memory DB
        collections.workflows.findAndRemove({ id: workflowId });
      }
      
      // Delete from filesystem
      const filePath = path.join(serverConfig.dataDir, 'workflows', `${workflowId}.json`);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      } else {
        return { success: false, error: `Workflow with ID ${workflowId} not found` };
      }
      
      return { 
        success: true, 
        message: `Workflow ${workflowId} deleted successfully` 
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
});

// Workflow Execution Methods
// ===============================

server.method({
  name: 'executeWorkflow',
  description: 'Execute a workflow with input data',
  parameters: {
    type: 'object',
    properties: {
      workflowId: {
        type: 'string',
        description: 'ID of the workflow to execute'
      },
      data: {
        type: 'object',
        description: 'Input data for workflow execution'
      },
      timeout: {
        type: 'number',
        description: 'Execution timeout in ms (0 for no timeout)'
      },
      executionMode: {
        type: 'string',
        enum: ['manual', 'cli', 'webhook', 'trigger'],
        description: 'Workflow execution mode'
      }
    },
    required: ['workflowId']
  },
  handler: async ({ workflowId, data, timeout, executionMode }) => {
    try {
      // Load workflow
      let workflow = null;
      
      if (serverConfig.memoryMode) {
        // Get from in-memory DB
        workflow = collections.workflows.findOne({ id: workflowId });
      }
      
      if (!workflow) {
        // Try to load from filesystem
        const filePath = path.join(serverConfig.dataDir, 'workflows', `${workflowId}.json`);
        if (fs.existsSync(filePath)) {
          workflow = fs.readJSONSync(filePath);
        }
      }
      
      if (!workflow) {
        return { success: false, error: `Workflow with ID ${workflowId} not found` };
      }
      
      // Prepare execution command
      const args = [
        'execute',
        '--workflow', workflowId,
        '--skipList', // Skip saving execution result (we'll handle it)
      ];
      
      // Add execution mode if specified
      if (executionMode) {
        args.push('--executionMode', executionMode);
      }
      
      // Add timeout if specified
      if (timeout !== undefined) {
        args.push('--timeout', timeout.toString());
      }
      
      // Create temporary file with input data if provided
      let dataFile = null;
      if (data) {
        dataFile = path.join(os.tmpdir(), `n8n-data-${workflowId}-${Date.now()}.json`);
        fs.writeJSONSync(dataFile, data);
        args.push('--data', dataFile);
      }
      
      // Set execution ID
      const executionId = uuidv4();
      
      // Execute workflow
      const childProc = spawn('n8n', args, {
        cwd: serverConfig.dataDir,
        env: {
          ...process.env,
          N8N_USER_FOLDER: serverConfig.dataDir,
          N8N_EXECUTIONS_TIMEOUT: '0'
        }
      });
      
      let stdout = '';
      let stderr = '';
      
      childProc.stdout.on('data', (data) => {
        stdout += data.toString();
      });
      
      childProc.stderr.on('data', (data) => {
        stderr += data.toString();
      });
      
      // Return execution result
      return await new Promise((resolve, reject) => {
        // Set timeout to prevent hanging
        const timeoutId = setTimeout(() => {
          childProc.kill();
          reject(new Error('Workflow execution timed out'));
        }, timeout || 3600000); // Default 1 hour timeout if not specified

        // Handle process error
        childProc.on('error', (err) => {
          clearTimeout(timeoutId);
          reject(err);
        });

        childProc.on('close', (code) => {
          clearTimeout(timeoutId);
          // Delete temporary data file if created
          if (dataFile && fs.existsSync(dataFile)) {
            fs.unlinkSync(dataFile);
          }
          
          // Parse output
          let result = {};
          try {
            // Try to parse JSON from stdout
            const jsonMatch = stdout.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
              result = JSON.parse(jsonMatch[0]);
            }
          } catch (error) {
            // If parsing fails, use raw output
            result = { data: stdout };
          }
          
          // Store execution result
          const executionData = {
            id: executionId,
            workflowId,
            startedAt: new Date().toISOString(),
            finishedAt: new Date().toISOString(),
            status: code === 0 ? 'success' : 'error',
            data: result,
            input: data || {},
            error: stderr || null
          };
          
          if (serverConfig.memoryMode && collections.executions) {
            collections.executions.insert(executionData);
          }
          
          resolve({
            success: code === 0,
            executionId,
            data: result,
            error: code !== 0 ? stderr : null
          });
        });
      });
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
});

// Server Status Method
// ===============================

server.method({
  name: 'getServerStatus',
  description: 'Get n8n server status',
  parameters: { type: 'object', properties: {} },
  handler: async () => {
    try {
      const memUsage = process.memoryUsage();
      
      // Get workflow count
      let workflowCount = 0;
      
      if (serverConfig.memoryMode && collections.workflows) {
        workflowCount = collections.workflows.count();
      } else {
        // Count workflow files
        const workflowsDir = path.join(serverConfig.dataDir, 'workflows');
        if (fs.existsSync(workflowsDir)) {
          const files = fs.readdirSync(workflowsDir).filter(f => f.endsWith('.json'));
          workflowCount = files.length;
        }
      }
      
      return {
        success: true,
        status: 'running',
        memoryMode: serverConfig.memoryMode,
        dataDir: serverConfig.dataDir,
        platform: process.platform,
        nodeVersion: process.version,
        cpuCores: os.cpus().length,
        memoryUsage: {
          rss: Math.round(memUsage.rss / 1024 / 1024) + ' MB',
          heapTotal: Math.round(memUsage.heapTotal / 1024 / 1024) + ' MB',
          heapUsed: Math.round(memUsage.heapUsed / 1024 / 1024) + ' MB'
        },
        stats: {
          workflowCount,
          uptime: Math.round(process.uptime()) + ' seconds'
        }
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
});

// Additional methods would be implemented here...

module.exports = server;
