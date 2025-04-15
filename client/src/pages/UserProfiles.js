import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const UserProfile = () => {
    const { username } = useParams();
    const [user, setUser] = useState(null);
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const res = await fetch(`/api/users/profile/${username}`);
                const data = await res.json();
                setUser(data.user);
                setRecipes(data.recipes);
            } catch (err) {
                console.error('Failed to fetch user profile:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchUserProfile();
    }, [username]);

    if (loading) return <p className="text-center">Loading profile...</p>;
    if (!user) return <p className="text-center text-red-600">User not found.</p>;

    return (
        <div className="max-w-3xl mx-auto p-4 space-y-4">
            <div className="border-b pb-4">
                <h2 className="text-3xl font-bold">{user.username}</h2>
                <p className="text-gray-600">{user.email}</p>
            </div>

            <div>
                <h3 className="text-2xl font-semibold mb-2">Recipes by {user.username}</h3>
                {recipes.length === 0 ? (
                    <p className="text-gray-500">No recipes yet.</p>
                ) : (
                    <ul className="space-y-3">
                        {recipes.map((recipe) => (
                            <li key={recipe._id} className="p-3 border rounded bg-white shadow">
                                <h4 className="text-lg font-bold">{recipe.title}</h4>
                                <p className="text-sm text-gray-600">{recipe.description}</p>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default UserProfile;