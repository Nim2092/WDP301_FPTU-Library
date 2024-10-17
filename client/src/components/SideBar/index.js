import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "./SideBar.scss"; // Import SCSS

const Sidebar = ({ menuItems }) => {
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const location = useLocation(); // Get the current route

  // Function to toggle sidebar visibility
  const toggleSidebar = () => {
    setIsSidebarVisible(!isSidebarVisible);
  };

  return (
    <div className="sidebar-container">
      {/* Sidebar Toggler Button */}
      <div className="sidebar-toggler" onClick={toggleSidebar}>
        <i className="fa fa-bars"></i>
      </div>

      {/* Sidebar Navigation */}
      <nav className={`sidebar ${isSidebarVisible ? "" : "sidebar-hidden"}`}>
        <ul>
          {menuItems.map((item) => (
            <li key={item.path}>
              <Link 
                to={item.path} 
                onClick={() => setIsSidebarVisible(false)}
                className={location.pathname === item.path ? "active" : ""} // Add 'active' class if the path matches
              >
                <i className={item.icon}></i> {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
