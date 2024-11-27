import React, { useState, useEffect } from "react";
import TaskList from "./TaskList";
import { FaTasks, FaUser } from "react-icons/fa";

// import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
// import UserTable from "./Usertable";


import { useSelector, useDispatch } from 'react-redux';
import UserTable from "./Usertable";
import axios from "axios";
import {setAdmin, setAdminTask, setAdminUser} from "../../features/userSlice";

//console.log(import.meta.env.VITE_SERVER_DOMAIN,"dsf")
// Sidebar categories
const categories = [
  { id: "tasks", name: "Tasks", icon: <FaTasks className="text-lg" /> },
  { id: "users", name: "Users", icon: <FaUser className="text-lg" /> },
];

const TaskManagement = () => {
  const [selectedCategory, setSelectedCategory] = useState("tasks");

  const userData = useSelector((state) => state.user);
  const navigate = useNavigate();
  console.log(userData,"tyu")

  

  // Check access_token and redirect if not present
  
  
  useEffect(() => {
    if (!userData?.access_token || userData.userData.role!==`admin`) {
      navigate("/"); // Redirect to the homepage if no access_token
    }
  }, [userData, navigate]);
  const access_token = userData?.access_token;

  const dispatch = useDispatch();

  const alldata=async()=>{
    await axios.get(import.meta.env.VITE_SERVER_DOMAIN+"/task/getallTasks",
      {
        headers:{
          'authorization': `${access_token}`
        }
      }
      
    ).then((data)=>{
      console.log(data,"dsff")
      dispatch(setAdmin(data));
      // dispatch(setAdminTask(data.data.task))
      // dispatch(setAdminUser(data.data.user))
      return;
    })
    .catch(({response})=>{
       console.log(response)
       return;
      
    })

  }

  useEffect(() => {
    if (access_token) {
      alldata(dispatch, access_token); // Call the alldata function with dispatch and token
    }
  }, [dispatch, access_token]);

 console.log(userData,"tyuiiii")
  return (
    <div className="pt-16 ">
      <div className="h-screen flex flex-col md:flex-row">
        {/* Categories (mobile view above main content, sidebar on large screens) */}
        <nav className="w-full bg-white p-4 shadow-md md:hidden flex justify-between mb-4">
          {categories.map((category) => (
            <div
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`flex items-center space-x-2 text-gray-700 cursor-pointer py-2 px-4 rounded-full hover:bg-gray-200 ${
                selectedCategory === category.id
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100"
              }`}
            >
              {category.icon}
              <span>{category.name}</span>
            </div>
          ))}
        </nav>

        {/* Sidebar (hidden on mobile view, displayed on larger screens) */}
        <aside className="w-1/6 bg-gray-100 p-4 pt-20 shadow-md md:block hidden">
          <h2 className="text-xl font-bold mb-4 text-gray-700">Admin Panel</h2>
          <nav>
            <ul className="space-y-4">
              {categories.map((category) => (
                <li
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center space-x-2 text-gray-700 hover:text-blue-500 cursor-pointer py-2 px-4 rounded-full ${
                    selectedCategory === category.id
                      ? "bg-blue-500 text-white"
                      : "bg-gray-100"
                  }`}
                >
                  {category.icon}
                  <span>{category.name}</span>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1  bg-gray-50 ">
          {/* Conditionally render based on selected category */}
          {selectedCategory === "tasks" ? (
            <TaskList  />
          ) : (
            <div className="text-center">
              
             
              <UserTable accessToken={access_token}  />
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default TaskManagement;
