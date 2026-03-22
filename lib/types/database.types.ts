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
          username: string;
          full_name: string | null;
          role: "user" | "coach";
          avatar_url: string | null;
          points: number;
          streak_count: number;
          last_workout_date: string | null;
          created_at: string;
        };
        Insert: {
          id: string;
          username: string;
          full_name?: string | null;
          role?: "user" | "coach";
          avatar_url?: string | null;
          points?: number;
          streak_count?: number;
          last_workout_date?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          username?: string;
          full_name?: string | null;
          role?: "user" | "coach";
          avatar_url?: string | null;
          points?: number;
          streak_count?: number;
          last_workout_date?: string | null;
          created_at?: string;
        };
      };
      exercises: {
        Row: {
          id: string;
          name: string;
          muscle_group:
            | "chest"
            | "back"
            | "shoulders"
            | "arms"
            | "legs"
            | "core"
            | "full_body"
            | "cardio"
            | null;
          equipment:
            | "barbell"
            | "dumbbell"
            | "machine"
            | "bodyweight"
            | "cable"
            | "other"
            | null;
          description: string | null;
          created_by: string | null;
          is_public: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          muscle_group?:
            | "chest"
            | "back"
            | "shoulders"
            | "arms"
            | "legs"
            | "core"
            | "full_body"
            | "cardio"
            | null;
          equipment?:
            | "barbell"
            | "dumbbell"
            | "machine"
            | "bodyweight"
            | "cable"
            | "other"
            | null;
          description?: string | null;
          created_by?: string | null;
          is_public?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          muscle_group?:
            | "chest"
            | "back"
            | "shoulders"
            | "arms"
            | "legs"
            | "core"
            | "full_body"
            | "cardio"
            | null;
          equipment?:
            | "barbell"
            | "dumbbell"
            | "machine"
            | "bodyweight"
            | "cable"
            | "other"
            | null;
          description?: string | null;
          created_by?: string | null;
          is_public?: boolean;
          created_at?: string;
        };
      };
      workouts: {
        Row: {
          id: string;
          title: string;
          description: string | null;
          format: "routine" | "challenge";
          created_by: string | null;
          is_public: boolean;
          duration_estimate: number | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description?: string | null;
          format?: "routine" | "challenge";
          created_by?: string | null;
          is_public?: boolean;
          duration_estimate?: number | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string | null;
          format?: "routine" | "challenge";
          created_by?: string | null;
          is_public?: boolean;
          duration_estimate?: number | null;
          created_at?: string;
        };
      };
      workout_exercises: {
        Row: {
          id: string;
          workout_id: string;
          exercise_id: string;
          order_index: number;
          sets: number;
          reps: number | null;
          duration_seconds: number | null;
          weight_kg: number | null;
          rest_seconds: number;
          notes: string | null;
        };
        Insert: {
          id?: string;
          workout_id: string;
          exercise_id: string;
          order_index: number;
          sets?: number;
          reps?: number | null;
          duration_seconds?: number | null;
          weight_kg?: number | null;
          rest_seconds?: number;
          notes?: string | null;
        };
        Update: {
          id?: string;
          workout_id?: string;
          exercise_id?: string;
          order_index?: number;
          sets?: number;
          reps?: number | null;
          duration_seconds?: number | null;
          weight_kg?: number | null;
          rest_seconds?: number;
          notes?: string | null;
        };
      };
      saved_workouts: {
        Row: {
          user_id: string;
          workout_id: string;
          saved_at: string;
        };
        Insert: {
          user_id: string;
          workout_id: string;
          saved_at?: string;
        };
        Update: {
          user_id?: string;
          workout_id?: string;
          saved_at?: string;
        };
      };
      calendar_entries: {
        Row: {
          id: string;
          user_id: string;
          workout_id: string;
          scheduled_date: string;
          is_completed: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          workout_id: string;
          scheduled_date: string;
          is_completed?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          workout_id?: string;
          scheduled_date?: string;
          is_completed?: boolean;
          created_at?: string;
        };
      };
      workout_sessions: {
        Row: {
          id: string;
          user_id: string;
          workout_id: string | null;
          calendar_entry_id: string | null;
          started_at: string;
          completed_at: string | null;
          duration_seconds: number | null;
          total_volume_kg: number | null;
          notes: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          workout_id?: string | null;
          calendar_entry_id?: string | null;
          started_at?: string;
          completed_at?: string | null;
          duration_seconds?: number | null;
          total_volume_kg?: number | null;
          notes?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          workout_id?: string | null;
          calendar_entry_id?: string | null;
          started_at?: string;
          completed_at?: string | null;
          duration_seconds?: number | null;
          total_volume_kg?: number | null;
          notes?: string | null;
        };
      };
      session_logs: {
        Row: {
          id: string;
          session_id: string;
          exercise_id: string | null;
          order_index: number | null;
          sets_data: Json;
        };
        Insert: {
          id?: string;
          session_id: string;
          exercise_id?: string | null;
          order_index?: number | null;
          sets_data?: Json;
        };
        Update: {
          id?: string;
          session_id?: string;
          exercise_id?: string | null;
          order_index?: number | null;
          sets_data?: Json;
        };
      };
      badges: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          icon: string | null;
          condition_type: string | null;
          condition_value: number | null;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          icon?: string | null;
          condition_type?: string | null;
          condition_value?: number | null;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          icon?: string | null;
          condition_type?: string | null;
          condition_value?: number | null;
        };
      };
      user_badges: {
        Row: {
          user_id: string;
          badge_id: string;
          earned_at: string;
        };
        Insert: {
          user_id: string;
          badge_id: string;
          earned_at?: string;
        };
        Update: {
          user_id?: string;
          badge_id?: string;
          earned_at?: string;
        };
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}

// Convenience types
export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type Exercise = Database["public"]["Tables"]["exercises"]["Row"];
export type Workout = Database["public"]["Tables"]["workouts"]["Row"];
export type WorkoutExercise =
  Database["public"]["Tables"]["workout_exercises"]["Row"];
export type CalendarEntry =
  Database["public"]["Tables"]["calendar_entries"]["Row"];
export type WorkoutSession =
  Database["public"]["Tables"]["workout_sessions"]["Row"];
export type SessionLog = Database["public"]["Tables"]["session_logs"]["Row"];
export type Badge = Database["public"]["Tables"]["badges"]["Row"];
export type UserBadge = Database["public"]["Tables"]["user_badges"]["Row"];

export type SetData = {
  set: number;
  reps: number;
  weight_kg: number;
  done: boolean;
};

export type WorkoutWithExercises = Workout & {
  workout_exercises: (WorkoutExercise & { exercise: Exercise })[];
};
