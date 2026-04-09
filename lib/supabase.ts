import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://cdilylgcxnfgrenedlnn.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNkaWx5bGdjeG5mZ3JlbmVkbG5uIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU2NDI4MzMsImV4cCI6MjA5MTIxODgzM30.JdQzNSp7fbkWMdsjtM8U0ZnXeQ9impAhxOoJRvHzzYE';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Appointment = {
  id: string;
  created_at: string;
  full_name: string;
  email: string;
  phone: string;
  service: string;
  preferred_date: string;
  preferred_time: string;
  message: string | null;
  status: 'pending' | 'confirmed' | 'cancelled';
};
