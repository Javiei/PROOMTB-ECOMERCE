import React from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Package, LogOut, Menu, X, Users } from 'lucide-react';

import { useAuth } from '../../context/AuthContext';

const AdminLayout = () => {
    const { signOut } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

    const handleSignOut = async () => {
        try {
            await signOut();
            navigate('/');
        } catch (error) {
            console.error('Error signing out:', error);
        }
    };

    const navItems = [
        { path: '/admin', label: 'Dashboard', icon: LayoutDashboard },
        { path: '/admin/bikes', label: 'Bicycles', icon: Package },
        { path: '/admin/accessories', label: 'Accessories', icon: Package },
        { path: '/admin/attendance', label: 'Attendance', icon: Users },
    ];


    return (
        <div className="min-h-screen bg-gray-100 flex">
            {/* Sidebar - Desktop */}
            <aside className="hidden md:flex flex-col w-64 bg-black text-white min-h-screen fixed">
                <div className="p-6 border-b border-gray-800">
                    <h1 className="text-xl font-black uppercase tracking-widest">Raymon Admin</h1>
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    {navItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${location.pathname === item.path || (item.path !== '/admin' && location.pathname.startsWith(item.path))
                                ? 'bg-white text-black font-bold'
                                : 'text-gray-400 hover:text-white hover:bg-white/10'
                                }`}
                        >
                            <item.icon size={20} />
                            <span>{item.label}</span>
                        </Link>
                    ))}
                </nav>

                <div className="p-4 border-t border-gray-800">
                    <button
                        onClick={handleSignOut}
                        className="flex items-center gap-3 px-4 py-3 w-full text-red-400 hover:bg-white/5 rounded-lg transition-colors"
                    >
                        <LogOut size={20} />
                        <span>Sign Out</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 md:ml-64 flex flex-col min-w-0">
                {/* Mobile Header */}
                <header className="md:hidden bg-black text-white p-4 flex items-center justify-between">
                    <h1 className="text-lg font-black uppercase tracking-widest">Raymon Admin</h1>
                    <button onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
                        {isSidebarOpen ? <X /> : <Menu />}
                    </button>
                </header>

                {/* Mobile Sidebar */}
                {isSidebarOpen && (
                    <div className="fixed inset-0 z-50 md:hidden">
                        <div className="absolute inset-0 bg-black/50" onClick={() => setIsSidebarOpen(false)} />
                        <div className="absolute inset-y-0 left-0 w-64 bg-black text-white p-4 flex flex-col">
                            <nav className="flex-1 space-y-2 mt-8">
                                {navItems.map((item) => (
                                    <Link
                                        key={item.path}
                                        to={item.path}
                                        onClick={() => setIsSidebarOpen(false)}
                                        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${location.pathname === item.path
                                            ? 'bg-white text-black font-bold'
                                            : 'text-gray-400 hover:text-white hover:bg-white/10'
                                            }`}
                                    >
                                        <item.icon size={20} />
                                        <span>{item.label}</span>
                                    </Link>
                                ))}
                            </nav>
                            <button
                                onClick={handleSignOut}
                                className="flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-white/5 rounded-lg"
                            >
                                <LogOut size={20} />
                                <span>Sign Out</span>
                            </button>
                        </div>
                    </div>
                )}

                {/* Page Content */}
                <main className="p-6 md:p-8 overflow-y-auto h-full">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
