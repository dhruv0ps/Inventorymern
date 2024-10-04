import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ProductTags = () => {
    const [tags, setTags] = useState([]);
    const [newTag, setNewTag] = useState('');
    const [editingTag, setEditingTag] = useState(null);
    const [editedTagName, setEditedTagName] = useState('');

    const fetchTags = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/tags'); 
            setTags(response.data);
        } catch (error) {
            console.error('Error fetching tags:', error);
        }
    };

    const addTag = async () => {
        if (!newTag) return; 
        try {
            const response = await axios.post('http://localhost:5000/api/tags', { name: newTag });
            setTags([...tags, response.data]);
            setNewTag(''); 
        } catch (error) {
            console.error('Error adding tag:', error);
        }
    };

    const updateTag = async (id) => {
        if (!editedTagName) return; 
        try {
            const response = await axios.put(`http://localhost:5000/api/tags/${id}`, { name: editedTagName });
            setTags(tags.map(tag => (tag._id === id ? response.data : tag)));
            setEditingTag(null); 
            setEditedTagName('');
        } catch (error) {
            console.error('Error updating tag:', error);
        }
    };

    const deleteTag = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/api/tags/${id}`);
            setTags(tags.filter(tag => tag._id !== id));
        } catch (error) {
            console.error('Error deleting tag:', error);
        }
    };

    useEffect(() => {
        fetchTags(); 
    }, []);

    return (
        <div className="flex flex-1 justify-center items-center min-h-screen bg-gray-100 ">
            <div className="bg-white p-6 rounded-lg shadow-md w-96">
                <h2 className="text-xl font-bold mb-4">Product Tags</h2>

                <div className="flex mb-4">
                    <input
                        type="text"
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        placeholder="Add a new tag"
                        className="flex-grow border border-gray-300 rounded px-3 py-2"
                    />
                    <button onClick={addTag} className="ml-2 bg-blue-500 text-white px-4 py-2 rounded">Add Tag</button>
                </div>

                <ul>
                    {tags.map(tag => (
                        <li key={tag._id} className="flex justify-between items-center mb-2 p-2 border-b">
                            {editingTag === tag._id ? (
                                <div className="flex flex-grow">
                                    <input
                                        type="text"
                                        value={editedTagName}
                                        onChange={(e) => setEditedTagName(e.target.value)}
                                        placeholder="Edit tag name"
                                        className="flex-grow border border-gray-300 rounded px-3 py-2"
                                    />
                                    <button onClick={() => updateTag(tag._id)} className="ml-2 bg-green-500 text-white px-4 py-2  rounded ">Save</button>
                                </div>
                            ) : (
                                <div className="flex-grow">
                                    {tag.name}
                                </div>
                            )}
                            <div>
                            {editingTag !== tag._id && (
                                    <>
                                        <button onClick={() => { setEditingTag(tag._id); setEditedTagName(tag.name); }} className="bg-yellow-500 text-white px-2 py-1 rounded">Edit</button>
                                        <button onClick={() => deleteTag(tag._id)} className="ml-2 bg-red-500 text-white px-2 py-1 rounded">Delete</button>
                                    </>
                                )}
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default ProductTags;
