CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE accounts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  display_name TEXT NOT NULL,
  birth_date DATE NOT NULL,
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE characters (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  account_id UUID NOT NULL REFERENCES accounts(id),
  full_name TEXT NOT NULL,
  gender TEXT NOT NULL,
  height_cm INT NOT NULL,
  weight_kg INT NOT NULL,
  appearance JSONB NOT NULL DEFAULT '{}',
  voice_profile TEXT,
  level INT NOT NULL DEFAULT 1,
  experience BIGINT NOT NULL DEFAULT 0,
  reputation JSONB NOT NULL DEFAULT '{}',
  current_zone TEXT NOT NULL DEFAULT 'centro',
  position JSONB NOT NULL DEFAULT '{"x":0,"y":0,"z":0}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE character_needs (
  character_id UUID PRIMARY KEY REFERENCES characters(id) ON DELETE CASCADE,
  hunger NUMERIC(5,2) NOT NULL DEFAULT 100,
  thirst NUMERIC(5,2) NOT NULL DEFAULT 100,
  sleep NUMERIC(5,2) NOT NULL DEFAULT 100,
  energy NUMERIC(5,2) NOT NULL DEFAULT 100,
  health NUMERIC(5,2) NOT NULL DEFAULT 100,
  hygiene NUMERIC(5,2) NOT NULL DEFAULT 100,
  stress NUMERIC(5,2) NOT NULL DEFAULT 0,
  happiness NUMERIC(5,2) NOT NULL DEFAULT 50,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE jobs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  base_salary_cents BIGINT NOT NULL DEFAULT 0,
  metadata JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE character_jobs (
  character_id UUID NOT NULL REFERENCES characters(id) ON DELETE CASCADE,
  job_id UUID NOT NULL REFERENCES jobs(id),
  rank_level INT NOT NULL DEFAULT 1,
  experience BIGINT NOT NULL DEFAULT 0,
  reputation NUMERIC(8,2) NOT NULL DEFAULT 0,
  active BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (character_id, job_id)
);

CREATE TABLE wallets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  character_id UUID NOT NULL UNIQUE REFERENCES characters(id) ON DELETE CASCADE,
  balance_cents BIGINT NOT NULL DEFAULT 0,
  locked_balance_cents BIGINT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE bank_accounts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  character_id UUID NOT NULL REFERENCES characters(id) ON DELETE CASCADE,
  bank_code TEXT NOT NULL,
  branch_code TEXT NOT NULL,
  account_number TEXT NOT NULL,
  balance_cents BIGINT NOT NULL DEFAULT 0,
  credit_limit_cents BIGINT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (bank_code, branch_code, account_number)
);

CREATE TABLE ledger_entries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  source_type TEXT NOT NULL,
  source_id UUID,
  from_wallet_id UUID,
  to_wallet_id UUID,
  amount_cents BIGINT NOT NULL CHECK (amount_cents > 0),
  currency TEXT NOT NULL DEFAULT 'MNV',
  description TEXT NOT NULL,
  metadata JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE companies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_character_id UUID NOT NULL REFERENCES characters(id),
  legal_name TEXT NOT NULL,
  trade_name TEXT NOT NULL,
  company_type TEXT NOT NULL,
  license_status TEXT NOT NULL DEFAULT 'pending',
  cash_balance_cents BIGINT NOT NULL DEFAULT 0,
  reputation NUMERIC(8,2) NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE company_employees (
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  character_id UUID NOT NULL REFERENCES characters(id) ON DELETE CASCADE,
  role_name TEXT NOT NULL,
  salary_cents BIGINT NOT NULL DEFAULT 0,
  permissions JSONB NOT NULL DEFAULT '{}',
  hired_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (company_id, character_id)
);

CREATE TABLE inventory_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_type TEXT NOT NULL,
  owner_id UUID NOT NULL,
  item_code TEXT NOT NULL,
  quantity INT NOT NULL DEFAULT 1,
  metadata JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX inventory_owner_idx ON inventory_items(owner_type, owner_id);

CREATE TABLE properties (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_character_id UUID REFERENCES characters(id),
  owner_company_id UUID REFERENCES companies(id),
  property_type TEXT NOT NULL,
  district TEXT NOT NULL,
  address_label TEXT NOT NULL,
  price_cents BIGINT NOT NULL,
  rent_cents BIGINT,
  status TEXT NOT NULL DEFAULT 'available',
  interior_template TEXT NOT NULL,
  decoration JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE vehicles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_character_id UUID REFERENCES characters(id),
  owner_company_id UUID REFERENCES companies(id),
  vehicle_type TEXT NOT NULL,
  model_code TEXT NOT NULL,
  plate TEXT NOT NULL UNIQUE,
  fuel_percent NUMERIC(5,2) NOT NULL DEFAULT 100,
  condition_percent NUMERIC(5,2) NOT NULL DEFAULT 100,
  insurance_expires_at TIMESTAMPTZ,
  license_expires_at TIMESTAMPTZ,
  metadata JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE social_relationships (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  character_a_id UUID NOT NULL REFERENCES characters(id) ON DELETE CASCADE,
  character_b_id UUID NOT NULL REFERENCES characters(id) ON DELETE CASCADE,
  relationship_type TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (character_a_id, character_b_id, relationship_type)
);

CREATE TABLE organizations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  organization_type TEXT NOT NULL,
  founder_character_id UUID NOT NULL REFERENCES characters(id),
  metadata JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  actor_account_id UUID REFERENCES accounts(id),
  actor_character_id UUID REFERENCES characters(id),
  action TEXT NOT NULL,
  target_type TEXT,
  target_id UUID,
  metadata JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

INSERT INTO jobs (code, name, category, base_salary_cents) VALUES
  ('app_driver', 'Motorista de aplicativo', 'transporte', 180000),
  ('motoboy', 'Motoboy', 'entrega', 160000),
  ('logistics_operator', 'Operador Logistico', 'industria', 220000),
  ('seller', 'Vendedor', 'comercio', 170000),
  ('police_officer', 'Policial', 'seguranca_publica', 350000),
  ('doctor', 'Medico', 'saude', 700000),
  ('programmer', 'Programador', 'tecnologia', 450000),
  ('mechanic', 'Mecanico', 'servicos', 260000);

