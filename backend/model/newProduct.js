const mongoose = require("mongoose");

const newproductSchema = new mongoose.Schema({
    parentName : {type:String,require:true},
    variants: [
        {
            size : {type:String ,require:true},
            firmness : {type : String ,require : true}

            
        }

       
    ],
    SKU: { type: String, required: true, unique: true }, 
    name : {type :String ,required :true},
    description: { type: String, required: true },      
    regularPrice: { type: Number, required: true },
    color: { type: String,  },
    weight: {type :String },
    rawMaterials: [{ material: String, quantity: Number, unit: String }], 
    // tags: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tag' }]   
    tags: [{ type: String }],
    
})

const Products = mongoose.model("Products",newproductSchema)

module.exports = Products;
