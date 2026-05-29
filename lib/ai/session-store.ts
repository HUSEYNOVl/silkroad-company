import {generateLeadCode} from './lead-code';
import type {Lead} from '@/lib/supabase/types';

export type Session = {
  leadCode: string;
  lead: Partial<Lead>;
  history: {role: 'user' | 'assistant'; content: string}[];
  messageCount: number;
};

// Single shared in-memory store used by both /api/ai/chat and /api/ai/image
const sessions = new Map<string, Session>();

export function getOrCreateSession(sessionId: string): Session {
  const existing = sessions.get(sessionId);
  if (existing) return existing;
  const session: Session = {
    leadCode: generateLeadCode(),
    lead: {},
    history: [],
    messageCount: 0,
  };
  sessions.set(sessionId, session);
  return session;
}

export function appendToHistory(session: Session, role: 'user' | 'assistant', content: string) {
  session.history.push({role, content});
  if (session.history.length > 20) session.history = session.history.slice(-20);
}
