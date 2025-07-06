import axios from 'axios';
import type { AxiosInstance, AxiosResponse } from 'axios';
import type { 
  AuthResponse, 
  LoginCredentials, 
  RegisterCredentials, 
  User, 
  Role,
  ApiError,
  RefreshTokenRequest,
  RefreshTokenResponse 
} from '../types';

// Create axios instance with base configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

class ApiService {
  private api: AxiosInstance;
  private isRefreshing = false;
  private refreshSubscribers: ((token: string) => void)[] = [];

  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor to add auth token
    this.api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('auth_token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor to handle errors and token refresh
    this.api.interceptors.response.use(
      (response: AxiosResponse) => {
        return response;
      },
      async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
          if (this.isRefreshing) {
            // If we're already refreshing, wait for it to complete
            return new Promise((resolve) => {
              this.refreshSubscribers.push((token: string) => {
                originalRequest.headers.Authorization = `Bearer ${token}`;
                resolve(this.api(originalRequest));
              });
            });
          }

          originalRequest._retry = true;
          this.isRefreshing = true;

          try {
            const refreshToken = localStorage.getItem('refresh_token');
            if (refreshToken) {
              const response = await this.refreshTokens({ refreshToken });
              const newToken = response.access_token;
              
              // Update stored tokens
              localStorage.setItem('auth_token', newToken);
              localStorage.setItem('refresh_token', response.refresh_token);
              
              // Update auth header for original request
              originalRequest.headers.Authorization = `Bearer ${newToken}`;
              
              // Resolve all waiting requests
              this.refreshSubscribers.forEach(callback => callback(newToken));
              this.refreshSubscribers = [];
              
              return this.api(originalRequest);
            }
          } catch (refreshError) {
            // Refresh failed, logout user
            this.clearAuthToken();
            window.location.href = '/login';
            return Promise.reject(refreshError);
          } finally {
            this.isRefreshing = false;
          }
        }

        if (error.response?.status === 401) {
          // Clear token and redirect to login
          this.clearAuthToken();
          window.location.href = '/login';
        }
        
        // Format error response
        const apiError: ApiError = {
          message: error.response?.data?.message || error.message || 'An error occurred',
          statusCode: error.response?.status || 500,
          timestamp: new Date().toISOString(),
          path: error.config?.url || '',
        };
        
        return Promise.reject(apiError);
      }
    );
  }

  // Authentication endpoints
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await this.api.post<AuthResponse>('/auth/login', credentials);
    return response.data;
  }

  async register(credentials: RegisterCredentials): Promise<AuthResponse> {
    const response = await this.api.post<AuthResponse>('/auth/register', credentials);
    return response.data;
  }

  async getProfile(): Promise<User> {
    const response = await this.api.get<User>('/auth/profile');
    return response.data;
  }

  async refreshTokens(refreshTokenRequest: RefreshTokenRequest): Promise<RefreshTokenResponse> {
    const response = await this.api.post<RefreshTokenResponse>('/auth/refresh', refreshTokenRequest);
    return response.data;
  }

  async logout(): Promise<void> {
    try {
      await this.api.post('/auth/logout');
    } catch (error) {
      // Even if logout fails on server, clear local tokens
      console.error('Logout error:', error);
    } finally {
      this.clearAuthToken();
    }
  }

  async updateUserRoles(userId: number, roles: Role[]): Promise<User> {
    const response = await this.api.patch<User>(`/auth/users/${userId}/roles`, { roles });
    return response.data;
  }

  // User management endpoints
  async getAllUsers(): Promise<User[]> {
    const response = await this.api.get<User[]>('/user');
    return response.data;
  }

  async getUserById(id: number): Promise<User> {
    const response = await this.api.get<User>(`/user/${id}`);
    return response.data;
  }

  async updateUser(id: number, userData: Partial<User>): Promise<User> {
    const response = await this.api.patch<User>(`/user/${id}`, userData);
    return response.data;
  }

  async deleteUser(id: number): Promise<void> {
    await this.api.delete(`/user/${id}`);
  }

  // Token management
  setAuthToken(token: string): void {
    localStorage.setItem('auth_token', token);
  }

  setRefreshToken(token: string): void {
    localStorage.setItem('refresh_token', token);
  }

  getAuthToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  getRefreshToken(): string | null {
    return localStorage.getItem('refresh_token');
  }

  clearAuthToken(): void {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return !!this.getAuthToken();
  }

  // Future API endpoints for career development features
  // These will be mock implementations for now since they don't exist in the backend yet

  // Career Tracks (Mock implementation)
  async getCareerTracks(): Promise<any[]> {
    // Mock data for career tracks
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          {
            id: '1',
            title: 'Full Stack Developer',
            description: 'Build end-to-end web applications using modern technologies',
            category: 'fullstack',
            requiredSkills: ['JavaScript', 'React', 'Node.js', 'Database'],
            avgSalary: { min: 60000, max: 120000, currency: 'USD' },
            demandLevel: 'very-high',
            estimatedTime: '8-12 months',
            difficulty: 'medium',
            icon: '💻',
            color: '#3B82F6'
          },
          {
            id: '2',
            title: 'Data Scientist',
            description: 'Analyze complex data to drive business decisions',
            category: 'data-science',
            requiredSkills: ['Python', 'Machine Learning', 'Statistics', 'SQL'],
            avgSalary: { min: 80000, max: 150000, currency: 'USD' },
            demandLevel: 'high',
            estimatedTime: '10-18 months',
            difficulty: 'hard',
            icon: '📊',
            color: '#10B981'
          },
          {
            id: '3',
            title: 'DevOps Engineer',
            description: 'Streamline development and deployment processes',
            category: 'devops',
            requiredSkills: ['Docker', 'Kubernetes', 'AWS', 'CI/CD'],
            avgSalary: { min: 70000, max: 130000, currency: 'USD' },
            demandLevel: 'high',
            estimatedTime: '6-12 months',
            difficulty: 'medium',
            icon: '⚙️',
            color: '#F59E0B'
          },
          {
            id: '4',
            title: 'Mobile Developer',
            description: 'Create native and cross-platform mobile applications',
            category: 'mobile',
            requiredSkills: ['React Native', 'Swift', 'Kotlin', 'Flutter'],
            avgSalary: { min: 65000, max: 125000, currency: 'USD' },
            demandLevel: 'high',
            estimatedTime: '6-10 months',
            difficulty: 'medium',
            icon: '📱',
            color: '#8B5CF6'
          },
          {
            id: '5',
            title: 'AI/ML Engineer',
            description: 'Build intelligent systems using AI and machine learning',
            category: 'ai-ml',
            requiredSkills: ['Python', 'TensorFlow', 'PyTorch', 'Deep Learning'],
            avgSalary: { min: 90000, max: 180000, currency: 'USD' },
            demandLevel: 'very-high',
            estimatedTime: '12-24 months',
            difficulty: 'expert',
            icon: '🤖',
            color: '#EF4444'
          },
          {
            id: '6',
            title: 'Cybersecurity Specialist',
            description: 'Protect systems and data from security threats',
            category: 'cybersecurity',
            requiredSkills: ['Network Security', 'Penetration Testing', 'Encryption', 'Risk Assessment'],
            avgSalary: { min: 75000, max: 140000, currency: 'USD' },
            demandLevel: 'very-high',
            estimatedTime: '8-16 months',
            difficulty: 'hard',
            icon: '🔒',
            color: '#DC2626'
          }
        ]);
      }, 500);
    });
  }

  // Learning Resources (Mock implementation)
  async getLearningResources(): Promise<any[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          {
            id: '1',
            title: 'Complete React Developer Course',
            type: 'course',
            url: 'https://example.com/react-course',
            description: 'Master React from basics to advanced concepts',
            duration: '40 hours',
            difficulty: 'intermediate',
            rating: 4.8,
            price: 99,
            currency: 'USD',
            provider: 'TechAcademy'
          },
          {
            id: '2',
            title: 'Node.js API Development',
            type: 'course',
            url: 'https://example.com/nodejs-course',
            description: 'Build scalable backend APIs with Node.js',
            duration: '25 hours',
            difficulty: 'intermediate',
            rating: 4.6,
            price: 79,
            currency: 'USD',
            provider: 'DevMaster'
          },
          {
            id: '3',
            title: 'Python for Data Science',
            type: 'course',
            url: 'https://example.com/python-datascience',
            description: 'Learn Python programming for data analysis',
            duration: '50 hours',
            difficulty: 'beginner',
            rating: 4.9,
            price: 129,
            currency: 'USD',
            provider: 'DataLearn'
          }
        ]);
      }, 500);
    });
  }

  // User Dashboard Data (Mock implementation)
  async getUserDashboardData(): Promise<any> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          progress: {
            currentRoadmap: {
              id: '1',
              title: 'Full Stack Developer Path',
              totalProgress: 35,
              estimatedDuration: '8 months'
            },
            completedSteps: 7,
            totalSteps: 20,
            weeklyProgress: 15
          },
          recommendations: {
            suggestedTracks: [
              {
                id: '2',
                title: 'Frontend Specialist',
                description: 'Focus on modern frontend technologies',
                matchPercentage: 85
              }
            ],
            nextResources: [
              {
                id: '1',
                title: 'Advanced React Patterns',
                type: 'course',
                priority: 'high'
              }
            ]
          },
          achievements: [
            {
              id: '1',
              title: 'First Course Completed',
              description: 'Completed your first learning course',
              icon: '🎉',
              color: '#10B981',
              earnedAt: '2024-01-15T10:30:00Z',
              category: 'learning'
            }
          ],
          recentActivity: [
            {
              id: '1',
              type: 'course_completed',
              title: 'JavaScript Fundamentals',
              description: 'Completed the JavaScript basics course',
              timestamp: '2024-01-20T14:30:00Z',
              icon: '✅',
              color: '#10B981'
            }
          ]
        });
      }, 500);
    });
  }

  // Admin Dashboard Stats (Mock implementation)
  async getAdminDashboardStats(): Promise<any> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          totalUsers: 1250,
          activeUsers: 892,
          completedRoadmaps: 345,
          averageProgress: 42,
          mostPopularTrack: 'Full Stack Developer',
          newUsersThisMonth: 156
        });
      }, 500);
    });
  }
}

// Export singleton instance
export const apiService = new ApiService();
export default apiService; 