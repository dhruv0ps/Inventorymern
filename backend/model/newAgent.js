
const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema({
  unit: { type: String },
  buzzCode: { type: String },
  street: { type: String, required: true },
  province: {
    type: String,
    required: true,
    enum: [
      'Alberta', 'British Columbia', 'Manitoba', 'New Brunswick', 
      'Newfoundland and Labrador', 'Northwest Territories', 'Nova Scotia', 
      'Nunavut', 'Ontario', 'Prince Edward Island', 'Quebec', 'Saskatchewan', 'Yukon'
    ],
  },
  postalCode: { type: String, required: true },
  isDefault: { type: Boolean, default: false }
});

const newAgentSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  cell: { type: String, required: true },
  emailID: { type: String, required: true, unique: true }, 
  addresses: { 
    type: [addressSchema], // Change this to an array of address objects
    required: true 
  },
  commissionPercentage: { type: Number, min: 0, max: 100 }, 
  status: {
    type: String,
    enum: ['active', 'inactive'], 
    
    default: 'active' 
    
  },
}, { timestamps: true });

module.exports = mongoose.model("Agent", newAgentSchema);
