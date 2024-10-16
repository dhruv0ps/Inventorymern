import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const provinces = [
  'Alberta', 'British Columbia', 'Manitoba', 'New Brunswick', 
  'Newfoundland and Labrador', 'Nova Scotia', 'Ontario', 
  'Prince Edward Island', 'Quebec', 'Saskatchewan', 
  'Northwest Territories', 'Nunavut', 'Yukon',
];

const EditAgent = () => {
  const { id } = useParams();  // Get agentId from URL
  const navigate = useNavigate();

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

  useEffect(() => {
    // Fetch agent data when component mounts
    const fetchAgentData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/agent/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const agentData = response.data;
        setFormData({
          firstName: agentData.firstName,
          lastName: agentData.lastName,
          cell: agentData.cell,
          emailID: agentData.emailID,
          commissionPercentage: agentData.commissionPercentage,
        });

        setAddresses(agentData.addresses);
      } catch (error) {
        console.error('Error fetching agent data:', error);
        setErrorMessage('Failed to load agent data');
      }
    };

    fetchAgentData();
  }, [id]);

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
      const response = await axios.put(`${process.env.REACT_APP_API_URL}/api/agent/${id}`, {
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

      if (response.status === 200) {
        setSuccessMessage("Agent updated successfully");
        navigate("/agentlist");  // Redirect to the agent list after successful update
      } else {
        setErrorMessage("There was an issue updating the agent");
      }
    } catch (error) {
      console.error("Error updating agent:", error);
      setErrorMessage("Failed to update agent");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center w-full h-screen overflow-y-scroll p-4 mt-5">
      <form onSubmit={handleSubmit} className="max-w-4xl w-full p-4 space-y-4 shadow-lg rounded-lg bg-navbar">
        <h2 className="text-xl font-semibold">Edit Agent Information</h2>

        {/* Form fields similar to NewAgent, but pre-populated */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
      <div>
        <label className="block">First Name *</label>
        <input
          type="text"
          name="firstName"
          value={formData.firstName}
          required
          onChange={handleInputChange}
          className="w-full p-2 border border-gray-300 rounded shadow-sm focus:ring focus:ring-blue-300"
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
          className="w-full p-2 border border-gray-300 rounded shadow-sm focus:ring focus:ring-blue-300"
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
          className="w-full p-2 border border-gray-300 rounded shadow-sm focus:ring focus:ring-blue-300"
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
          className="w-full p-2 border border-gray-300 rounded shadow-sm focus:ring focus:ring-blue-300"
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
          className="w-full p-2 border border-gray-300 rounded shadow-sm focus:ring focus:ring-blue-300"
          min="0"
          max="100"
        />
      </div>
    </div>

    <div>
      <h3 className="text-lg font-semibold">Addresses</h3>
      {addresses.map((address, index) => (
        <div key={address.id} className="border rounded p-4 mb-2 shadow-sm">
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div>
              <label className="block">Unit</label>
              <input
                type="text"
                name="unit"
                value={address.unit}
                onChange={(e) => handleAddressChange(index, e)}
                className="w-full p-2 border border-gray-300 rounded shadow-sm focus:ring focus:ring-blue-300"
              />
            </div>
            <div>
              <label className="block">Buzz Code (Optional)</label>
              <input
                type="text"
                name="buzzCode"
                value={address.buzzCode}
                onChange={(e) => handleAddressChange(index, e)}
                className="w-full p-2 border border-gray-300 rounded shadow-sm focus:ring focus:ring-blue-300"
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
                className="w-full p-2 border border-gray-300 rounded shadow-sm focus:ring focus:ring-blue-300"
                required
              />
            </div>
            <div>
              <label className="block">Province *</label>
              <select
                name="province"
                value={address.province}
                onChange={(e) => handleAddressChange(index, e)}
                className="w-full p-2 border border-gray-300 rounded shadow-sm focus:ring focus:ring-blue-300"
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
              className="w-full p-2 border border-gray-300 rounded shadow-sm focus:ring focus:ring-blue-300"
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

      {/* Button to add new address */}
      <button
        type="button"
        onClick={addAddress}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-200 ease-in-out"
      >
        Add Address
      </button>
    </div>

    {successMessage && (
      <p className="text-green-500">{successMessage}</p>
    )}
    {errorMessage && (
      <p className="text-red-500">{errorMessage}</p>
    )}
    
    {/* Submit button */}
    {loading ? (
      <p>Submitting...</p> 
    ) : (
      <button 
        type="submit" 
        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition duration-200 ease-in-out">
        Submit
      </button> 
    )}
  </form>
</div>
  );
};

export default EditAgent;
