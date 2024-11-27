import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./Layout/Layout";
import Homepage from "./Pages/HomePage";
import TaskManagement from "./Pages/Dashboards/AdminDashboard";
import User from "./Pages/Dashboards/UserDash/UserDashboard";
import Signup from "./Pages/Signup";
import ProtectedRoute from "./Pages/ProtectedRoute";


const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Homepage/>} />
        <Route path="*" element={<h1>Not Found</h1>} />
        <Route
          path="/admin-dashboard"
          element={
            // <ProtectedRoute
            //   adminComponent={<Layout><TaskManagement/></Layout>}
            //   userComponent={<Navigate to="/user-dashboard" />}
            // />
            <Layout><TaskManagement/></Layout>
          }
        />
        <Route
          path="/user-dashboard"
          element={
            // <ProtectedRoute
            //   adminComponent={<Navigate to="/admin-dashboard" />}
            //   userComponent={<Layout><User/></Layout>}
            // />
            <Layout><User/></Layout>
          }
        />
        {/* <Route path="/home-admin" element={<Layout><TaskManagement/></Layout>} />
        <Route path="/home-user" element={<Layout><User/></Layout>} /> */}
        <Route path="/signup" element={<Signup/>} />
      </Routes>
    </Router>
  );
};

export default App;
