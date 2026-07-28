require("dotenv").config();
const fs = require("fs");
const mongoose = require("mongoose");
const path = require("path");

const MONGODB_URI = process.env.MONGODB_URI;

// Schemas
const leaveHistorySchema = new mongoose.Schema({
  id: Number,
  date: String,
  status: String,
  remark: String
});

const employeeSchema = new mongoose.Schema({
  id: Number,
  name: String,
  loginId: String,
  password: String,
  role: String,
  totalLeaves: Number,
  leavesLeft: Number,
  leaveStatus: String,
  rejectionReason: String,
  department: String,
  leaveHistory: [leaveHistorySchema]
});
const Employee = mongoose.model("Employee", employeeSchema);

const leaveRequestSchema = new mongoose.Schema({
  id: Number,
  employeeId: Number,
  employeeName: String,
  status: String,
  requestedAt: String,
  reviewedAt: String
});
const LeaveRequest = mongoose.model("LeaveRequest", leaveRequestSchema);

async function migrate() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB Atlas");

    const dataPath = path.join(__dirname, "data.json");
    if (!fs.existsSync(dataPath)) {
      console.log("No data.json found!");
      process.exit(0);
    }

    const data = JSON.parse(fs.readFileSync(dataPath, "utf8"));
    const employees = data.employees || [];
    const leaveRequests = data.leaveRequests || [];

    if (employees.length > 0) {
      await Employee.deleteMany({}); // clear existing
      await Employee.insertMany(employees);
      console.log(`Migrated ${employees.length} employees`);
    }

    if (leaveRequests.length > 0) {
      await LeaveRequest.deleteMany({});
      await LeaveRequest.insertMany(leaveRequests);
      console.log(`Migrated ${leaveRequests.length} leave requests`);
    }

    console.log("Migration complete!");
    process.exit(0);
  } catch (err) {
    console.error("Migration failed:", err);
    process.exit(1);
  }
}

migrate();
