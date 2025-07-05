import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { type User, Role } from '../types';
import apiService from '../services/api';
import { toast } from 'react-hot-toast';
import { User as UserIcon, Shield, Edit2, Save, X, Search, Filter, Users, Crown } from 'lucide-react';

const AdminUsersPage: React.FC = () => {
  const { user: currentUser, isSuperAdmin } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState<string>('all');

  // Fetch all users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const allUsers = await apiService.getAllUsers();
        setUsers(allUsers);
      } catch (error: any) {
        toast.error(error.message || 'Failed to fetch users');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Filter users based on search and role filter
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || user.roles.includes(filterRole as Role);
    return matchesSearch && matchesRole;
  });

  // Handle role toggle
  const handleRoleToggle = async (userId: number, role: Role) => {
    try {
      const userToUpdate = users.find(u => u.id === userId);
      if (!userToUpdate) return;

      // Prevent modifying super admin
      if (userToUpdate.roles.includes(Role.SUPER_ADMIN)) {
        toast.error('Super admin roles cannot be modified');
        return;
      }

      // Only super admin can assign admin roles
      if (role === Role.ADMIN && !isSuperAdmin()) {
        toast.error('Only super admin can manage admin roles');
        return;
      }

      const currentRoles = userToUpdate.roles;
      const newRoles = currentRoles.includes(role)
        ? currentRoles.filter(r => r !== role)
        : [...currentRoles, role];

      // Ensure user always has at least the USER role
      if (!newRoles.includes(Role.USER)) {
        newRoles.push(Role.USER);
      }

      const updatedUser = await apiService.updateUserRoles(userId, newRoles);
      
      // Update local state
      setUsers(prev => prev.map(u => 
        u.id === userId ? { ...u, roles: updatedUser.roles } : u
      ));

      toast.success('User roles updated successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to update user roles');
    }
  };

  // Handle user deletion
  const handleDeleteUser = async (userId: number) => {
    const userToDelete = users.find(u => u.id === userId);
    if (!userToDelete) return;

    if (userId === currentUser?.id) {
      toast.error('You cannot delete your own account');
      return;
    }

    // Prevent deleting super admin
    if (userToDelete.roles.includes(Role.SUPER_ADMIN)) {
      toast.error('Super admin cannot be deleted');
      return;
    }

    // Only super admin can delete admin users
    if (userToDelete.roles.includes(Role.ADMIN) && !isSuperAdmin()) {
      toast.error('Only super admin can delete admin users');
      return;
    }

    const confirmed = window.confirm('Are you sure you want to delete this user? This action cannot be undone.');
    if (!confirmed) return;

    try {
      await apiService.deleteUser(userId);
      setUsers(prev => prev.filter(u => u.id !== userId));
      toast.success('User deleted successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete user');
    }
  };

  // Get role badge color and text
  const getRoleBadge = (role: Role) => {
    switch (role) {
      case Role.SUPER_ADMIN:
        return { color: 'bg-red-100 text-red-800', text: 'Super Admin', icon: <Crown className="w-3 h-3" /> };
      case Role.ADMIN:
        return { color: 'bg-purple-100 text-purple-800', text: 'Admin', icon: <Shield className="w-3 h-3" /> };
      case Role.USER:
        return { color: 'bg-blue-100 text-blue-800', text: 'User', icon: <UserIcon className="w-3 h-3" /> };
      default:
        return { color: 'bg-gray-100 text-gray-800', text: role, icon: null };
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
            <p className="text-gray-600 mt-1">
              {isSuperAdmin() ? 'Manage all user accounts and roles' : 'Manage user accounts'}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-2 bg-blue-100 px-3 py-2 rounded-lg">
              <Users className="w-4 h-4 text-blue-600" />
              <span className="text-blue-800 font-medium">{filteredUsers.length} Users</span>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search users by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Roles</option>
              <option value="user">Users</option>
              <option value="admin">Admins</option>
              {isSuperAdmin() && <option value="super_admin">Super Admins</option>}
            </select>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Age
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Roles
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Member Since
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        user.roles.includes(Role.SUPER_ADMIN) 
                          ? 'bg-gradient-to-br from-red-400 to-red-600' 
                          : user.roles.includes(Role.ADMIN)
                          ? 'bg-gradient-to-br from-purple-400 to-purple-600'
                          : 'bg-gradient-to-br from-blue-400 to-blue-600'
                      }`}>
                        {user.roles.includes(Role.SUPER_ADMIN) ? (
                          <Crown className="w-5 h-5 text-white" />
                        ) : user.roles.includes(Role.ADMIN) ? (
                          <Shield className="w-5 h-5 text-white" />
                        ) : (
                          <UserIcon className="w-5 h-5 text-white" />
                        )}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {user.age} years
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      {user.roles.map((role) => {
                        const badge = getRoleBadge(role);
                        return (
                          <span
                            key={role}
                            className={`px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1 ${badge.color}`}
                          >
                            {badge.icon}
                            <span>{badge.text}</span>
                          </span>
                        );
                      })}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      {/* Super Admin cannot be modified */}
                      {user.roles.includes(Role.SUPER_ADMIN) ? (
                        <span className="text-xs text-gray-500 italic">Protected</span>
                      ) : (
                        <>
                          {/* Toggle Admin Role - Only Super Admin can do this */}
                          {isSuperAdmin() && (
                            <button
                              onClick={() => handleRoleToggle(user.id, Role.ADMIN)}
                              className={`flex items-center space-x-1 px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                                user.roles.includes(Role.ADMIN)
                                  ? 'bg-purple-100 text-purple-800 hover:bg-purple-200'
                                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                              }`}
                              disabled={user.id === currentUser?.id}
                            >
                              <Shield className="w-3 h-3" />
                              <span>{user.roles.includes(Role.ADMIN) ? 'Remove Admin' : 'Make Admin'}</span>
                            </button>
                          )}

                          {/* Delete User */}
                          {((user.roles.includes(Role.ADMIN) && isSuperAdmin()) || 
                            (!user.roles.includes(Role.ADMIN) && !user.roles.includes(Role.SUPER_ADMIN))) && 
                            user.id !== currentUser?.id && (
                            <button
                              onClick={() => handleDeleteUser(user.id)}
                              className="flex items-center space-x-1 px-3 py-1 rounded-md text-xs font-medium bg-red-100 text-red-800 hover:bg-red-200 transition-colors"
                            >
                              <X className="w-3 h-3" />
                              <span>Delete</span>
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <UserIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No users found</h3>
            <p className="text-gray-500">
              {searchTerm || filterRole !== 'all' 
                ? 'Try adjusting your search or filter criteria.' 
                : 'No users are available.'}
            </p>
          </div>
        )}
      </div>

      {/* User Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{users.length}</h3>
              <p className="text-gray-600">Total Users</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mr-4">
              <Crown className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                {users.filter(u => u.roles.includes(Role.SUPER_ADMIN)).length}
              </h3>
              <p className="text-gray-600">Super Admins</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
              <Shield className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                {users.filter(u => u.roles.includes(Role.ADMIN) && !u.roles.includes(Role.SUPER_ADMIN)).length}
              </h3>
              <p className="text-gray-600">Administrators</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
              <UserIcon className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                {users.filter(u => u.roles.includes(Role.USER) && !u.roles.includes(Role.ADMIN) && !u.roles.includes(Role.SUPER_ADMIN)).length}
              </h3>
              <p className="text-gray-600">Regular Users</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminUsersPage; 