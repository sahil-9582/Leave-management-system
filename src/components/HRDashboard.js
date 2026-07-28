import { useState } from "react";
import StatCard from "./StatCard.js";
import EmptyState from "./EmptyState.js";

function HRDashboard(props) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");

  // Statistics calculate karo
  const totalEmployees = props.employees.length;
  const totalPending = props.employees.filter(
    (e) => e.leaveStatus === "Pending"
  ).length;
  const totalApproved = props.employees.filter(
    (e) => e.leaveStatus === "Approved"
  ).length;
  const totalRejected = props.employees.filter(
    (e) => e.leaveStatus === "Rejected"
  ).length;

  // Search + Filter + Sort (Pending pehle)
  const displayEmployees = [...props.employees]
    .sort((a, b) => {
      if (a.leaveStatus === "Pending" && b.leaveStatus !== "Pending") return -1;
      if (a.leaveStatus !== "Pending" && b.leaveStatus === "Pending") return 1;
      return 0;
    })
    .filter((emp) => {
      const matchesSearch = emp.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

      const matchesFilter =
        filterStatus === "All" ||
        (filterStatus === "None" && emp.leaveStatus === "") ||
        emp.leaveStatus === filterStatus;

      return matchesSearch && matchesFilter;
    });

  function getStatusBadge(status) {
    if (status === "Pending") return "bg-warning text-dark";
    if (status === "Approved") return "bg-success";
    if (status === "Rejected") return "bg-danger";
    return "bg-secondary";
  }

  return (
    <div className="container py-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <h2 className="fw-bold text-success mb-0">👔 HR Dashboard</h2>
        <button
          className="btn btn-outline-danger btn-sm"
          onClick={props.onResetAllData}
        >
          🔄 Reset All Data
        </button>
      </div>

      {/* Stats */}
      <div className="row g-3 mb-4">
        <div className="col-6 col-md-3">
          <StatCard
            title="Total Employees"
            value={totalEmployees}
            color="primary"
            icon="👥"
          />
        </div>
        <div className="col-6 col-md-3">
          <StatCard
            title="Pending"
            value={totalPending}
            color="warning"
            icon="⏳"
          />
        </div>
        <div className="col-6 col-md-3">
          <StatCard
            title="Approved"
            value={totalApproved}
            color="success"
            icon="✅"
          />
        </div>
        <div className="col-6 col-md-3">
          <StatCard
            title="Rejected"
            value={totalRejected}
            color="danger"
            icon="❌"
          />
        </div>
      </div>

      {/* Quick Actions */}
      <div className="d-flex gap-2 mb-4 flex-wrap">
        <button
          className="btn btn-primary"
          onClick={() => props.onNavigate("addEmployee")}
        >
          + Add Employee
        </button>
        <button
          className="btn btn-warning"
          onClick={() => props.onNavigate("pendingRequests")}
        >
          ⏳ Pending Requests{" "}
          {totalPending > 0 && (
            <span className="badge bg-dark ms-1">{totalPending}</span>
          )}
        </button>
        <button
          className="btn btn-info text-white"
          onClick={() => props.onNavigate("employeeCredentials")}
        >
          🔐 Employee Credentials
        </button>
      </div>

      {/* Search & Filter */}
      <div className="row g-2 mb-3">
        <div className="col-md-6">
          <input
            type="text"
            className="form-control"
            placeholder="🔍 Search employee by name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="col-md-3">
          <select
            className="form-select"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="All">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
            <option value="None">No Leave Applied</option>
          </select>
        </div>
      </div>

      {/* Employee Table */}
      <h5 className="fw-bold mb-3">
        All Employees ({displayEmployees.length})
      </h5>

      {props.employees.length === 0 ? (
        <EmptyState
          icon="👥"
          message="No employees added yet"
          subMessage="Click 'Add Employee' to get started"
          buttonText="+ Add Employee"
          onButtonClick={() => props.onNavigate("addEmployee")}
        />
      ) : displayEmployees.length === 0 ? (
        <EmptyState
          icon="🔍"
          message="No employees match your search or filter"
          subMessage="Try a different name or status"
        />
      ) : (
        <div className="table-responsive">
          <table className="table table-bordered table-hover align-middle">
            <thead className="table-success">
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Leaves Left</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {displayEmployees.map((emp, index) => (
                <tr key={emp.id}>
                  <td>{index + 1}</td>
                  <td>
                    <strong>{emp.name}</strong>
                  </td>
                  <td>
                    {emp.leavesLeft} / {emp.totalLeaves}
                  </td>
                  <td>
                    <span className={`badge ${getStatusBadge(emp.leaveStatus)}`}>
                      {emp.leaveStatus || "No Leave Applied"}
                    </span>
                  </td>
                  <td>
                    <button
                      className="btn btn-sm btn-outline-primary"
                      onClick={() => props.onViewEmployee(emp.id)}
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default HRDashboard;