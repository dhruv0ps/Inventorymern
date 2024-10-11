import React, { useState } from 'react';
import axios from 'axios';

const provinces = [
  'Alberta', 'British Columbia', 'Manitoba', 'New Brunswick', 
  'Newfoundland and Labrador', 'Nova Scotia', 'Ontario', 
  'Prince Edward Island', 'Quebec', 'Saskatchewan', 
  'Northwest Territories', 'Nunavut', 'Yukon',
];

const NewAgent = () => {
  const [addresses, setAddresses] = useState([{ 
    id: Date.now(), unit: '', buzzCode: '', street: '', 
    province: '', postalCode: '', isDefault: false 
  }]);

  const [formData, setFormData] = useState({
    firstName: '', lastName: '', cell: '', emailID: '',
    commissionPercentage: '',
  });

  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

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
    setLoading(true);
    setSuccessMessage('');
    setErrorMessage('');

    const token = localStorage.getItem('token'); 

    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/agent`, {
        ...formData,
        addresses: addresses.map(address => ({
          unit: address.unit,
          buzzCode: address.buzzCode,
          street: address.street,
          province: address.province,
          postalCode: address.postalCode,
          isDefault: address.isDefault
        }))
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,  
        },
      });

      if (response.status === 201) {
        setSuccessMessage("Agent created successfully");
        setFormData({
          firstName: '', lastName: '', cell: '', emailID: '',
          commissionPercentage: '',
        });
        setAddresses([{ 
          id: Date.now(), unit: '', buzzCode: '', street: '', 
          province: '', postalCode: '', isDefault: false 
        }]);
      } else {
        setErrorMessage("There was an issue creating the agent");
      }
    } catch (error) {
      console.error("Error creating agent:", error);
      setErrorMessage("Failed to create agent");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-screen overflow-y-scroll p-4">
      <form onSubmit={handleSubmit} className="max-w-full w-full mx-auto p-4 space-y-4">
        <h2 className="text-xl font-semibold">New Agent Information</h2>
        
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
          <div>
            <label className="block">Email ID *</label>
            <input
              type="email"
              name="emailID"
              value={formData.emailID}
              required
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <div>
            <label className="block">Commission Percentage *</label>
            <input
              type="number"
              name="commissionPercentage"
              value={formData.commissionPercentage}
              required
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded"
              min="0"
              max="100"
            />
          </div>
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
                  <label className="block">Street *</label>
                  <input
                    type="text"
                    name="street"
                    value={address.street}
                    onChange={(e) => handleAddressChange(index, e)}
                    className="w-full p-2 border border-gray-300 rounded"
                    required
                  />
                </div>
                <div>
                  <label className="block">Province *</label>
                  <select
                    name="province"
                    value={address.province}
                    onChange={(e) => handleAddressChange(index, e)}
                    className="w-full p-2 border border-gray-300 rounded"
                    required
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
                <label className="block">Postal Code *</label>
                <input
                  type="text"
                  name="postalCode"
                  value={address.postalCode}
                  onChange={(e) => handleAddressChange(index, e)}
                  className="w-full p-2 border border-gray-300 rounded"
                  required
                />
              </div>

              <div className="mt-2">
                <label className="block">
                  <input
                    type="checkbox"
                    checked={address.isDefault}
                    onChange={() => toggleDefaultAddress(index)}
                  />
                  Set as Default Address
                </label>
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={addAddress}
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            Add Address
          </button>
        </div>

        {successMessage && <p className="text-green-500">{successMessage}</p>}
        {errorMessage && <p className="text-red-500">{errorMessage}</p>}
        {loading ? <p>Submitting...</p> : <button type="submit" className="px-4 py-2 bg-green-500 text-white rounded">Submit</button>}
      </form>
    </div>
  );
};

export default NewAgent;
