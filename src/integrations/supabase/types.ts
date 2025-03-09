export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      admin_users: {
        Row: {
          created_at: string | null
          id: string
          is_superadmin: boolean | null
          last_login: string | null
          password_hash: string
          username: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_superadmin?: boolean | null
          last_login?: string | null
          password_hash: string
          username: string
        }
        Update: {
          created_at?: string | null
          id?: string
          is_superadmin?: boolean | null
          last_login?: string | null
          password_hash?: string
          username?: string
        }
        Relationships: []
      }
      distribution_services: {
        Row: {
          id: string
          logo: string
          name: string
        }
        Insert: {
          id?: string
          logo: string
          name: string
        }
        Update: {
          id?: string
          logo?: string
          name?: string
        }
        Relationships: []
      }
      royalty_payments: {
        Row: {
          amount: number
          artist_id: string
          created_at: string | null
          id: string
          isrc: string | null
          payment_date: string
          period: string
          service_name: string
          status: string
          track_id: string | null
        }
        Insert: {
          amount: number
          artist_id: string
          created_at?: string | null
          id?: string
          isrc?: string | null
          payment_date: string
          period: string
          service_name: string
          status?: string
          track_id?: string | null
        }
        Update: {
          amount?: number
          artist_id?: string
          created_at?: string | null
          id?: string
          isrc?: string | null
          payment_date?: string
          period?: string
          service_name?: string
          status?: string
          track_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "royalty_payments_track_id_fkey"
            columns: ["track_id"]
            isOneToOne: false
            referencedRelation: "tracks"
            referencedColumns: ["id"]
          },
        ]
      }
      track_distribution_services: {
        Row: {
          service_id: string
          track_id: string
        }
        Insert: {
          service_id: string
          track_id: string
        }
        Update: {
          service_id?: string
          track_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "track_distribution_services_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "distribution_services"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "track_distribution_services_track_id_fkey"
            columns: ["track_id"]
            isOneToOne: false
            referencedRelation: "tracks"
            referencedColumns: ["id"]
          },
        ]
      }
      track_metadata: {
        Row: {
          created_at: string | null
          genre: string | null
          id: string
          isrc: string
          release_date: string | null
          track_id: string | null
          upc: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          genre?: string | null
          id?: string
          isrc: string
          release_date?: string | null
          track_id?: string | null
          upc?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          genre?: string | null
          id?: string
          isrc?: string
          release_date?: string | null
          track_id?: string | null
          upc?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "track_metadata_track_id_fkey"
            columns: ["track_id"]
            isOneToOne: false
            referencedRelation: "tracks"
            referencedColumns: ["id"]
          },
        ]
      }
      track_streams: {
        Row: {
          created_at: string | null
          id: string
          isrc: string | null
          service_name: string
          stream_count: number
          stream_date: string
          track_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          isrc?: string | null
          service_name: string
          stream_count: number
          stream_date: string
          track_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          isrc?: string | null
          service_name?: string
          stream_count?: number
          stream_date?: string
          track_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "track_streams_track_id_fkey"
            columns: ["track_id"]
            isOneToOne: false
            referencedRelation: "tracks"
            referencedColumns: ["id"]
          },
        ]
      }
      tracks: {
        Row: {
          artist: string
          artwork: string
          duration: number
          genre: string
          id: string
          modification_message: string | null
          modification_requested: boolean | null
          release_date: string | null
          status: string
          submitted_at: string | null
          taken_down_at: string | null
          title: string
          user_id: string
        }
        Insert: {
          artist: string
          artwork: string
          duration: number
          genre: string
          id?: string
          modification_message?: string | null
          modification_requested?: boolean | null
          release_date?: string | null
          status?: string
          submitted_at?: string | null
          taken_down_at?: string | null
          title: string
          user_id: string
        }
        Update: {
          artist?: string
          artwork?: string
          duration?: number
          genre?: string
          id?: string
          modification_message?: string | null
          modification_requested?: boolean | null
          release_date?: string | null
          status?: string
          submitted_at?: string | null
          taken_down_at?: string | null
          title?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      verify_admin_login: {
        Args: {
          username_input: string
          password_input: string
        }
        Returns: {
          id: string
          username: string
          is_superadmin: boolean
        }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
