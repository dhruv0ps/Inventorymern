import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify'; // Import toastify components
import 'react-toastify/dist/ReactToastify.css'; // Import styles

const CustomerList = () => {
  const [customers, setCustomers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const customersPerPage = 5; // Define how many customers per page you want
  const [loading, setLoading] = useState(true); // Loading state
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    const fetchCustomers = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/customers`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCustomers(response.data);
      } catch (error) {
        console.error('Error fetching customers:', error);
        toast.error('Failed to fetch customers');
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  // Get current customers for the page
  const indexOfLastCustomer = currentPage * customersPerPage;
  const indexOfFirstCustomer = indexOfLastCustomer - customersPerPage;
  const currentCustomers = customers.slice(indexOfFirstCustomer, indexOfLastCustomer);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const updateCustomerList = (updatedCustomer) => {
    setCustomers((prevCustomers) =>
      prevCustomers.map((customer) =>
        customer._id === updatedCustomer._id ? updatedCustomer : customer
      )
    );
  };

  const saveCustomer = async (customerId, updatedData) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(`${process.env.REACT_APP_API_URL}/api/customers/${customerId}`, updatedData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      updateCustomerList(response.data);
      toast.success('Customer updated successfully!');
    } catch (error) {
      console.error('Error updating customer:', error);
      toast.error('Failed to update customer');
    }
  };

  const deleteCustomer = async (e, customerId) => {
    e.preventDefault();
    console.log(`Attempting to delete customer ID: ${customerId}`);

    if (!window.confirm("Are you sure you want to delete this customer?")) {
      console.log("Deletion canceled by user.");
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${process.env.REACT_APP_API_URL}/api/customers/${customerId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setCustomers((prevCustomers) =>
        prevCustomers.filter(customer => customer._id !== customerId)
      );
      toast.success("Customer deleted successfully!");
    } catch (error) {
      console.error('Error deleting customer:', error);
      toast.error('Failed to delete customer');
    }
  };

  const toggleCustomerStatus = async (customer) => {
    const newStatus = !customer.isActive;
    const action = newStatus ? 'activate' : 'deactivate';
  
    // Confirm action from the user
    if (!window.confirm(`Are you sure you want to ${action} this customer?`)) {
      return;
    }
  
    // Optimistically update the local state first
    const updatedCustomer = { ...customer, isActive: newStatus };
    updateCustomerList(updatedCustomer); // Update the UI immediately
  
    try {
      const token = localStorage.getItem('token');
      const response = await axios.patch(
        `${process.env.REACT_APP_API_URL}/api/customers/${customer._id}/status`,
        { isActive: newStatus },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
  
      // Check if the response has the updated customer
      if (response.data && response.data.customer) {
        updateCustomerList(response.data.customer); // Update with response data if needed
      }
      
      toast.success(`Customer ${action}d successfully!`);
    } catch (error) {
      console.error(`Error ${action}ing customer:`, error);
      toast.error(`Failed to ${action} customer: ${error.message || 'Unknown error'}`);
      
      // Optionally revert the change if the API call fails
      updateCustomerList(customer); // Revert back to old customer data
    }
  };
  
  const totalPages = Math.ceil(customers.length / customersPerPage);

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <div className="p-6 bg-background min-h-screen w-full">
      <h2 className="text-3xl font-semibold text-text mb-6">Customers List</h2>
      <div className='flex justify-end'>
        <Link to='/customerform'>
          <button className='bg-blue-600 px-3 py-3 text-white border border-rounded'>Add Customer</button>
        </Link>
      </div>

      {loading ? (
        <p>Loading customers...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-card shadow-lg rounded-lg md:table-fixed">
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
              {currentCustomers.map((customer) => (
                <tr key={customer._id} className="border-b">
                  <td className="p-4 text-text">{customer.businessName}</td>
                  <td className="p-4 text-text">{customer.firstName}</td>
                  <td className="p-4 text-text">{customer.lastName}</td>
                  <td className="p-4 text-text">{customer.cell}</td>
                  <td className="p-4 text-text">{customer.emailId}</td>
                  <td className="p-4 text-text">
                    <button
                      onClick={() => navigate(`/editcustomer/${customer._id}`)} // Navigate to EditCustomer page
                      className="text-blue-500 hover:text-blue-700 mr-4"
                    >
                      Edit
                    </button>
                    <button
                      onClick={(e) => deleteCustomer(e, customer._id)}
                      className="text-red-500 hover:text-red-700 mr-4"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => toggleCustomerStatus(customer)}
                      className="text-yellow-500 hover:text-yellow-700"
                    >
                      {customer.isActive ? 'Deactivate' : 'Activate'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination Controls */}
      <div className="mt-4 flex justify-center items-center">
        <button
          onClick={handlePrevious}
          disabled={currentPage === 1}
          className={`px-4 py-2 mx-1 ${currentPage === 1 ? 'bg-gray-300 text-gray-500' : 'bg-blue-500 text-white'} rounded`}
        >
          Previous
        </button>

        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index + 1}
            onClick={() => paginate(index + 1)}
            className={`px-4 py-2 mx-1 ${currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'} rounded`}
          >
            {index + 1}
          </button>
        ))}

        <button
          onClick={handleNext}
          disabled={currentPage === totalPages}
          className={`px-4 py-2 mx-1 ${currentPage === totalPages ? 'bg-gray-300 text-gray-500' : 'bg-blue-500 text-white'} rounded`}
        >
          Next
        </button>
      </div>

      <ToastContainer /> {/* Add this line to enable Toast notifications */}
    </div>
  );
};

export default CustomerList;

