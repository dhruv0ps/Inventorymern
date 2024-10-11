import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

Modal.setAppElement('#root');

const AgentList = () => {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentAgent, setCurrentAgent] = useState({
    firstName: '',
    lastName: '',
    cell: '',
    emailID: '',
  });

  const fetchAgents = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/agent`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setAgents(response.data);
    } catch (error) {
      console.error("Error fetching agents:", error);
      toast.error("Failed to fetch agents");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAgents();
  }, []);

  const openModal = (agent) => {
    setCurrentAgent(agent);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setCurrentAgent({ firstName: '', lastName: '', cell: '', emailID: '' });
    setIsModalOpen(false);
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${process.env.REACT_APP_API_URL}/api/agent/${currentAgent._id}`, currentAgent, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchAgents();
      toast.success("Agent updated successfully!");
      closeModal();
    } catch (error) {
      console.error("Error updating agent:", error);
      toast.error("Failed to update agent");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentAgent((prev) => ({ ...prev, [name]: value }));
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this agent?")) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`${process.env.REACT_APP_API_URL}/api/agent/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        fetchAgents();
        toast.success("Agent deleted successfully!");
      } catch (error) {
        console.error("Error deleting agent:", error);
        toast.error("Failed to delete agent");
      }
    }
  };

  const handleDeactivate = async (id, isActive) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(`${process.env.REACT_APP_API_URL}/api/agent/status/${id}`, { active: !isActive }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchAgents();
      toast.success(isActive ? "Agent deactivated successfully!" : "Agent activated successfully!");
    } catch (error) {
      console.error("Error changing agent status:", error);
      toast.error(isActive ? "Failed to deactivate agent" : "Failed to activate agent");
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="overflow-x-auto">
      <h2 className="text-xl font-semibold mb-4">Agent List</h2>
      <table className="min-w-full border-collapse border border-gray-200">
        <thead>
          <tr className="bg-navbar text-navbar-text">
            <th className="border border-gray-300 p-2">First Name</th>
            <th className="border border-gray-300 p-2">Last Name</th>
            <th className="border border-gray-300 p-2">Cell</th>
            <th className="border border-gray-300 p-2">Email ID</th>
            <th className="border border-gray-300 p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {agents.map((agent) => (
            <tr key={agent._id}>
              <td className="border border-gray-300 p-2">{agent.firstName}</td>
              <td className="border border-gray-300 p-2">{agent.lastName}</td>
              <td className="border border-gray-300 p-2">{agent.cell}</td>
              <td className="border border-gray-300 p-2">{agent.emailID}</td>
              <td className="border border-gray-300 p-2">
                <button 
                  onClick={() => openModal(agent)} 
                  className="bg-blue-500 text-white px-2 py-1 rounded mr-2"
                >
                  Edit
                </button>
                <button 
                  onClick={() => handleDeactivate(agent._id, agent.active)} 
                  className={`text-white px-2 py-1 rounded mr-2 ${agent.active ? 'bg-yellow-500' : 'bg-green-500'}`}
                >
                  {agent.active ? 'Deactivate' : 'Activate'}
                </button>
                <button 
                  onClick={() => handleDelete(agent._id)} 
                  className="bg-red-500 text-white px-2 py-1 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Modal 
        isOpen={isModalOpen} 
        onRequestClose={closeModal} 
        style={{
          content: {
            background: 'white',
            padding: '20px',
            borderRadius: '8px',
            maxWidth: '400px', 
            width: '90%',
            height: "60%",
            margin: 'auto',
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)', 
          },
          overlay: {
            background: 'rgba(0, 0, 0, 0.75)',
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          },
        }}
      >
        <h2 className="text-lg font-semibold">Edit Agent</h2>
        <form onSubmit={handleEdit}>
          <div>
            <label>First Name</label>
            <input 
              type="text" 
              name="firstName" 
              value={currentAgent.firstName} 
              onChange={handleInputChange} 
              required 
              style={{
                border: '1px solid #ccc',
                padding: '8px',
                width: '100%',
                marginBottom: '12px',
                borderRadius: '4px',
              }}
            />
          </div>
          <div>
            <label>Last Name</label>
            <input 
              type="text" 
              name="lastName" 
              value={currentAgent.lastName} 
              onChange={handleInputChange} 
              required 
              style={{
                border: '1px solid #ccc',
                padding: '8px',
                width: '100%',
                marginBottom: '12px',
                borderRadius: '4px',
              }}
            />
          </div>
          <div>
            <label>Cell</label>
            <input 
              type="text" 
              name="cell" 
              value={currentAgent.cell} 
              onChange={handleInputChange} 
              required 
              style={{
                border: '1px solid #ccc',
                padding: '8px',
                width: '100%',
                marginBottom: '12px',
                borderRadius: '4px',
              }}
            />
          </div>
          <div>
            <label>Email ID</label>
            <input 
              type="email" 
              name="emailID" 
              value={currentAgent.emailID} 
              onChange={handleInputChange} 
              required 
              style={{
                border: '1px solid #ccc',
                padding: '8px',
                width: '100%',
                marginBottom: '12px',
                borderRadius: '4px',
              }}
            />
          </div>
          <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">Update</button>
          <button type="button" onClick={closeModal} className="bg-gray-300 text-black px-4 py-2 rounded ml-2">Cancel</button>
        </form>
      </Modal>

      <ToastContainer 
        position="top-right" 
        autoClose={3000} 
        hideProgressBar={false} 
        closeOnClick 
        pauseOnFocusLoss 
        draggable 
        pauseOnHover 
      />
    </div>
  );
};

export default AgentList;
