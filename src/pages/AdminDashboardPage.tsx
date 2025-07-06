import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, 
  BookOpen, 
  TrendingUp, 
  Calendar,
  BarChart3,
  UserPlus,
  Target,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  Edit,
  Trash2,
  Search
} from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';
import type { User } from '../types';
import apiService from '../services/api';

const AdminDashboardPage: React.FC = () => {
  const [dashboardStats, setDashboardStats] = useState<any>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const [stats, usersData] = await Promise.all([
          apiService.getAdminDashboardStats(),
          apiService.getAllUsers()
        ]);
        setDashboardStats(stats);
        setUsers(usersData);
      } catch (error) {
        console.error('Failed to fetch admin data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAdminData();
  }, []);

  const handleDeleteUser = async (userId: number) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await apiService.deleteUser(userId);
        setUsers(users.filter(user => user.id !== userId));
      } catch (error) {
        console.error('Failed to delete user:', error);
      }
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = selectedFilter === 'all' || 
                         user.roles.includes(selectedFilter as any);
    return matchesSearch && matchesFilter;
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <LoadingSpinner size="large" text="Loading admin dashboard..." />
      </div>
    );
  }

  const stats = [
    {
      title: 'Total Users',
      value: dashboardStats?.totalUsers || 0,
      change: '+12%',
      changeType: 'positive',
      icon: Users,
      color: 'text-blue-600 bg-blue-100'
    },
    {
      title: 'Active Users',
      value: dashboardStats?.activeUsers || 0,
      change: '+8%',
      changeType: 'positive',
      icon: Activity,
      color: 'text-green-600 bg-green-100'
    },
    {
      title: 'Completed Roadmaps',
      value: dashboardStats?.completedRoadmaps || 0,
      change: '+15%',
      changeType: 'positive',
      icon: Target,
      color: 'text-purple-600 bg-purple-100'
    },
    {
      title: 'New Users This Month',
      value: dashboardStats?.newUsersThisMonth || 0,
      change: '+25%',
      changeType: 'positive',
      icon: UserPlus,
      color: 'text-orange-600 bg-orange-100'
    },
  ];

  const quickActions = [
    {
      title: 'User Management',
      description: 'Manage user accounts and roles',
      href: '/admin/users',
      icon: Users,
      color: 'bg-blue-600 hover:bg-blue-700'
    },
    {
      title: 'Analytics',
      description: 'View detailed analytics and reports',
      href: '/admin/analytics',
      icon: BarChart3,
      color: 'bg-green-600 hover:bg-green-700'
    },
    {
      title: 'Content Management',
      description: 'Manage courses and learning paths',
      href: '/admin/content',
      icon: BookOpen,
      color: 'bg-purple-600 hover:bg-purple-700'
    },
    {
      title: 'System Settings',
      description: 'Configure system settings',
      href: '/admin/settings',
      icon: Edit,
      color: 'bg-orange-600 hover:bg-orange-700'
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Admin Dashboard</h1>
            <p className="text-gray-300">
              Monitor and manage the Mentorny platform
            </p>
          </div>
          <div className="hidden md:flex items-center gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold">
                {dashboardStats?.averageProgress || 0}%
              </div>
              <div className="text-sm text-gray-300">Avg. Progress</div>
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
                <div className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value.toLocaleString()}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">{stat.title}</div>
              </div>
            </div>
            <div className={`flex items-center text-sm font-medium ${
              stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
            }`}>
              {stat.changeType === 'positive' ? (
                <ArrowUpRight className="w-4 h-4 mr-1" />
              ) : (
                <ArrowDownRight className="w-4 h-4 mr-1" />
              )}
              {stat.change}
            </div>
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
          </Link>
        ))}
      </div>

      {/* Recent Users */}
      <div className="card">
        <div className="card-header">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold flex items-center gap-2 text-gray-900 dark:text-white">
              <Users className="w-5 h-5 text-primary-600" />
              User Management
            </h2>
            <Link 
              to="/admin/users"
              className="btn btn-outline btn-sm"
            >
              View All Users
            </Link>
          </div>
        </div>
        <div className="card-content">
          {/* Search and Filter */}
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input pl-10"
              />
            </div>
            <select
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
              className="input w-auto"
            >
              <option value="all">All Roles</option>
              <option value="admin">Admin</option>
              <option value="user">User</option>
            </select>
          </div>

          {/* Users Table */}
          <div className="overflow-x-auto">
            <table className="w-full table-auto">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">User</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">Email</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">Role</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">Age</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.slice(0, 10).map((user) => (
                  <tr key={user.id} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-primary-600 to-secondary-600 rounded-full flex items-center justify-center">
                          <span className="text-white text-sm font-medium">
                            {user.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900 dark:text-white">{user.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-600 dark:text-gray-400">{user.email}</td>
                    <td className="py-3 px-4">
                      <span className={`skill-badge ${
                        user.roles.includes('admin' as any) 
                          ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300' 
                          : 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300'
                      }`}>
                        {user.roles.join(', ')}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-600 dark:text-gray-400">{user.age}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <Link
                          to={`/admin/users/${user.id}`}
                          className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg"
                          title="View User"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <Link
                          to={`/admin/users/${user.id}/edit`}
                          className="p-2 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg"
                          title="Edit User"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                          title="Delete User"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <div className="card-header">
            <h2 className="text-lg font-semibold flex items-center gap-2 text-gray-900 dark:text-white">
              <TrendingUp className="w-5 h-5 text-green-600" />
              Platform Growth
            </h2>
          </div>
          <div className="card-content">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600 dark:text-gray-400">Monthly Active Users</span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {dashboardStats?.activeUsers || 0}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600 dark:text-gray-400">Course Completions</span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {dashboardStats?.completedRoadmaps || 0}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600 dark:text-gray-400">Most Popular Track</span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {dashboardStats?.mostPopularTrack || 'N/A'}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h2 className="text-lg font-semibold flex items-center gap-2 text-gray-900 dark:text-white">
              <Calendar className="w-5 h-5 text-purple-600" />
              Recent Activity
            </h2>
          </div>
          <div className="card-content">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">New user registration</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">2 minutes ago</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Course completion</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">15 minutes ago</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">New learning path started</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">1 hour ago</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage; 