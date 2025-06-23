const User = require("../models/userModel");
const Client = require("../models/clientModels");

module.exports.createClient = async (req, res, next) => {
  try {
    const { clientName, clientMail, clientImage, clientNumber, projectName } =
      req.body;
    const client = await Client.create({
      clientName,
      clientMail,
      clientImage,
      clientNumber,
      projectName,
    });
    if (client) {
      return res
        .status(201)
        .json({ status: true, client, msg: "Client created successfully" });
    }
    return res.status(500).json({
      status: false,
      msg: "Client could not be created. Please try again.",
    });
  } catch (error) {
    console.error("Error creating client:", error);
    return res.status(500).json({
      status: false,
      msg: "Internal Server Error",
      error: error.message,
    });
  }
};

module.exports.getClients = async (req, res, next) => {
  try {
    const { clientName, projectName } = req.query;
    let filter = { roles: "Client" };

    if (clientName) {
      filter.name = new RegExp(clientName.trim(), "i");
    }

    if (projectName) {
      filter.organizationType = new RegExp(projectName.trim(), "i");
    }

    const client = await User.find(filter);

    if (!client || client.length === 0) {
      return res.status(404).json({
        status: false,
        msg: "No clients found.",
      });
    }

    return res.status(200).json({
      status: true,
      msg: "Clients fetched successfully",
      client,
    });
  } catch (error) {
    console.error("Error fetching clients:", error);
    return res.status(500).json({
      status: false,
      msg: "Internal Server Error",
      error: error.message,
    });
  }
};
