import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check active sessions and sets the user
    const getInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    };

    getInitialSession();

    // Listen for changes in auth state
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          try {
            // Create or update user profile
            const { data: profile, error } = await supabase
              .from('profiles')
              .upsert(
                {
                  id: session.user.id,
                  email: session.user.email,
                  full_name: session.user.user_metadata?.full_name || 
                             session.user.user_metadata?.name || 
                             session.user.email.split('@')[0],
                  avatar_url: session.user.user_metadata?.avatar_url || ''
                },
                { onConflict: 'id' }
              )
              .select()
              .single();

            if (error) {
              console.error('Error creating/updating profile:', error);
            }
          } catch (err) {
            console.error('Error in auth state change:', err);
          }
        }
        
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const value = {
    signUp: async (data) => {
      const { data: signUpData, error } = await supabase.auth.signUp(data);
      if (error) throw error;
      return signUpData;
    },
    signIn: async (data) => {
      const { data: signInData, error } = await supabase.auth.signInWithPassword(data);
      if (error) throw error;
      return signInData;
    },
    signInWithGoogle: async () => {
      try {
        console.log('Initiating Google OAuth...');
        
        // First, check if we can get the current session
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
        console.log('Current session:', sessionData);
        if (sessionError) console.error('Session error:', sessionError);
        
        // Try the simplest possible OAuth configuration
        const { data, error } = await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: {
            redirectTo: window.location.origin,
            queryParams: {
              prompt: 'select_account'  // Force account selection
            }
          }
        });
        
        if (error) {
          console.error('Google OAuth error details:', {
            message: error.message,
            status: error.status,
            code: error.code,
            stack: error.stack
          });
          throw error;
        }
        
        console.log('Google OAuth response:', data);
        return data;
      } catch (err) {
        console.error('Error in signInWithGoogle:', err);
        throw err;
      }
    },
    signInWithApple: async (redirectTo = '/') => {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'apple',
        options: {
          redirectTo: `${window.location.origin}${redirectTo}`,
          scopes: 'name email',
          redirectTo: `${window.location.origin}/perfil`
        }
      });
      if (error) throw error;
      return data;
    },
    signOut: async () => {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    },
    resetPassword: async (email) => {
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) throw error;
      return data;
    },
    updatePassword: async (newPassword) => {
      const { data, error } = await supabase.auth.updateUser({
        password: newPassword
      });
      if (error) throw error;
      return data;
    },
    user,
    session,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
