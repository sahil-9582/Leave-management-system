import StatCard from "./StatCard";
import EmptyState from "./EmptyState";

function EmployeeDashboard(props) {
  const selectedEmployee = props.employees.find(
    (emp) => emp.id === props.activeEmployeeId
  );

  const approvedCount = selectedEmployee
    ? selectedEmployee.leaveHistory.filter((h) => h.status === "Approved").length
    : 0;

  const rejectedCount = selectedEmployee
    ? selectedEmployee.leaveHistory.filter((h) => h.status === "Rejected").length
    : 0;

  function getStatusBadge(status) {
    if (status === "Pending") return "bg-warning text-dark";
    if (status === "Approved") return "bg-success";
    if (status === "Rejected") return "bg-danger";
    return "bg-secondary";
  }

  if (props.employees.length === 0) {
    return (
      <div className="container py-4">
        <EmptyState
          icon="👤"
          message="No employees found in the system"
          subMessage="Please ask HR to add you to the system"
        />
      </div>
    );
  }

  return (
    <div className="container py-4">
      <div className="mb-4">
        <h2 className="fw-bold text-primary">👤 Employee Dashboard</h2>
        <p className="text-muted">
          Welcome! Select your name to view your leave details.
        </p>
      </div>

      <div className="alert alert-info mb-4">
        <strong>Signed in as:</strong> {selectedEmployee?.name || "Employee"}
      </div>

      {selectedEmployee && (
        <>
          <div className="row g-3 mb-4">
            <div className="col-6 col-md-3">
              <StatCard
                title="Leaves Remaining"
                value={selectedEmployee.leavesLeft}
                color="primary"
                icon="📅"
              />
            </div>
            <div className="col-6 col-md-3">
              <StatCard
                title="Total Leaves"
                value={selectedEmployee.totalLeaves}
                color="secondary"
                icon="📋"
              />
            </div>
            <div className="col-6 col-md-3">
              <StatCard
                title="Approved"
                value={approvedCount}
                color="success"
                icon="✅"
              />
            </div>
            <div className="col-6 col-md-3">
              <StatCard
                title="Rejected"
                value={rejectedCount}
                color="danger"
                icon="❌"
              />
            </div>
          </div>

          <div className="card p-4 mb-4 shadow-sm">
            <h5 className="fw-bold mb-3">Current Leave Status</h5>
            <div className="d-flex align-items-center gap-2 mb-2">
              <span className="text-muted">Status:</span>
              <span
                className={`badge fs-6 ${getStatusBadge(selectedEmployee.leaveStatus)}`}
              >
                {selectedEmployee.leaveStatus || "No Leave Applied"}
              </span>
            </div>

            {selectedEmployee.rejectionReason && (
              <div className="alert alert-danger mt-2 mb-0">
                <strong>Rejection Reason:</strong>{" "}
                {selectedEmployee.rejectionReason}
              </div>
            )}
          </div>

          <div className="d-flex gap-2 flex-wrap">
            <button
              className="btn btn-primary"
              onClick={() => props.onNavigate("applyLeave")}
              disabled={
                selectedEmployee.leaveStatus === "Pending" ||
                selectedEmployee.leavesLeft === 0
              }
            >
              ✍️ Apply Leave
            </button>
            <button
              className="btn btn-outline-secondary"
              onClick={() => props.onNavigate("leaveStatus")}
            >
              📋 View Leave Status
            </button>
          </div>

          {selectedEmployee.leavesLeft === 0 && (
            <div className="alert alert-danger mt-3">
              ⚠️ You have no leaves remaining.
            </div>
          )}
          {selectedEmployee.leaveStatus === "Pending" && (
            <div className="alert alert-warning mt-3">
              ⏳ Your leave request is currently pending HR approval.
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default EmployeeDashboard;