// User and Authentication Types
export interface User {
  id: number;
  email: string;
  name: string;
  age: number;
  roles: Role[];
  createdAt?: string;
  updatedAt?: string;
}

export const Role = {
  SUPER_ADMIN: 'super_admin',
  ADMIN: 'admin',
  USER: 'user',
} as const;

export type Role = typeof Role[keyof typeof Role];

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  name: string;
  age: number;
}

export interface AuthResponse {
  access_token: string;
  user: User;
}

// Career and Skills Types
export interface Skill {
  id: string;
  name: string;
  category: SkillCategory;
  level: SkillLevel;
  description?: string;
  icon?: string;
}

export const SkillCategory = {
  FRONTEND: 'frontend',
  BACKEND: 'backend',
  FULLSTACK: 'fullstack',
  DEVOPS: 'devops',
  MOBILE: 'mobile',
  DATA_SCIENCE: 'data-science',
  AI_ML: 'ai-ml',
  CYBERSECURITY: 'cybersecurity',
  CLOUD: 'cloud',
  TESTING: 'testing',
} as const;

export type SkillCategory = typeof SkillCategory[keyof typeof SkillCategory];

export const SkillLevel = {
  BEGINNER: 'beginner',
  INTERMEDIATE: 'intermediate',
  ADVANCED: 'advanced',
  EXPERT: 'expert',
} as const;

export type SkillLevel = typeof SkillLevel[keyof typeof SkillLevel];

export interface CareerTrack {
  id: string;
  title: string;
  description: string;
  category: SkillCategory;
  requiredSkills: string[];
  avgSalary: {
    min: number;
    max: number;
    currency: string;
  };
  demandLevel: 'low' | 'medium' | 'high' | 'very-high';
  estimatedTime: string; // e.g., "6-12 months"
  difficulty: 'easy' | 'medium' | 'hard' | 'expert';
  icon?: string;
  color?: string;
}

export interface LearningResource {
  id: string;
  title: string;
  type: ResourceType;
  url: string;
  description: string;
  duration?: string;
  difficulty: SkillLevel;
  rating?: number;
  price?: number;
  currency?: string;
  provider?: string;
}

export const ResourceType = {
  COURSE: 'course',
  VIDEO: 'video',
  ARTICLE: 'article',
  BOOK: 'book',
  TUTORIAL: 'tutorial',
  DOCUMENTATION: 'documentation',
  PROJECT: 'project',
  CERTIFICATION: 'certification',
} as const;

export type ResourceType = typeof ResourceType[keyof typeof ResourceType];

export interface RoadmapStep {
  id: string;
  title: string;
  description: string;
  skills: string[];
  resources: LearningResource[];
  estimatedTime: string;
  prerequisites?: string[];
  isCompleted: boolean;
  progress: number; // 0-100
  order: number;
}

export interface LearningRoadmap {
  id: string;
  title: string;
  description: string;
  careerTrack: CareerTrack;
  steps: RoadmapStep[];
  totalProgress: number; // 0-100
  estimatedDuration: string;
  difficulty: SkillLevel;
  createdAt: string;
  updatedAt: string;
}

// User Progress and Assessment Types
export interface UserSkillAssessment {
  skillId: string;
  currentLevel: SkillLevel;
  targetLevel: SkillLevel;
  confidence: number; // 1-10
  experience: string;
  lastUpdated: string;
}

export interface UserProfile {
  id: string;
  userId: number;
  currentRole?: string;
  targetRole?: string;
  experience: string;
  skills: UserSkillAssessment[];
  interestedCategories: SkillCategory[];
  learningGoals: string[];
  availableHoursPerWeek: number;
  preferredLearningStyle: LearningStyle[];
  currentRoadmap?: LearningRoadmap;
  completedCourses: string[];
  achievements: Achievement[];
  createdAt: string;
  updatedAt: string;
}

export const LearningStyle = {
  VISUAL: 'visual',
  AUDITORY: 'auditory',
  KINESTHETIC: 'kinesthetic',
  READING: 'reading',
  INTERACTIVE: 'interactive',
} as const;

export type LearningStyle = typeof LearningStyle[keyof typeof LearningStyle];

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  earnedAt: string;
  category: AchievementCategory;
}

export const AchievementCategory = {
  LEARNING: 'learning',
  SKILL: 'skill',
  MILESTONE: 'milestone',
  CONSISTENCY: 'consistency',
  COMMUNITY: 'community',
} as const;

export type AchievementCategory = typeof AchievementCategory[keyof typeof AchievementCategory];

// API Response Types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasNext: boolean;
  hasPrev: boolean;
}

// UI State Types
export interface LoadingState {
  isLoading: boolean;
  error: string | null;
}

export interface FilterOptions {
  category?: SkillCategory;
  difficulty?: SkillLevel;
  type?: ResourceType;
  sortBy?: 'title' | 'difficulty' | 'rating' | 'duration';
  sortOrder?: 'asc' | 'desc';
}

// Form Types
export interface ContactForm {
  name: string;
  email: string;
  message: string;
}

export interface FeedbackForm {
  rating: number;
  comment: string;
  category: 'bug' | 'feature' | 'improvement' | 'other';
}

// Navigation Types
export interface NavItem {
  id: string;
  label: string;
  path: string;
  icon?: string;
  roles?: Role[];
  children?: NavItem[];
}

// Dashboard Types
export interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  completedRoadmaps: number;
  averageProgress: number;
  mostPopularTrack: string;
  newUsersThisMonth: number;
}

export interface UserDashboardData {
  progress: {
    currentRoadmap?: LearningRoadmap;
    completedSteps: number;
    totalSteps: number;
    weeklyProgress: number;
  };
  recommendations: {
    suggestedTracks: CareerTrack[];
    nextResources: LearningResource[];
  };
  achievements: Achievement[];
  recentActivity: ActivityItem[];
}

export interface ActivityItem {
  id: string;
  type: 'course_completed' | 'skill_leveled' | 'roadmap_started' | 'achievement_earned';
  title: string;
  description: string;
  timestamp: string;
  icon?: string;
  color?: string;
}

// Error Types
export interface ApiError {
  message: string;
  statusCode: number;
  timestamp: string;
  path: string;
}

// Theme Types
export interface ThemeConfig {
  primaryColor: string;
  secondaryColor: string;
  mode: 'light' | 'dark';
} 