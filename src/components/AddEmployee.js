import { useState } from "react";

function AddEmployee(props) {
  const [employeeName, setEmployeeName] = useState("");
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  function handleAddEmployee() {
    if (employeeName.trim() === "") {
      setError("Employee name cannot be empty!");
      return;
    }

    const trimmedName = employeeName.trim();
    const isDuplicate = props.employees.some(
      (emp) => emp.name.toLowerCase() === trimmedName.toLowerCase()
    );

    if (isDuplicate) {
      setError(`"${trimmedName}" already exists in the system!`);
      return;
    }

    let counter = props.employees.length + 1;
    let loginId = `EMP${String(counter).padStart(3, "0")}`;

    while (props.employees.some((emp) => emp.loginId === loginId)) {
      counter += 1;
      loginId = `EMP${String(counter).padStart(3, "0")}`;
    }

    const baseName = trimmedName.toLowerCase().replace(/[^a-z]/g, "") || "emp";
    const shortName = baseName.slice(0, 5);
    const specialChars = ["@", "#", "!"];
    const specialChar = specialChars[Math.floor(Math.random() * specialChars.length)];
    const numberPart = String(Math.floor(Math.random() * 90) + 10).slice(0, 3);
    const password = `${shortName}${specialChar}${Math.random().toString(36).slice(2, 4)}${numberPart}`;

    const newEmployee = {
      id: Date.now(),
      name: trimmedName,
      loginId,
      password,
      leavesLeft: 4,
      totalLeaves: 4,
      leaveStatus: "",
      rejectionReason: "",
      leaveHistory: [],
    };

    props.setEmployees([...props.employees, newEmployee]);
    setSuccessMsg(
      `✅ "${newEmployee.name}" added successfully. Login ID: ${newEmployee.loginId} | Password: ${newEmployee.password}`
    );
    setEmployeeName("");
    setError("");
  }

  return (
    <div className="container py-4">
      {/* Header with back button */}
      <div className="d-flex align-items-center gap-3 mb-4">
        <button
          className="btn btn-outline-secondary btn-sm"
          onClick={() => props.onNavigate("dashboard")}
        >
          ← Back
        </button>
        <h2 className="fw-bold text-success mb-0">+ Add Employee</h2>
      </div>

      {/* Add Form */}
      <div className="card p-4 shadow-sm mb-4" style={{ maxWidth: "500px" }}>
        {successMsg && (
          <div className="alert alert-success">{successMsg}</div>
        )}

        <div className="mb-3">
          <label className="form-label fw-semibold">Employee Name</label>
          <input
            type="text"
            className={`form-control ${error ? "is-invalid" : ""}`}
            placeholder="Enter employee name"
            value={employeeName}
            onChange={(e) => {
              setEmployeeName(e.target.value);
              setError("");
              setSuccessMsg("");
            }}
            // Enter press karne par bhi submit ho
            onKeyDown={(e) => {
              if (e.key === "Enter") handleAddEmployee();
            }}
          />
          {error && <div className="invalid-feedback">{error}</div>}
        </div>

        <div className="mb-3">
          <label className="form-label fw-semibold">
            Default Leave Balance
          </label>
          <input
            type="number"
            className="form-control"
            value={4}
            disabled
          />
          <small className="text-muted">
            All new employees get 4 leaves by default
          </small>
        </div>

        <button className="btn btn-success w-100" onClick={handleAddEmployee}>
          + Add Employee
        </button>
      </div>

      {/* Current Employee List */}
      <h5 className="fw-bold mb-3">
        Existing Employees ({props.employees.length})
      </h5>

      {props.employees.length === 0 ? (
        <p className="text-muted">No employees yet. Add one above!</p>
      ) : (
        <ul className="list-group shadow-sm" style={{ maxWidth: "500px" }}>
          {props.employees.map((emp, index) => (
            <li
              key={emp.id}
              className="list-group-item d-flex justify-content-between align-items-center"
            >
              <span>
                {index + 1}. <strong>{emp.name}</strong>
              </span>
              <span className="badge bg-primary rounded-pill">
                {emp.leavesLeft} leaves
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default AddEmployee;