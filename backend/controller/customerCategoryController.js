const CustomerCategory = require('../model/CustomerCategory');

// Create a new category, enforcing the limit of 3 categories
const createCategory = async (req, res) => {
    const { customercategoryId, customercategoryName, customercategoryDescription } = req.body;
    console.log(customercategoryId)
    try {
        const count = await CustomerCategory.countDocuments();

        if (count >= 3) {
            return res.status(400).json({ message: 'Cannot add more than three categories' });
        }

        const newcustomerCategory = new CustomerCategory({ 
            customercategoryId, 
            customercategoryName, 
            customercategoryDescription 
        });
        
        await newcustomerCategory.save();
        res.status(201).json({ message: 'Category created successfully', newCategory });
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


const updateCategory = async (req, res) => {
    const { customercategoryId } = req.body;
    const { customercategoryName, customercategoryDescription } = req.body;
     console.log
    try {
        const updatedCategory = await CustomerCategory.findOneAndUpdate(
            { customercategoryId },
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


const deleteCategory = async (req, res) => {
    const { customercategoryId } = req.body;

    try {
        const deletedCategory = await CustomerCategory.findOneAndDelete({ customercategoryId });

        if (!deletedCategory) {
            return res.status(404).json({ message: 'Category not found' });
        }

        res.status(200).json({ message: 'Category deleted successfully', deletedCategory });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to delete category', error });
    }
};

module.exports = {
    createCategory,
    getCategories,
    updateCategory,
    deleteCategory
};

