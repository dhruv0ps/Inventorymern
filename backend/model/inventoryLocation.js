const moongose = require("mongoose");

const LocationSchema = new moongose.Schema ({
      name : {type :String, require:true},
      address : {type : String ,require :true},

})

InventoryLocation = moongose.model("InventoryLocation",LocationSchema)

module.exports = InventoryLocation;

