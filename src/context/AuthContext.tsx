import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

interface UserData {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
}

interface AuthContextType {
  user: UserData | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  loading: boolean;
}

// Create context with default values
const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isAdmin: false,
  login: () => Promise.resolve(false),
  logout: () => Promise.resolve(),
  loading: true
});

// Admin email for role verification
const ADMIN_EMAIL = 'atlanticenterprise8@gmail.com';

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [supabaseUser, setSupabaseUser] = useState<User | null>(null);

  // Check for existing session and user data on mount
  useEffect(() => {
    const checkSession = async () => {
      try {
        // Get current session
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error fetching session:', error);
          setLoading(false);
          return;
        }
        
        if (session) {
          handleSessionChange(session);
        } else {
          setLoading(false);
        }
      } catch (error) {
        console.error('Error in session check:', error);
        setLoading(false);
      }
    };

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (session) {
          handleSessionChange(session);
        } else {
          setUser(null);
          setSupabaseUser(null);
          setLoading(false);
        }
      }
    );

    checkSession();

    // Clean up subscription
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Handle session changes and set user data
  const handleSessionChange = async (session: Session) => {
    setLoading(true);
    
    const currentUser = session.user;
    setSupabaseUser(currentUser);
    
    // Check if user is admin
    const isUserAdmin = currentUser.email === ADMIN_EMAIL;
    
    // Try to get user profile from DB
    let userRole: 'user' | 'admin' = isUserAdmin ? 'admin' : 'user';
    try {
      const { data: profileData, error } = await supabase
        .from('profiles')
        .select('role, name')
        .eq('id', currentUser.id)
        .single();
        
      if (!error && profileData) {
        // Ensure role is either 'user' or 'admin'
        userRole = (profileData.role === 'admin') ? 'admin' : 'user';
      }
    } catch (err) {
      console.error('Error fetching user profile:', err);
    }
    
    const userData: UserData = {
      id: currentUser.id,
      email: currentUser.email || '',
      name: currentUser.user_metadata.name || currentUser.email?.split('@')[0] || 'User',
      role: userRole
    };
    
    setUser(userData);
    setLoading(false);
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    setLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        console.error('Login error:', error.message);
        setLoading(false);
        return false;
      }
      
      // Authentication successful, session handled by onAuthStateChange
      return true;
    } catch (error) {
      console.error('Login error:', error);
      setLoading(false);
      return false;
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const isAuthenticated = !!user;
  const isAdmin = !!user && user.role === 'admin';

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated, 
      isAdmin,
      login, 
      logout,
      loading
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext); 