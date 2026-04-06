/**
 * Social Stream Ninja Configuration
 * Real-time multi-channel communication platform for Keruxia AI Agent
 * 
 * Supported Channels: WhatsApp, Email, SMS, Telegram, Discord, Slack, LinkedIn, Twitter, etc.
 * WebSocket Real-time Communication for AI responses
 */

export const socialStreamConfig = {
  // Social Stream Ninja API
  baseUrl: process.env.SOCIAL_STREAM_BASE_URL || 'https://ninja.streamyard.com',
  
  // Session ID (obtained from Social Stream Settings → API)
  sessionId: process.env.SOCIAL_STREAM_SESSION_ID || '',
  
  // API Timeout
  timeout: 30000,
  
  // WebSocket Configuration
  websocket: {
    reconnectInterval: 5000,
    maxReconnectAttempts: 5,
    messageBufferSize: 100,
  },

  // Keruxia Agent Configuration
  agent: {
    name: 'Keruxia AI Assistant',
    avatar: 'https://keruxia.com/logo.png',
    description: 'Marketing Automation & AI Agent',
    language: 'es', // Default: Spanish
    responseTimeout: 10000,
  },

  // Features to enable
  features: {
    whatsapp: true,
    email: true,
    sms: true,
    telegram: true,
    discord: true,
    slack: true,
    linkedin: true,
    twitter: true,
    instagram: true,
    tiktok: true,
    // Meta ecosystem (Andromeda AI recommendation layer)
    threads: true,          // Threads by Meta — microblogging (Andromeda ecosystem)
    facebook: true,
    messenger: true,
  },

  // Mixpost integration (self-hosted, MIT — github.com/inovector/mixpost)
  mixpost: {
    // Set MIXPOST_BASE_URL and MIXPOST_API_TOKEN in .env.local to enable
    baseUrl: process.env.MIXPOST_BASE_URL || '',
    apiToken: process.env.MIXPOST_API_TOKEN || '',
    enabled: !!(process.env.MIXPOST_BASE_URL && process.env.MIXPOST_API_TOKEN),
    // When disabled, posts are exported as JSON for manual import
  },

  // Meta Threads / Andromeda configuration
  // Andromeda is Meta's AI-powered content recommendation engine used across
  // Instagram, Facebook, Threads and future Meta surfaces.
  metaAndromeda: {
    threadsApiVersion: 'v1.0',
    // Threads API endpoint (Meta Graph API)
    threadsEndpoint: 'https://graph.threads.net/v1.0',
    appId: process.env.META_APP_ID || '',
    appSecret: process.env.META_APP_SECRET || '',
    // Andromeda-optimised content hints
    // (short-form, conversational, high-reply-rate topics)
    contentHints: {
      maxLength: 500,
      preferredFormats: ['text', 'image', 'video'],
      engagementTriggers: ['question', 'poll', 'hot_take'],
    },
  },

  // Message handling
  messages: {
    defaultResponse: 'Estoy procesando tu solicitud. Un momento por favor...',
    errorResponse: 'Disculpa, hubo un error. Intenta de nuevo.',
    typingIndicator: true,
    readReceipts: true,
  },

  // Database integration (Firestore)
  firestore: {
    enabled: true,
    collections: {
      conversations: 'social_stream_conversations',
      messages: 'social_stream_messages',
      agents: 'social_stream_agents',
      triggers: 'social_stream_triggers',
    },
  },

  // Analytics
  analytics: {
    enabled: true,
    trackMessageMetrics: true,
    trackResponseTime: true,
    trackConversationFlow: true,
  },

  // Rate limiting
  rateLimit: {
    enabled: true,
    messagesPerMinute: 30,
    requestsPerSecond: 10,
  },
};

/**
 * Validate configuration
 */
export function validateSocialStreamConfig(): boolean {
  if (!process.env.SOCIAL_STREAM_SESSION_ID) {
    console.error('❌ SOCIAL_STREAM_SESSION_ID not configured. Add to .env.local');
    return false;
  }
  return true;
}

/**
 * Get API Headers
 */
export function getSocialStreamHeaders(): Record<string, string> {
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${socialStreamConfig.sessionId}`,
    'User-Agent': 'Keruxia-AI-Agent/1.0',
  };
}
