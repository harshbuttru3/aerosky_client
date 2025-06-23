const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      max: 40,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    image: {
      type: String,
      default: "",
    },
    number: {
      type: String,
      default: "",
    },
    password: {
      type: String,
      required: true,
    },
    clientIndustry: {
      type: Array,
      default: [],
    },
    organizationType: {
      type: String,
      default: "",
    },
    organizationName: {
      type: String,
      default: "",
    },
    organizationDescription: {
      type: String,
      default: "",
    },
    organizationId: {
      type: String,
      default: "",
    },
    organizationRole: {
      type: Array,
      default: ["admin"],
    },
    roles: {
      type: Array,
      default: [],
    },
    projectRequestsId: {
      type: Array,
      default: [],
    },
    projectsId: {
      type: Array,
      default: [],
    },
    towerProjectsId: {
      type: Array,
      default: [],
    },
    solarProjectsId: {
      type: Array,
      default: [],
    },
    chats: {
      type: Array,
      default: [],
    },
    sites: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Site",
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
