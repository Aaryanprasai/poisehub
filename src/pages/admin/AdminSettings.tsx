
import React from 'react';
import AdminLayout from '@/components/admin/AdminLayout';

const AdminSettings = () => {
  return (
    <AdminLayout>
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Admin Settings</h1>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-500">Admin configuration settings will appear here.</p>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminSettings;
