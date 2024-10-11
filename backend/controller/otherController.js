const User = require("../model/User");
const bcrypt = require("bcryptjs")
const mongoose = require('mongoose');
const loginuser = async(req,res) => {
    const {email,password} = req.body
                               
    try{
      const user = await User.findOne({email});

      if(!user){
        return res.status(400).json({ message: 'Invalid email or password' });
      }
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
          return res.status(400).json({ message: 'Invalid email or password' });
      }
      res.status(200).json({ message: 'Login successful',userId: user._id     });
    }catch (error) {
        res.status(500).json({ message: error.message });
    }

}

const getUser = async(req,res) => {
    const {userId} = req.params;
    console.log(userId)
try{
    const user = await User.findById(new mongoose.Types.ObjectId(userId));
    if(user){
      res.status(200).json(user)
  
    }
    else{
      res.status(400).json({message : "usernotfound"});
    
    }
}

  catch (error) {
    console.log(error)
    res.status(500).json({ message: error.message });
}
}
module.exports = {loginuser,getUser};
