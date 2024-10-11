const Customer = require("../model/Customers")

const newCustomer = async(req,res) => {

    try{

    
    const {
        firstName,
        lastName,
        phoneNumber,
        cell,
        emailId,
        emailId2,
        businessName,
        customerCategory,
        addresses,
      } = req.body;

      if (!firstName || !lastName || !cell || !emailId || !businessName) {
        return res.status(400).json({ message: "Required fields are missing." });
      }
      const customer = new Customer({
        firstName,
        lastName,
        phoneNumber,
        cell,
        emailId,
        emailId2,
        businessName,
        customerCategory,
        addresses,
      });
  
    
      await customer.save();
  
   
      res.status(201).json({ message: "Customer created successfully", customer });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to create customer", error: error.message });
      }

}

const getCustomer = async(req,res) => {
    try{
        const customer = await Customer.find();
        if(customer){
              res.status(200).json(customer);
        }
        else{
            res.status(400).json({message : "No customers"})
        }
    }
    catch(error){
        res.status(500).json({ message: error.message });
    }
}

const updateCustomer = async(req,res) => {
  const { customerId } = req.params;
  const updatedData = req.body;

  try {
    
    const updatedCustomer = await Customer.findByIdAndUpdate(customerId, updatedData, { 
      new: true, 
      runValidators: true 
    });

    
    if (!updatedCustomer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

 
    return res.status(200).json(updatedCustomer);
  } catch (error) {
    console.error('Error updating customer:', error);
    return res.status(500).json({ message: 'Failed to update customer' });
  }
}
const deleteCustomer = async(req, res) => {
  const { customerId } = req.params;

  try {
    const deletedCustomer = await Customer.findByIdAndDelete(customerId);

    if (!deletedCustomer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    return res.status(200).json({ message: 'Customer deleted successfully' });
  } catch (error) {
    console.error('Error deleting customer:', error);
    return res.status(500).json({ message: 'Failed to delete customer' });
  }
}

module.exports = {newCustomer,getCustomer,updateCustomer,deleteCustomer}