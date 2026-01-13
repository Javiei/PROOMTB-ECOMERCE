import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { LogOut, User, Mail, Shield } from 'lucide-react';

const UserProfile = () => {
    const { user, signOut } = useAuth();
    const navigate = useNavigate();

    const handleSignOut = async () => {
        try {
            await signOut();
            navigate('/');
        } catch (error) {
            console.error('Error signing out:', error);
        }
    };

    if (!user) return null;

    return (
        <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto space-y-6">

                {/* Header Card */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 flex flex-col md:flex-row items-center gap-6">
                    <div className="w-24 h-24 bg-black rounded-full flex items-center justify-center text-white">
                        <span className="text-3xl font-black uppercase tracking-widest">
                            {user.email?.[0]}
                        </span>
                    </div>
                    <div className="text-center md:text-left flex-1">
                        <h1 className="text-2xl font-black uppercase tracking-tight mb-2">My Profile</h1>
                        <p className="text-gray-500 font-medium">{user.email}</p>
                        <div className="mt-4 flex flex-wrap justify-center md:justify-start gap-2">
                            <span className="px-3 py-1 bg-gray-100 rounded-full text-xs font-bold uppercase tracking-wide text-gray-600 flex items-center gap-1">
                                <Shield size={12} />
                                Rider Account
                            </span>
                        </div>
                    </div>
                </div>

                {/* Details Section */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-6 border-b border-gray-100 bg-gray-50/50">
                        <h2 className="text-lg font-bold uppercase tracking-wide">Account Details</h2>
                    </div>
                    <div className="p-6 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-1">
                                <label className="text-xs font-bold uppercase text-gray-400 flex items-center gap-2">
                                    <Mail size={12} />
                                    Email Address
                                </label>
                                <p className="font-medium text-gray-900">{user.email}</p>
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-bold uppercase text-gray-400 flex items-center gap-2">
                                    <User size={12} />
                                    User ID
                                </label>
                                <p className="font-mono text-sm text-gray-500 bg-gray-50 p-2 rounded-lg truncate">
                                    {user.id}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex justify-end">
                    <button
                        onClick={handleSignOut}
                        className="bg-white text-red-500 border border-red-100 hover:bg-red-50 px-6 py-3 rounded-xl font-bold uppercase tracking-wider transition-colors flex items-center gap-2"
                    >
                        <LogOut size={18} />
                        Sign Out
                    </button>
                </div>

            </div>
        </div>
    );
};

export default UserProfile;
