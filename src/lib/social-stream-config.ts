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
