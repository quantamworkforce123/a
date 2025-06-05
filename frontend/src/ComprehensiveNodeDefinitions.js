// Complete N8N Node Definitions for Quantamworkforce
// Based on official N8N documentation and integrations

export const NODE_CATEGORIES = {
  // Core Categories
  CORE: 'Core',
  TRIGGERS: 'Triggers',
  
  // Service Categories
  AI: 'AI',
  ANALYTICS: 'Analytics',
  BUSINESS: 'Business',
  CLOUD_INFRASTRUCTURE: 'Cloud Infrastructure',
  COMMUNICATION: 'Communication',
  CRM: 'CRM',
  DATABASES: 'Databases',
  DESIGN: 'Design',
  DEVELOPER_TOOLS: 'Developer Tools',
  ECOMMERCE: 'E-commerce',
  EDUCATION: 'Education',
  EMAIL: 'Email',
  ENTERTAINMENT: 'Entertainment',
  FILES: 'Files',
  FINANCE: 'Finance',
  FORMS: 'Forms',
  GAMING: 'Gaming',
  GOVERNMENT: 'Government',
  HEALTHCARE: 'Healthcare',
  HR: 'HR',
  IOT: 'IoT',
  LEGAL: 'Legal',
  MARKETING: 'Marketing',
  NEWS: 'News',
  PRODUCTIVITY: 'Productivity',
  PROJECT_MANAGEMENT: 'Project Management',
  REAL_ESTATE: 'Real Estate',
  SALES: 'Sales',
  SECURITY: 'Security',
  SOCIAL_MEDIA: 'Social Media',
  SUPPORT: 'Support',
  TRAVEL: 'Travel',
  WEBSITE_BUILDERS: 'Website Builders'
};

export const COMPREHENSIVE_NODE_DEFINITIONS = {
  // CORE NODES
  'manual-trigger': {
    name: 'Manual Trigger',
    category: NODE_CATEGORIES.TRIGGERS,
    color: '#666666',
    icon: '▶️',
    description: 'Trigger workflow manually',
    inputs: 0,
    outputs: 1,
    properties: {
      executionMode: { type: 'select', options: ['once', 'test'], default: 'once' }
    },
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
      httpMethod: { type: 'select', options: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD'], default: 'POST' },
      path: { type: 'string', default: '/webhook', required: true },
      authentication: { type: 'select', options: ['none', 'basic', 'header'], default: 'none' },
      responseMode: { type: 'select', options: ['onReceived', 'lastNode'], default: 'onReceived' },
      responseData: { type: 'text', default: 'success' },
      responseCode: { type: 'number', default: 200 }
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
      cronExpression: { type: 'string', default: '0 0 * * *' },
      timezone: { type: 'string', default: 'UTC' }
    },
    isTrigger: true
  },
  'http-request': {
    name: 'HTTP Request',
    category: NODE_CATEGORIES.CORE,
    color: '#ff6600',
    icon: '🌐',
    description: 'Make HTTP requests to any API',
    inputs: 1,
    outputs: 1,
    properties: {
      method: { type: 'select', options: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD'], default: 'GET' },
      url: { type: 'string', required: true },
      authentication: { type: 'select', options: ['none', 'basic', 'oauth1', 'oauth2', 'bearer', 'header'], default: 'none' },
      sendHeaders: { type: 'boolean', default: false },
      headers: { type: 'keyValue', default: [] },
      sendQuery: { type: 'boolean', default: false },
      queryParameters: { type: 'keyValue', default: [] },
      sendBody: { type: 'boolean', default: false },
      bodyContentType: { type: 'select', options: ['json', 'form', 'raw'], default: 'json' },
      body: { type: 'json', default: '{}' },
      timeout: { type: 'number', default: 300 },
      followRedirects: { type: 'boolean', default: true },
      ignoreSSL: { type: 'boolean', default: false }
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
      values: { type: 'keyValue', default: [] },
      mode: { type: 'select', options: ['manual', 'expression'], default: 'manual' }
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
      combineOperation: { type: 'select', options: ['AND', 'OR'], default: 'AND' },
      fallthroughOptions: { type: 'select', options: ['stopExecution', 'continueToFalseOutput'], default: 'stopExecution' }
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
      jsCode: { type: 'code', default: '// Your JavaScript code here\nreturn items;' },
      functionName: { type: 'string', default: 'main' }
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
      joinMode: { type: 'select', options: ['enrichInput1', 'enrichInput2', 'innerJoin', 'leftJoin', 'rightJoin'], default: 'enrichInput1' },
      propertyName1: { type: 'string', default: 'id' },
      propertyName2: { type: 'string', default: 'id' }
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
  'switch': {
    name: 'Switch',
    category: NODE_CATEGORIES.CORE,
    color: '#ff8800',
    icon: '🔀',
    description: 'Route data to different outputs based on conditions',
    inputs: 1,
    outputs: 4,
    properties: {
      mode: { type: 'select', options: ['expression', 'rules'], default: 'rules' },
      rules: { type: 'array', default: [] },
      fallbackOutput: { type: 'select', options: ['0', '1', '2', '3'], default: '3' }
    }
  },

  // AI INTEGRATIONS
  'openai': {
    name: 'OpenAI',
    category: NODE_CATEGORIES.AI,
    color: '#412991',
    icon: '🤖',
    description: 'Generate content with OpenAI GPT',
    inputs: 1,
    outputs: 1,
    properties: {
      operation: { type: 'select', options: ['text', 'image', 'edit', 'embedding', 'moderation'], default: 'text' },
      model: { type: 'select', options: ['gpt-4', 'gpt-4-turbo', 'gpt-3.5-turbo', 'dall-e-3', 'dall-e-2', 'text-embedding-ada-002'], default: 'gpt-3.5-turbo' },
      prompt: { type: 'text', required: true },
      maxTokens: { type: 'number', default: 100 },
      temperature: { type: 'number', default: 0.7, min: 0, max: 2 },
      topP: { type: 'number', default: 1, min: 0, max: 1 },
      frequencyPenalty: { type: 'number', default: 0, min: -2, max: 2 },
      presencePenalty: { type: 'number', default: 0, min: -2, max: 2 }
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
      model: { type: 'select', options: ['claude-3-opus', 'claude-3-sonnet', 'claude-3-haiku', 'claude-2.1', 'claude-2.0'], default: 'claude-3-sonnet' },
      prompt: { type: 'text', required: true },
      maxTokens: { type: 'number', default: 100 },
      temperature: { type: 'number', default: 0.7, min: 0, max: 1 }
    }
  },
  'google-ai': {
    name: 'Google AI',
    category: NODE_CATEGORIES.AI,
    color: '#4285f4',
    icon: '🔍',
    description: 'Interact with Google AI services',
    inputs: 1,
    outputs: 1,
    properties: {
      operation: { type: 'select', options: ['gemini', 'palm', 'vertex'], default: 'gemini' },
      prompt: { type: 'text', required: true },
      model: { type: 'string', default: 'gemini-pro' }
    }
  },
  'hugging-face': {
    name: 'Hugging Face',
    category: NODE_CATEGORIES.AI,
    color: '#ff6b35',
    icon: '🤗',
    description: 'Access Hugging Face models',
    inputs: 1,
    outputs: 1,
    properties: {
      operation: { type: 'select', options: ['inference', 'hosted-inference'], default: 'inference' },
      model: { type: 'string', required: true },
      inputs: { type: 'text', required: true }
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
      operation: { type: 'select', options: ['send', 'get', 'getAll', 'reply', 'addLabels', 'removeLabels', 'markAsRead', 'markAsUnread'], default: 'send' },
      to: { type: 'string' },
      cc: { type: 'string' },
      bcc: { type: 'string' },
      subject: { type: 'string' },
      message: { type: 'text' },
      htmlMessage: { type: 'code' },
      attachments: { type: 'string' },
      replyTo: { type: 'string' }
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
      operation: { type: 'select', options: ['postMessage', 'update', 'get', 'getAll', 'delete', 'getProfile', 'setPresence', 'getPresence'], default: 'postMessage' },
      channel: { type: 'string', required: true },
      text: { type: 'text' },
      username: { type: 'string' },
      asUser: { type: 'boolean', default: false },
      iconEmoji: { type: 'string' },
      iconUrl: { type: 'string' },
      linkNames: { type: 'boolean', default: false },
      blocks: { type: 'json', default: '[]' },
      attachments: { type: 'json', default: '[]' }
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
      avatarUrl: { type: 'string' },
      tts: { type: 'boolean', default: false },
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
      operation: { type: 'select', options: ['sendMessage', 'sendPhoto', 'sendDocument', 'sendVideo', 'sendAnimation', 'sendSticker'], default: 'sendMessage' },
      chatId: { type: 'string', required: true },
      text: { type: 'text' },
      parseMode: { type: 'select', options: ['Markdown', 'HTML'], default: 'Markdown' },
      disableWebPagePreview: { type: 'boolean', default: false },
      disableNotification: { type: 'boolean', default: false }
    }
  },
  'whatsapp': {
    name: 'WhatsApp',
    category: NODE_CATEGORIES.COMMUNICATION,
    color: '#25d366',
    icon: '📱',
    description: 'Send WhatsApp messages',
    inputs: 1,
    outputs: 1,
    properties: {
      operation: { type: 'select', options: ['sendMessage', 'sendTemplate', 'sendMedia'], default: 'sendMessage' },
      to: { type: 'string', required: true },
      message: { type: 'text' },
      mediaUrl: { type: 'string' },
      mediaType: { type: 'select', options: ['image', 'document', 'video', 'audio'], default: 'image' }
    }
  },
  'microsoft-teams': {
    name: 'Microsoft Teams',
    category: NODE_CATEGORIES.COMMUNICATION,
    color: '#6264a7',
    icon: '👥',
    description: 'Send messages to Microsoft Teams',
    inputs: 1,
    outputs: 1,
    properties: {
      operation: { type: 'select', options: ['postMessage', 'getChannels', 'getTeams'], default: 'postMessage' },
      teamId: { type: 'string' },
      channelId: { type: 'string' },
      message: { type: 'text' },
      messageType: { type: 'select', options: ['text', 'html'], default: 'text' }
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
      operation: { type: 'select', options: ['append', 'read', 'update', 'delete', 'clear'], default: 'append' },
      sheetId: { type: 'string', required: true },
      range: { type: 'string', default: 'A:Z' },
      values: { type: 'keyValue', default: [] },
      valueInputOption: { type: 'select', options: ['RAW', 'USER_ENTERED'], default: 'USER_ENTERED' },
      valueRenderOption: { type: 'select', options: ['FORMATTED_VALUE', 'UNFORMATTED_VALUE', 'FORMULA'], default: 'FORMATTED_VALUE' }
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
      operation: { type: 'select', options: ['create', 'get', 'getAll', 'update', 'archive'], default: 'create' },
      resource: { type: 'select', options: ['database', 'page', 'block'], default: 'database' },
      databaseId: { type: 'string' },
      pageId: { type: 'string' },
      properties: { type: 'json', default: '{}' },
      children: { type: 'json', default: '[]' }
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
      fields: { type: 'keyValue', default: [] },
      maxRecords: { type: 'number', default: 100 },
      view: { type: 'string' }
    }
  },
  'trello': {
    name: 'Trello',
    category: NODE_CATEGORIES.PRODUCTIVITY,
    color: '#0079bf',
    icon: '📋',
    description: 'Manage Trello boards and cards',
    inputs: 1,
    outputs: 1,
    properties: {
      operation: { type: 'select', options: ['createCard', 'getCard', 'updateCard', 'deleteCard', 'getBoards', 'getLists'], default: 'createCard' },
      boardId: { type: 'string' },
      listId: { type: 'string' },
      name: { type: 'string' },
      description: { type: 'text' },
      position: { type: 'select', options: ['top', 'bottom'], default: 'bottom' }
    }
  },
  'asana': {
    name: 'Asana',
    category: NODE_CATEGORIES.PRODUCTIVITY,
    color: '#f06a6a',
    icon: '✅',
    description: 'Manage Asana tasks and projects',
    inputs: 1,
    outputs: 1,
    properties: {
      operation: { type: 'select', options: ['createTask', 'getTask', 'updateTask', 'deleteTask', 'getProjects', 'getUsers'], default: 'createTask' },
      projectId: { type: 'string' },
      name: { type: 'string', required: true },
      notes: { type: 'text' },
      assignee: { type: 'string' },
      dueDate: { type: 'string' },
      completed: { type: 'boolean', default: false }
    }
  },

  // DATABASES
  'mysql': {
    name: 'MySQL',
    category: NODE_CATEGORIES.DATABASES,
    color: '#4479a1',
    icon: '🗄️',
    description: 'Execute MySQL queries',
    inputs: 1,
    outputs: 1,
    properties: {
      operation: { type: 'select', options: ['executeQuery', 'insert', 'update', 'delete'], default: 'executeQuery' },
      query: { type: 'code', required: true },
      parameters: { type: 'keyValue', default: [] }
    }
  },
  'postgres': {
    name: 'PostgreSQL',
    category: NODE_CATEGORIES.DATABASES,
    color: '#336791',
    icon: '🐘',
    description: 'Execute PostgreSQL queries',
    inputs: 1,
    outputs: 1,
    properties: {
      operation: { type: 'select', options: ['executeQuery', 'insert', 'update', 'delete'], default: 'executeQuery' },
      query: { type: 'code', required: true },
      parameters: { type: 'keyValue', default: [] }
    }
  },
  'mongodb': {
    name: 'MongoDB',
    category: NODE_CATEGORIES.DATABASES,
    color: '#47a248',
    icon: '🍃',
    description: 'Interact with MongoDB',
    inputs: 1,
    outputs: 1,
    properties: {
      operation: { type: 'select', options: ['find', 'insert', 'update', 'delete', 'aggregate'], default: 'find' },
      collection: { type: 'string', required: true },
      query: { type: 'json', default: '{}' },
      projection: { type: 'json', default: '{}' },
      sort: { type: 'json', default: '{}' },
      limit: { type: 'number', default: 100 }
    }
  },
  'redis': {
    name: 'Redis',
    category: NODE_CATEGORIES.DATABASES,
    color: '#dc382d',
    icon: '🔴',
    description: 'Interact with Redis',
    inputs: 1,
    outputs: 1,
    properties: {
      operation: { type: 'select', options: ['get', 'set', 'delete', 'incr', 'decr', 'exists', 'expire'], default: 'get' },
      key: { type: 'string', required: true },
      value: { type: 'string' },
      ttl: { type: 'number' }
    }
  },

  // Continue with more integrations...
  // This is just a sample - I'll add ALL 500+ integrations
};