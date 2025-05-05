import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Navigation = () => {
    const { currentUser, logout } = useAuth();
    const navigate = useNavigate();
    const [showDropdown, setShowDropdown] = useState(false);

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/login');
        } catch (err) {
            console.error('Logout failed:', err);
        }
    };

    return (
        <nav style={navContainer}>
            <div style={navRow}>
                <Link to="/" style={linkStyle}>Home</Link>

                {currentUser ? (
                    <>
                        <div style={{ position: 'relative' }}>
                            <button onClick={() => setShowDropdown(prev => !prev)} style={buttonStyle}>
                                Dashboard ▼
                            </button>
                            {showDropdown && (
                                <div style={dropdownStyle}>
                                    <Link to="/my-recipes" style={dropdownItem} onClick={() => setShowDropdown(false)}>My Recipes</Link>
                                    <Link to="/scheduler" style={dropdownItem} onClick={() => setShowDropdown(false)}>Scheduler</Link>
                                    <Link to="/shopping-list" style={dropdownItem} onClick={() => setShowDropdown(false)}>Shopping List</Link>
                                    <Link to="/search" style={dropdownItem} onClick={() => setShowDropdown(false)}>Search Users</Link>
                                </div>
                            )}
                        </div>
                        <button onClick={handleLogout} style={{ ...linkStyle, color: '#dc3545' }}>
                            Log Out
                        </button>
                    </>
                ) : (
                    <>
                        <Link to="/signup" style={linkStyle}>Sign Up</Link>
                        <Link to="/login" style={linkStyle}>Log In</Link>
                    </>
                )}
            </div>

            {currentUser && (
                <p style={userInfo}>
                    Logged in as: <strong>{currentUser.username || currentUser.email}</strong>
                </p>
            )}
        </nav>
    );
};

const navContainer = {
    padding: '10px 20px',
    backgroundColor: '#f8f9fa',
    borderBottom: '1px solid #ddd',
    marginBottom: '20px'
};

const navRow = {
    display: 'flex',
    gap: '15px',
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap'
};

const linkStyle = {
    color: '#007BFF',
    textDecoration: 'none',
    fontWeight: '500',
    fontSize: '0.95rem'
};

const buttonStyle = {
    background: 'none',
    border: 'none',
    color: '#007BFF',
    cursor: 'pointer',
    fontWeight: '500',
    fontSize: '0.95rem'
};

const dropdownStyle = {
    position: 'absolute',
    top: '30px',
    left: 0,
    backgroundColor: '#fff',
    border: '1px solid #ccc',
    borderRadius: '6px',
    boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
    zIndex: 1000,
    minWidth: '150px'
};

const dropdownItem = {
    display: 'block',
    padding: '8px 12px',
    color: '#333',
    textDecoration: 'none',
    fontSize: '0.9rem',
    borderBottom: '1px solid #eee'
};

const userInfo = {
    textAlign: 'center',
    fontSize: '0.85rem',
    color: '#555',
    marginTop: '8px'
};

export default Navigation;
