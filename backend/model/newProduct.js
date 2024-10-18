const mongoose = require("mongoose");

const newproductSchema = new mongoose.Schema({
    parentName: { type: String, required: true },
    category: [{ type: String, required: true }],
    variants: [
        {
            size: { type: String},
            height: { type: Number,  }, // Height of the variant
            width: { type: Number,  }, // Width of the variant
            length: { type: Number,  }, 
            firmness: { type: String, required: true },
            SKU: { type: String, required: true, unique: true }, // Child SKU for variant
            price: { type: Number, required: true },
            weight: { type: Number, required: true },
            color: { type: String,  },
            childName: { type: String, required: true },
            rawMaterials: [{ material: String, quantity: Number, unit: String }],
            tags: [{ type: String }],
            isActive: { type: Boolean, default: true },
        }
    ],
    SKU: { type: String, required: true, unique: true }, // Parent SKU
    // name: { type: String, required: true },
    description: { type: String, required: true },
    
});
const Products = mongoose.model("Products", newproductSchema);

module.exports = Products;
