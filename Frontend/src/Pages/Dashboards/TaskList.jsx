import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  FaCheck,
  FaRedo,
  FaExclamationCircle,
  FaClipboardCheck,
} from "react-icons/fa";
import { useSelector } from "react-redux";

const categories = [
  { id: "all", name: "All", icon: <FaRedo className="text-lg" /> },
  { id: "completed", name: "Completed", icon: <FaCheck className="text-lg" /> },
  { id: "pending", name: "Pending", icon: <FaExclamationCircle className="text-lg" /> },
  { id: "overdue", name: "Overdue", icon: <FaExclamationCircle className="text-lg text-red-500" /> },
  { id: "review", name: "For Review", icon: <FaClipboardCheck className="text-lg text-blue-500" /> },
];

const TaskList = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [currentTask, setCurrentTask] = useState(null);

  const userData = useSelector((state) => state.user);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_SERVER_DOMAIN}/task/getallTasks`,
        {
          headers: {
            authorization: `${userData?.access_token}`,
          },
        }
      );
      console.log(response.data);
      setTasks(response.data.task);
    } catch (error) {
      console.log(error.response?.data?.message || "Error fetching tasks");
    }
  };

  const handleOpenPopup = (task) => {
    setCurrentTask(task);
    setShowPopup(true);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
    setCurrentTask(null);
  };

  const handleStatusUpdate = async (newStatus) => {
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_SERVER_DOMAIN}/task/updateTask`,
        {
          taskId: currentTask._id,
          newStatus,
        },
        {
          headers: {
            authorization: `${userData?.access_token}`,
          },
        }
      );
      console.log(response.data);
      fetchTasks();
    } catch (error) {
      console.log(error.response?.data?.message || "Error updating task status");
    }

    handleClosePopup();
  };

  return (
    <div className="pt-16">
      {/* Categories Section */}
      <div className="bg-gradient-to-r from-blue-500 to-indigo-500 p-4 shadow-md rounded-lg">
        <div className="flex flex-wrap justify-center sm:justify-start gap-4">
          {categories.map((category) => (
            <div
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`flex items-center space-x-2 text-black cursor-pointer py-2 px-4 rounded-full transition ${
                selectedCategory === category.id
                  ? "bg-white text-blue-500 shadow-lg"
                  : "hover:bg-blue-600"
              }`}
            >
              {category.icon}
              <span>{category.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Task List Section with Scrolling */}
      <div
        className="h-[500px] overflow-y-auto mt-4 px-4"
        style={{
          backgroundColor: "#f9fafb", // Light background for scrolling area
          borderRadius: "8px",
        }}
      >
        {loading ? (
          <p className="text-center text-gray-500">Loading tasks...</p>
        ) : tasks.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {tasks.map((task) => {
              if (
                selectedCategory === "all" ||
                task.status === selectedCategory
              ) {
                return (
                  <div
                    key={task.id}
                    className="shadow-md p-6 rounded-lg flex flex-col transition transform hover:scale-105 hover:shadow-xl"
                  >
                    <h3 className="font-bold text-lg">{task.title}</h3>
                    <p className="text-sm text-blue-600 mt-1">
                      <strong>Created At:</strong> {task.updatedAt}
                    </p>
                    <p className="text-gray-700 text-sm mt-3">
                      <strong>Message:</strong> {task.Taskmessage}
                    </p>
                    <p className="text-sm text-gray-800 mt-2">
                      <strong>Issued To:</strong> {task.issuedTo || "Not Assigned"}
                    </p>
                    <p className="text-sm text-gray-800 mt-2">
                      <strong>Status:</strong>{" "}
                      <span
                        className={`font-medium px-2 py-1 rounded ${
                          task.status === "completed"
                            ? "bg-green-100 text-green-600"
                            : task.status === "pending"
                            ? "bg-yellow-100 text-yellow-600"
                            : task.status === "overdue"
                            ? "bg-red-100 text-red-600"
                            : "bg-blue-100 text-blue-600"
                        }`}
                      >
                        {task.status}
                      </span>
                    </p>
                    <div className="flex items-center justify-between mt-4">
                      <div
                        className={`flex items-center px-3 py-1 rounded-full ${
                          task.priority === "low"
                            ? "bg-green-100 text-green-700"
                            : task.priority === "medium"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        <span>
                          {task.priority.charAt(0).toUpperCase() +
                            task.priority.slice(1)}
                        </span>
                      </div>
                      {task.status === "review" && (
                        <button
                          onClick={() => handleOpenPopup(task)}
                          className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white py-1 px-3 rounded-lg hover:from-indigo-500 hover:to-blue-500 transition"
                        >
                          Update Status
                        </button>
                      )}
                    </div>
                  </div>
                );
              } else {
                return null;
              }
            })}
          </div>
        ) : (
          <p className="text-center text-gray-500">No tasks available.</p>
        )}
      </div>

      {/* Popup for Updating Status */}
      {showPopup && currentTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 px-4">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4 text-center text-gradient bg-clip-text from-blue-500 to-indigo-500">
              Update Task Status
            </h2>
            <p className="mb-4 text-center">
              Task: <strong>{currentTask.title}</strong>
            </p>
            <div className="space-y-4">
              <button
                onClick={() => handleStatusUpdate("completed")}
                className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600 transition"
              >
                Mark as Completed
              </button>
              <button
                onClick={() => handleStatusUpdate("pending")}
                className="w-full bg-yellow-500 text-white py-2 rounded hover:bg-yellow-600 transition"
              >
                Mark as Pending
              </button>
              <button
                onClick={() => handleStatusUpdate("overdue")}
                className="w-full bg-red-500 text-white py-2 rounded hover:bg-red-600 transition"
              >
                Mark as Overdue
              </button>
            </div>
            <button
              onClick={handleClosePopup}
              className="mt-4 w-full bg-gray-500 text-white py-2 rounded hover:bg-gray-600 transition"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskList;
