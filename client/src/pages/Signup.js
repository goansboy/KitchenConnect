import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
    const { signup, currentUser } = useAuth();
    const navigate = useNavigate();

    const [form, setForm] = useState({
        email: '',
        password: '',
        username: '',
    });

    const [error, setError] = useState('');

    useEffect(() => {
        if (currentUser) {
            navigate('/');
        }
    }, [currentUser, navigate]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const userCred = await signup(form.email, form.password);
            const uid = userCred.user.uid;

            const payload = {
                uid,
                email: form.email,
                username: form.username,
            };

            console.log("Creating user with payload:", payload); // Log to debug

            const res = await fetch('/api/users/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Failed to create user in backend');
            }

            navigate('/');
        } catch (err) {
            console.error(err);
            setError(err.message || 'Failed to sign up');
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10 p-4 border rounded">
            <h2 className="text-xl font-bold mb-4">Sign Up</h2>
            {error && <p className="text-red-500 mb-2">{error}</p>}
            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    type="text"
                    name="username"
                    placeholder="Username"
                    onChange={handleChange}
                    value={form.username}
                    className="w-full p-2 border rounded"
                    required
                />
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    onChange={handleChange}
                    value={form.email}
                    className="w-full p-2 border rounded"
                    required
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    onChange={handleChange}
                    value={form.password}
                    className="w-full p-2 border rounded"
                    required
                />
                <button type="submit" className="w-full bg-green-600 text-white py-2 rounded">
                    Sign Up
                </button>
            </form>
        </div>
    );
};

export default Signup;
