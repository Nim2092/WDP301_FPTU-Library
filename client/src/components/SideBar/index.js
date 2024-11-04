import React, { useState, useEffect, useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
import AuthContext from "../../contexts/UserContext";
import "./SideBar.scss"; // Import SCSS

const Sidebar = ({ menuItems }) => {
  const location = useLocation();
  const { user } = useContext(AuthContext);
  const [unreadCount, setUnreadCount] = useState(0);

  // Fetch unread notifications count
  useEffect(() => {
    if (user) {
      axios
        .get(`https://fptu-library.xyz/api/notifications/unreadCount/${user.id}`)
        .then((response) => {
          setUnreadCount(response.data.data);
        })
        .catch((error) => {
          console.error("Error fetching unread notification count:", error);
        });
    }
  }, [user]);

  return (
    <div className={`sidebar-container col-2`}>
      <nav className={`sidebar`}>
        <div className="sidebar-content">
          <ul>
            {menuItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={location.pathname === item.path ? "active" : ""}
                >
                  <i className={item.icon}></i> {item.label}
                  {item.label === "Thông báo" && unreadCount > 0 && (
                    <span className="badge">{unreadCount}</span>
                  )}
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
