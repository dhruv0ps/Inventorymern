const mongoose = require("mongoose")


const productcategorieschema = new mongoose.Schema({
 name : {type: String ,require:true, unique:true},
 description : {type :String,require:true}

})
module.exports = mongoose.model("Productcategories",productcategorieschema)
