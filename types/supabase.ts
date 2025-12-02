export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          avatar_url: string | null;
          total_xp: number | null;
          level: number | null;
          weekly_xp: number | null;
          monthly_xp: number | null;
          last_xp_reset_week: string | null;
          last_xp_reset_month: string | null;
          created_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          avatar_url?: string | null;
          total_xp?: number | null;
          level?: number | null;
          weekly_xp?: number | null;
          monthly_xp?: number | null;
          last_xp_reset_week?: string | null;
          last_xp_reset_month?: string | null;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["profiles"]["Row"]>;
      };
      teams: {
        Row: {
          id: string;
          name: string;
          slug: string;
          owner_id: string;
          logo_url: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          owner_id: string;
          logo_url?: string | null;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["teams"]["Row"]>;
      };
      team_members: {
        Row: {
          id: number;
          team_id: string;
          user_id: string;
          role: "owner" | "admin" | "member";
          joined_at: string;
        };
        Insert: {
          id?: number;
          team_id: string;
          user_id: string;
          role?: "owner" | "admin" | "member";
          joined_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["team_members"]["Row"]>;
      };
      tasks: {
        Row: {
          id: string;
          team_id: string | null;
          created_at: string;
          title: string;
          description: string | null;
          status: "todo" | "in_progress" | "done";
          priority: "low" | "medium" | "high" | "critical";
          created_by: string;
          assigned_to: string | null;
          due_date: string | null;
        };
        Insert: {
          id?: string;
          team_id?: string | null;
          created_at?: string;
          title: string;
          description?: string | null;
          status?: "todo" | "in_progress" | "done";
          priority?: "low" | "medium" | "high" | "critical";
          created_by: string;
          assigned_to?: string | null;
          due_date?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["tasks"]["Row"]>;
      };
      micro_learnings: {
        Row: {
          id: string;
          team_id: string | null;
          title: string;
          content: string | null;
          content_type: "pdf" | "markdown";
          content_url: string | null;
          xp: number;
          category: string | null;
          is_published: boolean;
          created_by: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          team_id?: string | null;
          title: string;
          content?: string | null;
          content_type: "pdf" | "markdown";
          content_url?: string | null;
          xp: number;
          category?: string | null;
          is_published?: boolean;
          created_by: string;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["micro_learnings"]["Row"]>;
      };
      user_progress: {
        Row: {
          id: number;
          user_id: string;
          learning_id: string;
          completed_at: string;
        };
        Insert: {
          id?: number;
          user_id: string;
          learning_id: string;
          completed_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["user_progress"]["Row"]>;
      };
      projects: {
        Row: {
          id: string;
          team_id: string;
          owner_id: string;
          name: string;
          slug: string;
          description: string | null;
          objective: string | null;
          status:
            | "planning"
            | "in_progress"
            | "on_hold"
            | "completed"
            | "cancelled";
          priority: "low" | "medium" | "high" | "critical";
          start_date: string | null;
          due_date: string | null;
          completed_at: string | null;
          cover_image_url: string | null;
          metadata: Json | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          team_id: string;
          owner_id: string;
          name: string;
          slug: string;
          description?: string | null;
          objective?: string | null;
          status?: Database["public"]["Tables"]["projects"]["Row"]["status"];
          priority?: Database["public"]["Tables"]["projects"]["Row"]["priority"];
          start_date?: string | null;
          due_date?: string | null;
          completed_at?: string | null;
          cover_image_url?: string | null;
          metadata?: Json | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["projects"]["Row"]>;
      };
      project_members: {
        Row: {
          id: number;
          project_id: string;
          user_id: string;
          role: "owner" | "manager" | "contributor" | "viewer";
          color_label: string | null;
          created_at: string;
        };
        Insert: {
          id?: number;
          project_id: string;
          user_id: string;
          role?: "owner" | "manager" | "contributor" | "viewer";
          color_label?: string | null;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["project_members"]["Row"]>;
      };
      project_milestones: {
        Row: {
          id: string;
          project_id: string;
          title: string;
          description: string | null;
          status: "planned" | "in_progress" | "blocked" | "done";
          due_date: string | null;
          order_index: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          project_id: string;
          title: string;
          description?: string | null;
          status?: Database["public"]["Tables"]["project_milestones"]["Row"]["status"];
          due_date?: string | null;
          order_index?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<
          Database["public"]["Tables"]["project_milestones"]["Row"]
        >;
      };
      project_updates: {
        Row: {
          id: number;
          project_id: string;
          author_id: string;
          update_type: "note" | "risk" | "decision" | "retro";
          title: string;
          body: string | null;
          highlight: boolean | null;
          created_at: string;
        };
        Insert: {
          id?: number;
          project_id: string;
          author_id: string;
          update_type?: Database["public"]["Tables"]["project_updates"]["Row"]["update_type"];
          title: string;
          body?: string | null;
          highlight?: boolean | null;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["project_updates"]["Row"]>;
      };
      project_documents: {
        Row: {
          id: string;
          project_id: string;
          uploader_id: string;
          storage_path: string;
          file_name: string;
          file_type: string | null;
          file_size: number | null;
          version: number;
          description: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          project_id: string;
          uploader_id: string;
          storage_path: string;
          file_name: string;
          file_type?: string | null;
          file_size?: number | null;
          version?: number;
          description?: string | null;
          created_at?: string;
        };
        Update: Partial<
          Database["public"]["Tables"]["project_documents"]["Row"]
        >;
      };
      achievements: {
        Row: {
          id: string;
          scope: "global" | "team" | "project";
          team_id: string | null;
          project_id: string | null;
          title: string;
          description: string;
          icon: string;
          badge_color: string;
          xp_reward: number;
          category:
            | "onboarding"
            | "tasks"
            | "projects"
            | "learning"
            | "collaboration"
            | "streak"
            | "level"
            | "general";
          trigger_type:
            | "manual"
            | "task_complete"
            | "project_complete"
            | "learning_complete"
            | "xp_threshold"
            | "level_threshold"
            | "streak"
            | "count_based";
          trigger_value: number;
          trigger_conditions: Json | null;
          order_index: number;
          is_active: boolean;
          is_hidden: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          scope?: "global" | "team" | "project";
          team_id?: string | null;
          project_id?: string | null;
          title: string;
          description: string;
          icon?: string;
          badge_color?: string;
          xp_reward?: number;
          category?: Database["public"]["Tables"]["achievements"]["Row"]["category"];
          trigger_type?: Database["public"]["Tables"]["achievements"]["Row"]["trigger_type"];
          trigger_value?: number;
          trigger_conditions?: Json | null;
          order_index?: number;
          is_active?: boolean;
          is_hidden?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["achievements"]["Row"]>;
      };
      user_achievements: {
        Row: {
          id: number;
          user_id: string;
          achievement_id: string;
          earned_at: string;
          xp_awarded: number;
          progress: number;
          progress_max: number;
        };
        Insert: {
          id?: number;
          user_id: string;
          achievement_id: string;
          earned_at?: string;
          xp_awarded?: number;
          progress?: number;
          progress_max?: number;
        };
        Update: Partial<
          Database["public"]["Tables"]["user_achievements"]["Row"]
        >;
      };
      reports: {
        Row: {
          id: string;
          scope: "personal" | "team" | "project";
          team_id: string | null;
          project_id: string | null;
          uploaded_by: string;
          title: string;
          description: string | null;
          file_name: string;
          file_type: string;
          file_size: number;
          storage_path: string;
          report_period: string | null;
          tags: string[];
          is_public: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          scope: "personal" | "team" | "project";
          team_id?: string | null;
          project_id?: string | null;
          uploaded_by: string;
          title: string;
          description?: string | null;
          file_name: string;
          file_type: string;
          file_size: number;
          storage_path: string;
          report_period?: string | null;
          tags?: string[];
          is_public?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["reports"]["Row"]>;
      };
    };
  };
}

// Helper types for achievements
export type Achievement = Database["public"]["Tables"]["achievements"]["Row"];
export type UserAchievement =
  Database["public"]["Tables"]["user_achievements"]["Row"];

export type AchievementWithProgress = Achievement & {
  user_progress?: {
    progress: number;
    progress_max: number;
    earned_at: string | null;
    xp_awarded: number;
  } | null;
};

// Helper types for reports
export type Report = Database["public"]["Tables"]["reports"]["Row"];
export type ReportInsert = Database["public"]["Tables"]["reports"]["Insert"];

export type ReportWithUploader = Report & {
  profiles?: {
    id: string;
    full_name: string | null;
    avatar_url: string | null;
  } | null;
};
