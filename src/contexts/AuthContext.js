import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  const updateUserProfile = async (user) => {
    if (!user) return null;

    try {
      // First try to get existing profile
      const { data: profile, error: fetchError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      // If no profile exists, create one
      if (fetchError || !profile) {
        const { data: newProfile, error: createError } = await supabase
          .from('profiles')
          .upsert(
            {
              id: user.id,
              email: user.email,
              full_name: user.user_metadata?.full_name ||
                user.user_metadata?.name ||
                user.email?.split('@')[0] || 'Usuario',
              avatar_url: user.user_metadata?.avatar_url || ''
            },
            { onConflict: 'id' }
          )
          .select()
          .single();

        if (createError) throw createError;
        return newProfile;
      }

      return profile;
    } catch (error) {
      console.error('Error managing user profile:', error);
      throw error;
    }
  };

  useEffect(() => {
    // Check active sessions and sets the user
    const getInitialSession = async () => {
      try {
        setLoading(true);
        const { data: { session }, error } = await supabase.auth.getSession();

        if (error) throw error;

        if (session?.user) {
          await updateUserProfile(session.user);
        }

        setSession(session);
        setUser(session?.user ?? null);
      } catch (error) {
        console.error('Error getting initial session:', error);
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    // Listen for changes in auth state
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        try {
          setLoading(true);

          if (event === 'SIGNED_IN' && session?.user) {
            await updateUserProfile(session.user);
          }

          setSession(session);
          setUser(session?.user ?? null);
        } catch (error) {
          console.error('Error in auth state change:', error);
        } finally {
          setLoading(false);
        }
      }
    );

    return () => {
      try {
        subscription?.unsubscribe();
      } catch (error) {
        console.error('Error unsubscribing from auth changes:', error);
      }
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
        // First, check if we can get the current session
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) console.error('Session error:', sessionError.message);

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
          console.error('Google OAuth error details:', error.message);
          throw error;
        }

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
