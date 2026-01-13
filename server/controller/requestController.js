const Request = require("../model/Request");

// Controller function to create a new request
const createRequest = async (req, res) => {
  try {
    const {
      name,
      phoneNumber,
      carModel,
      carNumber,
      fuelType,
      issueDescription,
      specialInstructions,
      latitude,
      longitude,
      address,
    } = req.body;

    const newRequest = new Request({
      name,
      phoneNumber,
      carModel,
      carNumber,
      fuelType,
      issueDescription,
      specialInstructions: specialInstructions || "",
      location: {
        type: "Point",
        coordinates: [longitude, latitude], // [Longitude, Latitude]
        addressString: address,
      },
    });

    // Save the request to the database
    const savedRequest = await newRequest.save();

    res.status(201).json({
      message: "Request created successfully",
      request: savedRequest,
    });
  } catch (error) {
    console.error("Error creating request:", error);
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Helper function to calculate elapsed time
const calculateElapsedTime = (createdAt) => {
  const now = new Date();
  const created = new Date(createdAt);
  const diffMs = now - created;

  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const diffHours = Math.floor(
    (diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
  );
  const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  const diffSeconds = Math.floor((diffMs % (1000 * 60)) / 1000);

  if (diffDays > 0) {
    return `${diffDays} day${diffDays > 1 ? "s" : ""} ${diffHours} hour${
      diffHours > 1 ? "s" : ""
    } ago`;
  } else if (diffHours > 0) {
    return `${diffHours} hour${diffHours > 1 ? "s" : ""} ${diffMinutes} minute${
      diffMinutes > 1 ? "s" : ""
    } ago`;
  } else if (diffMinutes > 0) {
    return `${diffMinutes} minute${
      diffMinutes > 1 ? "s" : ""
    } ${diffSeconds} second${diffSeconds > 1 ? "s" : ""} ago`;
  } else {
    return `${diffSeconds} second${diffSeconds > 1 ? "s" : ""} ago`;
  }
};

// Controller function to get all requests
const getAllRequests = async (req, res) => {
  try {
    const requests = await Request.find().select(
      "_id name phoneNumber status assignedMechanicId updatedAt createdAt"
    );
    const requestsWithElapsedTime = requests.map((request) => ({
      ...request.toObject(),
      elapsedTime: calculateElapsedTime(request.createdAt),
    }));
    res.status(200).json(requestsWithElapsedTime);
  } catch (error) {
    console.error("Error fetching requests:", error);
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Controller function to get a single request by ID
const getRequestById = async (req, res) => {
  try {
    const { id } = req.params;
    const request = await Request.findById(id);
    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }
    const requestWithElapsedTime = {
      ...request.toObject(),
      elapsedTime: calculateElapsedTime(request.createdAt),
    };
    res.status(200).json(requestWithElapsedTime);
  } catch (error) {
    console.error("Error fetching request:", error);
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

module.exports = {
  createRequest,
  getAllRequests,
  getRequestById,
};
