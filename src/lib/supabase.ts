import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface CompanySettings {
  id: string;
  name: string;
  activity: string;
  phones: string;
  cip: string;
  cip_expiry: string;
  ifu: string;
  email: string;
  rccm: string;
  manager_name: string;
  qr_code_url: string;
}

export interface Client {
  id: string;
  name: string;
  phone: string;
  email: string;
  address: string;
}

export interface Article {
  id: string;
  designation: string;
  unit_price: number;
}

export interface ProformaItem {
  id?: string;
  designation: string;
  quantity: number;
  unit_price: number;
  discount_type: 'none' | 'percentage' | 'amount';
  discount_value: number;
  amount: number;
}

export interface Proforma {
  id: string;
  invoice_number: string;
  client_id: string | null;
  client_name: string;
  date: string;
  subtotal: number;
  tax_rate: number;
  tax_amount: number;
  total: number;
  payment_terms: string;
  created_at: string;
}
