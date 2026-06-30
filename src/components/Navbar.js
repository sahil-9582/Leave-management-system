function Navbar(props) {
  // Active page ka button yellow dikhao, baaki white
  function btnClass(page) {
    return props.currentPage === page
      ? "btn btn-warning fw-semibold"
      : "btn btn-light";
  }

  return (
    <nav className="navbar navbar-expand-lg bg-primary shadow-sm">
      <div className="container-fluid">
        <span className="navbar-brand text-white fw-bold fs-5">
          🏢 Kreate Technologies
        </span>

        <div className="d-flex gap-2 flex-wrap">
          {!props.isLoggedIn && (
            <button className="btn btn-light">Login</button>
          )}

          {props.isLoggedIn && (
            <>
              <button
                className={btnClass("dashboard")}
                onClick={() => props.onNavigate("dashboard")}
              >
                Dashboard
              </button>

              {props.role === "employee" && (
                <>
                  <button
                    className={btnClass("applyLeave")}
                    onClick={() => props.onNavigate("applyLeave")}
                  >
                    Apply Leave
                  </button>

                  <button
                    className={btnClass("leaveStatus")}
                    onClick={() => props.onNavigate("leaveStatus")}
                  >
                    Leave Status
                  </button>
                </>
              )}

              {props.role === "hr" && (
                <>
                  <button
                    className={btnClass("addEmployee")}
                    onClick={() => props.onNavigate("addEmployee")}
                  >
                    Add Employee
                  </button>

                  <button
                    className={btnClass("pendingRequests")}
                    onClick={() => props.onNavigate("pendingRequests")}
                  >
                    Pending Requests
                  </button>

                  <button
                    className={btnClass("employeeCredentials")}
                    onClick={() => props.onNavigate("employeeCredentials")}
                  >
                    Credentials
                  </button>
                </>
              )}

              <button
                className="btn btn-danger"
                onClick={props.onLogout}
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;