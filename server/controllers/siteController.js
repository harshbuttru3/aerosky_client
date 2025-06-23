const Site = require("../models/siteModel");
const User = require("../models/userModel");
const Project = require("../models/projectModel");
const TowerProject = require("../models/TowerProjectModel");
const SolarProject = require("../models/solarProjectModel");
const mongoose = require("mongoose");

// Helper function to validate project ID
async function validateProjectId(projectId) {
  if (!mongoose.Types.ObjectId.isValid(projectId)) {
    return false;
  }
  const project =
    (await Project.findById(projectId)) ||
    (await TowerProject.findById(projectId)) ||
    (await SolarProject.findById(projectId));
  return !!project; // True if project exists in any model
}

// Helper function to populate projects manually
async function populateProjects(projectIds) {
  if (!projectIds || projectIds.length === 0) {
    console.log("populateProjects: No project IDs provided");
    return [];
  }

  // Ensure projectIds are strings for consistent comparison
  const ids = projectIds.map((id) => id.toString());

  const [projects, towerProjects, solarProjects] = await Promise.all([
    Project.find({ _id: { $in: ids } }).lean(),
    TowerProject.find({ _id: { $in: ids } }).lean(),
    SolarProject.find({ _id: { $in: ids } }).lean(),
  ]);

  // Create a map of project documents by ID
  const projectMap = new Map();
  [...projects, ...towerProjects, ...solarProjects].forEach((project) => {
    projectMap.set(project._id.toString(), project);
  });

  // Map IDs to their documents, preserving order
  const populatedProjects = ids.map((id) => {
    const project = projectMap.get(id);
    if (!project) {
      console.warn(`populateProjects: Project ID ${id} not found in any model`);
    }
    return project || null;
  });

  // Filter out null values (non-existent projects)
  const result = populatedProjects.filter((project) => project !== null);
  // console.log("populateProjects: Populated projects:", result);
  return result;
}

module.exports.createSite = async (req, res) => {
  try {
    let { siteName, location, kml, kmlFileName, project } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(400).json({ message: "User not authenticated." });
    }

    if (!Array.isArray(kml)) {
      kml = kml ? [kml] : [];
    }
    if (!Array.isArray(kmlFileName)) {
      kmlFileName = kmlFileName ? [kmlFileName] : [];
    }

    let site = await Site.findOne({ siteName, location });
    let updatedUser = null;

    if (!site) {
      site = new Site({
        siteName,
        location,
        kml,
        kmlFileName,
        projects: project ? [project] : [],
      });
      await site.save();

      updatedUser = await User.findByIdAndUpdate(
        userId,
        { $addToSet: { sites: site._id } }, // Prevent duplicates
        { new: true }
      );

      if (!updatedUser) {
        return res.status(404).json({ message: "User not found." });
      }
    } else {
      site.kml.push(...kml);
      site.kmlFileName.push(...kmlFileName);

      if (project) {
        site.projects.push(project);
      }

      await site.save();

      updatedUser = await User.findById(userId);
    }

    res.status(201).json({
      status: true,
      message: "Site added successfully",
      site,
      user: updatedUser,
    });
  } catch (error) {
    console.error("Create Site Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports.getSites = async (req, res) => {
  try {
    const { id } = req.body;

    if (!Array.isArray(id) || id.length === 0) {
      return res.status(400).json({
        status: false,
        message: "Valid array of Site IDs is required",
      });
    }

    const sites = await Site.find({ _id: { $in: id } }).populate("projects");

    if (sites.length === 0) {
      return res
        .status(404)
        .json({ status: false, message: "No sites found for the given IDs" });
    }

    res.status(200).json({ status: true, sites });
  } catch (error) {
    console.error("Error fetching sites:", error);
    res
      .status(500)
      .json({ status: false, message: "Server error", error: error.message });
  }
};

module.exports.getSiteById = async (req, res) => {
  try {
    const { id } = req.body;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        status: false,
        message: "Valid Site ID is required",
      });
    }

    const site = await Site.findById(id);

    if (!site) {
      return res.status(404).json({ status: false, message: "Site not found" });
    }

    const populatedProjects = await populateProjects(site.projects);

    const siteResponse = site.toObject();
    siteResponse.projects = populatedProjects;

    res.status(200).json({ status: true, site: siteResponse });
  } catch (error) {
    console.error("Error fetching site:", error);
    res
      .status(500)
      .json({ status: false, message: "Server error", error: error.message });
  }
};
