// Comprehensive N8N node definitions with all real integrations and configurations

export const NODE_CATEGORIES = {
  CORE: 'Core',
  PRODUCTIVITY: 'Productivity',
  MARKETING: 'Marketing',
  DEVELOPMENT: 'Development',
  COMMUNICATION: 'Communication',
  DATA: 'Data & Storage',
  AI: 'AI',
  ECOMMERCE: 'E-commerce',
  FINANCE: 'Finance',
  SOCIAL: 'Social Media',
  TRIGGERS: 'Triggers'
};

export const NODE_DEFINITIONS = {
  // TRIGGER NODES
  'manual-trigger': {
    name: 'Manual Trigger',
    category: NODE_CATEGORIES.TRIGGERS,
    color: '#666666',
    icon: '▶️',
    description: 'Trigger workflow manually',
    inputs: 0,
    outputs: 1,
    properties: {},
    isTrigger: true
  },
  'webhook': {
    name: 'Webhook',
    category: NODE_CATEGORIES.TRIGGERS,
    color: '#0088cc',
    icon: '🔗',
    description: 'Trigger workflow via HTTP webhook',
    inputs: 0,
    outputs: 1,
    properties: {
      httpMethod: { type: 'select', options: ['GET', 'POST', 'PUT', 'DELETE'], default: 'POST' },
      path: { type: 'string', default: '/webhook' },
      authentication: { type: 'select', options: ['none', 'basic', 'header'], default: 'none' },
      responseMode: { type: 'select', options: ['onReceived', 'lastNode'], default: 'onReceived' }
    },
    isTrigger: true
  },
  'schedule': {
    name: 'Schedule Trigger',
    category: NODE_CATEGORIES.TRIGGERS,
    color: '#00aa44',
    icon: '⏰',
    description: 'Trigger workflow on schedule',
    inputs: 0,
    outputs: 1,
    properties: {
      rule: { type: 'select', options: ['interval', 'cron'], default: 'interval' },
      interval: { type: 'number', default: 60 },
      unit: { type: 'select', options: ['seconds', 'minutes', 'hours', 'days'], default: 'minutes' },
      cronExpression: { type: 'string', default: '0 0 * * *' }
    },
    isTrigger: true
  },

  // CORE NODES
  'http-request': {
    name: 'HTTP Request',
    category: NODE_CATEGORIES.CORE,
    color: '#ff6600',
    icon: '🌐',
    description: 'Make HTTP requests to any API',
    inputs: 1,
    outputs: 1,
    properties: {
      method: { type: 'select', options: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'], default: 'GET' },
      url: { type: 'string', required: true },
      authentication: { type: 'select', options: ['none', 'basic', 'oauth1', 'oauth2', 'bearer'], default: 'none' },
      headers: { type: 'keyValue', default: [] },
      queryParameters: { type: 'keyValue', default: [] },
      body: { type: 'json', default: '{}' },
      timeout: { type: 'number', default: 300 }
    }
  },
  'set': {
    name: 'Set',
    category: NODE_CATEGORIES.CORE,
    color: '#0066cc',
    icon: '📝',
    description: 'Set values for workflow data',
    inputs: 1,
    outputs: 1,
    properties: {
      keepOnlySet: { type: 'boolean', default: false },
      values: { type: 'keyValue', default: [] }
    }
  },
  'if': {
    name: 'IF',
    category: NODE_CATEGORIES.CORE,
    color: '#aa6600',
    icon: '🔀',
    description: 'Conditional logic for workflows',
    inputs: 1,
    outputs: 2,
    properties: {
      conditions: { type: 'conditions', default: [] },
      combineOperation: { type: 'select', options: ['AND', 'OR'], default: 'AND' }
    }
  },
  'code': {
    name: 'Code',
    category: NODE_CATEGORIES.CORE,
    color: '#333333',
    icon: '💻',
    description: 'Execute custom JavaScript code',
    inputs: 1,
    outputs: 1,
    properties: {
      mode: { type: 'select', options: ['runOnceForAllItems', 'runOnceForEachItem'], default: 'runOnceForAllItems' },
      jsCode: { type: 'code', default: '// Your JavaScript code here\nreturn items;' }
    }
  },
  'function': {
    name: 'Function',
    category: NODE_CATEGORIES.CORE,
    color: '#666666',
    icon: 'ƒ',
    description: 'Transform data with functions',
    inputs: 1,
    outputs: 1,
    properties: {
      functionCode: { type: 'code', default: '// Transform your data\nreturn items.map(item => item);' }
    }
  },
  'merge': {
    name: 'Merge',
    category: NODE_CATEGORIES.CORE,
    color: '#9944aa',
    icon: '🔗',
    description: 'Merge data from multiple inputs',
    inputs: 2,
    outputs: 1,
    properties: {
      mode: { type: 'select', options: ['append', 'pass', 'wait'], default: 'append' },
      joinMode: { type: 'select', options: ['enrichInput1', 'enrichInput2', 'innerJoin', 'leftJoin', 'rightJoin'], default: 'enrichInput1' }
    }
  },
  'split-in-batches': {
    name: 'Split In Batches',
    category: NODE_CATEGORIES.CORE,
    color: '#0088aa',
    icon: '📦',
    description: 'Split data into smaller batches',
    inputs: 1,
    outputs: 1,
    properties: {
      batchSize: { type: 'number', default: 10 },
      options: { type: 'object', default: {} }
    }
  },

  // COMMUNICATION
  'gmail': {
    name: 'Gmail',
    category: NODE_CATEGORIES.COMMUNICATION,
    color: '#dd4b39',
    icon: '📧',
    description: 'Send and read Gmail emails',
    inputs: 1,
    outputs: 1,
    properties: {
      operation: { type: 'select', options: ['send', 'get', 'getAll', 'reply'], default: 'send' },
      to: { type: 'string' },
      subject: { type: 'string' },
      message: { type: 'text' },
      attachments: { type: 'string' }
    }
  },
  'slack': {
    name: 'Slack',
    category: NODE_CATEGORIES.COMMUNICATION,
    color: '#4a154b',
    icon: '💬',
    description: 'Send messages and interact with Slack',
    inputs: 1,
    outputs: 1,
    properties: {
      operation: { type: 'select', options: ['postMessage', 'update', 'get', 'getAll', 'delete'], default: 'postMessage' },
      channel: { type: 'string', required: true },
      text: { type: 'text' },
      username: { type: 'string' },
      asUser: { type: 'boolean', default: false }
    }
  },
  'discord': {
    name: 'Discord',
    category: NODE_CATEGORIES.COMMUNICATION,
    color: '#7289da',
    icon: '🎮',
    description: 'Send messages to Discord',
    inputs: 1,
    outputs: 1,
    properties: {
      webhookUrl: { type: 'string', required: true },
      text: { type: 'text' },
      username: { type: 'string' },
      embeds: { type: 'json', default: '[]' }
    }
  },
  'telegram': {
    name: 'Telegram',
    category: NODE_CATEGORIES.COMMUNICATION,
    color: '#0088cc',
    icon: '✈️',
    description: 'Send messages via Telegram',
    inputs: 1,
    outputs: 1,
    properties: {
      operation: { type: 'select', options: ['sendMessage', 'sendPhoto', 'sendDocument'], default: 'sendMessage' },
      chatId: { type: 'string', required: true },
      text: { type: 'text' }
    }
  },

  // PRODUCTIVITY
  'google-sheets': {
    name: 'Google Sheets',
    category: NODE_CATEGORIES.PRODUCTIVITY,
    color: '#0f9d58',
    icon: '📊',
    description: 'Read and write Google Sheets data',
    inputs: 1,
    outputs: 1,
    properties: {
      operation: { type: 'select', options: ['append', 'read', 'update', 'delete'], default: 'append' },
      sheetId: { type: 'string', required: true },
      range: { type: 'string', default: 'A:Z' },
      values: { type: 'keyValue', default: [] }
    }
  },
  'notion': {
    name: 'Notion',
    category: NODE_CATEGORIES.PRODUCTIVITY,
    color: '#000000',
    icon: '📝',
    description: 'Interact with Notion databases and pages',
    inputs: 1,
    outputs: 1,
    properties: {
      operation: { type: 'select', options: ['create', 'get', 'getAll', 'update'], default: 'create' },
      resource: { type: 'select', options: ['database', 'page'], default: 'database' },
      databaseId: { type: 'string' },
      properties: { type: 'json', default: '{}' }
    }
  },
  'airtable': {
    name: 'Airtable',
    category: NODE_CATEGORIES.PRODUCTIVITY,
    color: '#18bfff',
    icon: '🗃️',
    description: 'Manage Airtable records',
    inputs: 1,
    outputs: 1,
    properties: {
      operation: { type: 'select', options: ['create', 'get', 'getAll', 'update', 'delete'], default: 'create' },
      baseId: { type: 'string', required: true },
      tableId: { type: 'string', required: true },
      fields: { type: 'keyValue', default: [] }
    }
  },

  // DEVELOPMENT
  'github': {
    name: 'GitHub',
    category: NODE_CATEGORIES.DEVELOPMENT,
    color: '#333333',
    icon: '🐙',
    description: 'Interact with GitHub repositories',
    inputs: 1,
    outputs: 1,
    properties: {
      operation: { type: 'select', options: ['createIssue', 'getIssue', 'getRepository', 'createRelease'], default: 'getRepository' },
      owner: { type: 'string', required: true },
      repository: { type: 'string', required: true },
      title: { type: 'string' },
      body: { type: 'text' }
    }
  },
  'git': {
    name: 'Git',
    category: NODE_CATEGORIES.DEVELOPMENT,
    color: '#f05032',
    icon: '🌿',
    description: 'Git operations',
    inputs: 1,
    outputs: 1,
    properties: {
      operation: { type: 'select', options: ['clone', 'add', 'commit', 'push', 'pull'], default: 'clone' },
      repositoryPath: { type: 'string', required: true },
      message: { type: 'string' }
    }
  },
  'gitlab': {
    name: 'GitLab',
    category: NODE_CATEGORIES.DEVELOPMENT,
    color: '#fc6d26',
    icon: '🦊',
    description: 'Interact with GitLab',
    inputs: 1,
    outputs: 1,
    properties: {
      operation: { type: 'select', options: ['getRepository', 'createIssue', 'getMergeRequest'], default: 'getRepository' },
      projectId: { type: 'string', required: true }
    }
  },

  // DATA & STORAGE
  'mysql': {
    name: 'MySQL',
    category: NODE_CATEGORIES.DATA,
    color: '#4479a1',
    icon: '🗄️',
    description: 'Execute MySQL queries',
    inputs: 1,
    outputs: 1,
    properties: {
      operation: { type: 'select', options: ['select', 'insert', 'update', 'delete'], default: 'select' },
      query: { type: 'code', required: true },
      parameters: { type: 'keyValue', default: [] }
    }
  },
  'postgres': {
    name: 'PostgreSQL',
    category: NODE_CATEGORIES.DATA,
    color: '#336791',
    icon: '🐘',
    description: 'Execute PostgreSQL queries',
    inputs: 1,
    outputs: 1,
    properties: {
      operation: { type: 'select', options: ['select', 'insert', 'update', 'delete'], default: 'select' },
      query: { type: 'code', required: true },
      parameters: { type: 'keyValue', default: [] }
    }
  },
  'mongodb': {
    name: 'MongoDB',
    category: NODE_CATEGORIES.DATA,
    color: '#47a248',
    icon: '🍃',
    description: 'Interact with MongoDB',
    inputs: 1,
    outputs: 1,
    properties: {
      operation: { type: 'select', options: ['find', 'insert', 'update', 'delete'], default: 'find' },
      collection: { type: 'string', required: true },
      query: { type: 'json', default: '{}' }
    }
  },
  'redis': {
    name: 'Redis',
    category: NODE_CATEGORIES.DATA,
    color: '#dc382d',
    icon: '🔴',
    description: 'Interact with Redis',
    inputs: 1,
    outputs: 1,
    properties: {
      operation: { type: 'select', options: ['get', 'set', 'delete', 'incr', 'publish'], default: 'get' },
      key: { type: 'string', required: true },
      value: { type: 'string' }
    }
  },
  'aws-s3': {
    name: 'AWS S3',
    category: NODE_CATEGORIES.DATA,
    color: '#ff9900',
    icon: '☁️',
    description: 'Store and retrieve files from S3',
    inputs: 1,
    outputs: 1,
    properties: {
      operation: { type: 'select', options: ['upload', 'download', 'delete', 'getAll'], default: 'upload' },
      bucketName: { type: 'string', required: true },
      key: { type: 'string', required: true },
      region: { type: 'string', default: 'us-east-1' }
    }
  },

  // AI NODES
  'openai': {
    name: 'OpenAI',
    category: NODE_CATEGORIES.AI,
    color: '#412991',
    icon: '🤖',
    description: 'Generate content with OpenAI GPT',
    inputs: 1,
    outputs: 1,
    properties: {
      operation: { type: 'select', options: ['text', 'image', 'edit', 'embedding'], default: 'text' },
      model: { type: 'select', options: ['gpt-4', 'gpt-3.5-turbo', 'dall-e-3'], default: 'gpt-3.5-turbo' },
      prompt: { type: 'text', required: true },
      maxTokens: { type: 'number', default: 100 },
      temperature: { type: 'number', default: 0.7 }
    }
  },
  'anthropic': {
    name: 'Anthropic',
    category: NODE_CATEGORIES.AI,
    color: '#d4a574',
    icon: '🧠',
    description: 'Generate content with Claude',
    inputs: 1,
    outputs: 1,
    properties: {
      model: { type: 'select', options: ['claude-3-opus', 'claude-3-sonnet', 'claude-3-haiku'], default: 'claude-3-sonnet' },
      prompt: { type: 'text', required: true },
      maxTokens: { type: 'number', default: 100 }
    }
  },

  // MARKETING
  'mailchimp': {
    name: 'Mailchimp',
    category: NODE_CATEGORIES.MARKETING,
    color: '#ffe01b',
    icon: '🐵',
    description: 'Manage Mailchimp campaigns and lists',
    inputs: 1,
    outputs: 1,
    properties: {
      operation: { type: 'select', options: ['addMember', 'getMember', 'updateMember'], default: 'addMember' },
      listId: { type: 'string', required: true },
      email: { type: 'string', required: true }
    }
  },
  'hubspot': {
    name: 'HubSpot',
    category: NODE_CATEGORIES.MARKETING,
    color: '#ff7a59',
    icon: '🎯',
    description: 'Manage HubSpot CRM',
    inputs: 1,
    outputs: 1,
    properties: {
      operation: { type: 'select', options: ['createContact', 'getContact', 'updateContact'], default: 'createContact' },
      email: { type: 'string', required: true },
      properties: { type: 'keyValue', default: [] }
    }
  },

  // SOCIAL MEDIA
  'twitter': {
    name: 'Twitter',
    category: NODE_CATEGORIES.SOCIAL,
    color: '#1da1f2',
    icon: '🐦',
    description: 'Post and interact with Twitter',
    inputs: 1,
    outputs: 1,
    properties: {
      operation: { type: 'select', options: ['tweet', 'like', 'retweet', 'search'], default: 'tweet' },
      text: { type: 'text' },
      media: { type: 'string' }
    }
  },
  'facebook': {
    name: 'Facebook',
    category: NODE_CATEGORIES.SOCIAL,
    color: '#1877f2',
    icon: '📘',
    description: 'Post to Facebook pages',
    inputs: 1,
    outputs: 1,
    properties: {
      operation: { type: 'select', options: ['createPost', 'getPost', 'createPagePost'], default: 'createPost' },
      message: { type: 'text' },
      link: { type: 'string' }
    }
  },
  'linkedin': {
    name: 'LinkedIn',
    category: NODE_CATEGORIES.SOCIAL,
    color: '#0077b5',
    icon: '💼',
    description: 'Post to LinkedIn',
    inputs: 1,
    outputs: 1,
    properties: {
      operation: { type: 'select', options: ['createPost', 'getProfile'], default: 'createPost' },
      text: { type: 'text' },
      visibility: { type: 'select', options: ['public', 'connections'], default: 'public' }
    }
  },

  // E-COMMERCE
  'shopify': {
    name: 'Shopify',
    category: NODE_CATEGORIES.ECOMMERCE,
    color: '#95bf47',
    icon: '🛍️',
    description: 'Manage Shopify store',
    inputs: 1,
    outputs: 1,
    properties: {
      operation: { type: 'select', options: ['getProduct', 'createProduct', 'updateProduct', 'getOrder'], default: 'getProduct' },
      productId: { type: 'string' },
      title: { type: 'string' },
      price: { type: 'number' }
    }
  },
  'woocommerce': {
    name: 'WooCommerce',
    category: NODE_CATEGORIES.ECOMMERCE,
    color: '#96588a',
    icon: '🛒',
    description: 'Manage WooCommerce store',
    inputs: 1,
    outputs: 1,
    properties: {
      operation: { type: 'select', options: ['getProduct', 'createProduct', 'getOrder'], default: 'getProduct' },
      productId: { type: 'string' },
      name: { type: 'string' },
      price: { type: 'number' }
    }
  },

  // FINANCE
  'stripe': {
    name: 'Stripe',
    category: NODE_CATEGORIES.FINANCE,
    color: '#008cdd',
    icon: '💳',
    description: 'Process payments with Stripe',
    inputs: 1,
    outputs: 1,
    properties: {
      operation: { type: 'select', options: ['createCharge', 'getCharge', 'createCustomer'], default: 'createCharge' },
      amount: { type: 'number', required: true },
      currency: { type: 'string', default: 'usd' },
      description: { type: 'string' }
    }
  },
  'paypal': {
    name: 'PayPal',
    category: NODE_CATEGORIES.FINANCE,
    color: '#0070ba',
    icon: '💰',
    description: 'Process PayPal payments',
    inputs: 1,
    outputs: 1,
    properties: {
      operation: { type: 'select', options: ['createPayment', 'getPayment'], default: 'createPayment' },
      amount: { type: 'number', required: true },
      currency: { type: 'string', default: 'USD' }
    }
  }
};

// Helper functions
export function getNodesByCategory(category) {
  return Object.entries(NODE_DEFINITIONS)
    .filter(([_, node]) => node.category === category)
    .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});
}

export function getAllTriggerNodes() {
  return Object.entries(NODE_DEFINITIONS)
    .filter(([_, node]) => node.isTrigger)
    .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});
}

export function getAllRegularNodes() {
  return Object.entries(NODE_DEFINITIONS)
    .filter(([_, node]) => !node.isTrigger)
    .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});
}

export function getNodeDefinition(nodeType) {
  return NODE_DEFINITIONS[nodeType];
}

export function createNodeInstance(nodeType, position = { x: 200, y: 200 }) {
  const definition = NODE_DEFINITIONS[nodeType];
  if (!definition) {
    throw new Error(`Unknown node type: ${nodeType}`);
  }

  const nodeId = `${nodeType}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  return {
    id: nodeId,
    type: nodeType,
    name: definition.name,
    position,
    data: {
      label: definition.name,
      properties: { ...definition.properties },
      config: {},
      inputs: definition.inputs,
      outputs: definition.outputs
    },
    definition
  };
}