import React, { useEffect, useState } from "react";
import { FaCheck, FaExclamationCircle, FaClipboardCheck } from "react-icons/fa";
import axios from "axios";
import { useSelector } from "react-redux";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { useNavigate } from "react-router-dom";

// Register Chart.js elements
ChartJS.register(ArcElement, Tooltip, Legend);

const UserDashboard = () => {
  const [tasks, setTasks] = useState([]); // Store fetched tasks
  const [selectedCategory, setSelectedCategory] = useState("all"); // Track active filter category
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal state
  const [taskToSubmit, setTaskToSubmit] = useState(null); // Task ID for submission
  const [chartData, setChartData] = useState({}); // Chart data for Pie or Doughnut

  const userData = useSelector((state) => state.user);
  const access_token = userData?.access_token;
  const navigate=useNavigate();
  useEffect(() => {
    if (!userData?.access_token || userData.userData.role!==`user`) {
      navigate("/"); // Redirect to the homepage if no access_token
    }
  }, [userData, navigate]);

  const categories = [
    { id: "all", name: "All", icon: <FaExclamationCircle /> },
    { id: "completed", name: "Completed", icon: <FaCheck /> },
    { id: "pending", name: "Pending", icon: <FaExclamationCircle /> },
    { id: "overdue", name: "Overdue", icon: <FaExclamationCircle /> },
    { id: "review", name: "Submit for Review", icon: <FaClipboardCheck /> },
  ];

  // Fetch tasks from the backend
  const fetchTasks = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_SERVER_DOMAIN}/task/gettaskByUser`,
        {
          headers: { authorization: `${access_token}` },
        }
      );
      setTasks(response.data.task);
      // clg
      generateChartData(response.data.task); // Generate chart data after fetching tasks
    } catch (error) {
      console.error(error.response?.data?.message || "Error fetching tasks");
    }
  };

  // Generate chart data based on fetched tasks
  const generateChartData = (tasks) => {
    const statusCount = {
      completed: 0,
      pending: 0,
      overdue: 0,
      review: 0,
    };

    tasks.forEach((task) => {
      if (task.status in statusCount) {
        statusCount[task.status] += 1;
      }
    });

    const chartData = {
      labels: ["Completed", "Pending", "Overdue", "Review"],
      datasets: [
        {
          data: [
            statusCount.completed,
            statusCount.pending,
            statusCount.overdue,
            statusCount.review,
          ],
          backgroundColor: ["#4caf50", "#ffeb3b", "#f44336", "#2196f3"],
          borderWidth: 1,
        },
      ],
    };
    setChartData(chartData); // Update chart data state
  };

  useEffect(() => {
    fetchTasks(); // Fetch tasks on component mount
  }, []);

  // Handle the task submission for review
  const handleSubmitForReview = (taskId) => {
    setTaskToSubmit(taskId); // Set the task ID to be submitted
    setIsModalOpen(true); // Open the modal
  };

  // Handle task status change to 'Submit for Review'
  const handleConfirmSubmitReview = async () => {
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_SERVER_DOMAIN}/task/updateTask`,
        { taskId: taskToSubmit, newStatus: "review" },
        {
          headers: { authorization: `${access_token}` },
        }
      );
      // Update the tasks list locally
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === taskToSubmit ? { ...task, status: "review" } : task
        )
      );
      fetchTasks(); // Refetch tasks after updating the status
      setIsModalOpen(false); // Close the modal after submitting
      setTaskToSubmit(null); // Clear the task ID
      generateChartData(tasks); // Regenerate chart data after updating the task
    } catch (error) {
      console.error("Error updating task status:", error);
      setIsModalOpen(false); // Close the modal in case of error
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false); // Close the modal without any changes
    setTaskToSubmit(null); // Clear the task ID
  };
  console.log(tasks)

  return (
    <div className="flex flex-col md:flex-row h-screen pt-16">
      {/* Sidebar */}
      <aside className="w-full md:w-1/4 bg-gray-100 p-4 md:block flex-none md:flex-col">
        <div className="flex md:flex-col space-x-4 md:space-x-0 flex-wrap justify-center md:justify-start">
          {categories.map((category,i) => (
            <button
              key={i}
              onClick={() => setSelectedCategory(category.id)}
              className={`flex items-center space-x-2 cursor-pointer p-2 rounded-full text-md font-semibold transition-colors ${
                selectedCategory === category.id
                  ? "bg-blue-500 text-white"
                  : "hover:bg-blue-0 hover:text-blue-800"
              }`}
            >
              {category.icon}
              <span>{category.name}</span>
            </button>
          ))}
        </div>

        {/* Chart Container (below categories on mobile, fixed on larger screens) */}
        <div className="w-full md:w-full mt-6 md:mt-4 flex justify-center items-center">
          <div className="w-full">
            <h3 className="text-lg font-semibold mb-4 text-center">Task Status Distribution</h3>
            {chartData.labels && chartData.datasets ? (
              <Doughnut data={chartData} />
            ) : (
              <p className="text-center text-gray-500">No data available</p>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 bg-gray-50">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {/* Traverse through tasks and display only based on selected category */}
          {tasks.length > 0 &&
            tasks.map((task) => {
              // Only display tasks based on selected category
              if (
                selectedCategory === "all" ||
                task.status === selectedCategory
              ) {
                return (
                  <div
                    key={task._id}
                    className="backdrop-blur-sm p-6 shadow-lg rounded-xl flex flex-col transform transition-all hover:scale-105 hover:shadow-2xl"
                  >
                    <h3 className="text-black font-semibold text-xl">{task.title}</h3>
                    <p className="text-black text-sm mt-2">{task.Taskmessage}</p>
                    {/* Created At */}
                    <p className="text-sm text-blue-600 mt-1">
                      <strong>Created At:</strong> {task.updatedAt}
                    </p>

                    {/* Task Status */}
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
                    <div className="mt-4 flex justify-between items-center">
                      <span
                        className={`flex items-center px-3 py-1 rounded-full ${
                          task.priority === "low"
                            ? "bg-green-100 text-green-700"
                            : task.priority === "medium"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {task.priority}
                      </span>
                      <div className="flex items-center space-x-3">
                        {task.status === "pending" && (
                          <button
                            onClick={() => handleSubmitForReview(task._id)}
                            className="bg-gradient-to-r from-blue-500 to-teal-500 text-white py-2 px-4 rounded-full hover:from-teal-500 hover:to-blue-500 transition duration-300 w-full sm:w-auto"
                          >
                            Submit for Review
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              } else {
                return null; // If the task doesn't match selected category, render nothing
              }
            })}
        </div>
      </main>

      {/* Modal for confirmation */}
      {isModalOpen && (
  <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
    <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 sm:w-1/3 md:w-1/4">
      <h3 className="text-lg font-semibold mb-4 text-center">Confirm Submission</h3>
      <p className="text-sm text-gray-700 text-center">Are you sure you want to submit this task for review?</p>
      <div className="mt-6 flex justify-between space-x-4 flex-wrap">
        <button
          onClick={handleCancel}
          className="bg-gray-300 text-gray-800 py-2 px-4 rounded-full w-full sm:w-auto mb-2 sm:mb-0"
        >
          Cancel
        </button>
        <button
          onClick={handleConfirmSubmitReview}
          className="bg-blue-500 text-white py-2 px-4 rounded-full w-full sm:w-auto"
        >
          Submit for Review
        </button>
      </div>
    </div>
  </div>
)}

    </div>
  );
};

export default UserDashboard;
