import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Package, User, MapPin, LogOut, Plus, Trash2, Star, CheckCircle2, Edit2, X
} from 'lucide-react';
import { useGetMyOrdersQuery } from '../slices/ordersApiSlice';
import {
  useLogoutMutation,
  useGetUserProfileQuery,
  useUpdateProfileMutation,
  useAddAddressMutation,
  useDeleteAddressMutation,
  useSetDefaultAddressMutation,
} from '../slices/usersApiSlice';
import { logout, setCredentials } from '../slices/authSlice';

// ─── Add Address Modal ──────────────────────────────────────────────────────
const AddressModal = ({ onClose, onSaved }) => {
  const [form, setForm] = useState({ fullName: '', phone: '', address: '', city: '', postalCode: '', country: '', isDefault: false });
  const [addAddress, { isLoading }] = useAddAddressMutation();

  const change = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
  };

  const submit = async (e) => {
    e.preventDefault();

    if (!/^\d+$/.test(form.postalCode)) {
      alert('Postal code must contain only numbers');
      return;
    }

    try {
      await addAddress(form).unwrap();
      onSaved();
      onClose();
    } catch (err) {
      alert(err?.data?.message || 'Failed to save address');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-800 w-full max-w-lg p-8 relative animate-fade-in">
        <button onClick={onClose} className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-900 dark:hover:text-white transition">
          <X className="w-5 h-5" />
        </button>
        <h3 className="text-xl font-extrabold text-gray-900 dark:text-white mb-6">Add New Address</h3>
        <form onSubmit={submit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1">Full Name *</label>
              <input name="fullName" required value={form.fullName} onChange={change} className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl dark:text-white outline-none focus:ring-2 focus:ring-blue-500 text-sm" placeholder="John Doe" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1">Phone</label>
              <input name="phone" value={form.phone} onChange={change} className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl dark:text-white outline-none focus:ring-2 focus:ring-blue-500 text-sm" placeholder="+91 99999 00000" />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1">Street Address *</label>
            <input name="address" required value={form.address} onChange={change} className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl dark:text-white outline-none focus:ring-2 focus:ring-blue-500 text-sm" placeholder="123 Champions Ave" />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1">City *</label>
              <input name="city" required value={form.city} onChange={change} className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl dark:text-white outline-none focus:ring-2 focus:ring-blue-500 text-sm" placeholder="Mumbai" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1">Postal Code *</label>
              <input name="postalCode" required value={form.postalCode} onChange={change} className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl dark:text-white outline-none focus:ring-2 focus:ring-blue-500 text-sm" placeholder="400001" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1">Country *</label>
              <input name="country" required value={form.country} onChange={change} className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl dark:text-white outline-none focus:ring-2 focus:ring-blue-500 text-sm" placeholder="India" />
            </div>
          </div>
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" name="isDefault" checked={form.isDefault} onChange={change} className="w-4 h-4 accent-blue-600" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Set as default shipping address</span>
          </label>
          <button type="submit" disabled={isLoading} className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold rounded-xl transition shadow-md mt-2">
            {isLoading ? 'Saving...' : 'Save Address'}
          </button>
        </form>
      </div>
    </div>
  );
};

// ─── Dashboard Page ─────────────────────────────────────────────────────────
const DashboardPage = () => {
  const [activeTab, setActiveTab] = useState('orders');
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [profileName, setProfileName] = useState('');
  const [profilePassword, setProfilePassword] = useState('');
  const [profileSaved, setProfileSaved] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth);

  const { data: orders, isLoading: ordersLoading, error: ordersError } = useGetMyOrdersQuery();
  const { data: profile, refetch: refetchProfile } = useGetUserProfileQuery();
  const { data: addresses, refetch: refetchAddresses } = useGetUserProfileQuery();
  const [logoutApiCall] = useLogoutMutation();
  const [updateProfile, { isLoading: profileUpdating }] = useUpdateProfileMutation();
  const [deleteAddress] = useDeleteAddressMutation();
  const [setDefaultAddress] = useSetDefaultAddressMutation();

  const logoutHandler = async () => {
    try { await logoutApiCall().unwrap(); } catch (e) { /* ignore */ }
    finally { dispatch(logout()); navigate('/login'); }
  };

  const profileSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      const res = await updateProfile({ name: profileName || userInfo.name, password: profilePassword || undefined }).unwrap();
      dispatch(setCredentials(res));
      setProfileSaved(true);
      setProfilePassword('');
      setTimeout(() => setProfileSaved(false), 3000);
    } catch (err) {
      alert(err?.data?.message || 'Update failed');
    }
  };

  const handleDeleteAddress = async (id) => {
    if (!window.confirm('Remove this address?')) return;
    try { await deleteAddress(id).unwrap(); refetchProfile(); }
    catch (err) { alert(err?.data?.message || 'Failed to delete'); }
  };

  const handleSetDefault = async (id) => {
    try { await setDefaultAddress(id).unwrap(); refetchProfile(); }
    catch (err) { alert(err?.data?.message || 'Failed'); }
  };

  const tabs = [
    { id: 'orders', label: 'Orders & Tracking', icon: Package },
    { id: 'profile', label: 'My Profile', icon: User },
    { id: 'address', label: 'Addresses', icon: MapPin },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in">
      {showAddressModal && (
        <AddressModal
          onClose={() => setShowAddressModal(false)}
          onSaved={() => { refetchProfile(); }}
        />
      )}

      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">My Account</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Welcome back, <span className="font-semibold text-blue-600 dark:text-blue-400">{userInfo?.name}</span></p>
        </div>
        <button onClick={logoutHandler} className="flex items-center gap-2 text-red-500 hover:text-red-700 font-semibold transition border border-red-200 dark:border-red-900 hover:bg-red-50 dark:hover:bg-red-900/20 px-4 py-2 rounded-xl">
          <LogOut className="w-4 h-4" /> Sign Out
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar */}
        <div className="lg:w-1/4">
          <div className="bg-white dark:bg-gray-900 rounded-3xl p-4 shadow-sm border border-gray-100 dark:border-gray-800 space-y-1">
            {tabs.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`w-full flex items-center px-4 py-3 rounded-xl transition text-left ${
                  activeTab === id
                    ? 'bg-blue-50 text-blue-600 dark:bg-gray-800 dark:text-blue-400 font-bold'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <Icon className="w-5 h-5 mr-3 flex-shrink-0" /> {label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="lg:w-3/4">

          {/* ── ORDERS TAB ─────────────────────────── */}
          {activeTab === 'orders' && (
            <div className="bg-white dark:bg-gray-900 rounded-3xl p-8 shadow-sm border border-gray-100 dark:border-gray-800">
              <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Order History</h2>
              {ordersLoading ? (
                <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div></div>
              ) : ordersError ? (
                <div className="bg-red-50 dark:bg-red-900/20 text-red-500 p-4 rounded-xl">{ordersError?.data?.message || 'Failed to load orders'}</div>
              ) : orders && orders.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-gray-200 dark:border-gray-800 text-gray-500 dark:text-gray-400 text-sm">
                        <th className="pb-4 font-semibold">Order ID</th>
                        <th className="pb-4 font-semibold">Date</th>
                        <th className="pb-4 font-semibold">Total</th>
                        <th className="pb-4 font-semibold">Paid</th>
                        <th className="pb-4 font-semibold">Status</th>
                        <th className="pb-4 font-semibold">Details</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                      {orders.map((order) => (
                        <tr key={order._id} className="text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/30 transition">
                          <td className="py-4 font-mono text-xs font-bold">{order._id.substring(0, 10)}…</td>
                          <td className="py-4 text-sm">{order.createdAt.substring(0, 10)}</td>
                          <td className="py-4 font-bold text-blue-600 dark:text-blue-400">₹{order.totalPrice.toFixed(2)}</td>
                          <td className="py-4">
                            {order.isPaid
                              ? <span className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1 w-fit"><CheckCircle2 className="w-3 h-3"/> Paid</span>
                              : <span className="bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400 px-2 py-1 rounded-full text-xs font-bold">Unpaid</span>}
                          </td>
                          <td className="py-4">
                            {order.isDelivered
                              ? <span className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 px-2 py-1 rounded-full text-xs font-bold">Delivered</span>
                              : <span className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 px-2 py-1 rounded-full text-xs font-bold">Processing</span>}
                          </td>
                          <td className="py-4">
                            <Link to={`/order/${order._id}`} className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:underline font-bold text-sm">
                              View <Edit2 className="w-3 h-3" />
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-16">
                  <Package className="w-16 h-16 text-gray-300 dark:text-gray-700 mx-auto mb-4" />
                  <p className="text-gray-500 dark:text-gray-400 text-lg mb-4">You haven't placed any orders yet.</p>
                  <Link to="/" className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl transition">
                    Start Shopping
                  </Link>
                </div>
              )}
            </div>
          )}

          {/* ── PROFILE TAB ────────────────────────── */}
          {activeTab === 'profile' && (
            <div className="bg-white dark:bg-gray-900 rounded-3xl p-8 shadow-sm border border-gray-100 dark:border-gray-800">
              <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Update Profile</h2>
              {profileSaved && (
                <div className="mb-6 flex items-center gap-2 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 p-4 rounded-xl">
                  <CheckCircle2 className="w-5 h-5" /> Profile updated successfully!
                </div>
              )}
              <form onSubmit={profileSubmitHandler} className="space-y-6 max-w-lg">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
                  <input
                    type="text"
                    value={profileName || profile?.name || ''}
                    onChange={(e) => setProfileName(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 dark:text-white outline-none"
                    placeholder={profile?.name}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email Address</label>
                  <input
                    type="email"
                    readOnly
                    defaultValue={profile?.email || userInfo?.email}
                    className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl cursor-not-allowed text-gray-500 dark:text-gray-400 outline-none"
                  />
                  <p className="text-xs text-gray-400 mt-1">Email cannot be changed</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">New Password <span className="text-gray-400 font-normal">(leave blank to keep current)</span></label>
                  <input
                    type="password"
                    value={profilePassword}
                    onChange={(e) => setProfilePassword(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 dark:text-white outline-none"
                    placeholder="••••••••"
                  />
                </div>
                <button
                  type="submit"
                  disabled={profileUpdating}
                  className="py-3 px-8 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold rounded-xl transition shadow-md"
                >
                  {profileUpdating ? 'Saving...' : 'Save Changes'}
                </button>
              </form>
            </div>
          )}

          {/* ── ADDRESS TAB ────────────────────────── */}
          {activeTab === 'address' && (
            <div className="bg-white dark:bg-gray-900 rounded-3xl p-8 shadow-sm border border-gray-100 dark:border-gray-800">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Saved Addresses</h2>
                <button
                  onClick={() => setShowAddressModal(true)}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2 rounded-xl transition shadow-md"
                >
                  <Plus className="w-4 h-4" /> Add Address
                </button>
              </div>

              {profile?.addresses && profile.addresses.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {profile.addresses.map((addr) => (
                    <div
                      key={addr._id}
                      className={`relative p-5 rounded-2xl border-2 transition-all ${
                        addr.isDefault
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/10'
                          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                      }`}
                    >
                      {addr.isDefault && (
                        <span className="absolute top-3 right-3 flex items-center gap-1 bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                          <Star className="w-3 h-3" /> Default
                        </span>
                      )}
                      <p className="font-bold text-gray-900 dark:text-white">{addr.fullName}</p>
                      {addr.phone && <p className="text-sm text-gray-500 dark:text-gray-400">{addr.phone}</p>}
                      <p className="text-sm text-gray-700 dark:text-gray-300 mt-2">{addr.address}</p>
                      <p className="text-sm text-gray-700 dark:text-gray-300">{addr.city}, {addr.postalCode}</p>
                      <p className="text-sm text-gray-700 dark:text-gray-300">{addr.country}</p>

                      <div className="flex items-center gap-3 mt-4">
                        {!addr.isDefault && (
                          <button
                            onClick={() => handleSetDefault(addr._id)}
                            className="text-sm text-blue-600 dark:text-blue-400 font-semibold hover:underline"
                          >
                            Set as Default
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteAddress(addr._id)}
                          className="ml-auto p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <MapPin className="w-16 h-16 text-gray-300 dark:text-gray-700 mx-auto mb-4" />
                  <p className="text-gray-500 dark:text-gray-400 text-lg mb-6">No addresses saved yet.</p>
                  <button
                    onClick={() => setShowAddressModal(true)}
                    className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl transition"
                  >
                    <Plus className="w-5 h-5" /> Add Your First Address
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
