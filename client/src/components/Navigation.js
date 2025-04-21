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
        <div className="flex flex-col items-center gap-2 pb-4">
            <div className="flex flex-wrap justify-center gap-4">
                <Link to="/" className="text-blue-600 hover:underline">Home</Link>

                {currentUser && (
                    <>
                        <div className="relative inline-block text-left">
                            <button
                                onClick={() => setShowDropdown(prev => !prev)}
                                className="text-blue-600 hover:underline"
                            >
                                Dashboard ▼
                            </button>

                            {showDropdown && (
                                <div className="absolute z-10 mt-2 w-40 bg-white border rounded shadow-md">
                                    <Link
                                        to="/my-recipes"
                                        className="block px-4 py-2 hover:bg-gray-100 text-sm"
                                        onClick={() => setShowDropdown(false)}
                                    >
                                        My Recipes
                                    </Link>
                                    <Link
                                        to="/scheduler"
                                        className="block px-4 py-2 hover:bg-gray-100 text-sm"
                                        onClick={() => setShowDropdown(false)}
                                    >
                                        Scheduler
                                    </Link>
                                    <Link
                                        to="/shopping-list"
                                        className="block px-4 py-2 hover:bg-gray-100 text-sm"
                                        onClick={() => setShowDropdown(false)}
                                    >
                                        Shopping List
                                    </Link>

                                    <Link
                                        to="/search"
                                        className="block px-4 py-2 hover:bg-gray-100 text-sm"
                                        onClick={() => setShowDropdown(false)}
                                    >
                                        Search User
                                    </Link>
                                </div>
                            )}
                        </div>

                        

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
