const {
  register,
  adminLogin,
  clientLogin,
  checkForUserExist,
  updateUserRoles,
  registerUserRouteByAdmin,
  getClientById,
  getClientFromOrganisation,
  updateUserOrganization,
  updateProjectRequests,
  updateOrganizationNameAndDescription,
  getAllUsers,
  getUserById,
  searchClient,
  updateUserChats,
  getUserByIdWithChats,
  updateTowerProjectsId,
  getUserDetails,
  updateSolarProjectsId,
  verifySession,
  updateUserSites,
} = require("../controllers/userControllers");
const {
  createClient,
  getClients,
} = require("../controllers/clientControllers");
const {
  createAccessRequest,
  getAccessRequest,
  deleteRequest,
} = require("../controllers/accessRequestControllers");
const {
  createEmailVerify,
  getEmailVerify,
} = require("../controllers/emailVerifyControllers");
const {
  createDrone,
  getDrones,
  getPilotDrones,
  createDroneOwn,
  fetchDroneById,
  deleteDrone,
  editDrone,
} = require("../controllers/droneControllers");
const {
  createBattery,
  getBattery,
  editBattery,
  createBatteryOwn,
  fetchBatteryById,
  getPilotBattery,
  deleteBattery,
} = require("../controllers/batteryController");
const {
  registerPilot,
  updatePilotStatus,
  updatePilotProfile,
  loginPilot,
  getPilotsByIds,
  checkForPilotExist,
  getAllPilots,
  updateAssignedProjectsInPilot,
  updatePilotSoftwares,
  updatePilotDronesId,
  updatePilotBatteriesId,
} = require("../controllers/pilotControllers");
const {
  createPilotVerify,
  getPilotVerify,
} = require("../controllers/pilotVerifyControllers");
const {
  getPilotAccessRequest,
  deletePilotRequest,
} = require("../controllers/pilotAccessRequestControllers");
const {
  createProjectAccessRequest,
  getProjectAccessRequest,
  getProjectAccessRequestById,
  deleteProjectRequest,
  changeStatusById,
} = require("../controllers/projectRequestControllers");
const {
  getProjectById,
  createProject,
  addCommentsToProjectById,
  updateFolders,
  updatePilots,
  updateMissions,
  updateCompletedMissions,
  updateMissionsInProject,
  updateProjectSites,
  getAllProjects,
  updateProcessingTeam,
  fetchAllProjectType,
  fetchAllProjects,
  updateDeliverablesInProject,
  fetchProjectsBySiteId,
} = require("../controllers/projectControllers");
const {
  addMessage,
  getMessage,
  updateMsg,
  getGroupMessage,
  addGroupMessage,
  updateGroupMsg,
} = require("../controllers/messageControllers");
const {
  createFolder,
  updateFilesInFolder,
  getFoldersById,
  createVideoFolder,
  getVideoFoldersById,
  getFolderName,
} = require("../controllers/folderControllers");
const {
  createFile,
  getFilesByFolderId,
  updateFileTags,
  getAllImageWithTags,
  updateAnnotations,
  fetchFilesLength,
  fetchThermalImageByCoordinates,
} = require("../controllers/fileControllers");
const {
  createTowerProject,
  getTowerProject,
  updateTowerProjectFolders,
  updateGroupsInProject,
  fetchAllTowerProjects,
} = require("../controllers/TowerProjectControllers");
const {
  createSolarProject,
  getSolarProject,
  updateSolarProjectFolders,
  updateGroupsInSolarProject,
  updateSolarProjectThermalFolders,
  fetchAllSolarProjects,
} = require("../controllers/solarProjectControllers");
// const {createTagGroup,getTagGroups,updateTagsInGroup,getAllGroupsWithId}= require('../controllers/TagGroupController.js')
const verifyUserJwt = require("../middleware/verifyJWT");

const router = require("express").Router();

router.post("/createClient", createClient);
router.get("/getClients", verifyUserJwt, getClients);
router.post("/register", register);
router.post(
  "/registerUserRouteByAdmin",
  verifyUserJwt,
  registerUserRouteByAdmin
);
router.post("/adminLogin", adminLogin);
router.post("/clientLogin", clientLogin);
router.post("/checkForUserExist", checkForUserExist);
router.post("/createAccessRequest", createAccessRequest);
router.post("/getAccessRequest", getAccessRequest);
router.post("/createEmailVerify", createEmailVerify);
router.post("/getEmailVerify", getEmailVerify);
router.post("/deleteRequest", deleteRequest);
router.post("/updateUserRoles", verifyUserJwt, updateUserRoles);
router.post("/createDrone", verifyUserJwt, createDrone);
router.get("/getDrones", verifyUserJwt, getDrones);
router.post("/deleteDrone", verifyUserJwt, deleteDrone);
router.put("/editDrone", verifyUserJwt, editDrone);
router.post("/getClientById", verifyUserJwt, getClientById);
router.post(
  "/getClientFromOrganisation",
  verifyUserJwt,
  getClientFromOrganisation
);
router.post("/updateUserOrganization", verifyUserJwt, updateUserOrganization);
router.post(
  "/updateOrganizationNameAndDescription",
  verifyUserJwt,
  updateOrganizationNameAndDescription
);
router.post("/createBattery", createBattery);
router.get("/getBattery", verifyUserJwt, getBattery);
router.post("/deleteBattery", verifyUserJwt, deleteBattery);
router.post("/editBattery", verifyUserJwt, editBattery);
router.post("/getAllUsers", getAllUsers);
router.post("/registerPilot", registerPilot);
router.post("/loginPilot", loginPilot);
router.post("/checkForPilotExist", checkForPilotExist);
router.get("/getAllPilots", verifyUserJwt, getAllPilots);
router.post("/createPilotVerify", createPilotVerify);
router.post("/getPilotVerify", getPilotVerify);
router.post("/getPilotAccessRequest", getPilotAccessRequest);
router.post("/deletePilotRequest", deletePilotRequest);
router.post("/createProjectAccessRequest", createProjectAccessRequest);
router.post("/getProjectAccessRequest", getProjectAccessRequest);
router.post(
  "/getProjectAccessRequestById",
  verifyUserJwt,
  getProjectAccessRequestById
);
router.post("/updateProjectRequests", verifyUserJwt, updateProjectRequests);
router.post("/getUserById", getUserById);
router.post("/deleteProjectRequest", verifyUserJwt, deleteProjectRequest);
router.post("/changeStatusById", changeStatusById);
router.post("/getProjectById", getProjectById);
router.post("/updateDeliverablesInProject", updateDeliverablesInProject);
router.post("/createProject", createProject);
router.post("/addCommentsToProjectById", addCommentsToProjectById);
router.post("/searchClient", searchClient);
router.post("/addMessage", addMessage);
router.post("/getMessage", getMessage);
router.post("/updateMsg/:id", updateMsg);
router.post("/getUserByIdWithChats", getUserByIdWithChats);
router.post("/updateUserChats/:id", updateUserChats);
router.post("/getGroupMessage", getGroupMessage);
router.post("/addGroupMessage", addGroupMessage);
router.post("/updateGroupMsg/:id", updateGroupMsg);
router.post("/updatePilotStatus/:id", verifyUserJwt, updatePilotStatus);
router.post("/updatePilotProfile/:id", updatePilotProfile);
router.post("/updatePilots/:id", updatePilots);
router.post("/updateProcessingTeam/:id", updateProcessingTeam);
router.post("/getPilotsByIds", getPilotsByIds);
router.post(
  "/updateAssignedProjectsInPilot/:id",
  updateAssignedProjectsInPilot
);
router.post("/updatePilotSoftwares/:id", updatePilotSoftwares);
router.post("/getPilotDrones", getPilotDrones);
router.post("/createDroneOwn", createDroneOwn);
router.post("/updatePilotDronesId/:id", updatePilotDronesId);
router.post("/updatePilotBatteriesId/:id", updatePilotBatteriesId);
router.post("/createBatteryOwn", verifyUserJwt, createBatteryOwn);
router.post("/getPilotBattery", getPilotBattery);
router.post("/updateMissions", updateMissions);
router.post("/updateCompletedMissions", updateCompletedMissions);
router.post("/fetchDroneById", fetchDroneById);
router.post("/fetchBatteryById", fetchBatteryById);
router.post("/updateMissionsInProject", updateMissionsInProject);
router.post("/createFolder", createFolder);
router.post("/updateFilesInFolder", updateFilesInFolder);
router.post("/updateFolders", updateFolders);
router.post("/getFoldersById", getFoldersById);
router.post("/createFile", createFile);
router.post("/getFilesByFolderId", getFilesByFolderId);
router.post("/createVideoFolder", createVideoFolder);
router.post("/getVideoFoldersById", getVideoFoldersById);
router.post("/updateProjectSites", updateProjectSites);
router.post("/createTowerProject", createTowerProject);
router.post("/getTowerProject", getTowerProject);
router.post("/updateTowerProjectsId", updateTowerProjectsId);
router.post("/updateTowerProjectFolders", updateTowerProjectFolders);
router.post("/getFolderName", getFolderName);
router.post("/updateFileTags", updateFileTags);
// router.post('/createTagGroup',createTagGroup);
// router.post('/getTagGroups',getTagGroups);
router.post("/updateGroupsInProject", updateGroupsInProject);
// router.post('/updateTagsInGroup',updateTagsInGroup);
// router.post('/getAllGroupsWithId',getAllGroupsWithId);
router.post("/getAllImageWithTags", getAllImageWithTags);
router.post("/updateAnnotations", updateAnnotations);
router.post("/fetchFilesLength", fetchFilesLength);
router.post("/createSolarProject", createSolarProject);
router.post("/getSolarProject", getSolarProject);
router.post("/updateSolarProjectsId", updateSolarProjectsId);
router.post("/updateSolarProjectFolders", updateSolarProjectFolders);
router.post("/updateGroupsInSolarProject", updateGroupsInSolarProject);
router.post(
  "/updateSolarProjectThermalFolders",
  updateSolarProjectThermalFolders
);
router.post("/fetchThermalImageByCoordinates", fetchThermalImageByCoordinates);
router.post("/getAllProjects", getAllProjects);
router.post("/updateProcessingTeam", updateProcessingTeam);
router.post("/fetchAllSolarProjects", fetchAllSolarProjects);
router.post("/fetchAllTowerProjects", fetchAllTowerProjects);
router.post("/fetchAllProjectType", fetchAllProjectType);
//fetch all project types
// router.get("/fetchAllProjectType", verifyUserJwt, fetchAllProjectType);
//verifySession
router.get("/verifysession", verifySession);
//Get clientDetails
router.get("/clientDetails", verifyUserJwt, getUserDetails);
//fetchAllProject
router.get("/fetchAllProjects", verifyUserJwt, fetchAllProjects);
router.post("/fetchProjectsBySiteId", fetchProjectsBySiteId);
router.post("/updateUserSites", updateUserSites);
module.exports = router;
