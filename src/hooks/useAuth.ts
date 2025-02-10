import { useState, useEffect } from 'react';
import { supabase, refreshSession } from '../lib/supabase';
import { toast } from 'react-hot-toast';

interface User {
  id: string;
  email: string;
  role: string;
}

interface AuthError {
  message: string;
  code: string;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<AuthError | null>(null);

  useEffect(() => {
    // Check active session
    const checkSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) throw error;
        
        if (session?.user) {
          setUser({
            id: session.user.id,
            email: session.user.email!,
            role: session.user.user_metadata.role || 'user'
          });
        }
      } catch (error) {
        console.error('Session check error:', error);
        // Try to refresh the session
        const refreshedSession = await refreshSession();
        if (refreshedSession?.user) {
          setUser({
            id: refreshedSession.user.id,
            email: refreshedSession.user.email!,
            role: refreshedSession.user.user_metadata.role || 'user'
          });
        }
      } finally {
        setLoading(false);
      }
    };
    
    checkSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email!,
          role: session.user.user_metadata.role || 'user'
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleAuthError = (error: unknown) => {
    const message = error instanceof Error ? error.message : 'An unknown error occurred';
    setError({ message, code: 'unknown' });
    toast.error(message);
    return { error: message };
  };

  const signIn = async (email: string, password: string) => {
    setError(null);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      
      if (data.user) {
        setUser({
          id: data.user.id,
          email: data.user.email!,
          role: data.user.user_metadata.role || 'user'
        });
      }
      
      return { error: null };
    } catch (error) {
      return handleAuthError(error);
    }
  };

  const signUp = async (email: string, password: string) => {
    setError(null);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            role: 'user',
          },
        },
      });

      if (error) throw error;
      return { error: null };
    } catch (error) {
      return handleAuthError(error);
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut({ scope: 'local' });
      if (error) throw error;
      setUser(null);
      return { error: null };
    } catch (error) {
      return handleAuthError(error);
    }
  };

  const clearError = () => {
    setError(null);
  };

  return {
    user,
    loading,
    error,
    signIn,
    signUp,
    signOut,
    clearError,
  };
}