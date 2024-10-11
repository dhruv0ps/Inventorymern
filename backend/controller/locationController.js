const InventoryLocation = require("../model/inventoryLocation");

const addLocation = async(req,res) => {
    const {name ,address} = req.body 

    try{
             const Location = new InventoryLocation ({
                 name ,
                 address,
             })
        await Location.save();
        res.status(200).json({
            message :"Location added succefully"
        })
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
}



module.exports = { addLocation
}