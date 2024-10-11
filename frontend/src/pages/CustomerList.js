import axios from 'axios';
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

const CustomerList = () => {
  const [customers, setCustomers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentCustomer, setCurrentCustomer] = useState(null);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/customers`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setCustomers(response.data);
      } catch (error) {
        console.error('Error fetching customers:', error);
      }
    };

    fetchCustomers();
  }, []);

  
  const openModal = (customer) => {
    setCurrentCustomer(customer);
    setIsModalOpen(true);
  };

  
  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentCustomer(null);
  };

 
  const saveCustomer = async (customerId, updatedData) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${process.env.REACT_APP_API_URL}/api/customers/${customerId}`, updatedData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Update the customer in the state
      setCustomers(customers.map(customer =>
        customer._id === customerId ? { ...customer, ...updatedData } : customer
      ));

      alert('Customer updated successfully!');
      closeModal();
    } catch (error) {
      console.error('Error updating customer:', error);
      alert('Failed to update customer');
    }
  };

  const deleteCustomer = async (customerId) => {
    if (!window.confirm("Are you sure you want to delete this customer?")) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${process.env.REACT_APP_API_URL}/api/customers/${customerId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCustomers(customers.filter(customer => customer._id !== customerId));
      alert("Customer deleted successfully!");
    } catch (error) {
      console.error('Error deleting customer:', error);
      alert('Failed to delete customer');
    }
  };

  const toggleCustomerStatus = async (customer) => {
    const newStatus = !customer.isActive;
    const action = newStatus ? 'activate' : 'deactivate';

    if (!window.confirm(`Are you sure you want to ${action} this customer?`)) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.put(`${process.env.REACT_APP_API_URL}/api/customers/${customer._id}/status`, { isActive: newStatus }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCustomers(customers.map(c => 
        c._id === customer._id ? { ...c, isActive: newStatus } : c
      ));
      alert(`Customer ${action}d successfully!`);
    } catch (error) {
      console.error(`Error ${action}ing customer:`, error);
      alert(`Failed to ${action} customer`);
    }
  };

  return (
    <div className="p-6 bg-background min-h-screen w-full">
      <h2 className="text-3xl font-semibold text-text mb-6">Customers List</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-card shadow-lg rounded-lg">
          <thead>
            <tr className="bg-navbar text-navbar-text">
              <th className="p-4 text-left">Business Name</th>
              <th className="p-4 text-left">First Name</th>
              <th className="p-4 text-left">Last Name</th>
              <th className="p-4 text-left">Cell</th>
              <th className="p-4 text-left">Email ID</th>
              <th className="p-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer) => (
              <tr key={customer._id} className="border-b">
                <td className="p-4 text-text">{customer.businessName}</td>
                <td className="p-4 text-text">{customer.firstName}</td>
                <td className="p-4 text-text">{customer.lastName}</td>
                <td className="p-4 text-text">{customer.cell}</td>
                <td className="p-4 text-text">{customer.emailId}</td>
                <td className="p-4 space-x-2">
                  <button 
                    onClick={() => openModal(customer)} 
                    className="bg-warning text-white px-4 py-2 rounded hover:bg-opacity-80"
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => deleteCustomer(customer._id)} 
                    className="bg-error text-white px-4 py-2 rounded hover:bg-opacity-80"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => toggleCustomerStatus(customer)}
                    className={`${customer.isActive ? 'bg-gray-500' : 'bg-success'} text-white px-4 py-2 rounded hover:bg-opacity-80`}
                  >
                    {customer.isActive ? 'Deactivate' : 'Activate'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

     
      <EditModal
        isOpen={isModalOpen}
        onClose={closeModal}
        customer={currentCustomer}
        onSave={saveCustomer}
      />
    </div>
  );
};

export default CustomerList;

