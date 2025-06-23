const express = require("express");

const {
  createSite,
  getSites,
  getSiteById,
} = require("../controllers/siteController");
const verifyJWT = require("../middleware/verifyJWT");

const router = express.Router();

router.post("/createSite", verifyJWT, createSite);
router.post("/getSites", verifyJWT, getSites);
router.post("/getSiteById", verifyJWT, getSiteById);

module.exports = router;
