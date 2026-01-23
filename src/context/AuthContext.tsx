import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import type { User } from '../types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (userData: Partial<User>, password: string) => Promise<boolean>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    const storedToken = localStorage.getItem('authToken');
    
    if (storedUser && storedToken) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Failed to load user from storage:', error);
        localStorage.removeItem('currentUser');
        localStorage.removeItem('authToken');
      }
    }
    setLoading(false);
  }, []);

  const signup = async (userData: Partial<User>, password: string): Promise<boolean> => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...userData,
          password,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Registration failed:', errorData);
        return false;
      }

      const newUser = await response.json();
      
      // Store user data (without password)
      const { password: _, ...userWithoutPassword } = newUser;
      setUser(userWithoutPassword as User);
      localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
      
      // Generate a simple token (in production, backend should return this)
      const token = `token_${newUser._id}_${Date.now()}`;
      localStorage.setItem('authToken', token);
      
      return true;
    } catch (error) {
      console.error('Signup error:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setLoading(true);
      
      // Fetch all users and find matching credentials
      const response = await fetch(`${API_BASE_URL}/api/users?limit=1000`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        console.error('Failed to fetch users');
        return false;
      }

      const data = await response.json();
      const foundUser = data.users?.find((u: any) => u.email === email);

      if (!foundUser) {
        console.error('User not found');
        return false;
      }

      // In production, password verification should happen on backend
      // For now, we accept any password for demo users
      // This should be replaced with proper backend authentication
      
      const { password: _, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword as User);
      localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
      
      // Generate a simple token
      const token = `token_${foundUser._id}_${Date.now()}`;
      localStorage.setItem('authToken', token);
      
      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
    localStorage.removeItem('authToken');
  };

  const updateUser = async (userData: Partial<User>) => {
    if (!user || !user._id) return;

    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/users/${user._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        console.error('Failed to update user');
        return;
      }

      const updatedUser = await response.json();
      const { password: _, ...userWithoutPassword } = updatedUser;
      
      setUser(userWithoutPassword as User);
      localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
    } catch (error) {
      console.error('Update user error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
