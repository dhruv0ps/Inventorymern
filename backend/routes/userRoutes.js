// backend/routes/userRoutes.js
const express = require('express');
const { registerUser, getAllUsers,activateUser,suspendUser,deleteUser } = require('../controller/userController');
const authroutes = require("../middleware/auth");
const router = express.Router();


router.post('/', registerUser);


router.get('/', authroutes,getAllUsers);
router.put('/:id/activate',authroutes, activateUser);

router.put('/:id/suspend', authroutes ,suspendUser);

router.delete('/:id', authroutes, deleteUser);


module.exports = router;

