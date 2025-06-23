const Battery = require("../models/batteryModel");

module.exports.createBattery = async (req, res, next) => {
  try {
    const {
      serialId,
      modelName,
      image,
      batteryId,
      dischargeCycles,
      remarks,
      purchaseDate,
      status,
    } = req.body;

    const battery = await Battery.create({
      serialId,
      modelName,
      image,
      batteryId,
      dischargeCycles,
      remarks,
      purchaseDate,
      status,
    });

    return res.status(201).json({ status: true, battery });
  } catch (error) {
    console.error("Error creating battery:", error);
    return res
      .status(500)
      .json({ status: false, msg: "Internal server error." });
  }
};

module.exports.createBatteryOwn = async (req, res, next) => {
  try {
    const {
      serialId,
      modelName,
      image,
      batteryId,
      dischargeCycles,
      remarks,
      purchaseDate,
      status,
      userId,
      pilotBattery,
    } = req.body;
    const battery = await Battery.create({
      serialId,
      modelName,
      image,
      batteryId,
      dischargeCycles,
      remarks,
      purchaseDate,
      status,
      userId,
      pilotBattery,
    });
    if (battery) {
      return res.status(201).json({ status: true, battery });
    }
  } catch (error) {
    console.error("Error creating battery (own):", error);
    return res
      .status(500)
      .json({ status: false, msg: "Internal server error." });
  }
};

module.exports.getBattery = async (req, res, next) => {
  try {
    const battery = await Battery.find({ pilotBattery: false });

    if (!battery || battery.length === 0) {
      return res
        .status(404)
        .json({ status: false, msg: "No battery data found." });
    }

    return res.status(200).json({ status: true, battery });
  } catch (error) {
    console.error("Error fetching battery data:", error);
    return res
      .status(500)
      .json({ status: false, msg: "Internal server error." });
  }
};

module.exports.getPilotBattery = async (req, res, next) => {
  try {
    const { batteriesId } = req.body;
    const battery = await Battery.find({
      _id: batteriesId,
      pilotBattery: true,
    });

    if (!battery || battery.length === 0) {
      return res
        .status(404)
        .json({ status: false, msg: "Pilot battery not found." });
    }
    return res.status(200).json({ status: true, battery });
  } catch (error) {
    console.error("Error fetching pilot battery:", error);
    return res
      .status(500)
      .json({ status: false, msg: "Internal server error." });
  }
};

module.exports.editBattery = async (req, res, next) => {
  try {
    const {
      serialId,
      modelName,
      image,
      batteryId,
      dischargeCycles,
      remarks,
      purchaseDate,
      status,
      id,
    } = req.body;

    if (!id) {
      return res
        .status(400)
        .json({ status: false, msg: "Battery ID is required." });
    }

    const updatedBattery = await Battery.findByIdAndUpdate(
      id,
      {
        serialId,
        modelName,
        image,
        batteryId,
        dischargeCycles,
        remarks,
        purchaseDate,
        status,
      },
      { new: true }
    );
    if (!updatedBattery) {
      return res.status(404).json({ status: false, msg: "Battery not found." });
    }
    return res.status(200).json({ status: true, battery: updatedBattery });
  } catch (error) {
    console.error("Error editing battery:", error);
    return res
      .status(500)
      .json({ status: false, msg: "Internal server error." });
  }
};

module.exports.fetchBatteryById = async (req, res, next) => {
  try {
    const { id } = req.body;

    if (!id) {
      return res
        .status(400)
        .json({ status: false, msg: "Battery ID is required." });
    }

    const battery = await Battery.findById(id);
    if (!battery) {
      return res.status(404).json({ status: false, msg: "Battery not found." });
    }
    return res.status(200).json({ status: true, battery });
  } catch (error) {
    console.error("Error fetching battery by ID:", error);
    return res
      .status(500)
      .json({ status: false, msg: "Internal server error." });
  }
};

module.exports.deleteBattery = async (req, res) => {
  try {
    const { id } = req.body;

    if (!id) {
      return res
        .status(400)
        .json({ status: false, msg: "Battery ID is required." });
    }

    const deletedBattery = await Battery.findByIdAndDelete(id);

    if (!deletedBattery) {
      return res
        .status(404)
        .json({ status: false, message: "Battery not found" });
    }

    return res
      .status(200)
      .json({ status: true, message: "Battery deleted successfully" });
  } catch (error) {
    console.error("Delete Battery Error:", error);
    return res
      .status(500)
      .json({ status: false, message: "Internal server error" });
  }
};
