-- Proforma Management System Database Schema
-- Execute this in Supabase SQL Editor

-- Create tables
CREATE TABLE IF NOT EXISTS company_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL DEFAULT 'GBEFFA REIS BE KOM',
  activity text NOT NULL DEFAULT 'Tous Travaux d''Affichage, Décoration, Sérigraphie et Fabrication de panneaux statiques',
  phones text NOT NULL DEFAULT '01 96 34 64 35 / 01 94 14 52 69',
  cip text NOT NULL DEFAULT '8382792325',
  cip_expiry date NOT NULL DEFAULT '2026-12-10',
  ifu text NOT NULL DEFAULT '1201408335401',
  email text NOT NULL DEFAULT 'tundetoile@gmail.com',
  rccm text DEFAULT '',
  manager_name text DEFAULT '',
  qr_code_url text NOT NULL DEFAULT 'https://wa.me/22996346435',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS clients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  phone text DEFAULT '',
  email text DEFAULT '',
  address text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS articles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  designation text NOT NULL,
  unit_price numeric(12, 2) NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS proformas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_number text NOT NULL UNIQUE,
  client_id uuid REFERENCES clients(id) ON DELETE SET NULL,
  client_name text NOT NULL,
  date date NOT NULL DEFAULT CURRENT_DATE,
  subtotal numeric(12, 2) NOT NULL DEFAULT 0,
  tax_rate numeric(5, 2) DEFAULT 0,
  tax_amount numeric(12, 2) DEFAULT 0,
  total numeric(12, 2) NOT NULL DEFAULT 0,
  payment_terms text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS proforma_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  proforma_id uuid REFERENCES proformas(id) ON DELETE CASCADE,
  designation text NOT NULL,
  quantity numeric(10, 2) NOT NULL DEFAULT 1,
  unit_price numeric(12, 2) NOT NULL DEFAULT 0,
  discount_type text DEFAULT 'none',
  discount_value numeric(12, 2) DEFAULT 0,
  amount numeric(12, 2) NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE company_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE proformas ENABLE ROW LEVEL SECURITY;
ALTER TABLE proforma_items ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow all operations on company_settings" ON company_settings;
DROP POLICY IF EXISTS "Allow select on company_settings for anon" ON company_settings;
DROP POLICY IF EXISTS "Allow all operations on clients" ON clients;
DROP POLICY IF EXISTS "Allow all operations on articles" ON articles;
DROP POLICY IF EXISTS "Allow all operations on proformas" ON proformas;
DROP POLICY IF EXISTS "Allow all operations on proforma_items" ON proforma_items;

-- Create policies for public access (no auth required for this app)
CREATE POLICY "Allow all operations on company_settings"
  ON company_settings FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow all operations on clients"
  ON clients FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow all operations on articles"
  ON articles FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow all operations on proformas"
  ON proformas FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow all operations on proforma_items"
  ON proforma_items FOR ALL
  USING (true)
  WITH CHECK (true);

-- Insert default company settings
INSERT INTO company_settings (name, activity, phones, cip, cip_expiry, ifu, email, rccm, manager_name, qr_code_url)
VALUES (
  'GBEFFA REIS BE KOM',
  'Tous Travaux d''Affichage, Décoration, Sérigraphie et Fabrication de panneaux statiques',
  '01 96 34 64 35 / 01 94 14 52 69',
  '8382792325',
  '2026-12-10',
  '1201408335401',
  'tundetoile@gmail.com',
  '',
  '',
  'https://wa.me/22996346435'
)
ON CONFLICT DO NOTHING;

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_proformas_client_id ON proformas(client_id);
CREATE INDEX IF NOT EXISTS idx_proformas_date ON proformas(date);
CREATE INDEX IF NOT EXISTS idx_proforma_items_proforma_id ON proforma_items(proforma_id);
