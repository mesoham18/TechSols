import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      items: {
        Row: {
          id: string
          created_at: string
          user_id: string
          name: string
          type: string
          description: string
          cover_image: string
          additional_images: string[]
        }
        Insert: {
          id?: string
          created_at?: string
          user_id: string
          name: string
          type: string
          description: string
          cover_image: string
          additional_images?: string[]
        }
        Update: {
          id?: string
          created_at?: string
          user_id?: string
          name?: string
          type?: string
          description?: string
          cover_image?: string
          additional_images?: string[]
        }
      }
      enquiries: {
        Row: {
          id: string
          created_at: string
          user_id: string
          item_id: string
          enquirer_email: string
          message: string
        }
        Insert: {
          id?: string
          created_at?: string
          user_id: string
          item_id: string
          enquirer_email: string
          message?: string
        }
        Update: {
          id?: string
          created_at?: string
          user_id?: string
          item_id?: string
          enquirer_email?: string
          message?: string
        }
      }
    }
  }
}