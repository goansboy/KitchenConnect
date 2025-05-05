import React, { useEffect, useState } from 'react';
import { getMyRecipes, deleteRecipe } from '../api/recipeApi';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import RecipeForm from '../components/RecipeForm';

const MyRecipeList = () => {
    const { currentUser } = useAuth();
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingRecipe, setEditingRecipe] = useState(null);

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

    useEffect(() => {
        fetchMyRecipes();
    }, [currentUser]);

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this recipe?')) {
            await deleteRecipe(id);
            fetchMyRecipes(); // refresh list
        }
    };

    const handleEdit = (recipe) => {
        setEditingRecipe(recipe);
        setShowModal(true);
    };

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
            <h2 style={{ textAlign: 'center' }}>My Recipes</h2>

            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                <button
                    onClick={() => {
                        setEditingRecipe(null);
                        setShowModal(true);
                    }}
                    style={{
                        padding: '10px 20px',
                        backgroundColor: '#4CAF50',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer'
                    }}
                >
                    Add Recipe
                </button>
            </div>

            {/* Modal */}
            {showModal && (
                <div style={{
                    position: 'fixed', top: 0, left: 0,
                    width: '100%', height: '100%',
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    display: 'flex', justifyContent: 'center', alignItems: 'center',
                    zIndex: 1000
                }}>
                    <div style={{
                        backgroundColor: 'white',
                        padding: '20px',
                        borderRadius: '8px',
                        width: '90%',
                        maxWidth: '500px',
                        position: 'relative'
                    }}>
                        <button
                            onClick={() => setShowModal(false)}
                            style={{
                                position: 'absolute',
                                top: '10px',
                                right: '10px',
                                background: 'transparent',
                                border: 'none',
                                fontSize: '1.2rem',
                                cursor: 'pointer'
                            }}
                        >
                            &times;
                        </button>
                        <RecipeForm
                            initialData={editingRecipe}
                            onSuccess={() => {
                                fetchMyRecipes();
                                setShowModal(false);
                            }}
                        />
                    </div>
                </div>
            )}

            {loading ? (
                <p style={{ textAlign: 'center', color: '#777' }}>Loading...</p>
            ) : recipes.length === 0 ? (
                <p style={{ textAlign: 'center', color: '#777' }}>You haven’t added any recipes yet.</p>
            ) : (
                <div style={{ display: 'grid', gap: '20px', gridTemplateColumns: '1fr 1fr' }}>
                    {recipes.map((recipe) => (
                        <div key={recipe._id} style={{ border: '1px solid #ccc', padding: '16px', borderRadius: '8px' }}>
                            <h3>{recipe.title}</h3>
                            <p>{recipe.description}</p>
                            <Link to={`/recipes/${recipe._id}`} style={{ color: '#007BFF' }}>View</Link>
                            <div style={{ marginTop: '10px' }}>
                                <button
                                    onClick={() => handleEdit(recipe)}
                                    style={{
                                        marginRight: '10px',
                                        padding: '6px 12px',
                                        backgroundColor: '#007BFF',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '4px',
                                        cursor: 'pointer'
                                    }}
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(recipe._id)}
                                    style={{
                                        padding: '6px 12px',
                                        backgroundColor: '#dc3545',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '4px',
                                        cursor: 'pointer'
                                    }}
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyRecipeList;
