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
        if (!query.trim()) return;

        setLoading(true);
        setError('');
        try {
            const res = await fetch(`${process.env.REACT_APP_API_URL}/api/users/search?q=${encodeURIComponent(query)}`);
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

    return (
        <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px', backgroundColor: '#fff', border: '1px solid #ddd', borderRadius: '8px' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '16px', textAlign: 'center' }}>Find Other Cooks</h2>

            <form onSubmit={handleSearch} style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
                <input
                    type="text"
                    placeholder="Search by username"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    style={{ flex: 1, padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                />
                <button type="submit" style={{ padding: '8px 16px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px' }}>
                    Search
                </button>
            </form>

            {loading && <p style={{ fontSize: '0.9rem', color: '#555' }}>Searching...</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}

            <ul style={{ listStyle: 'none', padding: 0 }}>
                {results.map((user) => (
                    <li key={user._id} style={{ padding: '12px', border: '1px solid #eee', borderRadius: '6px', marginBottom: '12px', backgroundColor: '#f9f9f9' }}>
                        <p style={{ fontWeight: '600', marginBottom: '4px' }}>{user.username}</p>
                        <p style={{ fontSize: '0.9rem', color: '#666' }}>{user.email}</p>
                        <div style={{ marginTop: '8px', display: 'flex', gap: '10px' }}>
                            {user._id !== currentUser?.mongoId && (
                                <button
                                    onClick={() => handleFollowToggle(user._id)}
                                    style={{
                                        padding: '6px 12px',
                                        borderRadius: '4px',
                                        border: 'none',
                                        color: 'white',
                                        backgroundColor: followingMap[user._id] ? '#dc3545' : '#28a745',
                                        cursor: 'pointer',
                                    }}
                                >
                                    {followingMap[user._id] ? 'Unfollow' : 'Follow'}
                                </button>
                            )}
                            <Link
                                to={`/user/${user.username}`}
                                style={{
                                    padding: '6px 12px',
                                    backgroundColor: '#007bff',
                                    color: 'white',
                                    borderRadius: '4px',
                                    textDecoration: 'none',
                                    fontSize: '0.9rem'
                                }}
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
