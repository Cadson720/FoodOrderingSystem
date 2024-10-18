// frontend/SignIn.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // Import axios
import './SignIn.css';

function SignIn({ setIsSignedIn }) {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [code, setCode] = useState('');
    const [generatedCode, setGeneratedCode] = useState('');
    const [timer, setTimer] = useState(60);
    const [isCodeSent, setIsCodeSent] = useState(false);
    const navigate = useNavigate();

    // Validate Email Format
    const validateEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    };

    // Generate a 6-digit verification code
    const generateCode = () => {
        return Math.floor(100000 + Math.random() * 900000).toString();
    };

    // Handle Sign-In Form Submission
    const handleSignIn = async (event) => {
        event.preventDefault();

        // Validation checks
        if (!email || !validateEmail(email)) {
            setError('Please enter a valid email.');
            return;
        }

        // Generate verification code
        const newCode = generateCode();
        setGeneratedCode(newCode);

        try {
            // Send verification code via backend
            const response = await axios.post('http://localhost:3001/api/email/send-verification-email', {
                email: email,
                code: newCode,
            });

            if (response.data.message) {
                alert('Verification code sent to your email.');
                setIsCodeSent(true);
                setTimer(60); // Start timer
            }
        } catch (err) {
            console.error('Error sending verification email:', err);
            setError('Failed to send verification email. Please try again.');
        }
    };

    // Handle Code Verification
    const handleVerifyCode = (event) => {
        event.preventDefault();

        if (code === generatedCode) {
            setIsSignedIn(true);
            localStorage.setItem('isSignedIn', 'true');
            navigate('/'); // Redirect to home page
        } else {
            setError('Invalid verification code.');
        }
    };

    // Timer countdown
    useEffect(() => {
        let countdown;
        if (isCodeSent && timer > 0) {
            countdown = setInterval(() => {
                setTimer((prevTimer) => prevTimer - 1);
            }, 1000);
        } else if (timer === 0 && isCodeSent) {
            setIsCodeSent(false);
            setGeneratedCode('');
            setCode('');
            alert("Verification code has expired. Please sign in again.");
        }

        return () => clearInterval(countdown);
    }, [isCodeSent, timer]);

    return (
        <div className="signin-container">
            <div className="signin-card">
                <h1 className="signin-title">Sydney Burgers</h1>
                {!isCodeSent ? (
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
                        {error && <p className="error-message">{error}</p>}
                        <button type="submit" className="signin-button">SEND VERIFICATION CODE</button>
                    </form>
                ) : (
                    <form className="signin-form" onSubmit={handleVerifyCode}>
                        <div className="form-group">
                            <label>Enter Verification Code:</label>
                            <input
                                type="text"
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                                placeholder="Enter the 6-digit code"
                                required
                            />
                        </div>
                        <p>Code expires in: {timer} seconds</p>
                        {error && <p className="error-message">{error}</p>}
                        <button type="submit" className="signin-button">VERIFY CODE</button>
                    </form>
                )}
            </div>
        </div>
    );
}

export default SignIn;
