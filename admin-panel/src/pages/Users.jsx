import { Edit, Trash2, Loader2, UserX, AlertTriangle } from 'lucide-react';
import { useGetUsersQuery, useDeleteUserMutation } from '../api/usersApiSlice';
import { useState } from 'react';

const Users = () => {
  const { data: users = [], isLoading, isError, refetch } = useGetUsersQuery();
  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();
  const [deleteId, setDeleteId] = useState(null);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await deleteUser(id).unwrap();
      } catch (err) {
        alert(err?.data?.message || 'Failed to delete user.');
      }
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">Users Management</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1 font-medium">Manage customer accounts and admins.</p>
        </div>
        <div className="text-sm font-bold bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-3 py-1 rounded-full">
          {users.length} Users Found
        </div>
      </div>

      {isError && (
        <div className="mb-6 flex flex-col gap-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 rounded-xl p-5 text-sm">
          <div className="flex items-center gap-3 font-bold">
            <AlertTriangle className="w-5 h-5 flex-shrink-0" />
            <span>Session Authorization Failed</span>
          </div>
          <p className="pl-8 text-gray-700 dark:text-gray-300">
            Your security token has expired or is invalid due to recent updates. <strong>Please click Logout on the bottom left and log back in</strong> to regain access to user data.
          </p>
        </div>
      )}

      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-800/50 text-gray-400 dark:text-gray-500 text-xs uppercase border-b border-gray-200 dark:border-gray-800">
                <th className="p-4 font-semibold">User Info</th>
                <th className="p-4 font-semibold">Customer Details</th>
                <th className="p-4 font-semibold text-center">Admin Status</th>
                <th className="p-4 font-semibold text-center">Registration Date</th>
                <th className="p-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {isLoading ? (
                Array(5).fill(0).map((_, i) => (
                  <tr key={i}>
                    <td colSpan={5} className="p-4"><div className="h-10 bg-gray-100 dark:bg-gray-800 animate-pulse rounded-xl" /></td>
                  </tr>
                ))
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-20 text-gray-400">
                    <UserX className="w-12 h-12 mx-auto mb-3 opacity-20" />
                    <p className="font-medium">No users found</p>
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <td className="p-4">
                      <div>
                        <p className="font-bold text-gray-900 dark:text-white">{user.name}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{user.email}</p>
                        <p className="text-[10px] text-gray-300 dark:text-gray-600 font-mono mt-1">ID: {user._id}</p>
                      </div>
                    </td>
                    <td className="p-4 text-xs text-gray-600 dark:text-gray-400">
                      {user.addresses && user.addresses.length > 0 ? (
                        <div>
                          <p className="font-semibold text-gray-800 dark:text-gray-300">
                            {user.addresses.find(a => a.isDefault)?.phone || user.addresses[0].phone || 'No phone'}
                          </p>
                          <p className="truncate max-w-[200px]" title={user.addresses[0].address}>
                            {user.addresses.find(a => a.isDefault)?.address || user.addresses[0].address}
                          </p>
                          <p className="text-[10px]">
                            {user.addresses.find(a => a.isDefault)?.city || user.addresses[0].city}, {user.addresses.find(a => a.isDefault)?.country || user.addresses[0].country}
                          </p>
                        </div>
                      ) : (
                        <span className="italic text-gray-400">No details provided</span>
                      )}
                    </td>
                    <td className="p-4 text-center">
                      {user.isAdmin ? (
                        <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider">Admin</span>
                      ) : (
                        <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider">Customer</span>
                      )}
                    </td>
                    <td className="p-4 text-center text-gray-500 text-sm">
                      {new Date(user.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="p-4 text-right space-x-1">
                      {!user.isAdmin && (
                        <button 
                          onClick={() => handleDelete(user._id)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-colors inline-flex items-center"
                          title="Delete User"
                        >
                          <Trash2 className="w-4.5 h-4.5" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Users;
