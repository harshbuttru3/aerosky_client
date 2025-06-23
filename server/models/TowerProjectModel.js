const mongoose = require("mongoose");

const towerProjectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      max: 40,
    },
    referenceImage: {
      type: String,
    },
    projectArea: {
      type: String,
      required: true,
    },
    startDate: {
      type: String,
      required: true,
    },
    deadline: {
      type: String,
      default: "",
    },
    scope: {
      type: String,
      required: true,
    },
    industry: {
      type: String,
      default: "Solar",
    },
    type: {
      type: String,
      required: true,
    },
    coordinates: {
      type: Object,
      default: {},
    },
    siteData: {
      type: Object,
      default: [],
    },
    annotations: {
      type: Object,
      default: {},
    },
    issues: {
      type: Array,
      default: [],
    },
    deliverablesRequired: {
      type: Array,
      default: [],
    },
    attachments: {
      type: Array,
      default: [],
    },
    status: {
      type: String,
      default: "Ongoing project",
    },
    comments: {
      type: Array,
      default: [],
    },
    approvedBy: {
      type: Object,
      default: {},
    },
    progress: {
      type: Number,
      default: 0,
    },
    approvedAt: {
      type: String,
      default: "",
    },
    teamMembers: {
      type: Array,
      default: [],
    },
    clientDetails: {
      type: Object,
      required: true,
    },
    pilots: {
      type: Array,
      default: [],
    },
    processingTeam: {
      type: Array,
      default: [],
    },
    groups: {
      type: Array,
      default: [],
    },
    missions: {
      type: Array,
      default: [],
    },
    folders: {
      type: Array,
      default: [],
    },
    ongoingMissions: {
      type: Array,
      default: [],
    },
    completedMissions: {
      type: Array,
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("TowerProject", towerProjectSchema);
