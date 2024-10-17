import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ProductTags = () => {
    const [tags, setTags] = useState([]);
    const [newTag, setNewTag] = useState('');
    const [editingTag, setEditingTag] = useState(null);
    const [editedTagName, setEditedTagName] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [tagsPerPage] = useState(5); // Change this number to set how many tags to display per page

    const fetchTags = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/tags`);
            setTags(response.data);
        } catch (error) {
            console.error('Error fetching tags:', error);
        }
    };

    const addTag = async () => {
        if (!newTag) return;
        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/tags`, { name: newTag });
            setTags([...tags, response.data]);
            setNewTag('');
        } catch (error) {
            console.error('Error adding tag:', error);
        }
    };

    const updateTag = async (id) => {
        if (!editedTagName) return;
        try {
            const response = await axios.put(`${process.env.REACT_APP_API_URL}/api/tags/${id}`, { name: editedTagName });
            setTags(tags.map(tag => (tag._id === id ? response.data : tag)));
            setEditingTag(null);
            setEditedTagName('');
        } catch (error) {
            console.error('Error updating tag:', error);
        }
    };

    const deleteTag = async (id) => {
        try {
            await axios.delete(`${process.env.REACT_APP_API_URL}/api/tags/${id}`);
            setTags(tags.filter(tag => tag._id !== id));
        } catch (error) {
            console.error('Error deleting tag:', error);
        }
    };

    useEffect(() => {
        fetchTags();
    }, []);

    // Pagination Logic
    const indexOfLastTag = currentPage * tagsPerPage;
    const indexOfFirstTag = indexOfLastTag - tagsPerPage;
    const currentTags = tags.slice(indexOfFirstTag, indexOfLastTag);
    const totalPages = Math.ceil(tags.length / tagsPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div className="container mx-auto mt-8 p-4 ml-4 mr-4  max-w-full">
            <h2 className="text-3xl flex justify-center font-semibold mb-6 text-gray-800">Product Tags</h2>

            <div className="flex mb-4">
                <input
                    type="text"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder="Add a new tag"
                    className="flex-grow border border-gray-300 rounded px-3 py-2"
                />
                <button onClick={addTag} className="ml-2 bg-blue-500 text-white px-4 py-2 rounded shadow hover:bg-blue-600 transition duration-300">Add Tag</button>
            </div>

            {/* Table Container */}
            <div className="bg-gray-100 rounded-lg shadow-md p-4">
                <ul className="bg-white rounded-lg shadow-md divide-y divide-gray-200">
                    {currentTags.map(tag => (
                        <li key={tag._id} className="flex justify-between items-center p-4 hover:bg-gray-100">
                            {editingTag === tag._id ? (
                                <div className="flex flex-grow">
                                    <input
                                        type="text"
                                        value={editedTagName}
                                        onChange={(e) => setEditedTagName(e.target.value)}
                                        placeholder="Edit tag name"
                                        className="flex-grow border border-gray-300 rounded px-3 py-2"
                                    />
                                    <button onClick={() => updateTag(tag._id)} className="ml-2 bg-blue-500 text-white px-4 py-2 rounded">Save</button>
                                </div>
                            ) : (
                                <div className="flex-grow">{tag.name}</div>
                            )}
                            <div>
                                {editingTag !== tag._id && (
                                    <>
                                        <button onClick={() => { setEditingTag(tag._id); setEditedTagName(tag.name); }} className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 transition duration-300">Edit</button>
                                        <button onClick={() => deleteTag(tag._id)} className="ml-2 bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 transition duration-300">Delete</button>
                                    </>
                                )}
                            </div>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Pagination Controls */}
            <div className="flex justify-center mt-4">
                <button
                    onClick={() => currentPage > 1 && paginate(currentPage - 1)}
                    className={`px-3 py-1 border rounded ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600 transition duration-300'}`}
                    disabled={currentPage === 1}
                >
                    Previous
                </button>
                {Array.from({ length: totalPages }).map((_, index) => (
                    <button
                        key={index}
                        onClick={() => paginate(index + 1)}
                        className={`mx-1 px-3 py-1 border rounded ${currentPage === index + 1 ? 'bg-blue-500 text-white' : 'hover:bg-blue-500 hover:text-white transition duration-300'}`}
                    >
                        {index + 1}
                    </button>
                ))}
                <button
                    onClick={() => currentPage < totalPages && paginate(currentPage + 1)}
                    className={`px-3 py-1 border rounded ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600 transition duration-300'}`}
                    disabled={currentPage === totalPages}
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default ProductTags;

