import React, { useState } from 'react';
import './Header.scss';

function Header() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const handleLoginLogout = () => {
        setIsLoggedIn(!isLoggedIn);
    };

    return (
        <header className="header">
            <div className="logo">
                {/* Replace with your logo image */}
                <img src="path/to/logo.png" alt="Logo" />
            </div>
            <h1>FPTU Library</h1>
            <button onClick={handleLoginLogout}>
                {isLoggedIn ? 'Logout' : 'Login'}
            </button>
        </header>
    );
}

export default Header;
