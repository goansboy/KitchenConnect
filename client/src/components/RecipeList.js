import React, { useEffect, useState } from 'react';
import { getAllRecipes, deleteRecipe, updateRecipe } from '../api/recipeApi';

const RecipeList = () => {
    const [recipes, setRecipes] = useState([]);
    const [currentlyEditing, setCurrentlyEditing] = useState(null);
    const [editFormData, setEditFormData] = useState({});

    useEffect(() => {
        const fetchRecipes = async () => {
            const data = await getAllRecipes();
            setRecipes(data);
        };
        fetchRecipes();
    }, []);

    const handleEditClick = (recipe) => {
        setCurrentlyEditing(recipe._id);
        setEditFormData({
            title: recipe.title,
            description: recipe.description,
            ingredients: recipe.ingredients.join(', '),
            steps: recipe.steps.join(', '),
            cookTime: recipe.cookTime,
            prepTime: recipe.prepTime,
            servings: recipe.servings,
        });
    };

    const handleEditChange = (e) => {
        setEditFormData({ ...editFormData, [e.target.name]: e.target.value });
    };

    const handleUpdateSubmit = async (e, id) => {
        e.preventDefault();
        const updatedData = {
            ...editFormData,
            ingredients: editFormData.ingredients.split(',').map((i) => i.trim()),
            steps: editFormData.steps.split(',').map((s) => s.trim()),
        };
        const updated = await updateRecipe(id, updatedData);
        setRecipes((prev) =>
            prev.map((r) => (r._id === id ? updated : r))
        );
        setCurrentlyEditing(null);
    };

    return (
        <div className="max-w-4xl mx-auto p-4 space-y-4">
            <h2 className="text-2xl font-bold text-center">All Recipes</h2>
            {recipes.length === 0 ? (
                <p className="text-center text-gray-500">No recipes found.</p>
            ) : (
                <div className="grid gap-4 sm:grid-cols-2">
                    {recipes.map((recipe) => (
                        <div key={recipe._id} className="border rounded-lg p-4 shadow bg-white">
                            {currentlyEditing === recipe._id ? (
                                <form onSubmit={(e) => handleUpdateSubmit(e, recipe._id)} className="space-y-2">
                                    {['title', 'description', 'ingredients', 'steps', 'cookTime', 'prepTime', 'servings'].map((field) => (
                                        <div key={field}>
                                            <label className="block text-sm capitalize">{field}</label>
                                            <input
                                                type="text"
                                                name={field}
                                                value={editFormData[field]}
                                                onChange={handleEditChange}
                                                className="w-full p-2 border rounded"
                                            />
                                        </div>
                                    ))}
                                    <div className="flex gap-2">
                                        <button type="submit" className="bg-blue-600 text-white px-3 py-1 rounded">Save</button>
                                        <button type="button" className="text-gray-600" onClick={() => setCurrentlyEditing(null)}>Cancel</button>
                                    </div>
                                </form>
                            ) : (
                                <>
                                    <h3 className="text-xl font-semibold">{recipe.title}</h3>
                                    <p className="text-gray-600">{recipe.description}</p>
                                    <p><strong>Cook Time:</strong> {recipe.cookTime}</p>
                                    <p><strong>Prep Time:</strong> {recipe.prepTime}</p>
                                    <p><strong>Servings:</strong> {recipe.servings}</p>

                                    <div className="mt-2">
                                        <p><strong>Ingredients:</strong></p>
                                        <ul className="list-disc list-inside">
                                            {recipe.ingredients.map((item, index) => (
                                                <li key={index}>{item}</li>
                                            ))}
                                        </ul>
                                    </div>

                                    <div className="mt-2">
                                        <p><strong>Steps:</strong></p>
                                        <ol className="list-decimal list-inside">
                                            {recipe.steps.map((step, index) => (
                                                <li key={index}>{step}</li>
                                            ))}
                                        </ol>
                                    </div>

                                    <div className="flex gap-4 mt-2">
                                        <button
                                            className="text-blue-600 hover:underline"
                                            onClick={() => handleEditClick(recipe)}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            className="text-red-600 hover:underline"
                                            onClick={async () => {
                                                if (window.confirm('Are you sure you want to delete this recipe?')) {
                                                    await deleteRecipe(recipe._id);
                                                    setRecipes((prev) => prev.filter((r) => r._id !== recipe._id));
                                                }
                                            }}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default RecipeList;
