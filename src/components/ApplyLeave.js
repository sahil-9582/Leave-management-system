import { useState } from "react";

function ApplyLeave(props) {
  const employees = Array.isArray(props.employees) ? props.employees : [];

  const setActiveEmployeeId =
    typeof props.setActiveEmployeeId === "function"
      ? props.setActiveEmployeeId
      : () => {};

  const [selectedEmpId] = useState(
    props.activeEmployeeId || employees[0]?.id || ""
  );
  const [successMsg, setSuccessMsg] = useState("");

  const selectedEmployee = employees.find(
    (emp) => emp.id === Number(selectedEmpId)
  );

  function getStatusBadge(status) {
    if (status === "Pending") return "bg-warning text-dark";
    if (status === "Approved") return "bg-success";
    if (status === "Rejected") return "bg-danger";
    return "bg-secondary";
  }

  async function handleApplyLeave() {
    if (!selectedEmployee) return;

    if (selectedEmployee.leavesLeft === 0) {
      alert("No leaves remaining!");
      return;
    }

    try {
      const res = await fetch((process.env.REACT_APP_API_URL || "http://localhost:5000") + "/api/leave/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ employeeId: selectedEmployee.id })
      });

      if (!res.ok) {
        throw new Error("Failed to apply leave");
      }

      if (props.fetchEmployees) await props.fetchEmployees();

      setActiveEmployeeId(Number(selectedEmployee.id));
      setSuccessMsg(
        `Leave applied successfully for ${selectedEmployee.name}! Waiting for HR approval.`
      );
    } catch (err) {
      alert("Server error while applying leave.");
    }
  }

  return (
    <div className="container py-4">
      <h2 className="fw-bold text-primary mb-4">✍️ Apply Leave</h2>

      <div className="card p-4 shadow-sm" style={{ maxWidth: "520px" }}>
        <div className="alert alert-info mb-3">
          <strong>Applying leave for:</strong> {selectedEmployee?.name || "Your account"}
        </div>

        {/* Employee Info */}
        {selectedEmployee && (
          <>
            <div className="p-3 bg-light rounded mb-3">
              <div className="d-flex justify-content-between">
                <span className="text-muted">Leaves Remaining:</span>
                <strong className="text-primary">
                  {selectedEmployee.leavesLeft} / {selectedEmployee.totalLeaves}
                </strong>
              </div>
              <div className="d-flex justify-content-between mt-1">
                <span className="text-muted">Current Status:</span>
                <span
                  className={`badge ${getStatusBadge(
                    selectedEmployee.leaveStatus
                  )}`}
                >
                  {selectedEmployee.leaveStatus || "No Leave Applied"}
                </span>
              </div>
            </div>

            {/* Alert Messages */}
            {selectedEmployee.leavesLeft === 0 && (
              <div className="alert alert-danger">
                ❌ You have no leaves remaining!
              </div>
            )}
            {selectedEmployee.leaveStatus === "Pending" && (
              <div className="alert alert-warning">
                ⏳ A leave request is already pending for this employee.
              </div>
            )}
            {successMsg && (
              <div className="alert alert-success">✅ {successMsg}</div>
            )}

            {/* Apply Button */}
            <button
              className="btn btn-primary w-100"
              onClick={handleApplyLeave}
              disabled={
                selectedEmployee.leaveStatus === "Pending" ||
                selectedEmployee.leavesLeft === 0
              }
            >
              Submit Leave Request
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default ApplyLeave;