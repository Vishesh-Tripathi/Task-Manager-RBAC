import React from 'react';
import Navbar from '../Components/Navbar';
const Layout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen ">
      {/* Navbar */}
      <Navbar />
      
      {/* Main Content Area */}
      <main>
        {children}
      </main>

      {/* Footer */}
     
    </div>
  );
};

export default Layout;
