import axios from 'axios';
import React, { useEffect, useState } from 'react';

const provinces = [
  'Alberta', 'British Columbia', 'Manitoba', 'New Brunswick', 
  'Newfoundland and Labrador', 'Nova Scotia', 'Ontario', 
  'Prince Edward Island', 'Quebec', 'Saskatchewan', 
  'Northwest Territories', 'Nunavut', 'Yukon',
];

const CustomerForm = () => {
  const [addresses, setAddresses] = useState([{ 
    id: Date.now(), unit: '', buzzCode: '', street: '', 
    province: '', postalCode: '', isDefault: false 
  }]);

  const [formData, setFormData] = useState({
    firstName: '', lastName: '', phoneNumber: '', cell: '', 
    emailId: '', emailId2: '', businessName: '', customerCategory: '',
  });

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
      alert("You can only add up to 2 addresses.");
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
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/customers`, {
        ...formData,
        addresses
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,  
        },
      });
      if (response.status === 201) {
        alert("Customer created successfully");
      } else {
        alert("There was an issue creating the customer");
      }
    } catch (error) {
      console.error("Error creating customer:", error);
      alert("Failed to create customer");
    }
  };
  

  

  return (
    <div className="w-full h-screen overflow-y-scroll p-4">
      <form onSubmit={handleSubmit} className="max-w-full w-full mx-auto p-4 space-y-4">
        <h2 className="text-xl font-semibold">Customer Information</h2>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <div>
            <label className="block">First Name *</label>
            <input
              type="text"
              name="firstName"
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
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div>
            <label className="block">Cell *</label>
            <input
              type="tel"
              name="cell"
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
            required
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>

        <div>
          <h3 className="text-lg font-semibold">Addresses</h3>
          {addresses.map((address, index) => (
            <div key={address.id} className="border rounded p-4 mb-2">
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

              <div>
                <input
                  type="checkbox"
                  checked={address.isDefault}
                  onChange={() => toggleDefaultAddress(index)}
                />
                <label className="ml-2">Set as default</label>
              </div>
            </div>
          ))}

          {addresses.length < 2 && (
            <button
              type="button"
              onClick={addAddress}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Add Address
            </button>
          )}
        </div>

        <div>
          <label className="block">Customer Category</label>
          <select
            name="customerCategory"
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded"
          >
            <option value="">Select Category</option>
            <option value="Retail">Retail</option>
            <option value="Wholesale">Wholesale</option>
            <option value="Distributor">Distributor</option>
          </select>
        </div>

        <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">
          Submit
        </button>
      </form>
    </div>
  );
};

export default CustomerForm;
