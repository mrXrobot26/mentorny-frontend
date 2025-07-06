import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { type User, Role } from '../types';
import { toast } from 'react-hot-toast';
import { 
  User as UserIcon, 
  Shield, 
  Search, 
  Filter, 
  Users, 
  Crown, 
  Eye, 
  Edit, 
  Trash2, 
  Download
} from 'lucide-react';

const AdminUsersPage: React.FC = () => {
  const { user: currentUser, isSuperAdmin, getAllUsers, updateUserRoles, deleteUser } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<{ [key: number]: boolean }>({});

  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState<string>('all');

  // Fetch all users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const allUsers = await getAllUsers();
        setUsers(allUsers);
      } catch (error: any) {
        // Error handling is already done in AuthContext
        console.error('Failed to fetch users:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [getAllUsers]);

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
      setActionLoading(prev => ({ ...prev, [userId]: true }));
      
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

      const updatedUser = await updateUserRoles(userId, newRoles);
      
      // Update local state
      setUsers(prev => prev.map(u => 
        u.id === userId ? { ...u, roles: updatedUser.roles } : u
      ));
    } catch (error: any) {
      // Error handling is already done in AuthContext
      console.error('Failed to update user roles:', error);
    } finally {
      setActionLoading(prev => ({ ...prev, [userId]: false }));
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
      setActionLoading(prev => ({ ...prev, [userId]: true }));
      await deleteUser(userId);
      setUsers(prev => prev.filter(u => u.id !== userId));
      toast.success('User deleted successfully');
    } catch (error: any) {
      // Error handling is already done in AuthContext
      console.error('Failed to delete user:', error);
    } finally {
      setActionLoading(prev => ({ ...prev, [userId]: false }));
    }
  };

  // Get role badge color and text
  const getRoleBadge = (role: Role) => {
    switch (role) {
      case Role.SUPER_ADMIN:
        return { color: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300', text: 'Super Admin', icon: <Crown className="w-3 h-3" /> };
      case Role.ADMIN:
        return { color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300', text: 'Admin', icon: <Shield className="w-3 h-3" /> };
      case Role.USER:
        return { color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300', text: 'User', icon: <UserIcon className="w-3 h-3" /> };
      default:
        return { color: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300', text: role, icon: null };
    }
  };

  // Get user avatar color based on role
  const getUserAvatarColor = (userRoles: Role[]) => {
    if (userRoles.includes(Role.SUPER_ADMIN)) return 'bg-gradient-to-br from-red-500 to-red-600';
    if (userRoles.includes(Role.ADMIN)) return 'bg-gradient-to-br from-purple-500 to-purple-600';
    return 'bg-gradient-to-br from-blue-500 to-blue-600';
  };

  // Get user initials
  const getUserInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Enhanced Header */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">User Management</h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                {isSuperAdmin() ? 'Manage all user accounts and roles' : 'Manage user accounts'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-primary-50 dark:bg-primary-900/20 px-4 py-2 rounded-lg">
              <Users className="w-4 h-4 text-primary-600" />
              <span className="text-primary-800 dark:text-primary-300 font-medium">
                {filteredUsers.length} of {users.length}
              </span>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-secondary-600 hover:bg-secondary-700 text-white rounded-lg transition-colors">
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
        </div>
      </div>

      {/* Enhanced Search and Filter */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search users by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div className="relative min-w-[200px]">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="all">All Roles</option>
              <option value="user">Users</option>
              <option value="admin">Admins</option>
              {isSuperAdmin() && <option value="super_admin">Super Admins</option>}
            </select>
          </div>
        </div>
      </div>

      {/* Enhanced Users Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-900/50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Age
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold ${getUserAvatarColor(user.roles)}`}>
                        {getUserInitials(user.name)}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">{user.name}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          Member since {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-white">{user.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-wrap gap-1">
                      {user.roles.map((role) => {
                        const badge = getRoleBadge(role);
                        return (
                          <span
                            key={role}
                            className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${badge.color}`}
                          >
                            {badge.icon}
                            <span>{badge.text}</span>
                          </span>
                        );
                      })}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {user.age}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center gap-2">
                      {/* Super Admin cannot be modified */}
                      {user.roles.includes(Role.SUPER_ADMIN) ? (
                        <span className="flex items-center gap-1 px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-lg text-xs">
                          <Shield className="w-3 h-3" />
                          Protected
                        </span>
                      ) : (
                        <>
                          {/* View User */}
                          <button
                            className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                            title="View User"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          {/* Edit User */}
                          <button
                            className="p-2 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors"
                            title="Edit User"
                          >
                            <Edit className="w-4 h-4" />
                          </button>

                          {/* Toggle Admin Role - Only Super Admin can do this */}
                          {isSuperAdmin() && (
                            <button
                              onClick={() => handleRoleToggle(user.id, Role.ADMIN)}
                              disabled={user.id === currentUser?.id || actionLoading[user.id]}
                              className={`p-2 rounded-lg transition-colors ${
                                user.roles.includes(Role.ADMIN)
                                  ? 'text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20'
                                  : 'text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                              }`}
                              title={user.roles.includes(Role.ADMIN) ? 'Remove Admin Role' : 'Grant Admin Role'}
                            >
                              {actionLoading[user.id] ? (
                                <div className="w-4 h-4 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600"></div>
                              ) : (
                                <Shield className="w-4 h-4" />
                              )}
                            </button>
                          )}

                          {/* Delete User */}
                          {((user.roles.includes(Role.ADMIN) && isSuperAdmin()) || 
                            (!user.roles.includes(Role.ADMIN) && !user.roles.includes(Role.SUPER_ADMIN))) && 
                            user.id !== currentUser?.id && (
                            <button
                              onClick={() => handleDeleteUser(user.id)}
                              disabled={actionLoading[user.id]}
                              className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                              title="Delete User"
                            >
                              {actionLoading[user.id] ? (
                                <div className="w-4 h-4 animate-spin rounded-full border-2 border-gray-300 border-t-red-600"></div>
                              ) : (
                                <Trash2 className="w-4 h-4" />
                              )}
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
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <UserIcon className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No users found</h3>
            <p className="text-gray-500 dark:text-gray-400">
              {searchTerm || filterRole !== 'all' 
                ? 'Try adjusting your search or filter criteria.' 
                : 'No users are available.'}
            </p>
          </div>
        )}
      </div>

      {/* Enhanced User Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Users</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{users.length}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Super Admins</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {users.filter(u => u.roles.includes(Role.SUPER_ADMIN)).length}
              </p>
            </div>
            <div className="w-12 h-12 bg-red-100 dark:bg-red-900/20 rounded-lg flex items-center justify-center">
              <Crown className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Administrators</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {users.filter(u => u.roles.includes(Role.ADMIN) && !u.roles.includes(Role.SUPER_ADMIN)).length}
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
              <Shield className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Regular Users</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {users.filter(u => u.roles.includes(Role.USER) && !u.roles.includes(Role.ADMIN) && !u.roles.includes(Role.SUPER_ADMIN)).length}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
              <UserIcon className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminUsersPage; 