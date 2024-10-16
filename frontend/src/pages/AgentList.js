import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link, useNavigate } from 'react-router-dom';

const AgentList = () => {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [agentsPerPage] = useState(5);

  const navigate = useNavigate();

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

  const handleToggleStatus = async (id, isActive) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(`${process.env.REACT_APP_API_URL}/api/agent/status/${id}`, { isActive: !isActive }, {
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

  const indexOfLastAgent = currentPage * agentsPerPage;
  const indexOfFirstAgent = indexOfLastAgent - agentsPerPage;
  const currentAgents = agents.slice(indexOfFirstAgent, indexOfLastAgent);

  const totalPages = Math.ceil(agents.length / agentsPerPage);

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="overflow-x-auto w-full bg-gray-50 p-4">
      <div className='flex justify-between items-center mb-4'>
        <h2 className="text-xl font-semibold">Agent List</h2>
        <Link to="/addagent" className='mr-5 mt-2'>
          <button className="bg-blue-500 text-white px-4 py-2 rounded">
            Add Agent
          </button>
        </Link>
      </div>

      <div className='overflow-x-auto'>
        <table className="min-w-full border-collapse border border-gray-200 bg-card shadow-lg rounded-lg md:table-fixed">
          <thead>
            <tr className="bg-navbar text-navbar-text">
              <th className="p-2">First Name</th>
              <th className="p-2">Last Name</th>
              <th className="p-2">Cell</th>
              <th className="p-2">Email ID</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentAgents.map((agent) => (
              <tr key={agent._id}>
                <td className="p-2">{agent.firstName}</td>
                <td className="p-2">{agent.lastName}</td>
                <td className="p-2">{agent.cell}</td>
                <td className="p-2">{agent.emailID}</td>
                <td className="p-2">
                  <button 
                    onClick={() => navigate(`/editagent/${agent._id}`)} 
                    className="bg-blue-500 text-white px-2 py-1 rounded mr-2"
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => handleToggleStatus(agent._id, agent.isActive)} 
                    className={`text-white px-2 py-1 rounded mr-2 ${agent.isActive ? 'bg-yellow-500' : 'bg-green-500'}`}
                  >
                    {agent.isActive ? 'Deactivate' : 'Activate'}
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
      </div>

      <div className="flex justify-between items-center mt-4">
        <button onClick={prevPage} disabled={currentPage === 1} className="bg-gray-300 px-4 py-2 rounded">
          Previous
        </button>
        <span>Page {currentPage} of {totalPages}</span>
        <button onClick={nextPage} disabled={currentPage === totalPages} className="bg-gray-300 px-4 py-2 rounded">
          Next
        </button>
      </div>

      <ToastContainer />
    </div>
  );
};

export default AgentList;
