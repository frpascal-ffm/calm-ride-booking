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
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      bookings: {
        Row: {
          additional_info: string | null
          additional_notes: string | null
          barrier_free: boolean | null
          birth_date: string
          booking_date: string | null
          buffer_minutes: number
          calendar_event_id: string | null
          case_number: string
          company_id: string | null
          confirmation_email: string
          created_at: string
          destination_address: string | null
          dropoff_address: string
          estimated_drive_minutes: number
          first_name: string
          has_special_requirements: boolean
          id: string
          is_adipositas: boolean
          is_infectious: boolean
          is_visually_impaired: boolean
          is_wheelchair: boolean
          last_name: string
          needs_barrier_free: boolean
          organization_id: string
          partner_id: string | null
          partner_link_id: string
          patient_notes: string | null
          pickup_address: string
          pickup_datetime: string
          pickup_time: string | null
          special_requirements_note: string | null
          status: string
          updated_at: string
        }
        Insert: {
          additional_info?: string | null
          additional_notes?: string | null
          barrier_free?: boolean | null
          birth_date: string
          booking_date?: string | null
          buffer_minutes?: number
          calendar_event_id?: string | null
          case_number: string
          company_id?: string | null
          confirmation_email: string
          created_at?: string
          destination_address?: string | null
          dropoff_address: string
          estimated_drive_minutes?: number
          first_name: string
          has_special_requirements?: boolean
          id?: string
          is_adipositas?: boolean
          is_infectious?: boolean
          is_visually_impaired?: boolean
          is_wheelchair?: boolean
          last_name: string
          needs_barrier_free?: boolean
          organization_id: string
          partner_id?: string | null
          partner_link_id: string
          patient_notes?: string | null
          pickup_address: string
          pickup_datetime: string
          pickup_time?: string | null
          special_requirements_note?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          additional_info?: string | null
          additional_notes?: string | null
          barrier_free?: boolean | null
          birth_date?: string
          booking_date?: string | null
          buffer_minutes?: number
          calendar_event_id?: string | null
          case_number?: string
          company_id?: string | null
          confirmation_email?: string
          created_at?: string
          destination_address?: string | null
          dropoff_address?: string
          estimated_drive_minutes?: number
          first_name?: string
          has_special_requirements?: boolean
          id?: string
          is_adipositas?: boolean
          is_infectious?: boolean
          is_visually_impaired?: boolean
          is_wheelchair?: boolean
          last_name?: string
          needs_barrier_free?: boolean
          organization_id?: string
          partner_id?: string | null
          partner_link_id?: string
          patient_notes?: string | null
          pickup_address?: string
          pickup_datetime?: string
          pickup_time?: string | null
          special_requirements_note?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "bookings_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_partner_id_fkey"
            columns: ["partner_id"]
            isOneToOne: false
            referencedRelation: "partners"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_partner_link_id_fkey"
            columns: ["partner_link_id"]
            isOneToOne: false
            referencedRelation: "partner_links"
            referencedColumns: ["id"]
          },
        ]
      }
      emails: {
        Row: {
          created_at: string
          email: string
          id: string
          last_used_at: string
          partner_id: string
          usage_count: number
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          last_used_at?: string
          partner_id: string
          usage_count?: number
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          last_used_at?: string
          partner_id?: string
          usage_count?: number
        }
        Relationships: [
          {
            foreignKeyName: "emails_partner_id_fkey"
            columns: ["partner_id"]
            isOneToOne: false
            referencedRelation: "partners"
            referencedColumns: ["id"]
          },
        ]
      }
      organizations: {
        Row: {
          address: string | null
          arbeitszeiten_end: string | null
          arbeitszeiten_start: string | null
          contact_email: string | null
          contact_phone: string | null
          created_at: string
          id: string
          karenzzeit: number | null
          name: string
          slug: string | null
          standard_email: string | null
          updated_at: string
          working_hours: Json
        }
        Insert: {
          address?: string | null
          arbeitszeiten_end?: string | null
          arbeitszeiten_start?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string
          id?: string
          karenzzeit?: number | null
          name: string
          slug?: string | null
          standard_email?: string | null
          updated_at?: string
          working_hours?: Json
        }
        Update: {
          address?: string | null
          arbeitszeiten_end?: string | null
          arbeitszeiten_start?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string
          id?: string
          karenzzeit?: number | null
          name?: string
          slug?: string | null
          standard_email?: string | null
          updated_at?: string
          working_hours?: Json
        }
        Relationships: []
      }
      partner_known_emails: {
        Row: {
          email: string
          id: string
          last_used_at: string
          organization_id: string
          usage_count: number
        }
        Insert: {
          email: string
          id?: string
          last_used_at?: string
          organization_id: string
          usage_count?: number
        }
        Update: {
          email?: string
          id?: string
          last_used_at?: string
          organization_id?: string
          usage_count?: number
        }
        Relationships: [
          {
            foreignKeyName: "partner_known_emails_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      partner_links: {
        Row: {
          created_at: string
          id: string
          is_active: boolean
          label: string
          organization_id: string
          token: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean
          label: string
          organization_id: string
          token: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean
          label?: string
          organization_id?: string
          token?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "partner_links_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      partners: {
        Row: {
          active: boolean
          company_id: string
          created_at: string
          email: string | null
          id: string
          name: string
          slug: string
          updated_at: string
        }
        Insert: {
          active?: boolean
          company_id: string
          created_at?: string
          email?: string | null
          id?: string
          name: string
          slug: string
          updated_at?: string
        }
        Update: {
          active?: boolean
          company_id?: string
          created_at?: string
          email?: string | null
          id?: string
          name?: string
          slug?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "partners_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      generate_case_number: {
        Args: Record<PropertyKey, never>
        Returns: string
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
    Enums: {},
  },
} as const
