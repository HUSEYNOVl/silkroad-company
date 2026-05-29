create extension if not exists pgcrypto;

create table leads (
  id uuid primary key default gen_random_uuid(),
  lead_code text unique not null,
  status text,
  quality_score text,
  source text,
  locale text,
  client_name text,
  company_name text,
  email text,
  whatsapp text,
  wechat text,
  product_name text,
  product_category text,
  quantity text,
  target_price text,
  destination_country text,
  oem_required boolean,
  custom_packaging boolean,
  shipping_preference text,
  urgency text,
  budget text,
  reference_url text,
  notes text,
  conversation_summary text,
  missing_fields jsonb,
  last_ai_recommendation text,
  quality_score_reason text,
  whatsapp_link text,
  whatsapp_prefill_text text,
  whatsapp_link_generated boolean default false,
  whatsapp_cta_shown_at timestamptz,
  whatsapp_clicked boolean default false,
  whatsapp_clicked_at timestamptz,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

create table conversations (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid references leads(id) on delete set null,
  session_id uuid not null,
  locale text,
  started_at timestamptz default now() not null,
  ended_at timestamptz,
  last_message_at timestamptz,
  user_agent text,
  ip_hash text,
  referrer text,
  page_url text
);

create table messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid references conversations(id) on delete cascade,
  lead_id uuid references leads(id) on delete set null,
  role text not null,
  content text not null,
  content_type text default 'text' not null,
  transcript text,
  structured_data jsonb,
  created_at timestamptz default now() not null
);

create table uploads (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid references leads(id) on delete set null,
  conversation_id uuid references conversations(id) on delete cascade,
  message_id uuid references messages(id) on delete set null,
  file_url text not null,
  file_type text,
  file_name text,
  mime_type text,
  size_bytes bigint,
  analysis_json jsonb,
  transcript text,
  created_at timestamptz default now() not null
);

create table ai_events (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid references leads(id) on delete set null,
  conversation_id uuid references conversations(id) on delete cascade,
  event_type text not null,
  event_data jsonb,
  created_at timestamptz default now() not null
);

alter table leads enable row level security;
alter table conversations enable row level security;
alter table messages enable row level security;
alter table uploads enable row level security;
alter table ai_events enable row level security;

create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger leads_updated_at
before update on leads
for each row
execute function set_updated_at();
