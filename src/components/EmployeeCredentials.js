import { useState } from "react";

function EmployeeCredentials(props) {
  const [resetTargetId, setResetTargetId] = useState("");
  const [message, setMessage] = useState("");

  async function handleResetPassword() {
    const employee = props.employees.find((item) => item.loginId === resetTargetId.trim());

    if (!employee) {
      setMessage("No employee found with that ID.");
      return;
    }

    const baseName = (employee.name.toLowerCase().replace(/[^a-z]/g, "") || "emp").slice(0, 5);
    const specialChars = ["@", "#", "!"];
    const specialChar = specialChars[Math.floor(Math.random() * specialChars.length)];
    const numberPart = String(Math.floor(Math.random() * 90) + 10).slice(0, 3);
    const newPassword = `${baseName}${specialChar}${Math.random().toString(36).slice(2, 4)}${numberPart}`;
    
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL || "http://localhost:5000"}/api/employees/${employee.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: newPassword })
      });
      if (!res.ok) throw new Error("Failed to reset password");
      
      if (props.fetchEmployees) await props.fetchEmployees();
      
      setMessage(`Password reset successfully for ${employee.name}. New password: ${newPassword}`);
      setResetTargetId("");
    } catch (err) {
      setMessage("Error resetting password.");
    }
  }

  return (
    <div className="container py-4">
      <div className="d-flex align-items-center gap-3 mb-4">
        <button
          className="btn btn-outline-secondary btn-sm"
          onClick={() => props.onNavigate("dashboard")}
        >
          ← Back
        </button>
        <h2 className="fw-bold text-info mb-0">🔐 Employee Credentials</h2>
      </div>

      <div className="card shadow-sm">
        <div className="card-body">
          <p className="text-muted mb-3">
            HR can view every employee’s login ID and password here. You can also reset an employee password.
          </p>

          <div className="row g-2 mb-3">
            <div className="col-md-8">
              <input
                className="form-control"
                placeholder="Enter employee login ID to reset password"
                value={resetTargetId}
                onChange={(e) => setResetTargetId(e.target.value)}
              />
            </div>
            <div className="col-md-4">
              <button className="btn btn-warning w-100" onClick={handleResetPassword}>
                Reset Password
              </button>
            </div>
          </div>

          {message && <div className="alert alert-info">{message}</div>}

          <div className="table-responsive">
            <table className="table table-bordered align-middle">
              <thead className="table-info">
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Login ID</th>
                  <th>Password</th>
                </tr>
              </thead>
              <tbody>
                {props.employees.map((emp, index) => (
                  <tr key={emp.id}>
                    <td>{index + 1}</td>
                    <td>{emp.name}</td>
                    <td><strong>{emp.loginId}</strong></td>
                    <td>{emp.password}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EmployeeCredentials;
