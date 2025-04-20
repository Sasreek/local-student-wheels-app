
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/sonner';

// Hook return type
interface AuthState {
  user: any;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, name: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuth = (): AuthState => {
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Attach listener for auth state changes and init user from session
  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  // Login with Supabase
  const login = async (email: string, password: string): Promise<void> => {
    setIsLoading(true);
    const { error, data } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      toast.error(error.message);
      setIsLoading(false);
      throw error;
    }
    toast.success('Successfully logged in!');
    setUser(data.user);
    setIsLoading(false);
  };

  // Signup with Supabase
  const signup = async (email: string, name: string, password: string): Promise<void> => {
    setIsLoading(true);
    // Metadata for user profile (if needed)
    const { error, data } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name },
      },
    });
    if (error) {
      toast.error(error.message);
      setIsLoading(false);
      throw error;
    }
    toast.success('Account created successfully! Please check your email to confirm.');
    setUser(data.user);
    setIsLoading(false);
  };

  // Logout with Supabase
  const logout = async (): Promise<void> => {
    await supabase.auth.signOut();
    setUser(null);
    toast.info('You have been logged out');
  };

  return {
    user,
    isLoading,
    login,
    signup,
    logout,
  };
};
