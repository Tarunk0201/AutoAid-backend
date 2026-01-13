const mongoose = require("mongoose");

// Database configurations
const dbConfig = {
  admin: {
    url: process.env.ADMIN_DB_URL,
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
  },
  autoaid: {
    url: process.env.AUTOAID_DB_URL,
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
  },
};

// Create connections
const adminConnection = mongoose.createConnection(
  dbConfig.admin.url,
  dbConfig.admin.options
);
const autoaidConnection = mongoose.createConnection(
  dbConfig.autoaid.url,
  dbConfig.autoaid.options
);

// Handle connection events
adminConnection.on("connected", () => {
  console.log("Connected to Admin Database");
});

adminConnection.on("error", (err) => {
  console.error("Admin Database connection error:", err);
});

autoaidConnection.on("connected", () => {
  console.log("Connected to Autoaid Database");
});

autoaidConnection.on("error", (err) => {
  console.error("Autoaid Database connection error:", err);
});

const connectDB = () => {
  return Promise.all([
    new Promise((resolve, reject) => {
      adminConnection.once("open", () => {
        console.log("Admin Database connection established.");
        resolve();
      });
      adminConnection.once("error", (err) => {
        console.error("Admin Database connection error:", err);
        reject(err);
      });
    }),
    new Promise((resolve, reject) => {
      autoaidConnection.once("open", () => {
        console.log("Autoaid Database connection established.");
        resolve();
      });
      autoaidConnection.once("error", (err) => {
        console.error("Autoaid Database connection error:", err);
        reject(err);
      });
    }),
  ]);
};

module.exports = {
  adminConnection,
  autoaidConnection,
  connectDB,
};
