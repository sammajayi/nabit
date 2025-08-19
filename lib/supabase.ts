import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://skjjfexbigvkimotkloa.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl) {
  throw new Error('Missing Supabase URL. Please set NEXT_PUBLIC_SUPABASE_URL in your .env file.')
}

if (!supabaseAnonKey) {
  throw new Error('Missing Supabase anon key. Please set NEXT_PUBLIC_SUPABASE_ANON_KEY in your .env file.')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface Product {
  id: string
  name: string
  description: string
  price: number
  category: string
  images: string[]
  document?: string
  fid: string
  seller_image?: string
  seller_display_name?: string
  created_at: string
  updated_at: string
}

export interface User {
  fid: string
  display_name?: string
  pfp_url?: string
  username?: string
  created_at: string
}

export interface Order {
  id: string
  product_id: string
  buyer_fid: string
  seller_fid: string
  amount: number
  status: 'pending' | 'completed' | 'failed'
  transaction_id?: string
  created_at: string
  updated_at: string
} 