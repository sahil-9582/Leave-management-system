import { useState } from "react";
import EmptyState from "./EmptyState";

function EmployeeDetails(props) {
  // Current employee dhundho — har render pe updated data milega
  const employee = props.employees.find(
    (emp) => emp.id === props.detailEmployeeId
  );

  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const [editError, setEditError] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [filterStatus, setFilterStatus] = useState("All");
  const [resetSuccess, setResetSuccess] = useState(false);

  // Agar employee nahi mila (delete ho gaya, etc.)
  if (!employee) {
    return (
      <div className="container py-4">
        <EmptyState
          icon="🔍"
          message="Employee not found"
          buttonText="← Back to Dashboard"
          onButtonClick={() => props.onNavigate("dashboard")}
        />
      </div>
    );
  }

  function getStatusBadge(status) {
    if (status === "Pending") return "bg-warning text-dark";
    if (status === "Approved") return "bg-success";
    if (status === "Rejected") return "bg-danger";
    return "bg-secondary";
  }

  // ✏️ Edit name save karo
  function handleSaveEdit() {
    if (editName.trim() === "") {
      setEditError("Name cannot be empty!");
      return;
    }

    const isDuplicate = props.employees.some(
      (emp) =>
        emp.name.toLowerCase() === editName.trim().toLowerCase() &&
        emp.id !== employee.id
    );

    if (isDuplicate) {
      setEditError("An employee with this name already exists!");
      return;
    }

    const updated = props.employees.map((emp) => {
      if (emp.id === employee.id) {
        return { ...emp, name: editName.trim() };
      }
      return emp;
    });
    props.setEmployees(updated);
    setIsEditing(false);
    setEditError("");
  }

  // 🗑️ Delete employee
  function handleDelete() {
    const filtered = props.employees.filter(
      (emp) => emp.id !== employee.id
    );
    props.setEmployees(filtered);
    props.onNavigate("dashboard");
  }

  // 🔄 Reset leaves (sirf balance aur current status reset hoga, history rahega)
  function handleResetLeaves() {
    const updated = props.employees.map((emp) => {
      if (emp.id === employee.id) {
        return {
          ...emp,
          leavesLeft: emp.totalLeaves,
          leaveStatus: "",
          rejectionReason: "",
        };
      }
      return emp;
    });
    props.setEmployees(updated);
    setResetSuccess(true);
    setTimeout(() => setResetSuccess(false), 3000);
  }

  // ✅ Approve from details page
  function handleApprove() {
    const newEntry = {
      id: Date.now(),
      date: new Date().toLocaleDateString("en-IN"),
      status: "Approved",
      remark: "",
    };
    const updated = props.employees.map((emp) => {
      if (emp.id === employee.id) {
        return {
          ...emp,
          leavesLeft: emp.leavesLeft - 1,
          leaveStatus: "Approved",
          rejectionReason: "",
          leaveHistory: [...emp.leaveHistory, newEntry],
        };
      }
      return emp;
    });
    props.setEmployees(updated);
  }

  // ❌ Reject from details page
  function handleReject() {
    const reason = prompt("Enter rejection reason:");
    if (!reason || reason.trim() === "") return;

    const newEntry = {
      id: Date.now(),
      date: new Date().toLocaleDateString("en-IN"),
      status: "Rejected",
      remark: reason.trim(),
    };
    const updated = props.employees.map((emp) => {
      if (emp.id === employee.id) {
        return {
          ...emp,
          leaveStatus: "Rejected",
          rejectionReason: reason.trim(),
          leaveHistory: [...emp.leaveHistory, newEntry],
        };
      }
      return emp;
    });
    props.setEmployees(updated);
  }

  // History filter
  const filteredHistory = employee.leaveHistory.filter((entry) => {
    if (filterStatus === "All") return true;
    return entry.status === filterStatus;
  });

  return (
    <div className="container py-4">
      {/* Back button */}
      <div className="d-flex align-items-center gap-3 mb-4">
        <button
          className="btn btn-outline-secondary btn-sm"
          onClick={() => props.onNavigate("dashboard")}
        >
          ← Back to Dashboard
        </button>
        <h2 className="fw-bold text-primary mb-0">👤 Employee Details</h2>
      </div>

      {/* Main Info Card */}
      <div className="card p-4 shadow-sm mb-4">
        {/* Name + Edit/Delete buttons */}
        <div className="d-flex justify-content-between align-items-start mb-3 flex-wrap gap-2">
          <div>
            {isEditing ? (
              <div className="d-flex gap-2 align-items-center flex-wrap">
                <input
                  type="text"
                  className={`form-control ${editError ? "is-invalid" : ""}`}
                  value={editName}
                  onChange={(e) => {
                    setEditName(e.target.value);
                    setEditError("");
                  }}
                  style={{ maxWidth: "200px" }}
                  autoFocus
                />
                <button
                  className="btn btn-success btn-sm"
                  onClick={handleSaveEdit}
                >
                  💾 Save
                </button>
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => {
                    setIsEditing(false);
                    setEditError("");
                  }}
                >
                  Cancel
                </button>
                {editError && (
                  <span className="text-danger small">{editError}</span>
                )}
              </div>
            ) : (
              <h3 className="fw-bold mb-0">{employee.name}</h3>
            )}
          </div>

          {!isEditing && (
            <div className="d-flex gap-2">
              <button
                className="btn btn-outline-primary btn-sm"
                onClick={() => {
                  setIsEditing(true);
                  setEditName(employee.name);
                }}
              >
                ✏️ Edit
              </button>
              <button
                className="btn btn-outline-danger btn-sm"
                onClick={() => setShowDeleteConfirm(true)}
              >
                🗑️ Delete
              </button>
            </div>
          )}
        </div>

        {/* Delete Confirmation — inline, React ke saath */}
        {showDeleteConfirm && (
          <div className="alert alert-danger d-flex justify-content-between align-items-center flex-wrap gap-2">
            <span>
              ⚠️ Delete <strong>{employee.name}</strong>? This cannot be
              undone.
            </span>
            <div className="d-flex gap-2">
              <button
                className="btn btn-danger btn-sm"
                onClick={handleDelete}
              >
                Yes, Delete
              </button>
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => setShowDeleteConfirm(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Reset success message */}
        {resetSuccess && (
          <div className="alert alert-success">
            ✅ Leave balance reset successfully!
          </div>
        )}

        {/* Stats Row */}
        <div className="row g-3 mt-1">
          <div className="col-6 col-md-3">
            <div className="p-3 bg-light rounded text-center">
              <p className="mb-1 text-muted small">Leaves Left</p>
              <h4 className="fw-bold text-primary mb-0">
                {employee.leavesLeft} / {employee.totalLeaves}
              </h4>
            </div>
          </div>
          <div className="col-6 col-md-3">
            <div className="p-3 bg-light rounded text-center">
              <p className="mb-1 text-muted small">Current Status</p>
              <span
                className={`badge fs-6 ${getStatusBadge(
                  employee.leaveStatus
                )}`}
              >
                {employee.leaveStatus || "No Leave"}
              </span>
            </div>
          </div>
          <div className="col-6 col-md-3">
            <div className="p-3 bg-light rounded text-center">
              <p className="mb-1 text-muted small">Total History</p>
              <h4 className="fw-bold mb-0">{employee.leaveHistory.length}</h4>
            </div>
          </div>
          <div className="col-6 col-md-3">
            <div className="p-3 bg-light rounded text-center">
              <p className="mb-1 text-muted small">Reset Balance</p>
              <button
                className="btn btn-outline-warning btn-sm"
                onClick={handleResetLeaves}
              >
                🔄 Reset
              </button>
            </div>
          </div>
        </div>

        {/* Rejection reason */}
        {employee.rejectionReason && (
          <div className="alert alert-danger mt-3 mb-0">
            <strong>Rejection Reason:</strong> {employee.rejectionReason}
          </div>
        )}

        {/* Approve / Reject agar pending hai */}
        {employee.leaveStatus === "Pending" && (
          <div className="d-flex gap-2 mt-3">
            <button className="btn btn-success" onClick={handleApprove}>
              ✅ Approve
            </button>
            <button className="btn btn-danger" onClick={handleReject}>
              ❌ Reject
            </button>
          </div>
        )}
      </div>

      {/* Leave History */}
      <div className="card p-4 shadow-sm">
        <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
          <h5 className="fw-bold mb-0">
            Leave History ({filteredHistory.length})
          </h5>
          {/* Filter by status */}
          <select
            className="form-select"
            style={{ width: "auto" }}
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="All">All</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>

        {filteredHistory.length === 0 ? (
          <EmptyState
            icon="📋"
            message={
              filterStatus === "All"
                ? "No leave history yet"
                : `No ${filterStatus} leaves`
            }
            subMessage={
              filterStatus === "All"
                ? "Leaves will appear here after HR processes them"
                : `Try selecting a different filter`
            }
          />
        ) : (
          <div className="table-responsive">
            <table className="table table-bordered table-hover align-middle">
              <thead className="table-primary">
                <tr>
                  <th>#</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Remark</th>
                </tr>
              </thead>
              <tbody>
                {filteredHistory.map((entry, index) => (
                  <tr key={entry.id}>
                    <td>{index + 1}</td>
                    <td>{entry.date}</td>
                    <td>
                      <span
                        className={`badge ${getStatusBadge(entry.status)}`}
                      >
                        {entry.status}
                      </span>
                    </td>
                    <td>{entry.remark || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default EmployeeDetails;