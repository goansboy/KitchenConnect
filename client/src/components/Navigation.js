import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Navigation = () => {
    const { currentUser, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/login');
        } catch (err) {
            console.error('Logout failed:', err);
        }
    };

    return (
        <div className="flex flex-col items-center gap-2 pb-4">
            <div className="flex flex-wrap justify-center gap-4">
                <Link to="/" className="text-blue-600 hover:underline">Home</Link>

                {currentUser && (
                    <>
                        <Link to="/my-recipes" className="text-blue-600 hover:underline">My Recipes</Link>
                        <Link to="/search" className="text-blue-600 hover:underline">Search Users</Link>
                        <button onClick={handleLogout} className="text-red-600 hover:underline">
                            Log Out
                        </button>
                    </>
                )}

                {!currentUser && (
                    <>
                        <Link to="/signup" className="text-blue-600 hover:underline">Sign Up</Link>
                        <Link to="/login" className="text-blue-600 hover:underline">Log In</Link>
                    </>
                )}
            </div>

            
            {currentUser && (
                <p className="text-sm text-gray-600">
                    Logged in as: <span className="font-medium text-gray-800">
                        {currentUser.displayName || currentUser.email}
                    </span>
                </p>
            )}
        </div>
    );
};

export default Navigation;
