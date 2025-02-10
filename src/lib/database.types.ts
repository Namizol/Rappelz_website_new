export type Database = {
  public: {
    Tables: {
      news_articles: {
        Row: {
          id: string;
          title: string;
          content: string;
          publish_date: string;
          author_id: string;
          category: 'update' | 'event' | 'maintenance' | 'community';
          image_url: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          content: string;
          publish_date?: string;
          author_id: string;
          category?: 'update' | 'event' | 'maintenance' | 'community';
          image_url?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          content?: string;
          publish_date?: string;
          author_id?: string;
          category?: 'update' | 'event' | 'maintenance' | 'community';
          image_url?: string | null;
          created_at?: string;
        };
      };
      characters: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          level: number;
          class: 'warrior' | 'mage' | 'ranger' | 'summoner';
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          level?: number;
          class: 'warrior' | 'mage' | 'ranger' | 'summoner';
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          level?: number;
          class?: 'warrior' | 'mage' | 'ranger' | 'summoner';
          created_at?: string;
        };
      };
      website_images: {
        Row: {
          id: string;
          category: string;
          file_name: string;
          file_size: number;
          uploaded_by: string;
          uploaded_at: string;
          description: string | null;
        };
        Insert: {
          id?: string;
          category: string;
          file_name: string;
          file_size: number;
          uploaded_by: string;
          uploaded_at?: string;
          description?: string | null;
        };
        Update: {
          id?: string;
          category?: string;
          file_name?: string;
          file_size?: number;
          uploaded_by?: string;
          uploaded_at?: string;
          description?: string | null;
        };
      };
      support_tickets: {
        Row: {
          id: string;
          user_id: string;
          subject: string;
          message: string;
          category: 'technical' | 'account' | 'billing' | 'gameplay';
          status: 'open' | 'in_progress' | 'closed';
          admin_response: string | null;
          created_at: string;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          subject: string;
          message: string;
          category: 'technical' | 'account' | 'billing' | 'gameplay';
          status?: 'open' | 'in_progress' | 'closed';
          admin_response?: string | null;
          created_at?: string;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          subject?: string;
          message?: string;
          category?: 'technical' | 'account' | 'billing' | 'gameplay';
          status?: 'open' | 'in_progress' | 'closed';
          admin_response?: string | null;
          created_at?: string;
          updated_at?: string | null;
        };
      };
    };
  };
};