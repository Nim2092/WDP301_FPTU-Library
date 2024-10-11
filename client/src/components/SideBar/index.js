import React, { useState } from 'react';
import './SideBar.scss'; 

const SideBar = () => {
    const [isVisible, setIsVisible] = useState(true);

    const toggleSidebar = () => {
        setIsVisible(!isVisible);
    };

    return (
        <div>
            <button onClick={toggleSidebar}>
                {isVisible ? '✖' : '☰'} {/* Unicode characters for close and menu icons */}
                {isVisible ? ' Hide Sidebar' : ' Show Sidebar'}
            </button>
            {/* Sidebar is conditionally rendered, but the button is always visible */}
            {isVisible && (
                <div className="sidebar">
                    <h2>Sidebar</h2>
                    <ul>
                        <li>Home</li>
                        <li>About</li>
                        <li>Contact</li>
                        <li>Services</li>
                    </ul>
                </div>
            )}
        </div>
    );
};

export default SideBar;
