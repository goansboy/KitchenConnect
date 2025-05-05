import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { addIngredientsToShoppingList } from '../api/shoppingListApi';
import { useAuth } from '../contexts/AuthContext';

const UserProfile = () => {
    const { username } = useParams();
    const { currentUser } = useAuth();
    const [user, setUser] = useState(null);
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const res = await fetch(`${process.env.REACT_APP_API_URL}/api/users/profile/${username}`);
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

    const handleAddToShoppingList = async (ingredients) => {
        if (!currentUser?.mongoId) return alert('You must be logged in.');

        try {
            await addIngredientsToShoppingList(currentUser.mongoId, ingredients);
            setMessage('✅ Ingredients added to your shopping list!');
        } catch (err) {
            console.error('Error adding ingredients:', err);
            setMessage('❌ Failed to add ingredients.');
        }
    };

    const handleCloneRecipe = async (recipeId) => {
        if (!currentUser?.mongoId) return alert('You must be logged in.');

        try {
            const res = await fetch(`${process.env.REACT_APP_API_URL}/api/recipes/clone/${recipeId}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    mongoId: currentUser.mongoId,
                    userEmail: currentUser.email
                })
            });

            if (!res.ok) throw new Error();
            setMessage('✅ Recipe saved to My Recipes!');
        } catch (err) {
            console.error('Error cloning recipe:', err);
            setMessage('❌ Failed to save recipe.');
        }
    };

    if (loading) return <p style={{ textAlign: 'center' }}>Loading profile...</p>;
    if (!user) return <p style={{ textAlign: 'center', color: 'red' }}>User not found.</p>;

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
            {/* Back Link */}
            <div style={{ marginBottom: '20px' }}>
                <Link to="/search" style={{ textDecoration: 'none', color: '#333' }}>
                    ← Back to Search
                </Link>
            </div>

            {/* User Header */}
            <div style={{ borderBottom: '1px solid #ccc', paddingBottom: '12px', marginBottom: '24px' }}>
                <h2 style={{ fontSize: '2rem', margin: 0 }}>{user.username}</h2>
                <p style={{ color: '#666' }}>{user.email}</p>
            </div>

            {/* Recipes */}
            <div>
                <h3 style={{ fontSize: '1.5rem', marginBottom: '12px' }}>Recipes by {user.username}</h3>

                {recipes.length === 0 ? (
                    <p style={{ color: '#777' }}>No recipes yet.</p>
                ) : (
                    <ul style={{ listStyle: 'none', padding: 0 }}>
                        {recipes.map((recipe) => (
                            <li
                                key={recipe._id}
                                style={{
                                    border: '1px solid #ddd',
                                    borderRadius: '8px',
                                    padding: '16px',
                                    marginBottom: '16px',
                                    backgroundColor: '#f9f9f9'
                                }}
                            >
                                <h4 style={{ fontSize: '1.2rem', marginBottom: '4px' }}>{recipe.title}</h4>
                                <p style={{ marginBottom: '8px', color: '#555' }}>{recipe.description}</p>

                                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                                    <button
                                        onClick={() => navigate(`/recipes/${recipe._id}`)}
                                        style={{
                                            padding: '6px 12px',
                                            backgroundColor: '#007bff',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '4px',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        View Recipe
                                    </button>

                                    <button
                                        onClick={() => handleAddToShoppingList(recipe.ingredients)}
                                        style={{
                                            padding: '6px 12px',
                                            backgroundColor: '#28a745',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '4px',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        Add to Shopping List
                                    </button>

                                    <button
                                        onClick={() => handleCloneRecipe(recipe._id)}
                                        style={{
                                            padding: '6px 12px',
                                            backgroundColor: '#ff9800',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '4px',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        Save to My Recipes
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
                {message && (
                    <p
                        style={{
                            marginTop: '12px',
                            textAlign: 'center',
                            color: message.startsWith('✅') ? 'green' : 'red'
                        }}
                    >
                        {message}
                    </p>
                )}
            </div>
        </div>
    );
};

export default UserProfile;
