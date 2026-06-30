import { useState } from "react";
import EmptyState from "./EmptyState";

function PendingRequests(props) {
  const [searchQuery, setSearchQuery] = useState("");

  // Sirf pending employees filter karo
  const pendingEmployees = props.employees.filter(
    (emp) => emp.leaveStatus === "Pending"
  );

  // Unme se search filter
  const filteredPending = pendingEmployees.filter((emp) =>
    emp.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  function handleApprove(id) {
    const updatedEmployees = props.employees.map((emp) => {
      if (emp.id === id) {
        // Leave history mein naya entry add karo
        const newEntry = {
          id: Date.now(),
          date: new Date().toLocaleDateString("en-IN"),
          status: "Approved",
          remark: "",
        };
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
    props.setEmployees(updatedEmployees);
  }

  function handleReject(id) {
    const reason = prompt("Enter rejection reason:");
    if (!reason || reason.trim() === "") return;

    const updatedEmployees = props.employees.map((emp) => {
      if (emp.id === id) {
        // Leave history mein naya entry add karo
        const newEntry = {
          id: Date.now(),
          date: new Date().toLocaleDateString("en-IN"),
          status: "Rejected",
          remark: reason.trim(),
        };
        return {
          ...emp,
          leaveStatus: "Rejected",
          rejectionReason: reason.trim(),
          leaveHistory: [...emp.leaveHistory, newEntry],
        };
      }
      return emp;
    });
    props.setEmployees(updatedEmployees);
  }

  return (
    <div className="container py-4">
      {/* Header */}
      <div className="d-flex align-items-center gap-3 mb-4">
        <h2 className="fw-bold text-warning mb-0">⏳ Pending Requests</h2>
        <span className="badge bg-warning text-dark fs-6">
          {pendingEmployees.length}
        </span>
      </div>

      {/* Search (sirf tab dikhao jab pending ho) */}
      {pendingEmployees.length > 0 && (
        <div className="mb-4">
          <input
            type="text"
            className="form-control"
            placeholder="🔍 Search by employee name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ maxWidth: "320px" }}
          />
        </div>
      )}

      {/* States */}
      {pendingEmployees.length === 0 ? (
        <EmptyState
          icon="✅"
          message="No pending requests"
          subMessage="All leave requests have been processed"
        />
      ) : filteredPending.length === 0 ? (
        <EmptyState
          icon="🔍"
          message={`No employee found for "${searchQuery}"`}
        />
      ) : (
        <div className="row g-3">
          {filteredPending.map((emp) => (
            <div key={emp.id} className="col-md-6 col-lg-4">
              <div className="card border-warning shadow-sm h-100">
                <div className="card-header bg-warning bg-opacity-25 d-flex justify-content-between align-items-center">
                  <h5 className="mb-0 fw-bold">{emp.name}</h5>
                  <span className="badge bg-warning text-dark">Pending</span>
                </div>
                <div className="card-body">
                  <p className="text-muted mb-1">
                    Leaves Left:{" "}
                    <strong className="text-primary">
                      {emp.leavesLeft} / {emp.totalLeaves}
                    </strong>
                  </p>
                  <p className="text-muted mb-3">
                    History: {emp.leaveHistory.length} records
                  </p>

                  <div className="d-flex gap-2 flex-wrap">
                    <button
                      className="btn btn-success btn-sm"
                      onClick={() => handleApprove(emp.id)}
                    >
                      ✅ Approve
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleReject(emp.id)}
                    >
                      ❌ Reject
                    </button>
                    <button
                      className="btn btn-outline-primary btn-sm"
                      onClick={() => props.onViewEmployee(emp.id)}
                    >
                      👁️ Details
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default PendingRequests;