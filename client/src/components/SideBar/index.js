import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./SideBar.scss"; // Import SCSS

const Sidebar = ({ menuItems }) => {
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);

  // Function to toggle sidebar visibility
  const toggleSidebar = () => {
    setIsSidebarVisible(!isSidebarVisible);
  };

  return (
    <>
      {/* Sidebar Toggler Button */}
      <div className="sidebar-toggler" onClick={toggleSidebar}>
        <i className="fa fa-bars"></i>
      </div>

      {/* Sidebar Navigation */}
      <nav className={`sidebar ${isSidebarVisible ? "" : "sidebar-hidden"}`}>
        <ul>
          {menuItems.map((item) => (
            <li key={item.path}>
              <Link to={item.path} onClick={() => setIsSidebarVisible(false)}>
                <i className={item.icon}></i> {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
};

export default Sidebar;
