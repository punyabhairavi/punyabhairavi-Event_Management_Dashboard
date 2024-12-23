import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Eventmanagement.css";

const EventManagement = () => {
    const [events, setEvents] = useState([]);
    const [form, setForm] = useState({
        name: "",
        description: "",
        location: "",
        date: "",
    });

    const API_BASE_URL = "http://localhost:5000"; // Flask backend base URL

    // Fetch all events on component mount
    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/events`);
                setEvents(response.data);
            } catch (error) {
                console.error("Failed to fetch events:", error);
            }
        };
        fetchEvents();
    }, []);

    // Add a new event
    const handleAddEvent = async () => {
        if (!form.name || !form.description || !form.location || !form.date) return;
        try {
            const response = await axios.post(`${API_BASE_URL}/events`, form);
            setEvents([...events, { ...form, _id: response.data._id }]);
            setForm({ name: "", description: "", location: "", date: "" });
        } catch (error) {
            console.error("Failed to add event:", error);
        }
    };

    // Delete an event
    const handleDeleteEvent = async (id) => {
        try {
            await axios.delete(`${API_BASE_URL}/events/${id}`);
            setEvents(events.filter((event) => event._id !== id));
        } catch (error) {
            console.error("Failed to delete event:", error);
        }
    };

    return (
        <div className="event-container">
            <h2>Event Management</h2>
            <div className="event-form">
                <input
                    type="text"
                    placeholder="Event Name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
                <input
                    type="text"
                    placeholder="Description"
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                />
                <input
                    type="text"
                    placeholder="Location"
                    value={form.location}
                    onChange={(e) => setForm({ ...form, location: e.target.value })}
                />
                <input
                    type="date"
                    value={form.date}
                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                />
                <button onClick={handleAddEvent}>Add Event</button>
            </div>
            <ul className="event-list">
                {events.map((event) => (
                    <li key={event._id} className="event-item">
                        <h3>{event.name}</h3>
                        <p>{event.description}</p>
                        <p>
                            <strong>Location:</strong> {event.location}
                        </p>
                        <p>
                            <strong>Date:</strong> {event.date}
                        </p>
                        <button
                            onClick={() => handleDeleteEvent(event._id)}
                            className="delete-btn"
                        >
                            Delete
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default EventManagement;
