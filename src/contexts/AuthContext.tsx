import React, { createContext, useContext, useState, useEffect } from 'react';
import { type User, type LoginCredentials, type RegisterCredentials, type AuthResponse, Role } from '../types';
import apiService from '../services/api';
import { toast } from 'react-hot-toast';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<boolean>;
  register: (credentials: RegisterCredentials) => Promise<boolean>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  hasRole: (role: Role) => boolean;
  isAdmin: () => boolean;
  isSuperAdmin: () => boolean;
  updateUserRoles: (userId: number, roles: Role[]) => Promise<User>;
  getAllUsers: () => Promise<User[]>;
  getUserById: (id: number) => Promise<User>;
  updateUser: (id: number, userData: Partial<User>) => Promise<User>;
  deleteUser: (id: number) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing auth token on app start
  useEffect(() => {
    const initAuth = async () => {
      try {
        const token = apiService.getAuthToken();
        if (token) {
          // Verify token and get user profile
          const userProfile = await apiService.getProfile();
          setUser(userProfile);
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        // Clear invalid token
        apiService.clearAuthToken();
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    try {
      setIsLoading(true);
      const response: AuthResponse = await apiService.login(credentials);
      
      // Store tokens and user data
      apiService.setAuthToken(response.access_token);
      apiService.setRefreshToken(response.refresh_token);
      setUser(response.user);
      
      // Store user data in localStorage for persistence
      localStorage.setItem('user', JSON.stringify(response.user));
      
      toast.success('Login successful!');
      return true;
    } catch (error: any) {
      console.error('Login error:', error);
      toast.error(error.message || 'Login failed');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (credentials: RegisterCredentials): Promise<boolean> => {
    try {
      setIsLoading(true);
      const response: AuthResponse = await apiService.register(credentials);
      
      // Store tokens and user data
      apiService.setAuthToken(response.access_token);
      apiService.setRefreshToken(response.refresh_token);
      setUser(response.user);
      
      // Store user data in localStorage for persistence
      localStorage.setItem('user', JSON.stringify(response.user));
      
      toast.success('Registration successful! Welcome to Mentorny!');
      return true;
    } catch (error: any) {
      console.error('Registration error:', error);
      toast.error(error.message || 'Registration failed');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await apiService.logout();
      setUser(null);
      toast.success('Logged out successfully');
    } catch (error: any) {
      console.error('Logout error:', error);
      // Even if logout fails on server, clear local state
      setUser(null);
      toast.success('Logged out successfully');
    }
  };

  const refreshProfile = async (): Promise<void> => {
    try {
      const userProfile = await apiService.getProfile();
      setUser(userProfile);
      localStorage.setItem('user', JSON.stringify(userProfile));
    } catch (error) {
      console.error('Profile refresh error:', error);
      // If profile refresh fails, logout user
      logout();
    }
  };

  const hasRole = (role: Role): boolean => {
    return user?.roles?.includes(role) || false;
  };

  const isAdmin = (): boolean => {
    return hasRole(Role.ADMIN) || hasRole(Role.SUPER_ADMIN);
  };

  const isSuperAdmin = (): boolean => {
    return hasRole(Role.SUPER_ADMIN);
  };

  // Role management methods
  const updateUserRoles = async (userId: number, roles: Role[]): Promise<User> => {
    try {
      const updatedUser = await apiService.updateUserRoles(userId, roles);
      toast.success('User roles updated successfully');
      return updatedUser;
    } catch (error: any) {
      console.error('Update user roles error:', error);
      toast.error(error.message || 'Failed to update user roles');
      throw error;
    }
  };

  // User management methods
  const getAllUsers = async (): Promise<User[]> => {
    try {
      return await apiService.getAllUsers();
    } catch (error: any) {
      console.error('Get all users error:', error);
      toast.error(error.message || 'Failed to fetch users');
      throw error;
    }
  };

  const getUserById = async (id: number): Promise<User> => {
    try {
      return await apiService.getUserById(id);
    } catch (error: any) {
      console.error('Get user by ID error:', error);
      toast.error(error.message || 'Failed to fetch user');
      throw error;
    }
  };

  const updateUser = async (id: number, userData: Partial<User>): Promise<User> => {
    try {
      const updatedUser = await apiService.updateUser(id, userData);
      toast.success('User updated successfully');
      return updatedUser;
    } catch (error: any) {
      console.error('Update user error:', error);
      toast.error(error.message || 'Failed to update user');
      throw error;
    }
  };

  const deleteUser = async (id: number): Promise<void> => {
    try {
      await apiService.deleteUser(id);
      toast.success('User deleted successfully');
    } catch (error: any) {
      console.error('Delete user error:', error);
      toast.error(error.message || 'Failed to delete user');
      throw error;
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
    refreshProfile,
    hasRole,
    isAdmin,
    isSuperAdmin,
    updateUserRoles,
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider; 