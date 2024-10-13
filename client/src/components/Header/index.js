import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Header.scss';

function Header() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const navigate = useNavigate(); // Hook để điều hướng

    const handleLoginLogout = () => {
        if (isLoggedIn) {
            setIsLoggedIn(false);
        } else {
            navigate('/login'); // Điều hướng đến trang đăng nhập khi nhấn Login
        }
    };

    const handleLogoClick = () => {
        navigate('/'); // Điều hướng về trang chủ khi nhấn logo
    };

    return (
        <header className="header">
            <div className="logo" onClick={handleLogoClick} style={{ cursor: 'pointer' }}>
                {/* Thay thế bằng đường dẫn logo của bạn */}
                <img src="https://via.placeholder.com/150" alt="Logo" />
            </div>
            <h1>FPTU Library</h1>
            <button onClick={handleLoginLogout}>
                {isLoggedIn ? 'Logout' : 'Login'}
            </button>
        </header>
    );
}

export default Header;
