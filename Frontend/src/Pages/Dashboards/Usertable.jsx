import React, { useState, useEffect } from "react";
import { FaTasks, FaTrash, FaUserEdit, FaPlus } from "react-icons/fa";
import TaskForm from "./AssignTask";
import axios from "axios"; // For API calls
import { useSelector } from "react-redux";
import toast, { Toaster } from "react-hot-toast";

const UserTable = ({ accessToken }) => {
  const [users, setUsers] = useState([]); // Store real-time user data
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [loading, setLoading] = useState(true); // Loading state
  const [showAssignTaskModal, setShowAssignTaskModal] = useState(false);
  const [showChangeRoleModal, setShowChangeRoleModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newUser, setNewUser] = useState({ fullname: "", email: "", password: "" });
  const userData = useSelector((state) => state.user);

  // Fetch users data from Redux store
  let flg = 0;

  // const access_token = userData?.access_token;
  const access_token = userData?.access_token;
  const fetchUser=async()=>{
    try{
      let user = await axios.get(import.meta.env.VITE_SERVER_DOMAIN+"/auth/getusers",{
         
          headers: { authorization: `${access_token}` },
       
      })
      console.log(user.data.users,"yuihyutr");
      setUsers(user.data.users)
    }
    catch(err){
      console.log(err)
    }
  }

  useEffect(() => {
    // setUsers(userData?.adminData?.data?.user);
    fetchUser()
    setLoading(false);
  }, []);
  
  console.log(users,"yhioth")

  const baseurl = import.meta.env.VITE_SERVER_DOMAIN;


  // adding a user 

  const handleAddUser = async () => {
    try {
      const response = await axios.post(
        `${baseurl}/auth/createuser`,
        { ...newUser },
        {
          headers: {
            authorization: `${access_token}`,
          },
        }
      );
      flg =1;
      fetchUser()
      toast.success(response.data.message);
      setShowAddUserModal(false);
    } catch (error) {
      toast.error(error.response?.data?.message || "Error adding user");
    }
  };
  


  // assiging a atsk to a user  

  const handleAssignTask = (user) => {
    setSelectedUser(user);
    setShowAssignTaskModal(true);
  };
 


  // handle change Role

  const handleChangeRole = (user) => {
    setSelectedUser(user);
    setShowChangeRoleModal(true);
  };

  const confirmChangeRole = async () => {
    try {
      const ID = selectedUser._id;
      console.log(ID,"yui")
      const response = await axios.put(
        `${baseurl}/auth/updateuser`,
        { id:ID }, // Pass user ID
        {
          headers: {
            authorization: `${access_token}`,
          },
        }
      );
      toast.success(response.data.message);
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === selectedUser._id ? { ...user, role: response.data.newRole } : user
        )
      );
      setShowChangeRoleModal(false);
    } catch (error) {
      toast.error(error.response?.data?.message || "Error changing role");
    }
  };
  const handleDeleteUser = async (id) => {
    try {
      const response = await axios.post(
        `${baseurl}/auth/deleteuser/${id}`,
        {
          headers: {
            authorization: `${access_token}`,
          },
        }
      );
      flg =1;
      toast.success(response.data.message);
      fetchUser()
    } catch (error) {
      toast.error(error.response?.data?.message || "Error deleting user");
    }
  }

  ///checking api
  //   const alldata=async()=>{
  //   await axios.get(import.meta.env.VITE_SERVER_DOMAIN+"/task/getallTasks",
  //     {
  //       headers:{
  //         'authorization': `${access_token}`
  //       }
  //     }
      
  //   ).then((data)=>{
  //     console.log(data,"dsff")
  //     dispatch(setAdmin(data));
  //     dispatch(setAdminTask(data.data.task))
  //     dispatch(setAdminUser(data.data.user))
  //     return;
  //   })
  //   .catch(({response})=>{
  //      console.log(response)
  //      return;
      
  //   })

  // }

  return (
    <div className="p-4">
      <Toaster />
      <h1 className="text-xl font-bold mb-4">User Management</h1>
      <button
        onClick={() => setShowAddUserModal(true)}
        className="flex items-center bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition mb-4"
      >
        <FaPlus className="mr-2" />
        Add User
      </button>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-2 text-sm sm:text-base">Serial No</th>
              <th className="border border-gray-300 px-4 py-2 text-sm sm:text-base">Name</th>
              <th className="border border-gray-300 px-4 py-2 text-sm sm:text-base">Email</th>
              <th className="border border-gray-300 px-4 py-2 text-sm sm:text-base">Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="5" className="text-center py-4">Loading...</td>
              </tr>
            ) : users && users.length > 0 ? (
              users.map((user, index) => (
                <tr key={user._id} className="hover:bg-gray-50">
                  <td className="border border-gray-300 px-4 py-2 text-center">{index + 1}</td>
                  <td className="border border-gray-300 px-4 py-2 text-center">{user.fullname}</td>
                  <td className="border border-gray-300 px-4 py-2 text-center">{user.email}</td>
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    <div className="flex justify-center space-x-4">
                      <button
                        onClick={() => handleAssignTask(user)}
                        className="flex items-center text-green-600 hover:text-green-700 transition"
                      >
                        <FaTasks className="mr-2" />
                        Assign Task
                      </button>
                      <button
                        onClick={() => handleChangeRole(user)}
                        className="flex items-center text-blue-600 hover:text-blue-700 transition"
                      >
                        <FaUserEdit className="mr-2" />
                        Change Role
                      </button>
                      <button
                        onClick={() => handleDeleteUser(user._id)}
                        className="flex items-center text-red-600 hover:text-red-700 transition"
                      >
                        <FaTrash className="mr-2" />
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center py-4">No users found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add User Modal */}
{showAddUserModal && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
    <div className="w-full max-w-lg bg-white rounded-xl shadow-lg overflow-hidden transform transition-all sm:scale-100 scale-95">
      <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-6">
        <h2 className="text-2xl font-bold text-white text-center">Add New User</h2>
        <p className="text-sm text-white text-center mt-2">Fill in the details to create a new user.</p>
      </div>
      <div className="p-6">
        <div className="mb-6">
          <label className="block text-gray-700 font-semibold mb-2">Full Name</label>
          <input
            type="text"
            className="w-full border border-gray-300 px-4 py-3 rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-blue-300"
            placeholder="Enter full name"
            value={newUser.fullname}
            onChange={(e) => setNewUser({ ...newUser, fullname: e.target.value })}
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 font-semibold mb-2">Email</label>
          <input
            type="email"
            className="w-full border border-gray-300 px-4 py-3 rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-blue-300"
            placeholder="Enter email address"
            value={newUser.email}
            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 font-semibold mb-2">Password</label>
          <input
            type="password"
            className="w-full border border-gray-300 px-4 py-3 rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-blue-300"
            placeholder="Enter password"
            value={newUser.password}
            onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
          />
        </div>
        <div className="flex items-center justify-between">
          <button
            onClick={handleAddUser}
            className="bg-blue-500 text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-600 transition transform hover:-translate-y-1 focus:outline-none focus:ring focus:ring-blue-300"
          >
            Add User
          </button>
          <button
            onClick={() => setShowAddUserModal(false)}
            className="bg-gray-500 text-white px-6 py-3 rounded-lg shadow-md hover:bg-gray-600 transition transform hover:-translate-y-1 focus:outline-none focus:ring focus:ring-gray-300"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  </div>
)}


      {/* Change Role Modal */}
      {showChangeRoleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4">
              Confirm Role Change for {selectedUser?.fullname}?
            </h2>
            <div className="flex justify-end space-x-2">
              <button
                onClick={confirmChangeRole}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Confirm
              </button>
              <button
                onClick={() => setShowChangeRoleModal(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
        {/* Assign Task Modal */}
        {showAssignTaskModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-white rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4">Assign Task to {selectedUser?.fullname}</h2>
            <TaskForm user={selectedUser} onClose={() => setShowAssignTaskModal(false)} token={ access_token}  />
          </div>
        </div>
      )}
    </div>
  );
};

export default UserTable;
