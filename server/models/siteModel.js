const mongoose = require("mongoose");

const siteSchema = new mongoose.Schema(
  {
    siteName: {
      type: String,
      required: true,
      trim: true,
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    kml: {
      type: [String], // Always an array of strings
      default: [],
    },
    kmlFileName: {
      type: [String], // Always an array of strings
      default: [],
    },
    projects: {
      type: [mongoose.Schema.Types.ObjectId], // Array of Project ObjectIds
      ref: "Project",
      default: [],
    },
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt timestamps
);

module.exports = mongoose.model("Site", siteSchema);
