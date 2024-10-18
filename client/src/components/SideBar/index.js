import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "./SideBar.scss"; // Import SCSS

const Sidebar = ({ menuItems }) => {
  const [isSidebarVisible, setIsSidebarVisible] = useState(true); // Default sidebar is visible
  const location = useLocation(); // Get the current route

  // Function to toggle sidebar visibility
  return (
    <div className={`sidebar-container col-2`}>
      <nav className={`sidebar`}>
        <div className="sidebar-content">
          <ul>
            {menuItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={location.pathname === item.path ? "active" : ""}>
                  <i className={item.icon}></i> {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </div>
  );
};

export default Sidebar;
