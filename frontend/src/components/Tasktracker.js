import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Tasktracker.css";

const TaskTracker = () => {
  const [tasks, setTasks] = useState([]);
  const [searchName, setSearchName] = useState("");
  const [newTask, setNewTask] = useState("");
  const [eventId, setEventId] = useState("");

  const API_BASE_URL = "http://localhost:5000"; // Flask backend base URL

  const fetchTasks = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/tasks`);
      setTasks(response.data);
    } catch (error) {
      console.error("Failed to fetch tasks:", error);
    }
  };

  const handleSearchTasks = async () => {
    if (!searchName.trim()) return;
    try {
      const response = await axios.get(`${API_BASE_URL}/tasks/search`, {
        params: { name: searchName },
      });
      setTasks(response.data);
    } catch (error) {
      console.error("Failed to search tasks:", error);
    }
  };

  const handleAddTask = async () => {
    if (!newTask.trim() || !eventId.trim()) {
      alert("Please provide a task name and event ID.");
      return;
    }
    try {
      const response = await axios.post(`${API_BASE_URL}/tasks`, {
        name: newTask,
        status: "Pending",
        event_id: eventId,
      });
      setTasks([...tasks, response.data]);
      setNewTask("");
      setEventId("");
    } catch (error) {
      console.error("Failed to add task:", error);
    }
  };

  const updateTaskStatus = async (id) => {
    try {
      const task = tasks.find((task) => task._id === id);
      const updatedStatus = task.status === "Pending" ? "Completed" : "Pending";
      const response = await axios.patch(`${API_BASE_URL}/tasks/${id}`, {
        status: updatedStatus,
      });
      setTasks(
        tasks.map((task) =>
          task._id === id ? { ...task, status: response.data.status } : task
        )
      );
    } catch (error) {
      console.error("Failed to update task status:", error);
    }
  };

  const calculateProgress = () => {
    if (tasks.length === 0) return 0;
    const completedTasks = tasks.filter((task) => task.status === "Completed").length;
    return (completedTasks / tasks.length) * 100;
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div className="task-container">
      <h2>Task Tracker</h2>
      <div className="progress-bar">
        <div
          className="progress"
          style={{ width: `${calculateProgress()}%` }}
        >
          {Math.round(calculateProgress())}%
        </div>
      </div>
      <div className="event-selector">
        <input
          type="text"
          placeholder="Enter Event ID"
          value={eventId}
          onChange={(e) => setEventId(e.target.value)}
        />
        <button onClick={fetchTasks}>Fetch Tasks</button>
      </div>
      <div className="task-form">
        <input
          type="text"
          placeholder="New Task"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
        />
        <button onClick={handleAddTask}>Add Task</button>
      </div>
      <ul className="task-list">
        {tasks.map((task) => (
          <li key={task._id} className="task-item">
            {task.name} - {task.status}
            <button
              onClick={() => updateTaskStatus(task._id)}
              className="toggle-btn"
            >
              {task.status === "Pending" ? "Mark Complete" : "Mark Pending"}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TaskTracker;
