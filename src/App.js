import { useState } from "react";
import Login from "./components/Login";
import Navbar from "./components/Navbar";
import EmployeeDashboard from "./components/EmployeeDashboard";
import HRDashboard from "./components/HRDashboard";
import ApplyLeave from "./components/ApplyLeave";
import LeaveStatus from "./components/LeaveStatus";
import AddEmployee from "./components/AddEmployee";
import PendingRequests from "./components/PendingRequests";
import EmployeeDetails from "./components/EmployeeDetails";
import EmployeeCredentials from "./components/EmployeeCredentials";

// Default app state starts empty so HR can add employees as needed.
const INITIAL_EMPLOYEES = [];

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState("");
  const [currentPage, setCurrentPage] = useState("dashboard");
  const [employees, setEmployees] = useState(INITIAL_EMPLOYEES);
  const [loggedInUser, setLoggedInUser] = useState(null);

  // Employee role: currently selected employee ka ID
  const [activeEmployeeId, setActiveEmployeeId] = useState(
    INITIAL_EMPLOYEES[0]?.id || null
  );

  // HR role: details page ke liye kaunsa employee selected hai
  const [detailEmployeeId, setDetailEmployeeId] = useState(null);

  function handleLogin(userData) {
    setIsLoggedIn(true);
    setRole(userData.role);
    setLoggedInUser(userData);
    setCurrentPage("dashboard");

    if (userData.role === "employee") {
      const matchedEmployee = employees.find(
        (emp) => emp.name.toLowerCase() === (userData.name || "").toLowerCase()
      );
      if (matchedEmployee) {
        setActiveEmployeeId(matchedEmployee.id);
      }
    }
  }

  function handleLogout() {
    setIsLoggedIn(false);
    setRole("");
    setLoggedInUser(null);
    setCurrentPage("dashboard");
    setActiveEmployeeId(null);
    setDetailEmployeeId(null);
  }

  function handleNavigate(page) {
    setCurrentPage(page);
  }

  // HR jab kisi employee ka "View Details" click kare
  function handleViewEmployee(id) {
    setDetailEmployeeId(id);
    setCurrentPage("employeeDetails");
  }

  // Saara data reset karo
  function handleResetAllData() {
    const confirmed = window.confirm(
      "Are you sure you want to reset ALL data? This cannot be undone."
    );
    if (!confirmed) return;
    setEmployees(INITIAL_EMPLOYEES);
  }

  return (
    <>
      <Navbar
        role={role}
        isLoggedIn={isLoggedIn}
        onLogout={handleLogout}
        currentPage={currentPage}
        onNavigate={handleNavigate}
      />

      {/* LOGIN PAGE */}
      {!isLoggedIn && <Login onLogin={handleLogin} employees={employees} />}

      {/* EMPLOYEE PAGES */}
      {isLoggedIn && role === "employee" && (
        <>
          {currentPage === "dashboard" && (
            <EmployeeDashboard
              employees={employees}
              activeEmployeeId={activeEmployeeId}
              setActiveEmployeeId={setActiveEmployeeId}
              onNavigate={handleNavigate}
            />
          )}

          {currentPage === "applyLeave" && (
            <ApplyLeave
              employees={employees}
              setEmployees={setEmployees}
              activeEmployeeId={activeEmployeeId}
              setActiveEmployeeId={setActiveEmployeeId}
            />
          )}

          {currentPage === "leaveStatus" && (
            <LeaveStatus
              employees={employees}
              setEmployees={setEmployees}
              activeEmployeeId={activeEmployeeId}
              setActiveEmployeeId={setActiveEmployeeId}
            />
          )}
        </>
      )}

      {/* HR PAGES */}
      {isLoggedIn && role === "hr" && (
        <>
          {currentPage === "dashboard" && (
            <HRDashboard
              employees={employees}
              setEmployees={setEmployees}
              onNavigate={handleNavigate}
              onViewEmployee={handleViewEmployee}
              onResetAllData={handleResetAllData}
            />
          )}

          {currentPage === "addEmployee" && (
            <AddEmployee
              employees={employees}
              setEmployees={setEmployees}
              onNavigate={handleNavigate}
            />
          )}

          {currentPage === "pendingRequests" && (
            <PendingRequests
              employees={employees}
              setEmployees={setEmployees}
              onViewEmployee={handleViewEmployee}
            />
          )}

          {currentPage === "employeeCredentials" && (
            <EmployeeCredentials
              employees={employees}
              setEmployees={setEmployees}
              onNavigate={handleNavigate}
            />
          )}

          {currentPage === "employeeDetails" && (
            <EmployeeDetails
              employees={employees}
              setEmployees={setEmployees}
              detailEmployeeId={detailEmployeeId}
              onNavigate={handleNavigate}
            />
          )}
        </>
      )}
    </>
  );
}

export default App;