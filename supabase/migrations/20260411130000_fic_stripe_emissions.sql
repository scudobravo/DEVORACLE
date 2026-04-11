-- Idempotenza emissioni Fatture in Cloud da webhook Stripe (evita duplicati su retry).
create table if not exists public.fic_stripe_emissions (
  id uuid primary key default gen_random_uuid(),
  stripe_event_id text not null unique,
  source text not null,
  stripe_ref text not null,
  fic_document_id bigint,
  created_at timestamptz not null default now()
);

comment on table public.fic_stripe_emissions is 'Traccia eventi Stripe già usati per creare documenti in Fatture in Cloud';

alter table public.fic_stripe_emissions enable row level security;

-- Nessun accesso anon/authenticated: solo service role (usato dal webhook server-side).
