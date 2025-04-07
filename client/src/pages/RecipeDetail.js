import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const RecipeDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [recipe, setRecipe] = useState(null);
    const [loading, setLoading] = useState(true);

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
        </div>
    );
};

export default RecipeDetail;
