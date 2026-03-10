// constants.js — environment variables and app config

export const ANTHROPIC_API_KEY = import.meta.env.VITE_ANTHROPIC_API_KEY;
export const API_URL = import.meta.env.DEV ? 'http://localhost:3001/api/chat' : '/api/chat';
export const MAKE_WEBHOOK_URL = import.meta.env.VITE_MAKE_WEBHOOK_URL;
export const CALENDLY_URL = import.meta.env.VITE_CALENDLY_URL;

export const MODEL = 'claude-sonnet-4-6';
export const MAX_TOKENS = 1024;

// Delay before Aria sends the first greeting (ms)
export const GREETING_DELAY = 800;

// Control tags Aria embeds in responses
export const TAG_COLLECT_LEAD = '<collect_lead>';
export const TAG_SHOW_CALENDLY = '<show_calendly>';
