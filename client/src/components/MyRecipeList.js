import React, { useEffect, useState } from 'react';
import { getMyRecipes } from '../api/recipeApi';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';


const MyRecipeList = () => {
    const { currentUser } = useAuth();
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMyRecipes = async () => {
            if (!currentUser) return;
            try {
                const data = await getMyRecipes(currentUser.email);
                setRecipes(data);
            } catch (err) {
                console.error('Error fetching recipes:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchMyRecipes();
    }, [currentUser]);

    return (
        <div className="max-w-4xl mx-auto p-4 space-y-4">
            <h2 className="text-2xl font-bold text-center">My Recipes</h2>

            {loading ? (
                <p className="text-center text-gray-500">Loading...</p>
            ) : recipes.length === 0 ? (
                <p className="text-center text-gray-500">You haven’t added any recipes yet.</p>
            ) : (
                <div className="grid gap-4 sm:grid-cols-2">
                    {recipes.map((recipe) => (
                        <div key={recipe._id} className="border rounded-lg p-4 shadow bg-white">
                            <h3 className="text-xl font-semibold">{recipe.title}</h3>
                            <p className="text-gray-600">{recipe.description}</p>
                            <Link
                                to={`/recipes/${recipe._id}`}
                                className="inline-block mt-2 text-blue-600 hover:underline"
                            >
                                View
                            </Link>

                            
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyRecipeList;
