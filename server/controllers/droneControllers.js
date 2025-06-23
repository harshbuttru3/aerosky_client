const Drone = require("../models/droneModel");

module.exports.createDrone = async (req, res, next) => {
  try {
    const { name, id, image, ownerName } = req.body;

    if (!name || !id || !image || !ownerName) {
      return res
        .status(400)
        .json({ status: false, msg: "All fields are required." });
    }

    const drone = await Drone.create({
      name,
      id,
      image,
      ownerName,
    });

    return res.status(201).json({ status: true, drone });
  } catch (error) {
    console.error("Create Drone Error:", error);
    return res.status(500).json({ status: false, msg: "Server error." });
  }
};

module.exports.createDroneOwn = async (req, res, next) => {
  try {
    const { name, id, image, ownerName, userId, pilotDrone } = req.body;

    if (!name || !id || !image || !ownerName || !userId) {
      return res
        .status(400)
        .json({ status: false, msg: "All fields are required." });
    }

    const drone = await Drone.create({
      name,
      id,
      image,
      ownerName,
      userId,
      pilotDrone,
    });

    return res.status(201).json({ status: true, drone });
  } catch (error) {
    console.error("Create Pilot Drone Error:", error);
    return res.status(500).json({ status: false, msg: "Server error." });
  }
};

module.exports.getDrones = async (req, res, next) => {
  try {
    const drone = await Drone.find({ pilotDrone: false });
    if (drone) {
      return res.status(200).json({ status: true, drone });
    }
  } catch (error) {
    console.error("Get Drones Error:", error);
    return res.status(500).json({ status: false, msg: "Server error." });
  }
};

module.exports.getPilotDrones = async (req, res, next) => {
  try {
    const { dronesId } = req.body;

    if (!dronesId) {
      return res
        .status(400)
        .json({ status: false, msg: "Drone ID is required." });
    }

    const drone = await Drone.find({ _id: dronesId, pilotDrone: true });
    if (!drone.length) {
      return res
        .status(404)
        .json({ status: false, msg: "No pilot drone found." });
    }

    return res.status(200).json({ status: true, drone });
  } catch (error) {
    console.error("Get Pilot Drones Error:", error);
    return res.status(500).json({ status: false, msg: "Server error." });
  }
};

module.exports.fetchDroneById = async (req, res, next) => {
  try {
    const { id } = req.body;

    if (!id) {
      return res
        .status(400)
        .json({ status: false, msg: "Drone ID is required." });
    }

    const drone = await Drone.findById(id);
    if (!drone) {
      return res.status(404).json({ status: false, msg: "Drone not found." });
    }
    return res.status(200).json({ status: true, drone });
  } catch (error) {
    console.error("Fetch Drone Error:", error);
    return res.status(500).json({ status: false, msg: "Server error." });
  }
};

module.exports.deleteDrone = async (req, res) => {
  try {
    const { id } = req.body;

    if (!id) {
      return res
        .status(400)
        .json({ status: false, msg: "DeoneId is required" });
    }

    const drone = await Drone.findByIdAndDelete(id);

    if (!drone) {
      return res.status(404).json({ status: false, msg: "Drone not found" });
    }

    return res
      .status(200)
      .json({ status: true, msg: "Drone deleted successfully!!" });
  } catch (error) {
    console.log("Delete drone error : ", error);
    return res.status(500).json({ status: false, msg: "Server error." });
  }
};

module.exports.editDrone = async (req, res) => {
  try {
    const { _id, id, name, ownerName, image } = req.body;

    if (!_id || !id || !name || !ownerName || !image) {
      return res
        .status(400)
        .json({ status: false, message: "Missing required fields" });
    }

    const updatedDrone = await Drone.findByIdAndUpdate(
      _id,
      {
        name,
        image,
        ownerName,
        id,
      },
      { new: true, runValidators: true }
    );

    if (!updatedDrone) {
      return res
        .status(404)
        .json({ status: false, message: "Drone not found" });
    }

    return res.status(200).json({
      status: true,
      msg: "Drone updated successfully ",
      updatedDrone,
    });
  } catch (error) {
    console.error("Update failed:", error);
    res.status(500).json({ status: false, message: "Server error" });
  }
};
