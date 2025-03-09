
import React from 'react';
import AdminLayout from '@/components/admin/AdminLayout';

const AdminDeletionRequests = () => {
  return (
    <AdminLayout>
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Account Deletion Requests</h1>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-500">No deletion requests found. Requests from users will appear here.</p>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDeletionRequests;
