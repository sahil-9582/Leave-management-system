require("dotenv").config();
const http = require("http");
const mongoose = require("mongoose");
const { passwordMatches } = require("./password");

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;

// Connect to MongoDB
mongoose.connect(MONGODB_URI)
  .then(() => console.log("Connected to MongoDB Atlas"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Mongoose Schemas
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

const HR_CREDENTIALS = [
  { id: "HR001", password: "hr12345", name: "HR Manager" }
];

function sendJson(res, statusCode, payload) {
  res.writeHead(statusCode, {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,POST,PATCH,DELETE,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type"
  });
  res.end(JSON.stringify(payload));
}

function parseBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
    });
    req.on("end", () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (error) {
        reject(error);
      }
    });
    req.on("error", reject);
  });
}

const server = http.createServer(async (req, res) => {
  if (req.method === "OPTIONS") {
    sendJson(res, 204, {});
    return;
  }

  const url = new URL(req.url, `http://${req.headers.host}`);

  if (url.pathname === "/api/health") {
    sendJson(res, 200, { status: "ok" });
    return;
  }

  if (req.method === "GET" && url.pathname === "/api/employees") {
    try {
      const employees = await Employee.find({});
      sendJson(res, 200, employees);
    } catch (err) {
      sendJson(res, 500, { message: "Error fetching employees" });
    }
    return;
  }

  if (req.method === "POST" && url.pathname === "/api/auth/login") {
    try {
      const body = await parseBody(req);

      if (body.role === "hr") {
        const match = HR_CREDENTIALS.find(
          (account) => account.id === body.userId && passwordMatches(account.password, body.password)
        );

        if (!match) {
          sendJson(res, 401, { message: "Invalid HR credentials" });
          return;
        }

        sendJson(res, 200, { role: "hr", userId: match.id, name: match.name });
        return;
      }

      const employee = await Employee.findOne({ loginId: body.userId });

      if (!employee || !passwordMatches(employee.password, body.password)) {
        sendJson(res, 401, { message: "Invalid employee credentials" });
        return;
      }

      sendJson(res, 200, {
        role: "employee",
        userId: employee.loginId,
        name: employee.name,
        employeeId: employee.id
      });
      return;
    } catch (error) {
      sendJson(res, 400, { message: "Invalid request body" });
      return;
    }
  }

  if (req.method === "POST" && url.pathname === "/api/employees") {
    try {
      const body = await parseBody(req);

      if (!body.name || !body.loginId || !body.password) {
        sendJson(res, 400, { message: "Name, loginId, and password are required" });
        return;
      }

      const lastEmp = await Employee.findOne().sort({ id: -1 });
      const newId = (lastEmp?.id || 0) + 1;

      const newEmployee = new Employee({
        id: newId,
        name: body.name,
        loginId: body.loginId,
        password: body.password,
        role: "employee",
        totalLeaves: Number(body.totalLeaves || 4),
        leavesLeft: Number(body.totalLeaves || 4),
        leaveStatus: "No Leave Applied",
        rejectionReason: "",
        department: body.department || "General",
        leaveHistory: []
      });

      await newEmployee.save();
      sendJson(res, 201, newEmployee);
      return;
    } catch (error) {
      sendJson(res, 400, { message: "Invalid request body" });
      return;
    }
  }

  if (req.method === "POST" && url.pathname === "/api/leave/apply") {
    try {
      const body = await parseBody(req);
      const employee = await Employee.findOne({ id: Number(body.employeeId) });

      if (!employee) {
        sendJson(res, 404, { message: "Employee not found" });
        return;
      }

      if (employee.leaveStatus === "Pending") {
        sendJson(res, 400, { message: "A leave request is already pending" });
        return;
      }

      if (employee.leavesLeft <= 0) {
        sendJson(res, 400, { message: "No leaves remaining" });
        return;
      }

      const lastReq = await LeaveRequest.findOne().sort({ id: -1 });
      const newReqId = (lastReq?.id || 0) + 1;

      const request = new LeaveRequest({
        id: newReqId,
        employeeId: employee.id,
        employeeName: employee.name,
        status: "Pending",
        requestedAt: new Date().toISOString()
      });

      employee.leaveStatus = "Pending";
      employee.rejectionReason = "";
      
      await Promise.all([request.save(), employee.save()]);

      sendJson(res, 201, { employee, request });
      return;
    } catch (error) {
      sendJson(res, 400, { message: "Invalid request body" });
      return;
    }
  }

  if (req.method === "GET" && url.pathname === "/api/leave/requests") {
    try {
      const requests = await LeaveRequest.find({ status: "Pending" });
      sendJson(res, 200, requests);
      return;
    } catch (error) {
      sendJson(res, 500, { message: "Error fetching requests" });
      return;
    }
  }

  if (req.method === "PATCH" && url.pathname.startsWith("/api/leave/employee/")) {
    try {
      const employeeId = Number(url.pathname.split("/").pop());
      const body = await parseBody(req);
      
      const employee = await Employee.findOne({ id: employeeId });
      if (!employee) {
        sendJson(res, 404, { message: "Employee not found" });
        return;
      }

      const request = await LeaveRequest.findOne({ employeeId, status: "Pending" });

      if (body.action === "approve") {
        employee.leaveStatus = "Approved";
        employee.leavesLeft = Math.max(0, employee.leavesLeft - 1);
        employee.rejectionReason = "";
        
        employee.leaveHistory.push({
          id: Date.now(),
          date: new Date().toLocaleDateString("en-IN"),
          status: "Approved",
          remark: ""
        });

        if (request) {
          request.status = "Approved";
          request.reviewedAt = new Date().toISOString();
        }
      } else if (body.action === "reject") {
        employee.leaveStatus = "Rejected";
        employee.rejectionReason = body.reason || "No reason provided";
        
        employee.leaveHistory.push({
          id: Date.now(),
          date: new Date().toLocaleDateString("en-IN"),
          status: "Rejected",
          remark: body.reason || "No reason provided"
        });

        if (request) {
          request.status = "Rejected";
          request.reviewedAt = new Date().toISOString();
        }
      } else {
        sendJson(res, 400, { message: "Action must be approve or reject" });
        return;
      }

      await employee.save();
      if (request) await request.save();

      sendJson(res, 200, { employee, request });
      return;
    } catch (error) {
      sendJson(res, 400, { message: "Invalid request body" });
      return;
    }
  }

  if (req.method === "DELETE" && url.pathname === "/api/reset") {
    try {
      await Employee.deleteMany({});
      await LeaveRequest.deleteMany({});
      sendJson(res, 200, { message: "All data reset successfully" });
      return;
    } catch (error) {
      sendJson(res, 500, { message: "Internal server error" });
      return;
    }
  }

  if (req.method === "DELETE" && url.pathname.startsWith("/api/employees/")) {
    try {
      const employeeId = Number(url.pathname.split("/").pop());
      
      const result = await Employee.deleteOne({ id: employeeId });
      await LeaveRequest.deleteMany({ employeeId });
      
      sendJson(res, 200, { deleted: result.deletedCount > 0, employeeId });
      return;
    } catch (error) {
      sendJson(res, 400, { message: "Invalid request" });
      return;
    }
  }

  if (req.method === "PATCH" && url.pathname.startsWith("/api/employees/")) {
    try {
      const employeeId = Number(url.pathname.split("/").pop());
      const body = await parseBody(req);
      
      const employee = await Employee.findOne({ id: employeeId });
      if (!employee) {
        sendJson(res, 404, { message: "Employee not found" });
        return;
      }

      // Automatically assign any fields sent in body
      Object.keys(body).forEach((key) => {
        employee[key] = body[key];
      });
      
      await employee.save();
      sendJson(res, 200, employee);
      return;
    } catch (error) {
      sendJson(res, 400, { message: "Invalid request" });
      return;
    }
  }

  sendJson(res, 404, { message: "Route not found" });
});

server.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
