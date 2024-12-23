import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import EventManagement from "./components/Eventmanagement";
import AttendeeManagement from "./components/Atendeemanagement";
import TaskTracker from "./components/Tasktracker";
import AuthForm from "./components/AuthForm";
import EventCalendar from "./components/Eventcalendar"; // Importing new EventCalendar component

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Callback to update authentication status after login/signup
  const handleAuthSuccess = () => {
    setIsAuthenticated(true);
  };

  return (
    <Router>
      {/* Show Navbar only if authenticated */}
      {isAuthenticated && <Navbar />}
      <div className="container">
        <Routes>
          {/* Route for login/signup */}
          <Route
            path="/"
            element={
              isAuthenticated ? (
                <Navigate to="/events" replace />
              ) : (
                <AuthForm onAuthSuccess={handleAuthSuccess} />
              )
            }
          />

          {/* Protected routes */}
          <Route
            path="/events"
            element={isAuthenticated ? <EventManagement /> : <Navigate to="/" replace />}
          />
          <Route
            path="/event-calendar"
            element={isAuthenticated ? <EventCalendar /> : <Navigate to="/" replace />}
          /> {/* New EventCalendar Route */}
          <Route
            path="/attendees"
            element={isAuthenticated ? <AttendeeManagement /> : <Navigate to="/" replace />}
          />
          <Route
            path="/tasks"
            element={isAuthenticated ? <TaskTracker /> : <Navigate to="/" replace />}
          />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
