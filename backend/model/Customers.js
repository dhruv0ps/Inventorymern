const mongoose = require("mongoose");

const CustomerSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true, 
      },
      lastName: {
        type: String,
        required: true, 
      },
      phoneNumber: {
        type: String,
        required: false, 
      },
      cell: {
        type: String,
        required: true, 
      },
      emailId: {
        type: String,
        required: true, 
        unique: true, 
      },
      emailId2: {
        type: String,
        required: false,
      },
      businessName: {
        type: String,
        required: true,
      },
      addresses : [{
        unit : {
            type :String,
            required: false,
        },
        buzzCode: {
            type: String,
            required: false,
          },
          street: {
            type: String,
            required: true, 
          },
          province: {
            type: String,
            enum: [
              'Alberta',
              'British Columbia',
              'Manitoba',
              'New Brunswick',
              'Newfoundland and Labrador',
              'Nova Scotia',
              'Ontario',
              'Prince Edward Island',
              'Quebec',
              'Saskatchewan',
              'Northwest Territories',
              'Nunavut',
              'Yukon',
            ], 
            required: true, 
          },
          postalCode: {
            type: String,
            required: true, 
           
          },
          isDefault: {
            type: Boolean,
            default: false, 
          },

      }],
      isActive: {
        type: Boolean,
        default: true,  
    }
},{ timestamps: true })

module.exports = mongoose.model("Customer",CustomerSchema)