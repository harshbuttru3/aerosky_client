const ProjectRequest = require("../models/projectRequestModel");

module.exports.createProjectAccessRequest = async (req, res, next) => {
  try {
    const {
      name,
      projectLocation,
      startDate,
      deadline,
      scope,
      industry,
      type,
      kmlkmzFiles,
      attachments,
      clientDetails,
      deliverablesRequired,
      teamMembers,
    } = req.body;

    const request = await ProjectRequest.create({
      name,
      projectLocation,
      startDate,
      deadline,
      scope,
      industry,
      type,
      kmlkmzFiles,
      attachments,
      clientDetails,
      deliverablesRequired,
      teamMembers,
    });
    if (request) {
      res.status(201).json({ status: true, request });
    }
  } catch (error) {
    console.error("Error creating project access request:", error);
    next(error);
  }
};

module.exports.getProjectAccessRequest = async (req, res, next) => {
  try {
    const { token } = req.body;
    if (token === "719abd43fa46e1f4b7675f4e3b764d2f") {
      const request = await ProjectRequest.find();
      if (request) {
        res.status(200).json({ status: true, request });
      }
      return res.json({ status: false, msg: "No project requests found." });
    } else {
      return res.status(401).json({ status: false, msg: "Invalid token." });
    }
  } catch (error) {
    console.error("Error fetching project access requests:", error);
    next(error);
  }
};

module.exports.getProjectAccessRequestById = async (req, res, next) => {
  try {
    const { id } = req.body;

    if (!id) {
      return res
        .status(400)
        .json({ status: false, msg: "Project request ID is required." });
    }
    const request = await ProjectRequest.find({ _id: id });
    if (request && request.length > 0) {
      return res.status(200).json({ status: true, request });
    }
    return res.json({ status: false, msg: "Project request not found." });
  } catch (error) {
    console.error("Error fetching project access requests by id:", error);
    next(error);
  }
};

module.exports.deleteProjectRequest = async (req, res, next) => {
  try {
    const { id } = req.body;

    if (!id) {
      return res
        .status(400)
        .json({ status: false, msg: "Project request ID is required." });
    }

    const deletedRequest = await ProjectRequest.findByIdAndDelete(id);
    if (deletedRequest) {
      return res.status(200).json({
        status: true,
        msg: "Project request deleted successfully.",
        request: deletedRequest,
      });
    }
  } catch (error) {
    console.error("Error deleting project request:", error);

    if (error.name === "CastError") {
      return res
        .status(400)
        .json({ status: false, msg: "Invalid project request ID format." });
    }

    next(error);
  }
};

module.exports.changeStatusById = async (req, res, next) => {
  try {
    const { id, status, token } = req?.body;
    if (token === "d80a06cb4d4638995778a040c51f86f5") {
      const request = ProjectRequest.findByIdAndUpdate(
        id,
        {
          status,
        },
        { new: true },
        (err, obj) => {
          if (err) {
            return res.json({ status: false, msg: "Something went wrong!" });
          }
          return res.json({ status: true, request: obj });
        }
      );
    } else {
      return res.json({ status: false, msg: "Something went wrong!" });
    }
  } catch (ex) {
    next(ex);
  }
};
