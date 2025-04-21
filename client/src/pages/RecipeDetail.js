import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
                const res = await fetch(`/api/recipes/${id}`);
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

    if (loading) return <p className="text-center">Loading...</p>;
    if (!recipe) return <p className="text-center text-red-600">Recipe not found.</p>;

    return (
        <div className="max-w-2xl mx-auto p-4">
            <button
                onClick={() => navigate('/my-recipes')}
                className="mb-4 text-blue-600 hover:underline"
            >
                ← Back to My Recipes
            </button>

            <h2 className="text-3xl font-bold mb-2">{recipe.title}</h2>

            <div className="text-sm text-gray-600 mb-2">
                Posted by{' '}
                <span className="font-medium">
                    <a
                        href={`/user/${recipe.createdBy?.username || ''}`}
                        className="text-blue-600 hover:underline"
                    >
                        {recipe.createdBy?.username || recipe.userEmail}
                    </a>
                </span>{' '}
                on {new Date(recipe.createdAt).toLocaleDateString()}
            </div>

            <p className="text-gray-700 mb-2">{recipe.description}</p>
            <p><strong>Cook Time:</strong> {recipe.cookTime}</p>
            <p><strong>Prep Time:</strong> {recipe.prepTime}</p>
            <p><strong>Servings:</strong> {recipe.servings}</p>

            <div className="mt-4">
                <h3 className="font-semibold">Ingredients</h3>
                <ul className="list-disc list-inside">
                    {recipe.ingredients.map((item, idx) => (
                        <li key={idx}>{item}</li>
                    ))}
                </ul>
            </div>

            <div className="mt-4">
                <h3 className="font-semibold">Steps</h3>
                <ol className="list-decimal list-inside">
                    {recipe.steps.map((step, idx) => (
                        <li key={idx}>{step}</li>
                    ))}
                </ol>
            </div>

            <button
                onClick={handleAddToShoppingList}
                className="mt-6 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
                Add Ingredients to Shopping List
            </button>

            {message && <p className="mt-3 text-center text-sm text-blue-600">{message}</p>}
        </div>
    );
};

export default RecipeDetail;
