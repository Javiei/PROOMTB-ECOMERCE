import React, { useEffect, useState } from 'react';
import { supabase } from '../../supabaseClient';
import { Package, Bike, Wrench } from 'lucide-react';

const Dashboard = () => {
    const [stats, setStats] = useState({
        totalProducts: 0,
        totalBikes: 0,
        totalAccessories: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            // Fetch Bikes Count
            const { count: bikesCount, error: bikesError } = await supabase
                .from('bicicletas')
                .select('*', { count: 'exact', head: true });

            if (bikesError) throw bikesError;

            // Fetch Accessories Count
            const { count: accessoriesCount, error: productsError } = await supabase
                .from('products')
                .select('*', { count: 'exact', head: true });
            // Assuming 'products' table now ONLY holds accessories or we want all of them
            // If 'products' is ONLY accessories now:

            if (productsError) throw productsError;

            setStats({
                totalProducts: (bikesCount || 0) + (accessoriesCount || 0), // Total Items
                totalBikes: bikesCount || 0,
                totalAccessories: accessoriesCount || 0
            });
        } catch (error) {
            console.error('Error fetching stats:', error);
        } finally {
            setLoading(false);
        }
    };

    // --- User Management Logic ---
    const [users, setUsers] = useState([]);
    const [usersLoading, setUsersLoading] = useState(true);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setUsers(data || []);
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setUsersLoading(false);
        }
    };

    const toggleAdminRole = async (userId, currentRole) => {
        try {
            // If currently admin, set to null. If null (or user), set to admin.
            const newRole = currentRole === 'admin' ? null : 'admin';

            const { error } = await supabase
                .from('profiles')
                .update({ Role: newRole }) // Note: Capitalized 'Role' column
                .eq('id', userId);

            if (error) throw error;

            // Optimistic Update
            setUsers(users.map(user =>
                user.id === userId ? { ...user, Role: newRole } : user
            ));

            console.log(`Role updated to ${newRole} for user ${userId}`);
            // alert(`User role updated to ${newRole}`); // Optional feedback

        } catch (error) {
            console.error('Error updating role:', error);
            alert('Failed to update role');
        }
    };

    if (loading) return <div>Loading dashboard...</div>;

    const StatCard = ({ title, value, icon: Icon, color }) => (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
            <div className={`p-4 rounded-xl ${color}`}>
                <Icon size={24} className="text-white" />
            </div>
            <div>
                <p className="text-gray-500 text-sm font-medium uppercase tracking-wider">{title}</p>
                <h3 className="text-3xl font-black">{value}</h3>
            </div>
        </div>
    );

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-black uppercase tracking-tight">Dashboard Overview</h2>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard
                    title="Total Items"
                    value={stats.totalProducts}
                    icon={Package}
                    color="bg-blue-500"
                />
                <StatCard
                    title="Total Bikes"
                    value={stats.totalBikes}
                    icon={Bike}
                    color="bg-black"
                />
                <StatCard
                    title="Accessories"
                    value={stats.totalAccessories}
                    icon={Wrench}
                    color="bg-gray-500"
                />
            </div>

            {/* User Management Section */}
            <div className="pt-8">
                <h3 className="text-xl font-black uppercase tracking-tight mb-6">User Management</h3>

                <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 text-left">
                                <tr>
                                    <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">User ID / Email</th>
                                    <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Role</th>
                                    <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Created At</th>
                                    <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {usersLoading ? (
                                    <tr><td colSpan="4" className="p-8 text-center text-gray-500">Loading users...</td></tr>
                                ) : users.length === 0 ? (
                                    <tr><td colSpan="4" className="p-8 text-center text-gray-500">No users found.</td></tr>
                                ) : (
                                    users.map((user) => (
                                        <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="p-4">
                                                <div className="font-bold text-sm text-black">{user.email || 'No Email'}</div>
                                                <div className="text-xs text-gray-400 font-mono truncate max-w-[200px]">{user.id}</div>
                                            </td>
                                            <td className="p-4">
                                                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${user.Role === 'admin' ? 'bg-black text-white' : 'bg-gray-100 text-gray-600'}`}>
                                                    {user.Role === 'admin' ? 'ADMIN' : 'USER'}
                                                </span>
                                            </td>
                                            <td className="p-4 text-sm text-gray-500">
                                                {new Date(user.created_at).toLocaleDateString()}
                                            </td>
                                            <td className="p-4 text-right">
                                                <button
                                                    onClick={() => toggleAdminRole(user.id, user.Role)}
                                                    className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wide transition-colors ${user.Role === 'admin'
                                                        ? 'bg-red-50 text-red-600 hover:bg-red-100'
                                                        : 'bg-green-50 text-green-600 hover:bg-green-100'
                                                        }`}
                                                >
                                                    {user.Role === 'admin' ? 'Revoke Admin' : 'Make Admin'}
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
