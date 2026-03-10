import { Edit, Trash2 } from 'lucide-react';

const mockUsers = [
  { _id: '1', name: 'Admin User', email: 'admin@sportsgear.com', isAdmin: true },
  { _id: '2', name: 'John Doe', email: 'john@example.com', isAdmin: false },
  { _id: '3', name: 'Jane Smith', email: 'jane@example.com', isAdmin: false },
];

const Users = () => {
  return (
    <div className="p-6 max-w-7xl mx-auto animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Users Management</h1>
        <p className="text-gray-500 mt-1 font-medium">Manage customer accounts and admins.</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-sm border-b border-gray-200">
                <th className="p-4 font-semibold">ID</th>
                <th className="p-4 font-semibold">Name</th>
                <th className="p-4 font-semibold">Email</th>
                <th className="p-4 font-semibold">Role</th>
                <th className="p-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {mockUsers.map((user) => (
                <tr key={user._id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4 font-medium text-gray-900">USR-{user._id}</td>
                  <td className="p-4 text-gray-700">{user.name}</td>
                  <td className="p-4 text-gray-500">{user.email}</td>
                  <td className="p-4">
                     {user.isAdmin ? (
                        <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded-full text-xs font-bold">Admin</span>
                     ) : (
                        <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs font-bold">Customer</span>
                     )}
                  </td>
                  <td className="p-4 text-right space-x-2">
                    <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors inline-block">
                      <Edit className="w-4 h-4" />
                    </button>
                    {!user.isAdmin && (
                      <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors inline-block">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Users;
