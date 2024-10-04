// Modal.js
import React from 'react';

const Modal = ({ isOpen, onClose, onSubmit, formData, handleFormChange }) => {
    if (!isOpen) return null; 

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded shadow-lg">
                <h2 className="text-lg font-bold">Edit Product</h2>
                <form onSubmit={onSubmit}>
                  
                    {Object.keys(formData).map((key) => (
                        key !== 'variants' ? (
                            <div key={key} className="mb-4">
                                <label className="block text-sm font-medium">{key.charAt(0).toUpperCase() + key.slice(1)}:</label>
                                <input 
                                    type={key === 'regularPrice' ? 'number' : 'text'}
                                    name={key}
                                    value={formData[key]}
                                    onChange={handleFormChange}
                                    required
                                    className="p-2 border border-gray-300 rounded w-full"
                                />
                            </div>
                        ) : (
                            formData.variants.map((variant, index) => (
                                <div key={`size-${index}`} className="mb-4">
                                    <label className="block text-sm font-medium">Variant Size:</label>
                                    <input 
                                        type='text' 
                                        name={`size-${index}`} 
                                        value={variant.size} 
                                        onChange={(e) => {
                                            const newVariants = [...formData.variants];
                                            newVariants[index].size = e.target.value;
                                            handleFormChange({ target: { name: 'variants', value: newVariants } });
                                        }}
                                        required 
                                        className='p-2 border border-gray-300 rounded w-full' 
                                    />
                                </div>
                            ))
                        )
                    ))}
                    <button type='submit' className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'>Update Product</button>
                    <button type='button' onClick={onClose} className='ml-2 bg-gray-300 hover:bg-gray-400 text-black font-bold py-2 px-4 rounded'>Cancel</button>
                </form>
            </div>
        </div>
    );
};

export default Modal;
