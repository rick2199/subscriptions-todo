export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[];

export type Users = Database["public"]["Tables"]["users"]["Row"];
export type Plans = Database["public"]["Enums"]["subscription_plan"];
export type TodoPriority = Database["public"]["Enums"]["todo_measure"];

export interface Database {
  public: {
    Tables: {
      prices: {
        Row: {
          active: boolean | null;
          currency: string | null;
          description: string | null;
          id: string;
          interval: Database["public"]["Enums"]["pricing_plan_interval"] | null;
          interval_count: number | null;
          metadata: Json | null;
          product_id: string | null;
          trial_period_days: number | null;
          type: Database["public"]["Enums"]["pricing_type"] | null;
          unit_amount: number | null;
        };
        Insert: {
          active?: boolean | null;
          currency?: string | null;
          description?: string | null;
          id: string;
          interval?:
            | Database["public"]["Enums"]["pricing_plan_interval"]
            | null;
          interval_count?: number | null;
          metadata?: Json | null;
          product_id?: string | null;
          trial_period_days?: number | null;
          type?: Database["public"]["Enums"]["pricing_type"] | null;
          unit_amount?: number | null;
        };
        Update: {
          active?: boolean | null;
          currency?: string | null;
          description?: string | null;
          id?: string;
          interval?:
            | Database["public"]["Enums"]["pricing_plan_interval"]
            | null;
          interval_count?: number | null;
          metadata?: Json | null;
          product_id?: string | null;
          trial_period_days?: number | null;
          type?: Database["public"]["Enums"]["pricing_type"] | null;
          unit_amount?: number | null;
        };
      };
      products: {
        Row: {
          active: boolean | null;
          description: string | null;
          id: string;
          image: string | null;
          metadata: Json | null;
          name: string | null;
        };
        Insert: {
          active?: boolean | null;
          description?: string | null;
          id: string;
          image?: string | null;
          metadata?: Json | null;
          name?: string | null;
        };
        Update: {
          active?: boolean | null;
          description?: string | null;
          id?: string;
          image?: string | null;
          metadata?: Json | null;
          name?: string | null;
        };
      };
      subscriptions: {
        Row: {
          cancel_at: string | null;
          cancel_at_period_end: boolean | null;
          canceled_at: string | null;
          created: string;
          current_period_end: string;
          current_period_start: string;
          ended_at: string | null;
          id: string;
          metadata: Json | null;
          price_id: string | null;
          quantity: number | null;
          status: Database["public"]["Enums"]["subscription_status"] | null;
          trial_end: string | null;
          trial_start: string | null;
          user_id: string;
        };
        Insert: {
          cancel_at?: string | null;
          cancel_at_period_end?: boolean | null;
          canceled_at?: string | null;
          created?: string;
          current_period_end?: string;
          current_period_start?: string;
          ended_at?: string | null;
          id: string;
          metadata?: Json | null;
          price_id?: string | null;
          quantity?: number | null;
          status?: Database["public"]["Enums"]["subscription_status"] | null;
          trial_end?: string | null;
          trial_start?: string | null;
          user_id: string;
        };
        Update: {
          cancel_at?: string | null;
          cancel_at_period_end?: boolean | null;
          canceled_at?: string | null;
          created?: string;
          current_period_end?: string;
          current_period_start?: string;
          ended_at?: string | null;
          id?: string;
          metadata?: Json | null;
          price_id?: string | null;
          quantity?: number | null;
          status?: Database["public"]["Enums"]["subscription_status"] | null;
          trial_end?: string | null;
          trial_start?: string | null;
          user_id?: string;
        };
      };
      todo_categories: {
        Row: {
          category: string | null;
          id: string;
          user_id: string | null;
        };
        Insert: {
          category?: string | null;
          id?: string;
          user_id?: string | null;
        };
        Update: {
          category?: string | null;
          id?: string;
          user_id?: string | null;
        };
      };
      todos: {
        Row: {
          category_id: string;
          completed: boolean | null;
          finished_at: string | null;
          id: string;
          priority: Database["public"]["Enums"]["todo_measure"] | null;
          started_at: string | null;
          todo: string | null;
          user_id: string | null;
        };
        Insert: {
          category_id: string;
          completed?: boolean | null;
          finished_at?: string | null;
          id?: string;
          priority?: Database["public"]["Enums"]["todo_measure"] | null;
          started_at?: string | null;
          todo?: string | null;
          user_id?: string | null;
        };
        Update: {
          category_id?: string;
          completed?: boolean | null;
          finished_at?: string | null;
          id?: string;
          priority?: Database["public"]["Enums"]["todo_measure"] | null;
          started_at?: string | null;
          todo?: string | null;
          user_id?: string | null;
        };
      };
      user_action: {
        Row: {
          action_type: string | null;
          created_at: string | null;
          id: string;
          user_id: string | null;
        };
        Insert: {
          action_type?: string | null;
          created_at?: string | null;
          id?: string;
          user_id?: string | null;
        };
        Update: {
          action_type?: string | null;
          created_at?: string | null;
          id?: string;
          user_id?: string | null;
        };
      };
      users: {
        Row: {
          avatar_url: string | null;
          billing_address: Json | null;
          email: string;
          full_name: string | null;
          id: string;
          payment_method: Json | null;
          plan: Database["public"]["Enums"]["subscription_plan"] | null;
          stripe_customer_id: string | null;
        };
        Insert: {
          avatar_url?: string | null;
          billing_address?: Json | null;
          email: string;
          full_name?: string | null;
          id: string;
          payment_method?: Json | null;
          plan?: Database["public"]["Enums"]["subscription_plan"] | null;
          stripe_customer_id?: string | null;
        };
        Update: {
          avatar_url?: string | null;
          billing_address?: Json | null;
          email?: string;
          full_name?: string | null;
          id?: string;
          payment_method?: Json | null;
          plan?: Database["public"]["Enums"]["subscription_plan"] | null;
          stripe_customer_id?: string | null;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      pricing_plan_interval: "day" | "week" | "month" | "year";
      pricing_type: "one_time" | "recurring";
      subscription_plan: "free" | "monthly" | "annually";
      subscription_status:
        | "trialing"
        | "active"
        | "canceled"
        | "incomplete"
        | "incomplete_expired"
        | "past_due"
        | "unpaid";
      todo_measure: "low" | "medium" | "high";
    };
  };
}
