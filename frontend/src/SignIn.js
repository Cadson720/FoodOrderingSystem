import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './SignIn.css';

function SignIn({ setIsSignedIn }) {
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const validateEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    };

    const handleSignIn = (event) => {
        event.preventDefault();

        // Validation checks
        if (!email || !validateEmail(email)) {
            setError('Please enter a valid email.');
            return;
        }

        if (!phone || isNaN(phone) || phone.length < 10) {
            setError('Please enter a valid phone number.');
            return;
        }

        // If both email and phone are valid
        setError('');
        setIsSignedIn(true);  // Simulate sign-in
        navigate('/');  // Redirect to the home page after sign-in
    };

    return (
        <div className="signin-container">
            <div className="signin-card">
                <h1 className="signin-title">Sydney Burgers</h1>
                <form className="signin-form" onSubmit={handleSignIn}>
                    <div className="form-group">
                        <label>Email Address:</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Phone Number:</label>
                        <input
                            type="text"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="Enter your phone number"
                            required
                        />
                    </div>
                    {error && <p className="error-message">{error}</p>} {/* Display error messages */}
                    <button type="submit" className="signin-button">SIGN IN</button>
                </form>
            </div>
        </div>
    );
}

export default SignIn;
