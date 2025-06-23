const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      max: 40,
    },
    projectLocation: {
      type: String,
      required: true,
    },
    startDate: {
      type: String,
      required: true,
    },
    deadline: {
      required: true,
      type: String,
    },
    scope: {
      type: String,
      required: true,
    },
    industry: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    kmlkmzFiles: {
      type: Array,
      required: true,
    },
    siteData: {
      type: Object,
      default: [],
    },
    deliverables: {
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
      required: true,
    },
    groups: {
      type: Array,
      default: [],
    },
    progress: {
      type: Number,
      default: 0,
    },
    approvedAt: {
      type: String,
      required: true,
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

module.exports = mongoose.model("Project", projectSchema);
