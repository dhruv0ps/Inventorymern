const express = require('express');
const {
    createCategory,
    getCategories,
    updateCategory,
    deleteCategory,
    getsingleCategory
} = require('../controller/customerCategoryController');

const router = express.Router();
const auth = require("../middleware/auth");
router.post('/',auth, createCategory);
router.get('/', auth,getCategories);
router.put('/:id',auth, updateCategory);
router.delete('/:categoryId',auth, deleteCategory);
router.get("/:id",getsingleCategory);


module.exports = router;
