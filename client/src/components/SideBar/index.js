import React, { useState } from "react";
import { Link } from "react-router-dom"; // Nếu bạn sử dụng react-router-dom
import "./SideBar.scss"; // Tùy chọn: CSS cho Sidebar

function Sidebar() {
  const [isVisible, setIsVisible] = useState(true); // Trạng thái để kiểm soát sidebar

  const toggleSidebar = () => {
    setIsVisible(!isVisible); // Đảo ngược trạng thái hiển thị của sidebar
  };

  return (
    <div>
      <button onClick={toggleSidebar} className="btn btn-secondary">
        {isVisible ? 'Hide Sidebar' : 'Show Sidebar'}
      </button>
      {isVisible && (
        <nav className="sidebar">
          <ul className="list-unstyled">
            <li>
              <Link to="/home" className="sidebar-link">Home</Link>
            </li>
            <li>
              <Link to="/news" className="sidebar-link">News</Link>
            </li>
            <li>
              <Link to="/borrowed-books" className="sidebar-link">Borrowed Books</Link>
            </li>
            <li>
              <Link to="/renew" className="sidebar-link">Renew Book</Link>
            </li>
            <li>
              <Link to="/contact" className="sidebar-link">Contact</Link>
            </li>
          </ul>
        </nav>
      )}
    </div>
  );
}

export default Sidebar;
