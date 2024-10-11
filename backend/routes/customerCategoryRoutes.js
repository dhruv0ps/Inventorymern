const express = require('express');
const {
    createCategory,
    getCategories,
    updateCategory,
    deleteCategory
} = require('../controller/customerCategoryController');

const router = express.Router();
const auth = require("../middleware/auth");
router.post('/',auth, createCategory);
router.get('/', auth,getCategories);
router.put('/',auth, updateCategory);
router.delete('/:categoryId',auth, deleteCategory);

module.exports = router;
