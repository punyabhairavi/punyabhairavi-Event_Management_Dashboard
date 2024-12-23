import React from "react";
import { Link } from "react-router-dom";
import './Navbar.css';

const Navbar = () => (
  <nav className="navbar">
    <ul className="nav-links">
      {/* <li><Link to="/">Home</Link></li> */}
      <li><Link to="/event-calendar">Event Calendar</Link></li>
      <li><Link to="/events">Event Management</Link></li>
      <li><Link to="/attendees">Attendee Management</Link></li>
      <li><Link to="/tasks">Task Tracker</Link></li>
    </ul>
  </nav>
);

export default Navbar;


