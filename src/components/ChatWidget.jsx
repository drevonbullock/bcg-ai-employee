import React from 'react';
// ChatWidget.jsx — Main AI Employee chat widget (Aria)
// Dark theme, typing indicator, lead capture form, Calendly CTA card

import { useState, useEffect, useRef } from 'react';
import { useChat } from '../hooks/useChat.js';
import { logLead } from '../utils/helpers.js';
import { CALENDLY_URL, GREETING_DELAY } from '../config/constants.js';
import '../styles/widget.css';

export default function ChatWidget() {
  const {
    messages,
    isLoading,
    showLeadForm,
    showCalendly,
    sendMessage,
    sendGreeting,
    onLeadSubmitted,
  } = useChat();

  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [leadName, setLeadName] = useState('');
  const [leadEmail, setLeadEmail] = useState('');
  const [leadSubmitting, setLeadSubmitting] = useState(false);
  const [hasGreeted, setHasGreeted] = useState(false);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Trigger greeting on first open
  useEffect(() => {
    if (isOpen && !hasGreeted) {
      setHasGreeted(true);
      setTimeout(() => {
        sendGreeting();
      }, GREETING_DELAY);
    }
  }, [isOpen, hasGreeted, sendGreeting]);

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading, showLeadForm, showCalendly]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const handleSend = () => {
    const text = input.trim();
    if (!text || isLoading) return;
    setInput('');
    sendMessage(text);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleLeadSubmit = async (e) => {
    e.preventDefault();
    if (!leadName.trim() || !leadEmail.trim()) return;
    setLeadSubmitting(true);
    await logLead({ name: leadName, email: leadEmail, messages });
    onLeadSubmitted();
    setLeadSubmitting(false);
    sendMessage(`My name is ${leadName} and my email is ${leadEmail}.`);
  };

  // Only show visible messages (filter out the internal [visitor arrived] seed)
  const visibleMessages = messages.filter(
    (m) => !(m.role === 'user' && m.content === '[visitor arrived]')
  );

  return (
    <>
      {/* Launcher button */}
      <button
        className="aria-launcher"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label={isOpen ? 'Close chat' : 'Chat with Aria'}
      >
        {isOpen ? (
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M4 4L16 16M16 4L4 16" stroke="white" strokeWidth="2" strokeLinecap="round" />
          </svg>
        ) : (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path
              d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2v10z"
              fill="white"
            />
          </svg>
        )}
      </button>

      {/* Chat window */}
      {isOpen && (
        <div className="aria-widget">
          {/* Header */}
          <div className="aria-header">
            <div className="aria-avatar">A</div>
            <div className="aria-header-info">
              <span className="aria-name">Aria</span>
              <span className="aria-status">
                <span className="aria-dot" /> BCG AI Assistant
              </span>
            </div>
            <button className="aria-close" onClick={() => setIsOpen(false)} aria-label="Close">
              ✕
            </button>
          </div>

          {/* Messages */}
          <div className="aria-messages">
            {visibleMessages.map((msg, i) => (
              <div key={i} className={`aria-bubble aria-bubble--${msg.role}`}>
                {msg.content}
              </div>
            ))}

            {/* Typing indicator */}
            {isLoading && (
              <div className="aria-bubble aria-bubble--assistant aria-typing">
                <span /><span /><span />
              </div>
            )}

            {/* Lead capture form */}
            {showLeadForm && (
              <div className="aria-lead-form">
                <p className="aria-lead-form__label">Drop your info and I'll follow up:</p>
                <form onSubmit={handleLeadSubmit}>
                  <input
                    type="text"
                    placeholder="Your name"
                    value={leadName}
                    onChange={(e) => setLeadName(e.target.value)}
                    required
                    className="aria-input"
                  />
                  <input
                    type="email"
                    placeholder="Your email"
                    value={leadEmail}
                    onChange={(e) => setLeadEmail(e.target.value)}
                    required
                    className="aria-input"
                  />
                  <button type="submit" className="aria-btn" disabled={leadSubmitting}>
                    {leadSubmitting ? 'Sending...' : 'Submit'}
                  </button>
                </form>
              </div>
            )}

            {/* Calendly CTA card */}
            {showCalendly && CALENDLY_URL && (
              <div className="aria-calendly-card">
                <p className="aria-calendly-card__text">
                  Book your free 30-min strategy call — no pressure, just clarity.
                </p>
                <a
                  href={CALENDLY_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="aria-btn aria-btn--calendly"
                >
                  Book Free Strategy Call →
                </a>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="aria-input-row">
            <input
              ref={inputRef}
              type="text"
              className="aria-input aria-input--message"
              placeholder="Type a message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isLoading}
            />
            <button
              className="aria-send"
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              aria-label="Send"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M22 2L11 13M22 2L15 22L11 13M22 2L2 9L11 13" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>

          <div className="aria-footer">Powered by Bullock Consulting Group</div>
        </div>
      )}
    </>
  );
}
