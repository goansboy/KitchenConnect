const API_BASE_URL = 'http://localhost:5000/api/recipes';

export async function getAllRecipes() {
    const response = await fetch(API_BASE_URL);
    return response.json();
}

export async function createRecipe(recipeData) {
    const response = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(recipeData),
    });
    return response.json();
}

export async function deleteRecipe(id) {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'DELETE',
    });
    return response.json();
}

export async function updateRecipe(id, recipeData) {
    const response = await fetch(`http://localhost:5000/api/recipes/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(recipeData),
    });

    if (!response.ok) {
        throw new Error('Failed to update recipe');
    }

    return response.json();
}

export const getMyRecipes = async (email) => {
    const res = await fetch(`${API_BASE_URL}?userEmail=${email}`);
    return res.json();
};



