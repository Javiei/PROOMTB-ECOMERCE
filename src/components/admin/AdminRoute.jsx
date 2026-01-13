import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const AdminRoute = () => {
    const { user, loading: authLoading } = useAuth();
    const [isAdmin, setIsAdmin] = React.useState(null);
    const [roleCheckLoading, setRoleCheckLoading] = React.useState(true);

    React.useEffect(() => {
        const checkAdminRole = async () => {
            if (!user) {
                setIsAdmin(false);
                setRoleCheckLoading(false);
                return;
            }

            try {
                const { data, error } = await import('../../supabaseClient').then(module =>
                    module.supabase
                        .from('profiles')
                        .select('Role')
                        .eq('id', user.id)
                        .single()
                );

                if (error || !data) {
                    // Fallback: If profile doesn't exist yet but email matches hardcoded admin
                    // This creates a safety net while you set up the DB
                    if (user.email.toLowerCase() === 'albelcorlione@gmail.com') {
                        setIsAdmin(true);
                    } else {
                        setIsAdmin(false);
                    }
                } else {
                    setIsAdmin(data.Role === 'admin');
                }
            } catch (err) {
                console.error('Error checking admin role:', err);
                setIsAdmin(false);
            } finally {
                setRoleCheckLoading(false);
            }
        };

        if (!authLoading) {
            checkAdminRole();
        }
    }, [user, authLoading]);

    if (authLoading || roleCheckLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
            </div>
        );
    }

    if (!isAdmin) {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
};

export default AdminRoute;
