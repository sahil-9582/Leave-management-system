import EmptyState from "./EmptyState";

function LeaveStatus(props) {
  const selectedEmployee = props.employees.find(
    (emp) => emp.id === props.activeEmployeeId
  );
  
  const leaveHistory = selectedEmployee?.leaveHistory || [];

  function getStatusBadge(status) {
    if (status === "Pending") return "bg-warning text-dark";
    if (status === "Approved") return "bg-success";
    if (status === "Rejected") return "bg-danger";
    return "bg-secondary";
  }

  // Rejection ke baad employee re-apply kar sakta hai
  async function handleReApply() {
    try {
      const res = await fetch((process.env.REACT_APP_API_URL || "http://localhost:5000") + "/api/leave/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ employeeId: selectedEmployee.id })
      });
      if (!res.ok) throw new Error("Failed");
      if (props.fetchEmployees) await props.fetchEmployees();
    } catch (err) {
      alert("Failed to re-apply");
    }
  }

  if (props.employees.length === 0) {
    return (
      <div className="container py-4">
        <EmptyState icon="👤" message="No employees in system" />
      </div>
    );
  }

  return (
    <div className="container py-4">
      <h2 className="fw-bold text-primary mb-4">📋 Leave Status</h2>

      <div className="alert alert-info mb-4">
        <strong>Viewing status for:</strong> {selectedEmployee?.name || "Your account"}
      </div>

      {selectedEmployee && (
        <>
          {/* Current Status */}
          <div className="card p-4 mb-4 shadow-sm">
            <h5 className="fw-bold mb-3">Current Status</h5>

            <div className="d-flex align-items-center gap-2 mb-2">
              <span className="text-muted">Status:</span>
              <span
                className={`badge fs-6 ${getStatusBadge(
                  selectedEmployee.leaveStatus
                )}`}
              >
                {selectedEmployee.leaveStatus || "No Leave Applied"}
              </span>
            </div>

            <div className="d-flex align-items-center gap-2">
              <span className="text-muted">Leaves Left:</span>
              <strong>
                {selectedEmployee.leavesLeft} / {selectedEmployee.totalLeaves}
              </strong>
            </div>

            {/* Rejection reason */}
            {selectedEmployee.rejectionReason && (
              <div className="alert alert-danger mt-3 mb-0">
                <strong>Rejection Reason:</strong>{" "}
                {selectedEmployee.rejectionReason}
              </div>
            )}

            {/* Re-apply button */}
            {selectedEmployee.leaveStatus === "Rejected" && (
              <button
                className="btn btn-warning mt-3"
                onClick={handleReApply}
                disabled={selectedEmployee.leavesLeft === 0}
              >
                🔄 Re-Apply Leave
              </button>
            )}
          </div>

          {/* Leave History Table */}
          <div className="card p-4 shadow-sm">
            <h5 className="fw-bold mb-3">
              Leave History ({leaveHistory.length})
            </h5>

            {leaveHistory.length === 0 ? (
              <EmptyState
                icon="📋"
                message="No leave history yet"
                subMessage="Apply for a leave to see your history here"
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
                    {leaveHistory.map((entry, index) => (
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
        </>
      )}
    </div>
  );
}

export default LeaveStatus;