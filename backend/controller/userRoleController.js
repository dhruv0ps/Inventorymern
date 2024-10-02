const Role = require("../model/Role");

const bcrypt = require("bcryptjs")
const jwt = require('jsonwebtoken');
const dotenv = require("dotenv")
dotenv.config();

const addnewRole = async(req,res) => {
    const {role} = req.body
    try{
    const existingprofile =     await Role.findOne({name : role});
  if(existingprofile){
    return res.status(400).json({msg : "role already exist "});

  }
  const newRole =   new Role({name : role});
  await     newRole.save();
  
    }
    catch(error){
        res.status(500).json({ message: error.message });
    }
}

const updateUserRole = async(req,res) => {
    const {role} = req.body;
    const userId = req.params.userId;
    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.role = role;
        await user.save();

        res.status(200).json({ message: 'User role updated successfully', user });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.export = 
{
    addnewRole,
    updateUserRole,   
}
