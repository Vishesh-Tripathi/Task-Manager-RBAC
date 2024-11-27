import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ children, adminComponent, userComponent }) => {
  const user = useSelector((state) => state.user);

  if (!user.access_token) {
    // If user is not authenticated, redirect to login page
    return <Navigate to="/" />;
  }
  console.log(user.adminData,user.userData)
  if(user.adminData){
    return adminComponent;
  }
    if(user.userData){
        return userComponent;
    }

//   // If user is authenticated, check their role and navigate accordingly
//   if (user.role === 'admin') {
//     return adminComponent;
//   } else if (user.role === 'user') {
//     return userComponent;
//   }

  // If role is not recognized, redirect to a default page or show an error
  return <Navigate to="/" />;
};

export default ProtectedRoute;