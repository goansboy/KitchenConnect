import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { addIngredientsToShoppingList } from '../api/shoppingListApi';

const RecipeDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { currentUser } = useAuth();
    const [recipe, setRecipe] = useState(null);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');

    useEffect(() => {
        const fetchRecipe = async () => {
            try {
                const res = await fetch(`${process.env.REACT_APP_API_URL}/api/recipes/${id}`);
                const data = await res.json();
                setRecipe(data);
            } catch (err) {
                console.error('Failed to load recipe:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchRecipe();
    }, [id]);

    const handleAddToShoppingList = async () => {
        if (!currentUser?.mongoId) return alert('User ID not found.');
        try {
            await addIngredientsToShoppingList(currentUser.mongoId, recipe.ingredients);
            setMessage('✅ Ingredients added to your shopping list!');
        } catch (err) {
            console.error('Error adding ingredients:', err);
            setMessage('❌ Failed to add ingredients.');
        }
    };

    const handleCloneRecipe = async () => {
        if (!currentUser?.mongoId) return alert('You must be logged in.');

        try {
            const res = await fetch(`${process.env.REACT_APP_API_URL}/api/recipes/clone/${recipe._id}`, {
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

    if (loading) return <p style={{ textAlign: 'center' }}>Loading...</p>;
    if (!recipe) return <p style={{ textAlign: 'center', color: 'red' }}>Recipe not found.</p>;

    return (
        <div style={{ maxWidth: '700px', margin: '0 auto', padding: '20px' }}>
            <button onClick={() => navigate('/my-recipes')} style={{ marginBottom: '20px' }}>
                ← Back to My Recipes
            </button>

            <div style={{
                border: '1px solid #ddd',
                borderRadius: '10px',
                padding: '20px',
                background: '#fff'
            }}>
                <h2 style={{ fontSize: '2rem', marginBottom: '10px' }}>{recipe.title}</h2>

                <div style={{ fontSize: '0.9rem', color: '#555', marginBottom: '10px' }}>
                    Posted by{' '}
                    <Link to={`/user/${recipe.createdBy?.username || ''}`} style={{ color: '#1a73e8', textDecoration: 'none' }}>
                        {recipe.createdBy?.username || 'Unknown'}
                    </Link>{' '}
                    on {new Date(recipe.createdAt).toLocaleDateString()}
                </div>

                <p style={{ marginBottom: '10px' }}>{recipe.description}</p>
                <p><strong>Cook Time:</strong> {recipe.cookTime} mins</p>
                <p><strong>Prep Time:</strong> {recipe.prepTime} mins</p>
                <p><strong>Servings:</strong> {recipe.servings}</p>

                <div style={{ marginTop: '20px' }}>
                    <h3 style={{ fontWeight: 'bold' }}>Ingredients</h3>
                    <ul>
                        {recipe.ingredients.map((item, idx) => (
                            <li key={idx}>{item}</li>
                        ))}
                    </ul>
                </div>

                <div style={{ marginTop: '20px' }}>
                    <h3 style={{ fontWeight: 'bold' }}>Steps</h3>
                    <ol>
                        {recipe.steps.map((step, idx) => (
                            <li key={idx}>{step}</li>
                        ))}
                    </ol>
                </div>

                <div style={{ marginTop: '20px', display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                    <button
                        onClick={handleAddToShoppingList}
                        style={{
                            background: 'green',
                            color: 'white',
                            padding: '10px 16px',
                            border: 'none',
                            borderRadius: '5px',
                            cursor: 'pointer'
                        }}
                    >
                        Add Ingredients to Shopping List
                    </button>

                    {currentUser?.mongoId !== recipe.createdBy?._id && (
                        <button
                            onClick={handleCloneRecipe}
                            style={{
                                background: '#ff9800',
                                color: 'white',
                                padding: '10px 16px',
                                border: 'none',
                                borderRadius: '5px',
                                cursor: 'pointer'
                            }}
                        >
                            Save to My Recipes
                        </button>
                    )}
                </div>

                {message && (
                    <p style={{ marginTop: '15px', textAlign: 'center', color: '#1a73e8' }}>
                        {message}
                    </p>
                )}
            </div>
        </div>
    );
};

export default RecipeDetail;
