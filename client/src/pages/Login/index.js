import React, { useState } from 'react';
// Import any necessary libraries for Google login
// import { GoogleLogin } from 'react-google-login';
import './Login.scss';
function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (event) => {
        event.preventDefault();
        // Handle login logic here
        console.log('Username:', username);
        console.log('Password:', password);
    };

    // const handleGoogleLogin = (response) => {
    //     // Handle Google login logic here
    //     console.log('Google login response:', response);
    // };

    return (
        <div className="login-page-container">
            <div className="image-section">
                {/* Replace with your image source */}
                <img src="your-image-url.jpg" alt="Login" />
            </div>
            <div className="login-section">
                <h2>Login</h2>
                <form onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="username">Username:</label>
                        <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="password">Password:</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit">Login</button>
                </form>
                {/* Uncomment and configure GoogleLogin component */}
                {/* <GoogleLogin
                    clientId="YOUR_GOOGLE_CLIENT_ID"
                    buttonText="Login with Google"
                    onSuccess={handleGoogleLogin}
                    onFailure={handleGoogleLogin}
                    cookiePolicy={'single_host_origin'}
                /> */}
            </div>
        </div>
    );
}

export default LoginPage;
