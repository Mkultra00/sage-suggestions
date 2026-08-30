export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      action_plans: {
        Row: {
          contacts: Json
          created_at: string
          deadlines: Json
          headline: string
          id: string
          immediate: Json
          incident_id: string
          steps: Json
        }
        Insert: {
          contacts?: Json
          created_at?: string
          deadlines?: Json
          headline: string
          id?: string
          immediate?: Json
          incident_id: string
          steps?: Json
        }
        Update: {
          contacts?: Json
          created_at?: string
          deadlines?: Json
          headline?: string
          id?: string
          immediate?: Json
          incident_id?: string
          steps?: Json
        }
        Relationships: [
          {
            foreignKeyName: "action_plans_incident_id_fkey"
            columns: ["incident_id"]
            isOneToOne: false
            referencedRelation: "incidents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "action_plans_incident_id_fkey"
            columns: ["incident_id"]
            isOneToOne: false
            referencedRelation: "public_incidents"
            referencedColumns: ["id"]
          },
        ]
      }
      incidents: {
        Row: {
          ai_confidence: number | null
          ai_rationale: string | null
          ai_summary: string | null
          category: string
          created_at: string
          description: string
          id: string
          institution: string | null
          lat: number
          lng: number
          location_type: string
          occurred_at: string
          pub_lat: number | null
          pub_lng: number | null
          saved: boolean
          synthetic: boolean
          tier: Database["public"]["Enums"]["incident_tier"]
        }
        Insert: {
          ai_confidence?: number | null
          ai_rationale?: string | null
          ai_summary?: string | null
          category?: string
          created_at?: string
          description?: string
          id?: string
          institution?: string | null
          lat: number
          lng: number
          location_type?: string
          occurred_at?: string
          pub_lat?: number | null
          pub_lng?: number | null
          saved?: boolean
          synthetic?: boolean
          tier?: Database["public"]["Enums"]["incident_tier"]
        }
        Update: {
          ai_confidence?: number | null
          ai_rationale?: string | null
          ai_summary?: string | null
          category?: string
          created_at?: string
          description?: string
          id?: string
          institution?: string | null
          lat?: number
          lng?: number
          location_type?: string
          occurred_at?: string
          pub_lat?: number | null
          pub_lng?: number | null
          saved?: boolean
          synthetic?: boolean
          tier?: Database["public"]["Enums"]["incident_tier"]
        }
        Relationships: []
      }
    }
    Views: {
      public_incidents: {
        Row: {
          category: string | null
          id: string | null
          lat: number | null
          lng: number | null
          location_type: string | null
          occurred_hour: string | null
          synthetic: boolean | null
          tier: Database["public"]["Enums"]["incident_tier"] | null
        }
        Insert: {
          category?: string | null
          id?: string | null
          lat?: number | null
          lng?: number | null
          location_type?: string | null
          occurred_hour?: never
          synthetic?: boolean | null
          tier?: Database["public"]["Enums"]["incident_tier"] | null
        }
        Update: {
          category?: string | null
          id?: string | null
          lat?: number | null
          lng?: number | null
          location_type?: string | null
          occurred_hour?: never
          synthetic?: boolean | null
          tier?: Database["public"]["Enums"]["incident_tier"] | null
        }
        Relationships: []
      }
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      incident_tier: "T1" | "T2" | "T3" | "T4"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      incident_tier: ["T1", "T2", "T3", "T4"],
    },
  },
} as const
