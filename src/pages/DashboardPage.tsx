import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import { 
  BookOpen, 
  Trophy, 
  Target, 
  TrendingUp, 
  Calendar,
  Clock,
  ArrowRight,
  PlayCircle,
  Award,
  Users,
  Brain,
  Zap
} from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';
import apiService from '../services/api';

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const data = await apiService.getUserDashboardData();
        setDashboardData(data);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <LoadingSpinner size="large" text="Loading your dashboard..." />
      </div>
    );
  }

  const stats = [
    { 
      icon: BookOpen, 
      label: 'Courses Completed', 
      value: '12', 
      change: '+2 this week',
      color: 'text-blue-600 bg-blue-100'
    },
    { 
      icon: Trophy, 
      label: 'Achievements Earned', 
      value: '8', 
      change: '+1 this month',
      color: 'text-yellow-600 bg-yellow-100'
    },
    { 
      icon: Target, 
      label: 'Learning Streak', 
      value: '15 days', 
      change: 'Keep it up!',
      color: 'text-green-600 bg-green-100'
    },
    { 
      icon: TrendingUp, 
      label: 'Progress This Week', 
      value: '85%', 
      change: '+15% from last week',
      color: 'text-purple-600 bg-purple-100'
    },
  ];

  const quickActions = [
    { 
      icon: PlayCircle, 
      title: 'Continue Learning', 
      description: 'Resume your current course',
      href: '/learning',
      color: 'bg-primary-600 hover:bg-primary-700'
    },
    { 
      icon: Target, 
      title: 'Explore Tracks', 
      description: 'Find your ideal career path',
      href: '/career-tracks',
      color: 'bg-secondary-600 hover:bg-secondary-700'
    },
    { 
      icon: Users, 
      title: 'Join Community', 
      description: 'Connect with other learners',
      href: '/community',
      color: 'bg-green-600 hover:bg-green-700'
    },
    { 
      icon: Brain, 
      title: 'Take Assessment', 
      description: 'Test your knowledge',
      href: '/assessment',
      color: 'bg-orange-600 hover:bg-orange-700'
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-600 to-secondary-600 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">
              Welcome back, {user?.name}! 👋
            </h1>
            <p className="text-primary-100">
              Ready to continue your learning journey? You're making great progress!
            </p>
          </div>
          <div className="hidden md:flex items-center gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold">
                {dashboardData?.progress?.totalProgress || 35}%
              </div>
              <div className="text-sm text-primary-200">Overall Progress</div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="stats-card">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-lg ${stat.color}`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                <div className="text-sm text-gray-500">{stat.label}</div>
              </div>
            </div>
            <div className="text-sm text-green-600 font-medium">{stat.change}</div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {quickActions.map((action, index) => (
          <Link 
            key={index}
            to={action.href}
            className={`${action.color} text-white p-6 rounded-xl hover:scale-105 transition-transform duration-200 group`}
          >
            <action.icon className="w-8 h-8 mb-3" />
            <h3 className="font-semibold text-lg mb-1">{action.title}</h3>
            <p className="text-sm opacity-90">{action.description}</p>
            <ArrowRight className="w-4 h-4 mt-2 group-hover:translate-x-1 transition-transform" />
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Current Progress */}
        <div className="card">
          <div className="card-header">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Target className="w-5 h-5 text-primary-600" />
              Current Learning Path
            </h2>
          </div>
          <div className="card-content">
            {dashboardData?.progress?.currentRoadmap ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {dashboardData.progress.currentRoadmap.title}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {dashboardData.progress.completedSteps} of {dashboardData.progress.totalSteps} steps completed
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-primary-600">
                      {dashboardData.progress.currentRoadmap.totalProgress}%
                    </div>
                  </div>
                </div>
                
                <div className="progress-bar">
                  <div 
                    className="progress-fill"
                    style={{ width: `${dashboardData.progress.currentRoadmap.totalProgress}%` }}
                  />
                </div>
                
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span>Estimated completion: {dashboardData.progress.currentRoadmap.estimatedDuration}</span>
                  <Link 
                    to="/learning"
                    className="text-primary-600 hover:text-primary-700 font-medium"
                  >
                    Continue Learning →
                  </Link>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <Target className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No active learning path
                </h3>
                <p className="text-gray-600 mb-4">
                  Start your career journey by choosing a learning path
                </p>
                <Link 
                  to="/career-tracks"
                  className="btn btn-primary"
                >
                  Explore Career Tracks
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Recommendations */}
        <div className="card">
          <div className="card-header">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-500" />
              Recommended for You
            </h2>
          </div>
          <div className="card-content">
            <div className="space-y-4">
              {dashboardData?.recommendations?.suggestedTracks?.map((track: any, index: number) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4 hover:border-primary-300 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-gray-900">{track.title}</h3>
                    <span className="text-sm text-primary-600 font-medium">
                      {track.matchPercentage}% match
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{track.description}</p>
                  <Link 
                    to={`/career-tracks/${track.id}`}
                    className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                  >
                    Learn More →
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Achievements */}
        <div className="card">
          <div className="card-header">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Trophy className="w-5 h-5 text-yellow-500" />
              Recent Achievements
            </h2>
          </div>
          <div className="card-content">
            {dashboardData?.achievements?.length > 0 ? (
              <div className="space-y-3">
                {dashboardData.achievements.map((achievement: any, index: number) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="text-2xl">{achievement.icon}</div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{achievement.title}</h3>
                      <p className="text-sm text-gray-600">{achievement.description}</p>
                    </div>
                    <div className="text-sm text-gray-500">
                      {new Date(achievement.earnedAt).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Award className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">
                  Complete your first course to earn achievements!
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="card">
          <div className="card-header">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Clock className="w-5 h-5 text-gray-500" />
              Recent Activity
            </h2>
          </div>
          <div className="card-content">
            {dashboardData?.recentActivity?.length > 0 ? (
              <div className="space-y-3">
                {dashboardData.recentActivity.map((activity: any, index: number) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="text-lg">{activity.icon}</div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{activity.title}</h3>
                      <p className="text-sm text-gray-600">{activity.description}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(activity.timestamp).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">
                  Your recent activity will appear here
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage; 