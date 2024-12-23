import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Atendeemanagement.css"; // Import the stylesheet

const AttendeeManagement = () => {
  const [attendees, setAttendees] = useState([]);
  const [newAttendee, setNewAttendee] = useState("");

  const API_BASE_URL = "http://localhost:5000"; // Flask backend base URL

  // Fetch all attendees on component mount
  useEffect(() => {
    const fetchAttendees = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/attendees`);
        setAttendees(response.data);
      } catch (error) {
        console.error("Failed to fetch attendees:", error);
      }
    };
    fetchAttendees();
  }, []);

  // Add a new attendee
  const handleAddAttendee = async () => {
    if (!newAttendee) return;
    try {
      const response = await axios.post(`${API_BASE_URL}/attendees`, { name: newAttendee });
      setAttendees([...attendees, { _id: response.data._id, name: newAttendee }]);
      setNewAttendee("");
    } catch (error) {
      console.error("Failed to add attendee:", error);
    }
  };

  // Remove an attendee
  const handleRemoveAttendee = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/attendees/${id}`);
      setAttendees(attendees.filter((attendee) => attendee._id !== id));
    } catch (error) {
      console.error("Failed to remove attendee:", error);
    }
  };

  return (
    <div className="attendee-container">
      <h2>Attendee Management</h2>
      <div className="add-attendee-form">
        <input
          type="text"
          placeholder="Add Attendee"
          value={newAttendee}
          onChange={(e) => setNewAttendee(e.target.value)}
        />
        <button onClick={handleAddAttendee}>Add</button>
      </div>
      <ul className="attendee-list">
        {attendees.map((attendee) => (
          <li key={attendee._id} className="attendee-item">
            {attendee.name}
            <button
              onClick={() => handleRemoveAttendee(attendee._id)}
              className="remove-btn"
            >
              Remove
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AttendeeManagement;
