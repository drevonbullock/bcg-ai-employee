// useChat.js — Claude API call logic and conversation state

import { useState, useCallback } from 'react';
import { MODEL, MAX_TOKENS, API_URL } from '../config/constants.js';
import { systemPrompt } from '../prompts/systemPrompt.js';
import { hasCollectLeadTag, hasShowCalendlyTag, stripTags } from '../utils/helpers.js';

export function useChat() {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showLeadForm, setShowLeadForm] = useState(false);
  const [showCalendly, setShowCalendly] = useState(false);
  const [leadCaptured, setLeadCaptured] = useState(false);

  const sendMessage = useCallback(async (userText) => {
    const userMessage = { role: 'user', content: userText };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setIsLoading(true);

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: MODEL,
          max_tokens: MAX_TOKENS,
          system: systemPrompt,
          messages: updatedMessages,
        }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      const rawText = data.content[0].text;

      // Parse control tags before storing/rendering
      if (hasCollectLeadTag(rawText) && !leadCaptured) {
        setShowLeadForm(true);
      }
      if (hasShowCalendlyTag(rawText)) {
        setShowCalendly(true);
      }

      const assistantMessage = {
        role: 'assistant',
        content: stripTags(rawText),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      console.error('Claude API error:', err);
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content:
            "I'm having a little trouble connecting right now. Feel free to reach out directly at bulllockconsultinggroup.com or try again in a moment!",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }, [messages, leadCaptured]);

  const sendGreeting = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: MODEL,
          max_tokens: MAX_TOKENS,
          system: systemPrompt,
          messages: [
            {
              role: 'user',
              content:
                'Start the conversation — greet the visitor and ask your first qualifying question.',
            },
          ],
        }),
      });

      if (!response.ok) throw new Error(`API error: ${response.status}`);

      const data = await response.json();
      const rawText = data.content[0].text;

      setMessages([
        { role: 'user', content: '[visitor arrived]' },
        { role: 'assistant', content: stripTags(rawText) },
      ]);
    } catch (err) {
      console.error('Greeting error:', err);
      setMessages([
        {
          role: 'assistant',
          content:
            "Hey there! I'm Aria, BCG's AI assistant. What brings you to the site today — are you looking to automate something specific in your business?",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const onLeadSubmitted = useCallback(() => {
    setLeadCaptured(true);
    setShowLeadForm(false);
    setShowCalendly(true);
  }, []);

  return {
    messages,
    isLoading,
    showLeadForm,
    showCalendly,
    leadCaptured,
    sendMessage,
    sendGreeting,
    onLeadSubmitted,
  };
}
