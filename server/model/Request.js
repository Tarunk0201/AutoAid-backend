const mongoose = require("mongoose");
const { autoaidConnection } = require("../../config/database");

const RequestSchema = new mongoose.Schema(
  {
    // --- Contact Info ---
    name: {
      type: String,
      required: true,
      trim: true,
    },
    phoneNumber: {
      type: String,
      required: true,
      trim: true,
    },
    carModel: {
      type: String,
      required: true,
    },
    carNumber: {
      type: String,
      required: true,
      uppercase: true,
    },
    fuelType: {
      type: String,
      enum: ["Petrol", "Diesel", "Electric", "CNG", "Hybrid"],
      required: true,
    },
    issueDescription: {
      type: String,
      required: true,
    },
    specialInstructions: {
      type: String,
      default: "", // Optional (Water, Food, etc.)
    },

    // --- Location (Critical for Maps) ---
    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number], // [Longitude, Latitude]
        required: true,
      },
      addressString: {
        type: String, // Readable address (e.g., "AB Road, Indore") if available
      },
    },

    status: {
      type: String,
      enum: ["Pending", "Accepted", "EnRoute", "Completed", "Cancelled"],
      default: "Pending",
    },
    assignedMechanicId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Mechanic",
      default: null,
    },
  },
  {
    timestamps: true,
    collection: "requests",
  }
);

RequestSchema.index({ location: "2dsphere" });

module.exports = autoaidConnection.model("Request", RequestSchema);
