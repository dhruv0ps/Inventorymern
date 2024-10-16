const mongoose = require('mongoose');
const CustomerCategory = require('../model/CustomerCategory');

// Create a new category, enforcing the limit of 3 categories
const createCategory = async (req, res) => {
    const { customercategoryId, customercategoryName, customercategoryDescription } = req.body;
    console.log(customercategoryId)
    try {
        

        const newcustomerCategory = new CustomerCategory({ 
            customercategoryId, 
            customercategoryName, 
            customercategoryDescription 
        });
        
        await newcustomerCategory.save();
        res.status(201).json({ message: 'Category created successfully', newcustomerCategory }); // Fixed variable name
    } catch (error) {
        console.error(error); 
        res.status(500).json({ message: 'Failed to create category', error });
    }
};

// Get all categories
const getCategories = async (req, res) => {
    try {
        const categories = await CustomerCategory.find();
        res.status(200).json(categories);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to fetch categories', error });
    }
};

// Update a category by ID
const updateCategory = async (req, res) => {
    const { id } = req.params;
    const { customercategoryName, customercategoryDescription } = req.body;
     
    try {
        const updatedCategory = await CustomerCategory.findByIdAndUpdate(
        id, 
            { customercategoryName, customercategoryDescription },
            { new: true }
        );

        if (!updatedCategory) {
            return res.status(404).json({ message: 'Category not found' });
        }

        res.status(200).json({ message: 'Category updated successfully', updatedCategory });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to update category', error });
    }
};

// Delete a category by ID
const deleteCategory = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedCategory = await CustomerCategory.findByIdAndDelete(id); // Use findByIdAndDelete for MongoDB _id

        if (!deletedCategory) {
            return res.status(404).json({ message: 'Category not found' });
        }

        res.status(200).json({ message: 'Category deleted successfully', deletedCategory });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to delete category', error });
    }
};

// Get a single category by ID
const getsingleCategory = async (req, res) => {
    const { id } = req.params;
    
    try {
        const singleCategory = await CustomerCategory.findById(id);
        
        if (!singleCategory) {
            return res.status(404).json({ message: 'Category not found' });
        }

        res.status(200).json(singleCategory);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to find category', error });
    }
};

module.exports = {
    createCategory,
    getCategories,
    updateCategory,
    deleteCategory,
    getsingleCategory
};
