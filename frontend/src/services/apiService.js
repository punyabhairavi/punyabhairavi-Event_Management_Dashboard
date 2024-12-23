import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api'; // Replace with your backend URL

export const createEvent = async (eventData) => {
  return await axios.post(`${API_BASE_URL}/events`, eventData);
};

export const getEvents = async () => {
  return await axios.get(`${API_BASE_URL}/events`);
};

export const deleteEvent = async (eventId) => {
  return await axios.delete(`${API_BASE_URL}/events/${eventId}`);
};

// Add more API methods as needed
