import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';
import { toast } from 'sonner';

interface Profile {
  id: string;
  user_id: string;
  display_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  location: string | null;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  updateProfile: (updates: Partial<Profile>) => Promise<boolean>;
  uploadAvatar: (file: File) => Promise<string | null>;
  updateEmail: (email: string) => Promise<boolean>;
  updatePassword: (password: string) => Promise<boolean>;
  deleteAccount: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProfile = async (userId: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if (error) {
      console.error('Error fetching profile:', error);
      return null;
    }
    return data;
  };

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);

        // Defer profile fetch with setTimeout to prevent deadlock
        if (session?.user) {
          setTimeout(() => {
            fetchProfile(session.user.id).then(setProfile);
          }, 0);
        } else {
          setProfile(null);
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);

      if (session?.user) {
        fetchProfile(session.user.id).then(setProfile);
      }
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      toast.error(error.message);
      return false;
    }
    return true;
  };

  const signup = async (name: string, email: string, password: string): Promise<boolean> => {
    const redirectUrl = `${window.location.origin}/`;

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: {
          display_name: name,
        },
      },
    });

    if (error) {
      if (error.message.includes('already registered')) {
        toast.error('This email is already registered. Please login instead.');
      } else {
        toast.error(error.message);
      }
      return false;
    }
    return true;
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setProfile(null);
  };

  const updateProfile = async (updates: Partial<Profile>): Promise<boolean> => {
    if (!user) return false;

    const { error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('user_id', user.id);

    if (error) {
      toast.error('Failed to update profile');
      console.error('Profile update error:', error);
      return false;
    }

    // Refresh profile
    const updatedProfile = await fetchProfile(user.id);
    setProfile(updatedProfile);
    return true;
  };

  const uploadAvatar = async (file: File): Promise<string | null> => {
    if (!user) {
      console.warn('Upload attempted without authenticated user');
      return null;
    }

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `avatar-${Math.random().toString(36).slice(2)}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;

      console.log('Attempting to upload avatar to path:', filePath);

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, {
          upsert: true,
          contentType: file.type
        });

      if (uploadError) {
        console.error('Supabase storage upload error details:', uploadError);
        // Be more specific if it's a common error
        if (uploadError.message.includes('bucket not found')) {
          toast.error('Storage bucket "avatars" not found. Please create it in Supabase.');
        } else if (uploadError.message.includes('permission denied') || (uploadError as any).status === 403) {
          toast.error('Permission denied. Please check Supabase RLS policies for "avatars" bucket.');
        } else {
          toast.error(`Upload error: ${uploadError.message}`);
        }
        return null;
      }

      const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);

      if (!data?.publicUrl) {
        console.error('Failed to get public URL for uploaded avatar');
        toast.error('Upload succeeded but failed to generate public link.');
        return null;
      }

      console.log('Avatar uploaded successfully, public URL:', data.publicUrl);

      // Update profile with new avatar URL
      const updateSuccess = await updateProfile({ avatar_url: data.publicUrl });

      if (!updateSuccess) {
        console.error('Failed to link avatar URL to profile');
        // updateProfile already shows a toast
        return null;
      }

      toast.success('Profile picture updated successfully');
      return data.publicUrl;
    } catch (err) {
      console.error('Unexpected error during avatar upload:', err);
      return null;
    }
  };

  const updateEmail = async (email: string): Promise<boolean> => {
    const { error } = await supabase.auth.updateUser({ email });
    if (error) {
      toast.error(error.message);
      return false;
    }
    toast.success('Email update request sent! Please check your new email for verification.');
    return true;
  };

  const updatePassword = async (password: string): Promise<boolean> => {
    const { error } = await supabase.auth.updateUser({ password });
    if (error) {
      toast.error(error.message);
      return false;
    }
    toast.success('Password updated successfully');
    return true;
  };

  const deleteAccount = async (): Promise<boolean> => {
    try {
      const { error } = await (supabase as any).rpc('delete_user_account');
      if (error) {
        if (error.message.includes('function delete_user_account() does not exist')) {
          toast.error('Account deletion requires backend configuration. Please contact support.');
        } else {
          toast.error(error.message);
        }
        return false;
      }

      await logout();
      toast.success('Account deleted successfully');
      return true;
    } catch (err) {
      console.error('Delete account error:', err);
      toast.error('An unexpected error occurred during account deletion');
      return false;
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      session,
      profile,
      isAuthenticated: !!user,
      isLoading,
      login,
      signup,
      logout,
      updateProfile,
      uploadAvatar,
      updateEmail,
      updatePassword,
      deleteAccount,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
