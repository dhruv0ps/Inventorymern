// src/components/ProductModal.js

import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import axios from 'axios';

// Set the app element for accessibility
Modal.setAppElement('#root');

const ProductModal = ({ isOpen, onRequestClose, productToEdit, onUpdate }) => {
  const [currentProduct, setCurrentProduct] = useState(null);

  useEffect(() => {
    setCurrentProduct(productToEdit);
  }, [productToEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCurrentProduct((prevProduct) => ({
      ...prevProduct,
      [name]: value,
    }));
  };

  const handleProductUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${process.env.REACT_APP_API_URL}/api/products/${currentProduct._id}`, currentProduct);
      alert('Product updated successfully!');
      onUpdate(); // Callback to fetch updated products
      onRequestClose(); // Close modal
    } catch (error) {
      console.error('Error updating product:', error);
    }
  };

  // Inline styles for the modal and overlay
  const modalStyle = {
    content: {
      background: 'white',
      borderRadius: '8px',
      padding: '20px',
      maxWidth: '500px',
      width: '90%', // Adjust to fit well on mobile
      position: 'fixed', // Use fixed positioning
      top: '50%',
      left: '50%', // Center horizontally
      transform: 'translate(-50%, -50%)', // Center vertically
      zIndex: 1000, // Ensure it is on top
    },
    overlay: {
      background: 'rgba(0, 0, 0, 0.5)',
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Edit Product Modal"
      style={modalStyle} // Apply inline styles
    >
      <h2 className="text-2xl font-bold mb-4">Edit Product</h2>
      {currentProduct && (
        <form onSubmit={handleProductUpdate}>
          <div className="mb-4">
            <label className="block mb-1">Product Name:</label>
            <input
              type="text"
              name="name"
              value={currentProduct.name}
              onChange={handleChange}
              className="p-2 border border-gray-300 rounded w-full"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1">SKU:</label>
            <input
              type="text"
              name="SKU"
              value={currentProduct.SKU}
            //   onChange={handleChange}
              className="p-2 border border-gray-300 rounded w-full"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1">Regular Price:</label>
            <input
              type="number"
              name="regularPrice"
              value={currentProduct.regularPrice}
              onChange={handleChange}
              className="p-2 border border-gray-300 rounded w-full"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1">Color:</label>
            <input
              type="text"
              name="color"
              value={currentProduct.color}
              onChange={handleChange}
              className="p-2 border border-gray-300 rounded w-full"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1">Weight:</label>
            <input
              type="number"
              name="weight"
              value={currentProduct.weight}
              onChange={handleChange}
              className="p-2 border border-gray-300 rounded w-full"
              required
            />
          </div>
          <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            Update Product
          </button>
          <button
            type="button"
            onClick={onRequestClose}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 ml-2"
          >
            Cancel
          </button>
        </form>
      )}
    </Modal>
  );
};

export default ProductModal;
