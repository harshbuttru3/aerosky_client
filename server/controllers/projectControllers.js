const Project = require("../models/projectModel");
const Site = require("../models/siteModel");
const TowerProject = require("../models/TowerProjectModel");
const SolarProject = require("../models/solarProjectModel");
const ProjectRequest = require("../models/projectRequestModel");
const User = require("../models/userModel");

const sendAnEmailForAlertingTheClient = async (projectDetails) => {};

module.exports.updateMissions = async (req, res, next) => {
  try {
    const { ongoingMissions, id, key } = req.body;
    const { industry } = req?.query;
    if (key === "8PT3wDCU+GVdniP3dVrLM4L96tjmmqxIX5HU+UZFVKw=") {
      if (industry === "Construction") {
        const project = Project.findByIdAndUpdate(
          id,
          {
            ongoingMissions,
          },
          { new: true },
          (err, obj) => {
            if (err) {
              return res.json({ status: false, msg: "Something went wrong" });
            }
            return res.json({ status: true, project: obj });
          }
        );
      } else if (industry === "Solar") {
        const project = SolarProject.findByIdAndUpdate(
          id,
          {
            ongoingMissions,
          },
          { new: true },
          (err, obj) => {
            if (err) {
              return res.json({ status: false, msg: "Something went wrong" });
            }
            return res.json({ status: true, project: obj });
          }
        );
      } else if (industry === "Tower") {
        const project = TowerProject.findByIdAndUpdate(
          id,
          {
            ongoingMissions,
          },
          { new: true },
          (err, obj) => {
            if (err) {
              return res.json({ status: false, msg: "Something went wrong" });
            }
            return res.json({ status: true, project: obj });
          }
        );
      }
    } else {
      return res.json({ status: false, msg: "Something went wrong!" });
    }
  } catch (ex) {
    next(ex);
  }
};

module.exports.updateCompletedMissions = async (req, res, next) => {
  try {
    const { completedMissions, id, key } = req.body;
    const { industry } = req?.query;
    if (key === "8PT3wDCU+GVdniP3dVrLM4L96tjmmqxIX5HU+UZFVKw=") {
      if (industry === "Construction") {
        const project = Project.findByIdAndUpdate(
          id,
          {
            completedMissions,
          },
          { new: true },
          (err, obj) => {
            if (err) {
              return res.json({ status: false, msg: "Something went wrong" });
            }
            return res.json({ status: true, project: obj });
          }
        );
      } else if (industry === "Solar") {
        const project = SolarProject.findByIdAndUpdate(
          id,
          {
            completedMissions,
          },
          { new: true },
          (err, obj) => {
            if (err) {
              return res.json({ status: false, msg: "Something went wrong" });
            }
            return res.json({ status: true, project: obj });
          }
        );
      } else if (industry === "Tower") {
        const project = TowerProject.findByIdAndUpdate(
          id,
          {
            completedMissions,
          },
          { new: true },
          (err, obj) => {
            if (err) {
              return res.json({ status: false, msg: "Something went wrong" });
            }
            return res.json({ status: true, project: obj });
          }
        );
      }
    } else {
      return res.json({ status: false, msg: "Something went wrong!" });
    }
  } catch (ex) {
    next(ex);
  }
};

module.exports.createProject = async (req, res, next) => {
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
      approvedBy,
      approvedAt,
      requestId,
    } = req.body;

    const projectRequestExists = await ProjectRequest.findOne({
      _id: requestId,
    });
    if (projectRequestExists) {
      if (!approvedBy?.roles?.includes("Admin")) {
        if (industry === "Construction") {
          const project = await Project.create({
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
            approvedBy,
            approvedAt,
          });
          if (project) {
            const projectRequest = await ProjectRequest.findByIdAndRemove(
              requestId
            );
            sendAnEmailForAlertingTheClient(project);
            const user = await User.findOne({ _id: clientDetails?._id });
            let projectRequestArray = [...user?.projectRequestsId];
            const idx = projectRequestArray?.findIndex(
              (id) => id === requestId
            );
            if (idx > -1) {
              projectRequestArray?.splice(idx, 1);
            }
            let projectsId = [...user?.projectsId];
            projectsId.unshift(project?._id);
            const updatedUser = await User.findByIdAndUpdate(
              clientDetails?._id,
              {
                projectsId,
                projectRequestsId: projectRequestArray,
              }
            );
            return res.json({ status: true, project });
          }
          return res.json({ status: false, msg: "Something went wrong" });
        } else if (industry === "Solar") {
          const project = await SolarProject.create({
            name,
            projectArea: projectLocation,
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
            approvedBy,
            approvedAt,
          });
          if (project) {
            const projectRequest = await ProjectRequest.findByIdAndRemove(
              requestId
            );
            sendAnEmailForAlertingTheClient(project);
            const user = await User.findOne({ _id: clientDetails?._id });
            let projectRequestArray = [...user?.projectRequestsId];
            const idx = projectRequestArray?.findIndex(
              (id) => id === requestId
            );
            if (idx > -1) {
              projectRequestArray?.splice(idx, 1);
            }
            let projectsId = [...user?.projectsId];
            projectsId.unshift(project?._id);
            const updatedUser = await User.findByIdAndUpdate(
              clientDetails?._id,
              {
                projectsId,
                projectRequestsId: projectRequestArray,
              }
            );
            return res.json({ status: true, project });
          }
          return res.json({ status: false, msg: "Something went wrong" });
        } else if (industry === "Tower") {
          const project = await TowerProject.create({
            name,
            projectArea: projectLocation,
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
            approvedBy,
            approvedAt,
          });
          if (project) {
            const projectRequest = await ProjectRequest.findByIdAndRemove(
              requestId
            );
            sendAnEmailForAlertingTheClient(project);
            const user = await User.findOne({ _id: clientDetails?._id });
            let projectRequestArray = [...user?.projectRequestsId];
            const idx = projectRequestArray?.findIndex(
              (id) => id === requestId
            );
            if (idx > -1) {
              projectRequestArray?.splice(idx, 1);
            }
            let projectsId = [...user?.projectsId];
            projectsId.unshift(project?._id);
            const updatedUser = await User.findByIdAndUpdate(
              clientDetails?._id,
              {
                projectsId,
                projectRequestsId: projectRequestArray,
              }
            );
            return res.json({ status: true, project });
          }
          return res.json({ status: false, msg: "Something went wrong" });
        }
      } else {
        return res.json({
          status: false,
          msg: "Something went wrong! You are not an admin",
        });
      }
    } else {
      return res.json({
        status: false,
        msg: "Project request already accepted or does not exists!",
      });
    }
  } catch (ex) {
    console.error("Create Project Error:", ex);
    return res.json({ status: false, msg: "Server error", error: ex.message });
  }
};

module.exports.getProjectById = async (req, res, next) => {
  try {
    const { id } = req?.body;
    const { industry } = req?.query;
    if (industry === "Construction") {
      const project = await Project.find({ _id: id });
      if (project.length > 0) {
        return res.json({ status: true, project });
      }
      return res.json({ status: false, msg: "Something went wrong!" });
    } else if (industry === "Tower") {
      const project = await TowerProject.find({ _id: id });
      if (project.length > 0) {
        return res.json({ status: true, project });
      }
      return res.json({ status: false, msg: "Something went wrong!" });
    } else if (industry === "Solar") {
      const project = await SolarProject.find({ _id: id });
      if (project.length > 0) {
        return res.json({ status: true, project });
      }
      return res.json({ status: false, msg: "Something went wrong!" });
    } else {
      let project = [];
      const proj = await Project.find({ _id: id });
      const proj2 = await SolarProject.find({ _id: id });
      const proj3 = await TowerProject.find({ _id: id });
      project = [...proj, ...proj2, ...proj3];
      if (project.length > 0) {
        return res.json({ status: true, project });
      }
      return res.json({ status: false, msg: "Something went wrong!" });
    }
    console.log(industry);
  } catch (ex) {
    console.log(ex);
    return res.json({ status: false, msg: "Something went wrong!" });
  }
};

module.exports.updateDeliverablesInProject = async (req, res, next) => {
  try {
    const { id, deliverables } = req?.body;

    if (!id || !deliverables) {
      return res.json({
        status: false,
        msg: "Project ID and deliverables are required!",
      });
    }

    // Find and update the project
    const updatedProject = await Project.findByIdAndUpdate(
      id,
      { deliverables: deliverables },
      { new: true } // Return the updated document
    );

    if (!updatedProject) {
      return res.json({
        status: false,
        msg: "Project not found!",
      });
    }

    return res.json({
      status: true,
      msg: "Deliverables updated successfully",
      project: updatedProject,
    });
  } catch (ex) {
    console.log(ex);
    return res.json({
      status: false,
      msg: "Something went wrong while updating deliverables!",
    });
  }
};

module.exports.getProjectBySiteId = async (req, res, next) => {
  try {
    const { siteId } = req?.body;
    const { industry } = req?.query;
    if (industry === "Construction") {
      const project = await Project.find({ _id: siteId });
      if (project.length > 0) {
        return res.json({ status: true, project });
      }
      return res.json({ status: false, msg: "Something went wrong!" });
    } else if (industry === "Tower") {
      const project = await TowerProject.find({ _id: id });
      if (project.length > 0) {
        return res.json({ status: true, project });
      }
      return res.json({ status: false, msg: "Something went wrong!" });
    } else if (industry === "Solar") {
      const project = await SolarProject.find({ _id: id });
      if (project.length > 0) {
        return res.json({ status: true, project });
      }
      return res.json({ status: false, msg: "Something went wrong!" });
    } else {
      let project = [];
      const proj = await Project.find({ _id: id });
      const proj2 = await SolarProject.find({ _id: id });
      const proj3 = await TowerProject.find({ _id: id });
      project = [...proj, ...proj2, ...proj3];
      if (project.length > 0) {
        return res.json({ status: true, project });
      }
      return res.json({ status: false, msg: "Something went wrong!" });
    }
  } catch (ex) {
    console.log(ex);
    return res.json({ status: false, msg: "Something went wrong!" });
  }
};

module.exports.addCommentsToProjectById = async (req, res, next) => {
  try {
    const { id, comments } = req.body;
    const { industry } = req?.query;

    if (!id || !comments || !industry) {
      return res.status(400).json({
        status: false,
        msg: "ID, comments, and industry are required!",
      });
    }

    let Model;
    if (industry === "Construction") {
      Model = Project;
    } else if (industry === "Solar") {
      Model = SolarProject;
    } else if (industry === "Tower") {
      Model = TowerProject;
    } else {
      return res
        .status(400)
        .json({ status: false, msg: "Invalid industry type!" });
    }
    const updatedProject = await Model.findByIdAndUpdate(
      id,
      { comments },
      { new: true }
    );

    if (!updatedProject) {
      return res.status(404).json({ status: false, msg: "Project not found!" });
    }

    return res.status(200).json({ status: true, project: updatedProject });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: false, msg: "Server error!" });
  }
};

module.exports.updatePilots = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { pilots } = req.body;
    const { industry } = req?.query;
    if (industry === "Construction") {
      const project = Project.findByIdAndUpdate(
        id,
        {
          pilots,
        },
        { new: true },
        (err, obj) => {
          if (err) {
            return res.json({ status: false, msg: "Something went wrong!" });
          }
          return res.json({ status: true, project: obj });
        }
      );
    } else if (industry === "Solar") {
      const project = SolarProject.findByIdAndUpdate(
        id,
        {
          pilots,
        },
        { new: true },
        (err, obj) => {
          if (err) {
            return res.json({ status: false, msg: "Something went wrong!" });
          }
          return res.json({ status: true, project: obj });
        }
      );
    } else if (industry === "Tower") {
      const project = TowerProject.findByIdAndUpdate(
        id,
        {
          pilots,
        },
        { new: true },
        (err, obj) => {
          if (err) {
            return res.json({ status: false, msg: "Something went wrong!" });
          }
          return res.json({ status: true, project: obj });
        }
      );
    }
  } catch (ex) {
    console.log(ex);
    return res.json({ status: false, msg: "Something went wrong!" });
  }
};

module.exports.updateProcessingTeam = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { processingTeam } = req.body;
    const { industry } = req?.query;
    if (industry === "Construction") {
      const project = Project.findByIdAndUpdate(
        id,
        {
          processingTeam,
        },
        { new: true },
        (err, obj) => {
          if (err) {
            return res.json({ status: false, msg: "Something went wrong!" });
          }
          return res.json({ status: true, project: obj });
        }
      );
    } else if (industry === "Solar") {
      const project = SolarProject.findByIdAndUpdate(
        id,
        {
          processingTeam,
        },
        { new: true },
        (err, obj) => {
          if (err) {
            return res.json({ status: false, msg: "Something went wrong!" });
          }
          return res.json({ status: true, project: obj });
        }
      );
    } else if (industry === "Tower") {
      const project = TowerProject.findByIdAndUpdate(
        id,
        {
          processingTeam,
        },
        { new: true },
        (err, obj) => {
          if (err) {
            return res.json({ status: false, msg: "Something went wrong!" });
          }
          return res.json({ status: true, project: obj });
        }
      );
    }
  } catch (ex) {
    console.log(ex);
    return res.json({ status: false, msg: "Something went wrong!" });
  }
};

module.exports.updateMissionsInProject = async (req, res, next) => {
  try {
    const { id, missions } = req.body;
    const { industry } = req?.query;
    if (industry === "Construction") {
      const project = Project.findByIdAndUpdate(
        id,
        {
          missions,
        },
        { new: true },
        (err, obj) => {
          if (err) {
            return res.json({ status: false, msg: "Something went wrong!" });
          }
          return res.json({ status: true, project: obj });
        }
      );
    } else if (industry === "Solar") {
      const project = SolarProject.findByIdAndUpdate(
        id,
        {
          missions,
        },
        { new: true },
        (err, obj) => {
          if (err) {
            return res.json({ status: false, msg: "Something went wrong!" });
          }
          return res.json({ status: true, project: obj });
        }
      );
    } else if (industry === "Tower") {
      const project = TowerProject.findByIdAndUpdate(
        id,
        {
          missions,
        },
        { new: true },
        (err, obj) => {
          if (err) {
            return res.json({ status: false, msg: "Something went wrong!" });
          }
          return res.json({ status: true, project: obj });
        }
      );
    }
  } catch (ex) {
    next(ex);
  }
};

module.exports.updateFolders = async (req, res, next) => {
  try {
    const { id, folders } = req.body;
    const { industry } = req.query;
    console.log(id, folders);
    if (industry === "Construction") {
      const project = Project.findByIdAndUpdate(
        id,
        {
          folders,
        },
        { new: true },
        (err, obj) => {
          if (err) {
            return res.json({ status: false, msg: "Something went wrong!" });
          }
          console.log(err, obj);
          return res.json({ status: true, project: obj });
        }
      );
    } else if (industry === "Solar") {
      const project = SolarProject.findByIdAndUpdate(
        id,
        {
          folders,
        },
        { new: true },
        (err, obj) => {
          if (err) {
            return res.json({ status: false, msg: "Something went wrong!" });
          }
          console.log(err, obj);
          return res.json({ status: true, project: obj });
        }
      );
    } else if (industry === "Tower") {
      const project = TowerProject.findByIdAndUpdate(
        id,
        {
          folders,
        },
        { new: true },
        (err, obj) => {
          if (err) {
            return res.json({ status: false, msg: "Something went wrong!" });
          }
          console.log(err, obj);
          return res.json({ status: true, project: obj });
        }
      );
    }
  } catch (ex) {
    next(ex);
  }
};

module.exports.updateProjectSites = async (req, res, next) => {
  try {
    const { kmlkmzFiles, id, siteData } = req.body;
    const { industry } = req.query;
    if (industry === "Construction") {
      const project = Project.findByIdAndUpdate(
        id,
        {
          kmlkmzFiles,
          siteData,
        },
        { new: true },
        (err, obj) => {
          if (err) {
            return res.json({ status: false, msg: "Something went wrong!" });
          }
          return res.json({ status: true, project: obj });
        }
      );
    } else if (industry === "Solar") {
      const project = SolarProject.findByIdAndUpdate(
        id,
        {
          kmlkmzFiles,
          siteData,
        },
        { new: true },
        (err, obj) => {
          if (err) {
            return res.json({ status: false, msg: "Something went wrong!" });
          }
          return res.json({ status: true, project: obj });
        }
      );
    } else if (industry === "Tower") {
      const project = TowerProject.findByIdAndUpdate(
        id,
        {
          kmlkmzFiles,
          siteData,
        },
        { new: true },
        (err, obj) => {
          if (err) {
            return res.json({ status: false, msg: "Something went wrong!" });
          }
          return res.json({ status: true, project: obj });
        }
      );
    }
  } catch (ex) {
    next(ex);
  }
};

module.exports.getAllProjects = async (req, res, next) => {
  try {
    const { key } = req.body;
    const { industry } = req?.query;
    if (key === "@!#sdaT45#@DSF01=-~32") {
      if (industry === "Construction") {
        const project = await Project.find();
        if (project) {
          return res.json({ status: true, project });
        }
        return res.json({ status: false, msg: "Something went wrong" });
      } else if (industry === "Solar") {
        const project = await SolarProject.find();
        if (project) {
          return res.json({ status: true, project });
        }
        return res.json({ status: false, msg: "Something went wrong" });
      } else if (industry === "Tower") {
        const project = await TowerProject.find();
        if (project) {
          return res.json({ status: true, project });
        }
        return res.json({ status: false, msg: "Something went wrong" });
      }
    } else {
      return res.json({ status: false, msg: "Unauthorized" });
    }
  } catch (ex) {
    next(ex);
  }
};

module.exports.fetchAllProjectType = async (req, res, next) => {
  try {
    const { id } = req.body;

    if (!id || !Array.isArray(id) || id.length === 0) {
      return res.status(400).json({
        status: false,
        msg: "Project IDs are required and must be a non-empty array.",
      });
    }

    const [constructionProjects, solarProjects, towerProjects] =
      await Promise.all([
        Project.find({ _id: { $in: id } }),
        SolarProject.find({ _id: { $in: id } }),
        TowerProject.find({ _id: { $in: id } }),
      ]);

    const allProjects = [
      ...constructionProjects,
      ...solarProjects,
      ...towerProjects,
    ];

    if (allProjects.length === 0) {
      return res.status(404).json({
        status: false,
        msg: "No projects found for the given IDs.",
      });
    }

    return res.status(200).json({
      status: true,
      project: allProjects,
    });
  } catch (error) {
    console.error("Error fetching projects:", error);
    return res.status(500).json({
      status: false,
      msg: "Internal server error while fetching projects.",
    });
  }
};

module.exports.fetchAllProjects = async (req, res, next) => {
  try {
    const [project1, project2, project3] = await Promise.all([
      Project.find(),
      SolarProject.find(),
      TowerProject.find(),
    ]);

    // Combine all projects into a single array
    const projects = [...project1, ...project2, ...project3];

    if (projects.length > 0) {
      return res.json({ status: true, projects });
    }

    return res.json({ status: false, msg: "No projects found!" });
  } catch (ex) {
    next(ex);
  }
};

module.exports.fetchProjectsBySiteId = async (req, res) => {
  try {
    const { siteId } = req.body;

    if (!siteId) {
      return res.status(400).json({ status: false, msg: "siteId is required" });
    }

    const site = await Site.findById(siteId).populate("projects");

    if (!site) {
      return res.status(404).json({ status: false, msg: "Site not found" });
    }

    return res.status(200).json({ status: true, project: site.projects });
  } catch (error) {
    console.error("Error in fetchProjectsBySiteId:", error.message);
    return res
      .status(500)
      .json({ status: false, msg: "Internal Server Error" });
  }
};
