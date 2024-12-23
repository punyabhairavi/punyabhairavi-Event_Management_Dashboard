import React, { useState, useEffect } from 'react';
import axios from 'axios';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction'; // Enables event interaction
import './Eventcalendar.css'; // Optional: Add a custom CSS file for styling

const EventCalendar = () => {
  const [calendarEvents, setCalendarEvents] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch events from the backend
  const fetchEvents = async () => {
    try {
      const response = await axios.get('http://localhost:5000/events'); // Update with your Flask server URL
      const events = response.data.map(event => ({
        title: event.name,
        date: event.date, 
        description: event.description || '',
      }));
      setCalendarEvents(events);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching events:', error);
      setError('Unable to load events. Please try again later.');
      setLoading(false);
    }
  };

  // Handle event click (optional)
  const handleEventClick = (info) => {
    alert(`Event: ${info.event.title}\nDescription: ${info.event.extendedProps.description}`);
  };

  // Call fetchEvents on component load
  useEffect(() => {
    fetchEvents();
  }, []);

  // Conditional rendering
  if (loading) {
    return <div>Loading events...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="calendar-container">
      <h2>Event Calendar</h2>
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]} // Add interactionPlugin for event clicks
        initialView="dayGridMonth"
        events={calendarEvents} // Dynamically set events
        eventClick={handleEventClick} // Handle event clicks
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,dayGridWeek,dayGridDay',
        }} // Add navigation and view options
      />
    </div>
  );
};

export default EventCalendar;
