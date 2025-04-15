import React, { useState } from 'react';

const SearchUsers = () => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!query.trim()) return;

        setLoading(true);
        setError('');
        try {
            const res = await fetch(`/api/users/search?q=${encodeURIComponent(query)}`);
            const data = await res.json();
            setResults(data);
        } catch (err) {
            setError('Something went wrong.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-4 space-y-4">
            <h2 className="text-2xl font-bold text-center">Find Other Cooks</h2>

            <form onSubmit={handleSearch} className="flex space-x-2">
                <input
                    type="text"
                    placeholder="Search by username..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="flex-grow p-2 border rounded"
                />
                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
                    Search
                </button>
            </form>

            {loading && <p className="text-gray-500">Searching...</p>}
            {error && <p className="text-red-500">{error}</p>}

            {results.length > 0 && (
                <ul className="space-y-3">
                    {results.map((user) => (
                        <li key={user._id} className="p-3 border rounded shadow bg-white">
                            <p className="font-semibold">{user.username}</p>
                            <p className="text-sm text-gray-500">{user.email}</p>
                            {/* Follow button will go here */}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default SearchUsers;
