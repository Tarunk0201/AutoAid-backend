const express = require("express");
const router = express.Router();
const {
  createRequest,
  getAllRequests,
  getRequestById,
} = require("../controller/requestController");

// Route to create a new request
router.post("/requests", createRequest);

// Route to get all requests
router.get("/requests", getAllRequests);

// Route to get a single request by ID
router.get("/requests/:id", getRequestById);

module.exports = router;
