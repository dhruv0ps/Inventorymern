import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import { useParams } from 'react-router-dom';

const provinces = ['Alberta', 'British Columbia', 'Manitoba', 'New Brunswick', 'Newfoundland and Labrador', 'Nova Scotia', 'Ontario', 'Prince Edward Island', 'Quebec', 'Saskatchewan'];

const CustomerEdit = () => {
    const { id } = useParams(); // Get the customerId from the URL
    console.log(id)
    const [addresses, setAddresses] = useState([{ 
        id: Date.now(), unit: '', buzzCode: '', street: '', 
        province: '', postalCode: '', isDefault: false 
      }]);
    
    const [formData, setFormData] = useState({
        firstName: '', lastName: '', phoneNumber: '', cell: '', 
        emailId: '', emailId2: '', businessName: '', customerCategory: '',
    });

    // Fetch customer data when the component mounts
    useEffect(() => {
        const fetchCustomerData = async () => {
            const token = localStorage.getItem('token'); 
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/customers/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                const customer = response.data;
                setFormData({
                    firstName: customer.firstName,
                    lastName: customer.lastName,
                    phoneNumber: customer.phoneNumber,
                    cell: customer.cell,
                    emailId: customer.emailId,
                    emailId2: customer.emailId2,
                    businessName: customer.businessName,
                    customerCategory: customer.customerCategory,
                });
                setAddresses(customer.addresses); // Assuming customer.addresses is an array
            } catch (error) {
                console.error("Error fetching customer data:", error);
                toast.error("Failed to fetch customer data");
            }
        };

        fetchCustomerData();
    }, [id]); // Dependency array includes customerId

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleAddressChange = (index, e) => {
        const { name, value } = e.target;
        const newAddresses = [...addresses];
        newAddresses[index][name] = value;
        setAddresses(newAddresses);
    };

    const addAddress = () => {
        if (addresses.length < 2) {
            setAddresses([...addresses, { id: Date.now(), unit: '', buzzCode: '', street: '', province: '', postalCode: '', isDefault: false }]);
        } else {
            toast.warn("You can only add up to 2 addresses.");
        }
    };

    const toggleDefaultAddress = (index) => {
        const newAddresses = addresses.map((address, i) => ({
            ...address,
            isDefault: i === index ? !address.isDefault : false,
        }));
        setAddresses(newAddresses);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token'); 
        try {
            const response = await axios.put(`${process.env.REACT_APP_API_URL}/api/customers/${id}`, {
                ...formData,
                addresses
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,  
                },
            });
            if (response.status === 200) {
                toast.success("Customer updated successfully");
            } else {
                toast.error("There was an issue updating the customer");
            }
        } catch (error) {
            console.error("Error updating customer:", error);
            toast.error("Failed to update customer");
        }
    };

    return (
        <div>
            <div className="w-full h-screen p-4 flex justify-center items-center ml-52">
                <ToastContainer />
                <div className="bg-gray-100 mb-10 rounded shadow-lg p-4 w-full max-w-5xl h-[80vh] overflow-y-auto">
                    <form onSubmit={handleSubmit} className="max-w-full w-full mx-auto p-4 space-y-4 bg-gray-100 border border-gray-300 rounded-lg shadow-md">
                        <h2 className="text-xl font-semibold">Customer Information</h2>
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                            <div>
                                <label className="block">First Name *</label>
                                <input
                                    type="text"
                                    name="firstName"
                                    value={formData.firstName}
                                    required
                                    onChange={handleInputChange}
                                    className="w-full p-2 border border-gray-300 rounded"
                                />
                            </div>
                            <div>
                                <label className="block">Last Name *</label>
                                <input
                                    type="text"
                                    name="lastName"
                                    value={formData.lastName}
                                    required
                                    onChange={handleInputChange}
                                    className="w-full p-2 border border-gray-300 rounded"
                                />
                            </div>
                        </div>

                        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                            <div>
                                <label className="block">Phone Number (Optional)</label>
                                <input
                                    type="tel"
                                    name="phoneNumber"
                                    value={formData.phoneNumber}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border border-gray-300 rounded"
                                />
                            </div>
                            <div>
                                <label className="block">Cell *</label>
                                <input
                                    type="tel"
                                    name="cell"
                                    value={formData.cell}
                                    required
                                    onChange={handleInputChange}
                                    className="w-full p-2 border border-gray-300 rounded"
                                />
                            </div>
                        </div>

                        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                            <div>
                                <label className="block">Email ID *</label>
                                <input
                                    type="email"
                                    name="emailId"
                                    value={formData.emailId}
                                    required
                                    onChange={handleInputChange}
                                    className="w-full p-2 border border-gray-300 rounded"
                                />
                            </div>
                            <div>
                                <label className="block">Email ID 2 (Optional)</label>
                                <input
                                    type="email"
                                    name="emailId2"
                                    value={formData.emailId2}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border border-gray-300 rounded"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block">Business Name *</label>
                            <input
                                type="text"
                                name="businessName"
                                value={formData.businessName}
                                required
                                onChange={handleInputChange}
                                className="w-full p-2 border border-gray-300 rounded"
                            />
                        </div>

                        <div>
                            <h3 className="text-lg font-semibold">Addresses</h3>
                            {addresses.map((address, index) => (
                                <div key={address.id} className="border rounded p-4 mb-2 bg-gray-50">
                                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                                        <div>
                                            <label className="block">Unit</label>
                                            <input
                                                type="text"
                                                name="unit"
                                                value={address.unit}
                                                onChange={(e) => handleAddressChange(index, e)}
                                                className="w-full p-2 border border-gray-300 rounded"
                                            />
                                        </div>
                                        <div>
                                            <label className="block">Buzz Code (Optional)</label>
                                            <input
                                                type="text"
                                                name="buzzCode"
                                                value={address.buzzCode}
                                                onChange={(e) => handleAddressChange(index, e)}
                                                className="w-full p-2 border border-gray-300 rounded"
                                            />
                                        </div>
                                    </div>

                                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                                        <div>
                                            <label className="block">Street</label>
                                            <input
                                                type="text"
                                                name="street"
                                                value={address.street}
                                                onChange={(e) => handleAddressChange(index, e)}
                                                className="w-full p-2 border border-gray-300 rounded"
                                            />
                                        </div>
                                        <div>
                                            <label className="block">Province</label>
                                            <select
                                                name="province"
                                                value={address.province}
                                                onChange={(e) => handleAddressChange(index, e)}
                                                className="w-full p-2 border border-gray-300 rounded"
                                            >
                                                <option value="">Select Province</option>
                                                {provinces.map((province) => (
                                                    <option key={province} value={province}>
                                                        {province}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block">Postal Code</label>
                                        <input
                                            type="text"
                                            name="postalCode"
                                            value={address.postalCode}
                                            onChange={(e) => handleAddressChange(index, e)}
                                            className="w-full p-2 border border-gray-300 rounded"
                                        />
                                    </div>

                                    <div className="flex items-center">
                                        <input
                                            type="checkbox"
                                            checked={address.isDefault}
                                            onChange={() => toggleDefaultAddress(index)}
                                        />
                                        <span className="ml-2">Set as Default Address</span>
                                    </div>
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={addAddress}
                                className="bg-blue-500 text-white rounded px-4 py-2 mt-2"
                            >
                                Add Address
                            </button>
                        </div>

                        <button type="submit" className="bg-green-500 text-white rounded px-4 py-2 mt-4">
                            Update Customer
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CustomerEdit;
