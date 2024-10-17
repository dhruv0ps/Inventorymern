import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const RawMaterialsList = () => {
    const [rawMaterials, setRawMaterials] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    
    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(5); // Set the number of items per page
    const [totalPages, setTotalPages] = useState(0);
    
    const navigate = useNavigate();

    useEffect(() => {
        fetchRawMaterials();
    }, [currentPage]); // Fetch materials when the page changes

    const fetchRawMaterials = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/raw-materials`);
            setRawMaterials(response.data);
            setTotalPages(Math.ceil(response.data.length / itemsPerPage)); // Calculate total pages
            setError(null); // Clear any previous errors
        } catch (error) {
            console.error('Error fetching raw materials:', error);
            setError('Failed to fetch raw materials. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleEditClick = (rawMaterial) => {
        // Redirect to edit page instead of opening a modal
        navigate(`/edit-raw-material/${rawMaterial._id}`);
    };

    const handleDeleteClick = async (id) => {
        if (window.confirm("Are you sure you want to delete this raw material?")) {
            setLoading(true);
            try {
                await axios.delete(`${process.env.REACT_APP_API_URL}/api/raw-materials/${id}`);
                alert('Raw Material deleted successfully!');
                fetchRawMaterials();
            } catch (error) {
                console.error('Error deleting raw material:', error);
                alert('Error deleting raw material. Please try again.');
            } finally {
                setLoading(false);
            }
        }
    };

    // Handle page change
    const handlePageChange = (pageNumber) => {
        if (pageNumber > 0 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
        }
    };

    // Calculate the current raw materials to display
    const indexOfLastMaterial = currentPage * itemsPerPage;
    const indexOfFirstMaterial = indexOfLastMaterial - itemsPerPage;
    const currentMaterials = rawMaterials.slice(indexOfFirstMaterial, indexOfLastMaterial);

    return (
        <div className="container mx-auto mt-10 ml-4   p-4">
            <div className="mb-4 flex justify-between items-center">
                <span className='font-bold text-2xl ml-5 '>Raw Materials</span>
                <Link to="/addnewraw" className='mt-2'>
                    <button className="px-2 py-2 mr-5 bg-blue-500 text-white rounded">
                        Add New Raw Material
                    </button>
                </Link>
            </div>

            {/* Loading state */}
            {loading && <p className="text-center">Loading...</p>}
            {error && <p className="text-red-500 text-center">{error}</p>}

            {/* Table for raw materials */}
            {!loading && (
                <div className="bg-gray-100 rounded-lg shadow-md p-4"> {/* Box around the table */}
                    <table className="min-w-full bg-white border border-gray-200">
                        <thead>
                            <tr className="bg-gray-300 border-b">
                                <th className="py-2 px-4 text-left border-r">Raw material Image</th>
                                <th className="py-2 px-4 text-left border-r">Material Name</th>
                                <th className="py-2 px-4 text-left border-r">Description</th>
                                <th className="py-2 px-4 text-left border-r">Measuring Unit</th>
                                <th className="py-2 px-4 text-left">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentMaterials.map((rawMaterial) => (
                                <tr key={rawMaterial._id} className="border-b">
                                    <td className="py-4 px-4 border-r">
                                        <a 
                                            href={`${process.env.REACT_APP_API_URL}/${rawMaterial.image}`} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                        >
                                            <img 
                                                src={`${process.env.REACT_APP_API_URL}/${rawMaterial.image}`} 
                                                alt={rawMaterial.name} 
                                                className='h-12 w-12 object-cover cursor-pointer' 
                                            />
                                        </a>
                                    </td>
                                    <td className="py-4 px-4 border-r">{rawMaterial.material}</td>
                                    <td className="py-4 px-4 border-r">{rawMaterial.description}</td>
                                    <td className="py-4 px-4 border-r">{rawMaterial.measuringUnit}</td>
                                    <td className="py-4 px-4">
                                        <button 
                                            onClick={() => handleEditClick(rawMaterial)} 
                                            className='mr-2 px-4 py-2 bg-blue-500 hover:bg-blue-700 text-white rounded'
                                        >
                                            Edit
                                        </button>
                                        <button 
                                            onClick={() => handleDeleteClick(rawMaterial._id)} 
                                            className='px-4 py-2 bg-red-500 hover:bg-red-700 text-white rounded'
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Pagination controls */}
            {!loading && (
                <div className="flex justify-center items-center mt-4 space-x-4"> {/* Center the buttons */}
                    <button 
                        onClick={() => handlePageChange(currentPage - 1)} 
                        disabled={currentPage === 1} 
                        className={`px-3 py-1 border rounded ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600 transition duration-300'}`}
                    >
                        Previous
                    </button>

                    {/* Page number buttons */}
                    <div className="flex space-x-2">
                        {Array.from({ length: totalPages }, (_, index) => (
                            <button
                                key={index + 1}
                                onClick={() => handlePageChange(index + 1)}
                                className={`px-3 py-1 rounded ${currentPage === index + 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-blue-300'}`}
                            >
                                {index + 1}
                            </button>
                        ))}
                    </div>

                    <button 
                        onClick={() => handlePageChange(currentPage + 1)} 
                        disabled={currentPage === totalPages} 
                        className={`px-3 py-1 border rounded ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600 transition duration-300'}`}
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
};

export default RawMaterialsList;
