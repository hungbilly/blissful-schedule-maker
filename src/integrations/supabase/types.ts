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
      budget_categories: {
        Row: {
          created_at: string
          id: number
          name: string
          project_id: number
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: number
          name: string
          project_id: number
          user_id: string
        }
        Update: {
          created_at?: string
          id?: number
          name?: string
          project_id?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "budget_categories_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      budget_items: {
        Row: {
          amount: number
          category_id: number
          created_at: string
          id: number
          project_id: number
          title: string
          user_id: string
        }
        Insert: {
          amount?: number
          category_id: number
          created_at?: string
          id?: number
          project_id: number
          title: string
          user_id: string
        }
        Update: {
          amount?: number
          category_id?: number
          created_at?: string
          id?: number
          project_id?: number
          title?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "budget_items_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "budget_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "budget_items_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          created_at: string
          description: string | null
          duration: string
          end_time: string
          id: number
          location: string | null
          project_id: number
          time: string
          title: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          duration: string
          end_time: string
          id?: number
          location?: string | null
          project_id: number
          time: string
          title: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          duration?: string
          end_time?: string
          id?: number
          location?: string | null
          project_id?: number
          time?: string
          title?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "events_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      guest_categories: {
        Row: {
          created_at: string
          id: number
          name: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: never
          name: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: never
          name?: string
          user_id?: string
        }
        Relationships: []
      }
      guests: {
        Row: {
          category_id: number | null
          created_at: string
          id: number
          name: string
          table_id: number | null
          user_id: string
        }
        Insert: {
          category_id?: number | null
          created_at?: string
          id?: never
          name: string
          table_id?: number | null
          user_id: string
        }
        Update: {
          category_id?: number | null
          created_at?: string
          id?: never
          name?: string
          table_id?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "guests_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "guest_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "guests_table_id_fkey"
            columns: ["table_id"]
            isOneToOne: false
            referencedRelation: "tables"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          bride_name: string | null
          created_at: string
          groom_name: string | null
          id: string
          updated_at: string
        }
        Insert: {
          bride_name?: string | null
          created_at?: string
          groom_name?: string | null
          id: string
          updated_at?: string
        }
        Update: {
          bride_name?: string | null
          created_at?: string
          groom_name?: string | null
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      projects: {
        Row: {
          created_at: string
          id: number
          name: string
          user_id: string
          wedding_date: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          name: string
          user_id: string
          wedding_date?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          name?: string
          user_id?: string
          wedding_date?: string | null
        }
        Relationships: []
      }
      tables: {
        Row: {
          created_at: string
          id: number
          name: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: number
          name: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: number
          name?: string
          user_id?: string
        }
        Relationships: []
      }
      vendors: {
        Row: {
          address: string | null
          contact_number: string
          created_at: string
          id: number
          name: string
          role: string
          service_details: string | null
          social_media: string | null
          user_id: string
        }
        Insert: {
          address?: string | null
          contact_number: string
          created_at?: string
          id?: number
          name: string
          role: string
          service_details?: string | null
          social_media?: string | null
          user_id: string
        }
        Update: {
          address?: string | null
          contact_number?: string
          created_at?: string
          id?: number
          name?: string
          role?: string
          service_details?: string | null
          social_media?: string | null
          user_id?: string
        }
        Relationships: []
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
