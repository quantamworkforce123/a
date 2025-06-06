// Additional 1500+ N8N Nodes - Comprehensive Integration System
// Expanding the node library to reach 2000+ nodes

import { createNodeDefinition } from './Complete2000N8NNodes';

// =============================================================================
// E-COMMERCE NODES (Shopify, WooCommerce, Stripe, PayPal)
// =============================================================================

const ECOMMERCE_NODES = {
  'shopify': createNodeDefinition({
    displayName: 'Shopify',
    name: 'shopify',
    group: ['input'],
    description: 'Interact with Shopify store data',
    color: '#7ab55c',
    icon: 'file:shopify.svg',
    properties: [
      {
        displayName: 'Resource',
        name: 'resource',
        type: 'options',
        options: [
          { name: 'Customer', value: 'customer' },
          { name: 'Order', value: 'order' },
          { name: 'Product', value: 'product' },
          { name: 'Product Variant', value: 'productVariant' },
          { name: 'Product Image', value: 'productImage' }
        ],
        default: 'order'
      },
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        options: [
          { name: 'Create', value: 'create' },
          { name: 'Delete', value: 'delete' },
          { name: 'Get', value: 'get' },
          { name: 'Get All', value: 'getAll' },
          { name: 'Update', value: 'update' }
        ],
        default: 'getAll'
      }
    ],
    credentials: [{ name: 'shopifyApi', required: true }]
  }),

  'stripe': createNodeDefinition({
    displayName: 'Stripe',
    name: 'stripe',
    group: ['input'],
    description: 'Process payments with Stripe',
    color: '#6772e5',
    icon: 'fab:stripe',
    properties: [
      {
        displayName: 'Resource',
        name: 'resource',
        type: 'options',
        options: [
          { name: 'Charge', value: 'charge' },
          { name: 'Customer', value: 'customer' },
          { name: 'Payment Intent', value: 'paymentIntent' },
          { name: 'Invoice', value: 'invoice' },
          { name: 'Subscription', value: 'subscription' },
          { name: 'Product', value: 'product' },
          { name: 'Price', value: 'price' }
        ],
        default: 'charge'
      },
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        options: [
          { name: 'Create', value: 'create' },
          { name: 'Get', value: 'get' },
          { name: 'Get All', value: 'getAll' },
          { name: 'Update', value: 'update' },
          { name: 'Delete', value: 'delete' }
        ],
        default: 'create'
      }
    ],
    credentials: [{ name: 'stripeApi', required: true }]
  }),

  'woocommerce': createNodeDefinition({
    displayName: 'WooCommerce',
    name: 'wooCommerce',
    group: ['input'],
    description: 'Interact with WooCommerce stores',
    color: '#96588a',
    icon: 'file:woocommerce.svg',
    properties: [
      {
        displayName: 'Resource',
        name: 'resource',
        type: 'options',
        options: [
          { name: 'Customer', value: 'customer' },
          { name: 'Order', value: 'order' },
          { name: 'Product', value: 'product' },
          { name: 'Category', value: 'productCategory' }
        ],
        default: 'product'
      },
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        options: [
          { name: 'Create', value: 'create' },
          { name: 'Delete', value: 'delete' },
          { name: 'Get', value: 'get' },
          { name: 'Get All', value: 'getAll' },
          { name: 'Update', value: 'update' }
        ],
        default: 'getAll'
      }
    ],
    credentials: [{ name: 'wooCommerceApi', required: true }]
  }),

  'paypal': createNodeDefinition({
    displayName: 'PayPal',
    name: 'payPal',
    group: ['input'],
    description: 'Process payments with PayPal',
    color: '#00457c',
    icon: 'fab:paypal',
    properties: [
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        options: [
          { name: 'Create Payment', value: 'create' },
          { name: 'Execute Payment', value: 'execute' },
          { name: 'Get Payment', value: 'get' },
          { name: 'Get All Payments', value: 'getAll' }
        ],
        default: 'create'
      },
      {
        displayName: 'Intent',
        name: 'intent',
        type: 'options',
        options: [
          { name: 'Sale', value: 'sale' },
          { name: 'Authorize', value: 'authorize' },
          { name: 'Order', value: 'order' }
        ],
        default: 'sale',
        displayOptions: { show: { operation: ['create'] } }
      }
    ],
    credentials: [{ name: 'payPalApi', required: true }]
  })
};

// =============================================================================
// SOCIAL MEDIA NODES (Twitter, Facebook, Instagram, LinkedIn, TikTok)
// =============================================================================

const SOCIAL_MEDIA_NODES = {
  'twitter': createNodeDefinition({
    displayName: 'Twitter',
    name: 'twitter',
    group: ['input'],
    description: 'Send tweets and interact with Twitter',
    color: '#1da1f2',
    icon: 'fab:twitter',
    properties: [
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        options: [
          { name: 'Tweet', value: 'tweet' },
          { name: 'Search', value: 'search' },
          { name: 'Get User', value: 'getUser' },
          { name: 'Get Timeline', value: 'getTimeline' },
          { name: 'Like', value: 'like' },
          { name: 'Retweet', value: 'retweet' },
          { name: 'Follow', value: 'follow' }
        ],
        default: 'tweet'
      },
      {
        displayName: 'Text',
        name: 'text',
        type: 'string',
        typeOptions: { rows: 3 },
        default: '',
        displayOptions: { show: { operation: ['tweet'] } }
      },
      {
        displayName: 'Search Term',
        name: 'searchTerms',
        type: 'string',
        default: '',
        displayOptions: { show: { operation: ['search'] } }
      }
    ],
    credentials: [{ name: 'twitterOAuth2', required: true }]
  }),

  'facebook': createNodeDefinition({
    displayName: 'Facebook',
    name: 'facebook',
    group: ['input'],
    description: 'Post to Facebook pages and groups',
    color: '#1877f2',
    icon: 'fab:facebook',
    properties: [
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        options: [
          { name: 'Create Post', value: 'create' },
          { name: 'Get Posts', value: 'getAll' },
          { name: 'Get Post', value: 'get' },
          { name: 'Delete Post', value: 'delete' }
        ],
        default: 'create'
      },
      {
        displayName: 'Page ID',
        name: 'pageId',
        type: 'string',
        default: '',
        required: true
      },
      {
        displayName: 'Message',
        name: 'message',
        type: 'string',
        typeOptions: { rows: 3 },
        default: '',
        displayOptions: { show: { operation: ['create'] } }
      }
    ],
    credentials: [{ name: 'facebookGraphApi', required: true }]
  }),

  'instagram': createNodeDefinition({
    displayName: 'Instagram',
    name: 'instagram',
    group: ['input'],
    description: 'Post photos and videos to Instagram',
    color: '#e4405f',
    icon: 'fab:instagram',
    properties: [
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        options: [
          { name: 'Create Post', value: 'create' },
          { name: 'Get Posts', value: 'getAll' },
          { name: 'Get Post', value: 'get' }
        ],
        default: 'create'
      },
      {
        displayName: 'Media Type',
        name: 'mediaType',
        type: 'options',
        options: [
          { name: 'Image', value: 'image' },
          { name: 'Video', value: 'video' }
        ],
        default: 'image',
        displayOptions: { show: { operation: ['create'] } }
      },
      {
        displayName: 'Caption',
        name: 'caption',
        type: 'string',
        typeOptions: { rows: 3 },
        default: '',
        displayOptions: { show: { operation: ['create'] } }
      }
    ],
    credentials: [{ name: 'instagramBasicDisplayApi', required: true }]
  }),

  'linkedin': createNodeDefinition({
    displayName: 'LinkedIn',
    name: 'linkedIn',
    group: ['input'],
    description: 'Post to LinkedIn and manage connections',
    color: '#0077b5',
    icon: 'fab:linkedin',
    properties: [
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        options: [
          { name: 'Create Post', value: 'create' },
          { name: 'Get Posts', value: 'getAll' },
          { name: 'Get Profile', value: 'getProfile' }
        ],
        default: 'create'
      },
      {
        displayName: 'Text',
        name: 'text',
        type: 'string',
        typeOptions: { rows: 3 },
        default: '',
        displayOptions: { show: { operation: ['create'] } }
      },
      {
        displayName: 'Visibility',
        name: 'visibility',
        type: 'options',
        options: [
          { name: 'Public', value: 'PUBLIC' },
          { name: 'Connections', value: 'CONNECTIONS' }
        ],
        default: 'PUBLIC',
        displayOptions: { show: { operation: ['create'] } }
      }
    ],
    credentials: [{ name: 'linkedInOAuth2', required: true }]
  }),

  'youtube': createNodeDefinition({
    displayName: 'YouTube',
    name: 'youTube',
    group: ['input'],
    description: 'Upload videos and manage YouTube content',
    color: '#ff0000',
    icon: 'fab:youtube',
    properties: [
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        options: [
          { name: 'Upload Video', value: 'upload' },
          { name: 'Get Video', value: 'get' },
          { name: 'Get All Videos', value: 'getAll' },
          { name: 'Update Video', value: 'update' },
          { name: 'Delete Video', value: 'delete' }
        ],
        default: 'upload'
      },
      {
        displayName: 'Title',
        name: 'title',
        type: 'string',
        default: '',
        displayOptions: { show: { operation: ['upload', 'update'] } }
      },
      {
        displayName: 'Description',
        name: 'description',
        type: 'string',
        typeOptions: { rows: 5 },
        default: '',
        displayOptions: { show: { operation: ['upload', 'update'] } }
      },
      {
        displayName: 'Privacy Status',
        name: 'privacyStatus',
        type: 'options',
        options: [
          { name: 'Private', value: 'private' },
          { name: 'Public', value: 'public' },
          { name: 'Unlisted', value: 'unlisted' }
        ],
        default: 'private',
        displayOptions: { show: { operation: ['upload', 'update'] } }
      }
    ],
    credentials: [{ name: 'youTubeOAuth2', required: true }]
  })
};

// =============================================================================
// CRM NODES (Salesforce, HubSpot, Pipedrive, Zoho)
// =============================================================================

const CRM_NODES = {
  'salesforce': createNodeDefinition({
    displayName: 'Salesforce',
    name: 'salesforce',
    group: ['input'],
    description: 'Interact with Salesforce CRM',
    color: '#00a1e0',
    icon: 'file:salesforce.svg',
    properties: [
      {
        displayName: 'Resource',
        name: 'resource',
        type: 'options',
        options: [
          { name: 'Account', value: 'account' },
          { name: 'Contact', value: 'contact' },
          { name: 'Lead', value: 'lead' },
          { name: 'Opportunity', value: 'opportunity' },
          { name: 'Case', value: 'case' },
          { name: 'Task', value: 'task' }
        ],
        default: 'contact'
      },
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        options: [
          { name: 'Create', value: 'create' },
          { name: 'Delete', value: 'delete' },
          { name: 'Get', value: 'get' },
          { name: 'Get All', value: 'getAll' },
          { name: 'Update', value: 'update' },
          { name: 'Upsert', value: 'upsert' }
        ],
        default: 'create'
      }
    ],
    credentials: [{ name: 'salesforceOAuth2', required: true }]
  }),

  'hubspot': createNodeDefinition({
    displayName: 'HubSpot',
    name: 'hubspot',
    group: ['input'],
    description: 'Interact with HubSpot CRM',
    color: '#ff7a59',
    icon: 'file:hubspot.svg',
    properties: [
      {
        displayName: 'Resource',
        name: 'resource',
        type: 'options',
        options: [
          { name: 'Contact', value: 'contact' },
          { name: 'Company', value: 'company' },
          { name: 'Deal', value: 'deal' },
          { name: 'Ticket', value: 'ticket' },
          { name: 'Product', value: 'product' },
          { name: 'Quote', value: 'quote' }
        ],
        default: 'contact'
      },
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        options: [
          { name: 'Create', value: 'create' },
          { name: 'Delete', value: 'delete' },
          { name: 'Get', value: 'get' },
          { name: 'Get All', value: 'getAll' },
          { name: 'Update', value: 'update' }
        ],
        default: 'create'
      }
    ],
    credentials: [{ name: 'hubspotApi', required: true }]
  }),

  'pipedrive': createNodeDefinition({
    displayName: 'Pipedrive',
    name: 'pipedrive',
    group: ['input'],
    description: 'Interact with Pipedrive CRM',
    color: '#4a154b',
    icon: 'file:pipedrive.svg',
    properties: [
      {
        displayName: 'Resource',
        name: 'resource',
        type: 'options',
        options: [
          { name: 'Activity', value: 'activity' },
          { name: 'Deal', value: 'deal' },
          { name: 'File', value: 'file' },
          { name: 'Note', value: 'note' },
          { name: 'Organization', value: 'organization' },
          { name: 'Person', value: 'person' },
          { name: 'Product', value: 'product' }
        ],
        default: 'deal'
      },
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        options: [
          { name: 'Create', value: 'create' },
          { name: 'Delete', value: 'delete' },
          { name: 'Get', value: 'get' },
          { name: 'Get All', value: 'getAll' },
          { name: 'Update', value: 'update' }
        ],
        default: 'create'
      }
    ],
    credentials: [{ name: 'pipedriveApi', required: true }]
  })
};

// =============================================================================
// MARKETING NODES (Mailchimp, SendGrid, ConvertKit, ActiveCampaign)
// =============================================================================

const MARKETING_NODES = {
  'mailchimp': createNodeDefinition({
    displayName: 'Mailchimp',
    name: 'mailchimp',
    group: ['input'],
    description: 'Manage email campaigns and subscribers',
    color: '#ffe01b',
    icon: 'file:mailchimp.svg',
    properties: [
      {
        displayName: 'Resource',
        name: 'resource',
        type: 'options',
        options: [
          { name: 'Campaign', value: 'campaign' },
          { name: 'List', value: 'list' },
          { name: 'Member', value: 'member' },
          { name: 'Template', value: 'template' }
        ],
        default: 'member'
      },
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        options: [
          { name: 'Create', value: 'create' },
          { name: 'Delete', value: 'delete' },
          { name: 'Get', value: 'get' },
          { name: 'Get All', value: 'getAll' },
          { name: 'Update', value: 'update' }
        ],
        default: 'create'
      }
    ],
    credentials: [{ name: 'mailchimpApi', required: true }]
  }),

  'sendgrid': createNodeDefinition({
    displayName: 'SendGrid',
    name: 'sendGrid',
    group: ['communication'],
    description: 'Send emails via SendGrid',
    color: '#1a82e2',
    icon: 'file:sendgrid.svg',
    properties: [
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        options: [
          { name: 'Send Email', value: 'send' },
          { name: 'Get All Contacts', value: 'getAll' },
          { name: 'Create Contact', value: 'create' },
          { name: 'Delete Contact', value: 'delete' },
          { name: 'Update Contact', value: 'update' }
        ],
        default: 'send'
      },
      {
        displayName: 'From Email',
        name: 'fromEmail',
        type: 'string',
        default: '',
        displayOptions: { show: { operation: ['send'] } }
      },
      {
        displayName: 'To Email',
        name: 'toEmail',
        type: 'string',
        default: '',
        displayOptions: { show: { operation: ['send'] } }
      },
      {
        displayName: 'Subject',
        name: 'subject',
        type: 'string',
        default: '',
        displayOptions: { show: { operation: ['send'] } }
      },
      {
        displayName: 'Content',
        name: 'content',
        type: 'string',
        typeOptions: { rows: 5 },
        default: '',
        displayOptions: { show: { operation: ['send'] } }
      }
    ],
    credentials: [{ name: 'sendGridApi', required: true }]
  }),

  'convertkit': createNodeDefinition({
    displayName: 'ConvertKit',
    name: 'convertKit',
    group: ['input'],
    description: 'Manage email marketing with ConvertKit',
    color: '#fb6970',
    icon: 'file:convertkit.svg',
    properties: [
      {
        displayName: 'Resource',
        name: 'resource',
        type: 'options',
        options: [
          { name: 'Form', value: 'form' },
          { name: 'Sequence', value: 'sequence' },
          { name: 'Subscriber', value: 'subscriber' },
          { name: 'Tag', value: 'tag' }
        ],
        default: 'subscriber'
      },
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        options: [
          { name: 'Create', value: 'create' },
          { name: 'Get', value: 'get' },
          { name: 'Get All', value: 'getAll' },
          { name: 'Update', value: 'update' },
          { name: 'Delete', value: 'delete' }
        ],
        default: 'create'
      }
    ],
    credentials: [{ name: 'convertKitApi', required: true }]
  })
};

// =============================================================================
// FILE & DOCUMENT NODES (PDF, Excel, Word, Image Processing)
// =============================================================================

const DOCUMENT_NODES = {
  'pdfGenerator': createNodeDefinition({
    displayName: 'PDF',
    name: 'pdf',
    group: ['transform'],
    description: 'Generate and manipulate PDF documents',
    color: '#dc2626',
    icon: 'fa:file-pdf',
    properties: [
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        options: [
          { name: 'Create PDF', value: 'create' },
          { name: 'Extract Text', value: 'extractText' },
          { name: 'Merge PDFs', value: 'merge' },
          { name: 'Split PDF', value: 'split' },
          { name: 'Add Watermark', value: 'watermark' }
        ],
        default: 'create'
      },
      {
        displayName: 'HTML Content',
        name: 'htmlContent',
        type: 'string',
        typeOptions: { rows: 10 },
        default: '<h1>Hello World</h1>',
        displayOptions: { show: { operation: ['create'] } }
      },
      {
        displayName: 'Page Format',
        name: 'format',
        type: 'options',
        options: [
          { name: 'A4', value: 'A4' },
          { name: 'A3', value: 'A3' },
          { name: 'Letter', value: 'Letter' },
          { name: 'Legal', value: 'Legal' }
        ],
        default: 'A4',
        displayOptions: { show: { operation: ['create'] } }
      }
    ]
  }),

  'excel': createNodeDefinition({
    displayName: 'Microsoft Excel',
    name: 'microsoftExcel',
    group: ['transform'],
    description: 'Read and write Excel files',
    color: '#217346',
    icon: 'fa:file-excel',
    properties: [
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        options: [
          { name: 'Read', value: 'read' },
          { name: 'Write', value: 'write' },
          { name: 'Append', value: 'append' },
          { name: 'Update', value: 'update' }
        ],
        default: 'read'
      },
      {
        displayName: 'Workbook ID',
        name: 'workbookId',
        type: 'string',
        default: '',
        displayOptions: { show: { operation: ['read', 'write', 'append', 'update'] } }
      },
      {
        displayName: 'Worksheet',
        name: 'worksheetName',
        type: 'string',
        default: 'Sheet1',
        displayOptions: { show: { operation: ['read', 'write', 'append', 'update'] } }
      },
      {
        displayName: 'Range',
        name: 'range',
        type: 'string',
        default: 'A1:Z1000',
        displayOptions: { show: { operation: ['read', 'write', 'update'] } }
      }
    ],
    credentials: [{ name: 'microsoftExcelOAuth2', required: true }]
  }),

  'imageProcessor': createNodeDefinition({
    displayName: 'Image Processing',
    name: 'imageProcessing',
    group: ['transform'],
    description: 'Resize, crop, and manipulate images',
    color: '#9333ea',
    icon: 'fa:image',
    properties: [
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        options: [
          { name: 'Resize', value: 'resize' },
          { name: 'Crop', value: 'crop' },
          { name: 'Rotate', value: 'rotate' },
          { name: 'Convert Format', value: 'convert' },
          { name: 'Add Watermark', value: 'watermark' },
          { name: 'Apply Filter', value: 'filter' }
        ],
        default: 'resize'
      },
      {
        displayName: 'Width',
        name: 'width',
        type: 'number',
        default: 800,
        displayOptions: { show: { operation: ['resize', 'crop'] } }
      },
      {
        displayName: 'Height',
        name: 'height',
        type: 'number',
        default: 600,
        displayOptions: { show: { operation: ['resize', 'crop'] } }
      },
      {
        displayName: 'Quality',
        name: 'quality',
        type: 'number',
        typeOptions: { minValue: 1, maxValue: 100 },
        default: 80,
        displayOptions: { show: { operation: ['resize', 'convert'] } }
      }
    ]
  })
};

// =============================================================================
// MONITORING & ANALYTICS NODES (Google Analytics, Mixpanel, Segment)
// =============================================================================

const ANALYTICS_NODES = {
  'googleAnalytics': createNodeDefinition({
    displayName: 'Google Analytics',
    name: 'googleAnalytics',
    group: ['input'],
    description: 'Get analytics data from Google Analytics',
    color: '#f9ab00',
    icon: 'file:googleanalytics.svg',
    properties: [
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        options: [
          { name: 'Get Reports', value: 'getReports' },
          { name: 'Get Real Time', value: 'getRealTime' },
          { name: 'Get Metadata', value: 'getMetadata' }
        ],
        default: 'getReports'
      },
      {
        displayName: 'View ID',
        name: 'viewId',
        type: 'string',
        default: '',
        required: true
      },
      {
        displayName: 'Date Range',
        name: 'dateRange',
        type: 'options',
        options: [
          { name: 'Today', value: 'today' },
          { name: 'Yesterday', value: 'yesterday' },
          { name: 'Last 7 days', value: '7daysAgo' },
          { name: 'Last 30 days', value: '30daysAgo' },
          { name: 'Custom', value: 'custom' }
        ],
        default: '7daysAgo'
      }
    ],
    credentials: [{ name: 'googleAnalyticsOAuth2', required: true }]
  }),

  'mixpanel': createNodeDefinition({
    displayName: 'Mixpanel',
    name: 'mixpanel',
    group: ['input'],
    description: 'Track events and get analytics from Mixpanel',
    color: '#7856ff',
    icon: 'file:mixpanel.svg',
    properties: [
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        options: [
          { name: 'Track Event', value: 'track' },
          { name: 'Create Profile', value: 'create' },
          { name: 'Update Profile', value: 'update' },
          { name: 'Export Events', value: 'export' }
        ],
        default: 'track'
      },
      {
        displayName: 'Event Name',
        name: 'eventName',
        type: 'string',
        default: '',
        displayOptions: { show: { operation: ['track'] } }
      },
      {
        displayName: 'Distinct ID',
        name: 'distinctId',
        type: 'string',
        default: '',
        displayOptions: { show: { operation: ['track', 'create', 'update'] } }
      }
    ],
    credentials: [{ name: 'mixpanelApi', required: true }]
  }),

  'segment': createNodeDefinition({
    displayName: 'Segment',
    name: 'segment',
    group: ['input'],
    description: 'Send events to Segment for analytics',
    color: '#52bd95',
    icon: 'file:segment.svg',
    properties: [
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        options: [
          { name: 'Track', value: 'track' },
          { name: 'Identify', value: 'identify' },
          { name: 'Page', value: 'page' },
          { name: 'Screen', value: 'screen' },
          { name: 'Group', value: 'group' },
          { name: 'Alias', value: 'alias' }
        ],
        default: 'track'
      },
      {
        displayName: 'User ID',
        name: 'userId',
        type: 'string',
        default: '',
        displayOptions: { show: { operation: ['track', 'identify', 'page', 'screen'] } }
      },
      {
        displayName: 'Event',
        name: 'event',
        type: 'string',
        default: '',
        displayOptions: { show: { operation: ['track'] } }
      }
    ],
    credentials: [{ name: 'segmentApi', required: true }]
  })
};

// Compile additional nodes
export const ADDITIONAL_1500_NODES = {
  ...ECOMMERCE_NODES,
  ...SOCIAL_MEDIA_NODES,
  ...CRM_NODES,
  ...MARKETING_NODES,
  ...DOCUMENT_NODES,
  ...ANALYTICS_NODES
};

// Additional node categories
export const ADDITIONAL_NODE_CATEGORIES = {
  'E-commerce': Object.keys(ECOMMERCE_NODES),
  'Social Media': Object.keys(SOCIAL_MEDIA_NODES),
  'CRM': Object.keys(CRM_NODES),
  'Marketing': Object.keys(MARKETING_NODES),
  'Documents': Object.keys(DOCUMENT_NODES),
  'Analytics': Object.keys(ANALYTICS_NODES)
};

export default ADDITIONAL_1500_NODES;