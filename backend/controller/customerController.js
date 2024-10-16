const Customer = require("../model/Customers");

// Create a new customer
const newCustomer = async (req, res) => {
  try {
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
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to create customer", error: error.message });
  }
};

// Get all customers
const getCustomer = async (req, res) => {
  try {
    const customers = await Customer.find();
    if (customers) {
      res.status(200).json(customers);
    } else {
      res.status(400).json({ message: "No customers found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update customer details
const updateCustomer = async (req, res) => {
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
};

// Delete a customer
const deleteCustomer = async (req, res) => {
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
};


const toggleCustomerStatus = async (req, res) => {
  const { customerId } = req.params; 
  console.log(customerId); 
  try {
   
    const customer = await Customer.findById(customerId);

    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

  
    customer.isActive = !customer.isActive;
    await customer.save();

    const status = customer.isActive ? 'activated' : 'deactivated';
    return res.status(200).json({ message: `Customer ${status} successfully`, customer });
  } catch (error) {
    console.error('Error toggling customer status:', error);
    return res.status(500).json({ message: 'Failed to toggle customer status' });
  }
};

const getsingleCustomer = async (req, res) => {
  const { customerId } = req.params;  // Get customerId from request parameters

  try {
    const customer = await Customer.findById(customerId);  // Find customer by ID

    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });  // Handle case where customer is not found
    }

    return res.status(200).json(customer);  // Return the found customer
  } catch (error) {
    console.error('Error retrieving customer:', error);  // Log the error for debugging
    return res.status(500).json({ message: 'Failed to retrieve customer', error: error.message });  // Handle server error
  }
};

module.exports = {
  newCustomer,
  getCustomer,
  updateCustomer,
  deleteCustomer,
  toggleCustomerStatus, 
  getsingleCustomer,   
};
