// helpers.js — tag parsing and lead logging via Make.com webhook

import { MAKE_WEBHOOK_URL, TAG_COLLECT_LEAD, TAG_SHOW_CALENDLY } from '../config/constants.js';

/**
 * Strip control tags from AI response text before rendering.
 */
export function stripTags(text) {
  return text
    .replace(TAG_COLLECT_LEAD, '')
    .replace(TAG_SHOW_CALENDLY, '')
    .trim();
}

/**
 * Check if the AI response contains the lead capture tag.
 */
export function hasCollectLeadTag(text) {
  return text.includes(TAG_COLLECT_LEAD);
}

/**
 * Check if the AI response contains the Calendly CTA tag.
 */
export function hasShowCalendlyTag(text) {
  return text.includes(TAG_SHOW_CALENDLY);
}

/**
 * Fire the Make.com webhook to log lead data to Google Sheets.
 * Schema: { name, email, timestamp, conversation_summary }
 */
export async function logLead({ name, email, messages }) {
  if (!MAKE_WEBHOOK_URL) {
    console.warn('VITE_MAKE_WEBHOOK_URL is not set — skipping lead log.');
    return;
  }

  const conversation_summary = buildSummary(messages);
  const timestamp = new Date().toISOString();

  const payload = { name, email, timestamp, conversation_summary };

  try {
    await fetch(MAKE_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  } catch (err) {
    console.error('Failed to log lead to Make.com:', err);
  }
}

/**
 * Build a conversation summary from the last ~1,000 characters of chat history.
 */
function buildSummary(messages) {
  const transcript = messages
    .map((m) => `${m.role === 'user' ? 'Visitor' : 'Aria'}: ${m.content}`)
    .join('\n');
  return transcript.slice(-1000);
}
