export type Json = string | number | boolean | null | {[key: string]: Json | undefined} | Json[];

export type Lead = {
  id: string;
  lead_code: string;
  status: string | null;
  quality_score: string | null;
  source: string | null;
  locale: string | null;
  client_name: string | null;
  company_name: string | null;
  email: string | null;
  whatsapp: string | null;
  wechat: string | null;
  product_name: string | null;
  product_category: string | null;
  quantity: string | null;
  target_price: string | null;
  destination_country: string | null;
  oem_required: boolean | null;
  custom_packaging: boolean | null;
  shipping_preference: string | null;
  urgency: string | null;
  budget: string | null;
  reference_url: string | null;
  notes: string | null;
  conversation_summary: string | null;
  missing_fields: string[] | null;
  last_ai_recommendation: string | null;
  quality_score_reason: string | null;
  whatsapp_link: string | null;
  whatsapp_prefill_text: string | null;
  whatsapp_link_generated: boolean | null;
  whatsapp_cta_shown_at: string | null;
  whatsapp_clicked: boolean | null;
  whatsapp_clicked_at: string | null;
  created_at: string;
  updated_at: string;
};

export type Conversation = {
  id: string;
  lead_id: string | null;
  session_id: string;
  locale: string | null;
  started_at: string;
  ended_at: string | null;
  last_message_at: string | null;
  user_agent: string | null;
  ip_hash: string | null;
  referrer: string | null;
  page_url: string | null;
};

export type MessageRow = {
  id: string;
  conversation_id: string | null;
  lead_id: string | null;
  role: 'user' | 'assistant' | 'system';
  content: string;
  content_type: string;
  transcript: string | null;
  structured_data: Json | null;
  created_at: string;
};

export type Database = {
  public: {
    Tables: {
      leads: {
        Row: Lead;
        Insert: Partial<Omit<Lead, 'id' | 'created_at' | 'updated_at'>> & {lead_code: string};
        Update: Partial<Omit<Lead, 'id' | 'created_at' | 'updated_at'>>;
        Relationships: [];
      };
      conversations: {
        Row: Conversation;
        Insert: Partial<Omit<Conversation, 'id' | 'started_at'>> & {session_id: string};
        Update: Partial<Omit<Conversation, 'id' | 'started_at'>>;
        Relationships: [];
      };
      messages: {
        Row: MessageRow;
        Insert: Partial<Omit<MessageRow, 'id' | 'created_at'>> & {role: MessageRow['role']; content: string};
        Update: Partial<Omit<MessageRow, 'id' | 'created_at'>>;
        Relationships: [];
      };
      uploads: {
        Row: {
          id: string;
          lead_id: string | null;
          conversation_id: string | null;
          message_id: string | null;
          file_url: string;
          file_type: string | null;
          file_name: string | null;
          mime_type: string | null;
          size_bytes: number | null;
          analysis_json: Json | null;
          transcript: string | null;
          created_at: string;
        };
        Insert: {
          lead_id?: string | null;
          conversation_id?: string | null;
          message_id?: string | null;
          file_url: string;
          file_type?: string | null;
          file_name?: string | null;
          mime_type?: string | null;
          size_bytes?: number | null;
          analysis_json?: Json | null;
          transcript?: string | null;
        };
        Update: Record<string, never>;
        Relationships: [];
      };
      ai_events: {
        Row: {
          id: string;
          lead_id: string | null;
          conversation_id: string | null;
          event_type: string;
          event_data: Json | null;
          created_at: string;
        };
        Insert: {
          lead_id?: string | null;
          conversation_id?: string | null;
          event_type: string;
          event_data?: Json | null;
        };
        Update: Record<string, never>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
