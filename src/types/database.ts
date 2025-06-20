// Database type definitions for the childcare worker support app

// Supabase Database Schema Types
export interface Database {
  public: {
    Tables: {
      users: {
        Row: User
        Insert: Omit<User, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<User, 'id' | 'created_at'>>
      }
      user_profiles: {
        Row: UserProfile
        Insert: Omit<UserProfile, 'created_at' | 'updated_at'>
        Update: Partial<Omit<UserProfile, 'user_id' | 'created_at'>>
      }
      classes: {
        Row: Class
        Insert: Omit<Class, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Class, 'id' | 'created_at'>>
      }
      children: {
        Row: Child
        Insert: Omit<Child, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Child, 'id' | 'created_at'>>
      }
      child_records: {
        Row: ChildRecord
        Insert: Omit<ChildRecord, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<ChildRecord, 'id' | 'created_at'>>
      }
      generation_history: {
        Row: GenerationHistory
        Insert: Omit<GenerationHistory, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<GenerationHistory, 'id' | 'created_at'>>
      }
    }
    Views: {
      child_list_view: {
        Row: ChildListItem
      }
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      class_type: ClassType
      generation_type: GenerationType
      user_role: 'teacher' | 'admin' | 'supervisor'
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

// Basic structure with empty interfaces - will be populated in subsequent tasks
export interface User {
  id: string;
  email: string;
  name: string;
  assigned_class?: string;
  created_at: Date;
  updated_at: Date;
}

export interface UserProfile {
  user_id: string;
  avatar_url?: string;
  phone?: string;
  bio?: string;
  preferences?: Record<string, unknown>;
  created_at: Date;
  updated_at: Date;
}

export interface Class {
  id: string;
  name: string;
  description?: string;
  age_range?: string;
  capacity?: number;
  created_at: Date;
  updated_at: Date;
}

// Supported class types for the childcare app
export type ClassType = 'koala' | 'bear' | 'giraffe';

export const CLASS_NAMES: Record<ClassType, string> = {
  koala: 'こあら組',
  bear: 'くま組',
  giraffe: 'きりん組'
} as const;

export interface Child {
  id: string;
  name: string;
  class_id: string;
  enrollment_date: Date;
  birth_date?: Date;
  guardian_name?: string;
  guardian_phone?: string;
  guardian_email?: string;
  medical_notes?: string;
  dietary_restrictions?: string;
  emergency_contact?: string;
  created_at: Date;
  updated_at: Date;
}

export interface ChildListItem {
  id: string;
  name: string;
  class_name: string;
  enrollment_date: Date;
  age?: number;
  recent_record_date?: Date;
}

export interface GenerationHistory {
  id: string;
  user_id: string;
  type: GenerationType;
  input: string;
  output: string;
  model_used?: string;
  tokens_used?: number;
  created_at: Date;
  updated_at: Date;
}

export type GenerationType = 'email' | 'diary' | 'record';

export interface ChildRecord {
  id: string;
  child_id: string;
  period: string; // e.g., "2024-04", "2024-Q1"
  six_areas_data: SixAreas;
  overall_notes?: string;
  goals?: string;
  concerns?: string;
  created_by: string;
  created_at: Date;
  updated_at: Date;
}

export interface SixAreas {
  yougo: AreaData; // 養護 (Care and Nurturing)
  kenkou: AreaData; // 健康 (Health)
  ningenkankei: AreaData; // 人間関係 (Human Relationships)
  kankyou: AreaData; // 環境 (Environment)
  kotoba: AreaData; // 言葉 (Language)
  hyougen: AreaData; // 表現 (Expression)
}

export interface AreaData {
  observations: string;
  development_notes: string;
  goals?: string;
  rating?: number; // 1-5 scale
}