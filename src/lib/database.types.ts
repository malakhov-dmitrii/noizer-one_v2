export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[]

export interface Database {
  public: {
    Tables: {
      playlists: {
        Row: {
          created_at: string | null
          group: string | null
          id: number
          sounds: Json | null
          title: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          group?: string | null
          id?: number
          sounds?: Json | null
          title: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          group?: string | null
          id?: number
          sounds?: Json | null
          title?: string
          user_id?: string
        }
      }
      profiles: {
        Row: {
          created_at: string | null
          email: string | null
          id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          email?: string | null
          id?: string
          user_id?: string
        }
      }
      subscriptions: {
        Row: {
          created_at: string | null
          current_period_end: string | null
          current_period_start: string | null
          customer_id: string | null
          id: number
          metadata: Json | null
          status: string | null
          stripe_subsription_id: string | null
          updated_at: string | null
          user_email: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          current_period_end?: string | null
          current_period_start?: string | null
          customer_id?: string | null
          id?: number
          metadata?: Json | null
          status?: string | null
          stripe_subsription_id?: string | null
          updated_at?: string | null
          user_email: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          current_period_end?: string | null
          current_period_start?: string | null
          customer_id?: string | null
          id?: number
          metadata?: Json | null
          status?: string | null
          stripe_subsription_id?: string | null
          updated_at?: string | null
          user_email?: string
          user_id?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
