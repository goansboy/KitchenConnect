import React, { useEffect, useState } from 'react';
import { getAllRecipes, deleteRecipe, updateRecipe } from '../api/recipeApi';
import { addIngredientsToShoppingList } from '../api/shoppingListApi';
import { useAuth } from '../contexts/AuthContext';

const RecipeList = () => {
    const { currentUser } = useAuth();
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
        setRecipes((prev) => prev.map((r) => (r._id === id ? updated : r)));
        setCurrentlyEditing(null);
    };

    const handleAddToShoppingList = async (ingredients) => {
        try {
            await addIngredientsToShoppingList(currentUser.mongoId, ingredients);
            alert('✅ Ingredients added to your shopping list!');
        } catch (err) {
            console.error('Failed to add ingredients:', err);
            alert('❌ Something went wrong.');
        }
    };

    return (
        <div className="max-w-5xl mx-auto p-6 space-y-6">
            <h2 className="text-3xl font-bold text-center">All Recipes</h2>

            {recipes.length === 0 ? (
                <p className="text-center text-gray-500">No recipes found.</p>
            ) : (
                <div className="space-y-4">
                    {recipes.map((recipe) => (
                        <div key={recipe._id} className="border rounded-lg p-4 shadow-sm bg-white">
                            {currentlyEditing === recipe._id ? (
                                <form onSubmit={(e) => handleUpdateSubmit(e, recipe._id)} className="space-y-3">
                                    {['title', 'description', 'ingredients', 'steps', 'cookTime', 'prepTime', 'servings'].map((field) => (
                                        <div key={field}>
                                            <label className="block text-sm font-medium capitalize mb-1">{field}</label>
                                            <input
                                                type="text"
                                                name={field}
                                                value={editFormData[field]}
                                                onChange={handleEditChange}
                                                className="w-full p-2 border rounded"
                                            />
                                        </div>
                                    ))}
                                    <div className="flex gap-3 mt-4">
                                        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
                                            Save
                                        </button>
                                        <button
                                            type="button"
                                            className="text-gray-600 underline"
                                            onClick={() => setCurrentlyEditing(null)}
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            ) : (
                                <>
                                    <h3 className="text-xl font-semibold text-gray-800">{recipe.title}</h3>
                                    <p className="text-gray-700 mb-1">{recipe.description}</p>
                                    <p className="text-sm text-gray-600">
                                        <strong>Cook:</strong> {recipe.cookTime} mins | <strong>Prep:</strong> {recipe.prepTime} mins | <strong>Servings:</strong> {recipe.servings}
                                    </p>

                                    <div className="mt-3">
                                        <h4 className="font-medium">Ingredients</h4>
                                        <ul className="list-disc list-inside text-sm text-gray-700">
                                            {recipe.ingredients.map((item, i) => (
                                                <li key={i}>{item}</li>
                                            ))}
                                        </ul>
                                    </div>

                                    <div className="mt-3">
                                        <h4 className="font-medium">Steps</h4>
                                        <ol className="list-decimal list-inside text-sm text-gray-700">
                                            {recipe.steps.map((step, i) => (
                                                <li key={i}>{step}</li>
                                            ))}
                                        </ol>
                                    </div>

                                    <div className="flex flex-wrap gap-4 mt-4">
                                        <button
                                            onClick={() => handleEditClick(recipe)}
                                            className="text-blue-600 hover:underline text-sm"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={async () => {
                                                if (window.confirm('Delete this recipe?')) {
                                                    await deleteRecipe(recipe._id);
                                                    setRecipes((prev) => prev.filter((r) => r._id !== recipe._id));
                                                }
                                            }}
                                            className="text-red-600 hover:underline text-sm"
                                        >
                                            Delete
                                        </button>
                                        <button
                                            onClick={() => handleAddToShoppingList(recipe.ingredients)}
                                            className="text-green-600 hover:underline text-sm"
                                        >
                                            Add to Shopping List
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
