// EditModal.js
import React, { useEffect, useState } from 'react';

const EditModal = ({ isOpen, onClose, customer, onSave }) => {
  const [formData, setFormData] = useState({
    businessName: '',
    firstName: '',
    lastName: '',
    cell: '',
    emailId: ''
  });

  useEffect(() => {
    if (customer) {
      setFormData({
        businessName: customer.businessName || '',
        firstName: customer.firstName || '',
        lastName: customer.lastName || '',
        cell: customer.cell || '',
        emailId: customer.emailId || ''
      });
    }
  }, [customer]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(customer._id, formData);
  };

  if (!isOpen) return null; 

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-gray-900 bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-1/2">
        <h2 className="text-2xl font-bold mb-4">Edit Customer</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium">Business Name</label>
            <input
              type="text"
              name="businessName"
              value={formData.businessName}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium">First Name</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium">Last Name</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium">Cell</label>
            <input
              type="text"
              name="cell"
              value={formData.cell}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium">Email ID</label>
            <input
              type="email"
              name="emailId"
              value={formData.emailId}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
            />
          </div>
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditModal;
