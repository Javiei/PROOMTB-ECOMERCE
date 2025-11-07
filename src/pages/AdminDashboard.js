import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminRoute from '../components/AdminRoute';

function AdminDashboard() {
  return (
    <AdminRoute>
      <div className="admin-dashboard">
        <main className="admin-content">
          <Outlet />
        </main>
      </div>
    </AdminRoute>
  );
}

export default AdminDashboard;
