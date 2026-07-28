import { useMemo, useState } from "react";



function Login(props) {
  const [role, setRole] = useState("employee");
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [forgotMode, setForgotMode] = useState(false);
  const [resetMessage, setResetMessage] = useState("");

  const roleLabel = useMemo(() => (role === "hr" ? "HR" : "Employee"), [role]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch((process.env.REACT_APP_API_URL || "http://localhost:5000") + "/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role, userId: userId.trim(), password })
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        setError(data.message || "Invalid ID or password. Please try again.");
        return;
      }

      props.onLogin({ role, userId: data.userId, password, name: data.name });
    } catch (err) {
      setError("Server error. Please try again later.");
    }
  }

  function handleForgotPassword() {
    if (role === "hr") {
      setForgotMode(true);
      setResetMessage("");
      setError("For HR login, use ID HR001 and password hr12345.");
      return;
    }

    const employeeAccounts = props.employees || [];
    if (employeeAccounts.length === 0) {
      setForgotMode(true);
      setResetMessage("");
      setError("No employee accounts are available yet. Ask HR to add employees first.");
      return;
    }

    const matchedEmployee = employeeAccounts.find(
      (account) => account.loginId === userId.trim()
    );

    if (!matchedEmployee) {
      setForgotMode(true);
      setResetMessage("");
      setError("Enter your employee ID first to retrieve your password.");
      return;
    }

    setForgotMode(true);
    setResetMessage(`Your password is: ${matchedEmployee.password}`);
    setError("");
  }

  return (
    <div
      className="container d-flex justify-content-center align-items-center"
      style={{ minHeight: "90vh" }}
    >
      <div className="card shadow-lg p-4 p-md-5" style={{ width: "420px" }}>
        <div className="text-center mb-4">
          <div style={{ fontSize: "3rem" }}>🏢</div>
          <h3 className="fw-bold text-primary mt-2">Leave Management System</h3>
          <p className="text-muted">Sign in with your personal ID and password</p>
        </div>

        <form onSubmit={handleSubmit} className="d-grid gap-3">
          <div>
            <label className="form-label fw-semibold" htmlFor="roleSelect">
              Select Role
            </label>
            <select
              id="roleSelect"
              className="form-select"
              value={role}
              onChange={(e) => {
                setRole(e.target.value);
                setError("");
                setForgotMode(false);
              }}
            >
              <option value="employee">Employee</option>
              <option value="hr">HR</option>
            </select>
          </div>

          <div>
            <label className="form-label fw-semibold" htmlFor="userIdInput">
              {roleLabel} ID
            </label>
            <input
              id="userIdInput"
              className="form-control"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              placeholder={`Enter ${roleLabel.toLowerCase()} ID`}
            />
          </div>

          <div>
            <label className="form-label fw-semibold" htmlFor="passwordInput">
              Password
            </label>
            <input
              id="passwordInput"
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
            />
          </div>

          {(error || resetMessage) && (
            <div className={`alert ${forgotMode ? "alert-info" : "alert-danger"} mb-0`}>
              {error || resetMessage}
            </div>
          )}

          <button type="submit" className="btn btn-primary btn-lg">
            Login
          </button>

          <button
            type="button"
            className="btn btn-outline-secondary"
            onClick={handleForgotPassword}
          >
            Forgot Password?
          </button>
        </form>

        <hr />
        <div className="text-center">
          <small className="text-muted">Kreate Technologies © 2024</small>
        </div>
      </div>
    </div>
  );
}

export default Login;