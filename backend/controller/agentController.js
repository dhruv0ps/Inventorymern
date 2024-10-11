const Agent = require("../model/newAgent");

const createAgent = async (req, res) => {
  try {
    const { firstName, lastName, cell, emailID, addresses, commissionPercentage } = req.body;

    // Prepare the new agent object
    const newAgent = new Agent({
      firstName,
      lastName,
      cell,
      emailID, // emailID comes from the frontend
      addresses, // Addresses should already be in the required format (array of objects)
      commissionPercentage,
    });

    // Save the agent in the database
    await newAgent.save();

    res.status(201).json({ message: 'Agent created successfully', agent: newAgent });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to create agent', error: error.message });
  }
};

const getAgent = async (req, res) => {
  try {
    const agents = await Agent.find();
    if (!agents || agents.length === 0) {
      return res.status(400).json("No agents found");
    }
    res.status(200).json(agents);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch agents', error: error.message });
  }
};

const deleteAgent = async (req, res) => {
  const { id } = req.params; // Get the agent ID from the request parameters

  try {
    const deletedAgent = await Agent.findByIdAndDelete(id);

    if (!deletedAgent) {
      return res.status(404).json({ message: "Agent not found" });
    }

    res.status(200).json({ message: 'Agent deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to delete agent', error: error.message });
  }
};

const updateAgent = async (req, res) => {
  const { id } = req.params; // Get the agent ID from the request parameters
  const { firstName, lastName, cell, emailID, addresses, commissionPercentage } = req.body;

  try {
    // Find the agent by ID and update it
    const updatedAgent = await Agent.findByIdAndUpdate(
      id,
      {
        firstName,
        lastName,
        cell,
        emailID,
        addresses,
        commissionPercentage,
      },
      { new: true } // Return the updated agent
    );

    if (!updatedAgent) {
      return res.status(404).json({ message: "Agent not found" });
    }

    res.status(200).json({ message: 'Agent updated successfully', agent: updatedAgent });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to update agent', error: error.message });
  }
};


const statusagent = async (req, res) => {
  const { id } = req.params; // Get the agent ID from the request parameters
  const { status } = req.body; // Get the desired status from the request body

  try {
    const result = await Agent.updateOne({ _id: id }, { $set: { status } });

    if (result.modifiedCount === 0) {
      return res.status(404).json({ message: "Agent not found or status unchanged" });
    }

    res.status(200).json({ message: `Agent ${status} successfully` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating agent status", error: error.message });
  }
}


module.exports = { createAgent, getAgent, deleteAgent, updateAgent,statusagent };
