
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          name: string
          email: string
          avatar: string | null
          phone_number: string | null
          two_factor_enabled: boolean
          role: 'artist' | 'admin' | 'superadmin'
          created_at: string
          id_type: 'passport' | 'drivers_license' | 'national_id' | 'personal' | 'business' | null
          verification_status: 'unverified' | 'pending' | 'verified' | 'rejected'
          delete_status: 'pending' | 'approved' | null
          has_releases: boolean | null
        }
        Insert: {
          id?: string
          name: string
          email: string
          avatar?: string | null
          phone_number?: string | null
          two_factor_enabled?: boolean
          role?: 'artist' | 'admin' | 'superadmin'
          created_at?: string
          id_type?: 'passport' | 'drivers_license' | 'national_id' | 'personal' | 'business' | null
          verification_status?: 'unverified' | 'pending' | 'verified' | 'rejected'
          delete_status?: 'pending' | 'approved' | null
          has_releases?: boolean | null
        }
        Update: {
          id?: string
          name?: string
          email?: string
          avatar?: string | null
          phone_number?: string | null
          two_factor_enabled?: boolean
          role?: 'artist' | 'admin' | 'superadmin'
          created_at?: string
          id_type?: 'passport' | 'drivers_license' | 'national_id' | 'personal' | 'business' | null
          verification_status?: 'unverified' | 'pending' | 'verified' | 'rejected'
          delete_status?: 'pending' | 'approved' | null
          has_releases?: boolean | null
        }
      }
      tracks: {
        Row: {
          id: string
          title: string
          artist: string
          artwork: string
          genre: string
          status: 'pending' | 'approved' | 'rejected'
          submitted_at: string
          release_date: string | null
          duration: number
          user_id: string
          taken_down_at: string | null
          modification_requested: boolean | null
          modification_message: string | null
        }
        Insert: {
          id?: string
          title: string
          artist: string
          artwork: string
          genre: string
          status?: 'pending' | 'approved' | 'rejected'
          submitted_at?: string
          release_date?: string | null
          duration: number
          user_id: string
          taken_down_at?: string | null
          modification_requested?: boolean | null
          modification_message?: string | null
        }
        Update: {
          id?: string
          title?: string
          artist?: string
          artwork?: string
          genre?: string
          status?: 'pending' | 'approved' | 'rejected'
          submitted_at?: string
          release_date?: string | null
          duration?: number
          user_id?: string
          taken_down_at?: string | null
          modification_requested?: boolean | null
          modification_message?: string | null
        }
      }
      distribution_services: {
        Row: {
          id: string
          name: string
          logo: string
        }
        Insert: {
          id?: string
          name: string
          logo: string
        }
        Update: {
          id?: string
          name?: string
          logo?: string
        }
      }
      track_distribution_services: {
        Row: {
          track_id: string
          service_id: string
        }
        Insert: {
          track_id: string
          service_id: string
        }
        Update: {
          track_id?: string
          service_id?: string
        }
      }
      registration_config: {
        Row: {
          id: number
          public_registration_enabled: boolean
          invite_only_mode: boolean
          public_login_enabled: boolean
        }
        Insert: {
          id?: number
          public_registration_enabled?: boolean
          invite_only_mode?: boolean
          public_login_enabled?: boolean
        }
        Update: {
          id?: number
          public_registration_enabled?: boolean
          invite_only_mode?: boolean
          public_login_enabled?: boolean
        }
      }
      track_streams: {
        Row: {
          id: string
          track_id: string
          service_name: string
          stream_count: number
          stream_date: string
          created_at: string
        }
        Insert: {
          id?: string
          track_id: string
          service_name: string
          stream_count: number
          stream_date: string
          created_at?: string
        }
        Update: {
          id?: string
          track_id?: string
          service_name?: string
          stream_count?: number
          stream_date?: string
          created_at?: string
        }
      }
      royalty_payments: {
        Row: {
          id: string
          artist_id: string
          track_id: string
          service_name: string
          amount: number
          period: string
          payment_date: string
          status: 'pending' | 'processing' | 'paid'
          created_at: string
        }
        Insert: {
          id?: string
          artist_id: string
          track_id: string
          service_name: string
          amount: number
          period: string
          payment_date: string
          status?: 'pending' | 'processing' | 'paid'
          created_at?: string
        }
        Update: {
          id?: string
          artist_id?: string
          track_id?: string
          service_name?: string
          amount?: number
          period?: string
          payment_date?: string
          status?: 'pending' | 'processing' | 'paid'
          created_at?: string
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
  }
}
