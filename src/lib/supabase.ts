import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types for our database
export interface Launch {
  id: string
  title: string
  description?: string
  status: 'Planning' | 'In Progress' | 'Ready' | 'Shipped'
  launch_date?: string
  owner?: string
  checklist: {
    blog: boolean
    demo: boolean
    social: boolean
    partner: boolean
    docs: boolean
  }
  tags: string[]
  created_at: string
}

export interface ActivityLog {
  id: string
  action: string
  user_name?: string
  details?: Record<string, unknown>
  created_at: string
}