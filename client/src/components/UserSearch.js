import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { followUser, unfollowUser } from '../api/userApi';
import { Link } from 'react-router-dom';

const UserSearch = () => {
    const { currentUser } = useAuth();
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [followingMap, setFollowingMap] = useState({});

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!query.trim() || !currentUser) return;

        setLoading(true);
        setError('');
        try {
            const res = await fetch(`/api/users/search?q=${encodeURIComponent(query)}`);
            const data = await res.json();
            setResults(data);

            const map = {};
            data.forEach((user) => {
                map[user._id] = user.followers?.includes(currentUser.mongoId);
            });
            setFollowingMap(map);
        } catch (err) {
            setError('Something went wrong.');
        } finally {
            setLoading(false);
        }
    };

    const handleFollowToggle = async (userId) => {
        const isFollowing = followingMap[userId];
        try {
            if (isFollowing) {
                await unfollowUser(userId, currentUser.mongoId);
            } else {
                await followUser(userId, currentUser.mongoId);
            }
            setFollowingMap((prev) => ({ ...prev, [userId]: !isFollowing }));
        } catch (err) {
            console.error('Follow/unfollow failed:', err);
        }
    };

    if (!currentUser) return <p className="text-center text-gray-500">Loading user...</p>;

    return (
        <div className="max-w-md mx-auto p-4 border rounded shadow bg-white">
            <h2 className="text-xl font-bold mb-2">Search Users</h2>
            <form onSubmit={handleSearch} className="flex space-x-2 mb-4">
                <input
                    type="text"
                    placeholder="Search by username"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="flex-grow p-2 border rounded"
                />
                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Search</button>
            </form>

            {loading && <p>Searching...</p>}
            {error && <p className="text-red-500">{error}</p>}

            <ul className="space-y-2">
                {results.map((user) => (
                    <li key={user._id} className="p-2 border rounded bg-gray-100">
                        <p className="font-semibold">{user.username}</p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                        <div className="mt-2 flex gap-2">
                            {user.email !== currentUser.email && (
                                <button
                                    onClick={() => handleFollowToggle(user._id)}
                                    className={`px-3 py-1 rounded text-white ${followingMap[user._id] ? 'bg-red-500' : 'bg-green-600'}`}
                                >
                                    {followingMap[user._id] ? 'Unfollow' : 'Follow'}
                                </button>
                            )}
                            <Link
                                to={`/user/${user.username}`}
                                className="px-3 py-1 rounded bg-blue-500 text-white hover:bg-blue-600 text-sm"
                            >
                                View Profile
                            </Link>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default UserSearch;
