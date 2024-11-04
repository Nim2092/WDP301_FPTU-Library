import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify'; // Import toast
import AuthContext from '../../contexts/UserContext';
import './Header.scss';

function Header() {
    const { user, logout } = useContext(AuthContext); // Use context for user info
    const navigate = useNavigate();
    const [isDropdownVisible, setIsDropdownVisible] = useState(false); // State to toggle dropdown

    // Hide dropdown initially when the user logs in
    useEffect(() => {
        setIsDropdownVisible(false);
    }, [user]);

    const handleLogout = () => {
        logout(); // Perform logout
        navigate('/login');
        toast("Đăng xuất thành công");
    };

    const handleProfileClick = () => {
        navigate('/profile/:id'); // Navigate to profile page
    };

    const toggleDropdown = () => {
        setIsDropdownVisible(!isDropdownVisible); // Toggle dropdown visibility
    };

    const handleLogoClick = () => {
        navigate('/'); // Navigate to homepage
    };

    return (
        <header className="header d-flex ">
            <div className="logo" onClick={handleLogoClick} style={{ cursor: 'pointer' }}>
                <img src="https://library.fpt.edu.vn/Uploads/HN/images/opac-logo/logo.png" alt="Logo" />
            </div>
            <div className="d-flex align-items-center">
                <h1>FPTU Library</h1>
            </div>
            <div className="header-icons" >
                {user ? (
                    <div className="profile-container">
                        <div className="profile-dropdown">
                            <img
                                src={user.profilePicture || "https://static.vecteezy.com/system/resources/thumbnails/020/911/731/small/profile-icon-avatar-icon-user-icon-person-icon-free-png.png"}
                                alt="Profile"
                                className="profile-pic"
                                onClick={toggleDropdown} // Toggle dropdown on click
                            />
                            {isDropdownVisible && ( // Conditionally render dropdown
                                <div className="dropdown-content">
                                    <button onClick={handleProfileClick}>Profile</button>
                                    <button onClick={handleLogout}>Logout</button>
                                </div>
                            )}
                        </div>
                    </div>
                ) : null}
            </div>
        </header>
        
    );
}

export default Header;
