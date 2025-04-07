import React, { useState } from 'react';
import { createRecipe } from '../api/recipeApi';
import { useAuth } from '../contexts/AuthContext';


const RecipeForm = () => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        ingredients: '',
        steps: '',
        cookTime: '',
        prepTime: '',
        servings: ''
    });

    const { currentUser } = useAuth(); //Get the logged-in user

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const recipe = {
            ...formData,
            ingredients: formData.ingredients.split(',').map(i => i.trim()),
            steps: formData.steps.split(',').map(s => s.trim()),
            userEmail: currentUser.email,
        };
        await createRecipe(recipe);
        alert('Recipe created!');
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-4 p-4">
            <h2 className="text-xl font-bold">Create a Recipe</h2>
            {['title', 'description', 'ingredients', 'steps', 'cookTime', 'prepTime', 'servings'].map((field) => (
                <div key={field}>
                    <label className="block capitalize">{field}</label>
                    <input
                        type="text"
                        name={field}
                        value={formData[field]}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                        placeholder={field === 'ingredients' || field === 'steps' ? 'Separate with commas' : ''}
                    />
                </div>
            ))}
            <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">Submit</button>
        </form>
    );
};

export default RecipeForm;
