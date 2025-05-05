const API_BASE_URL = 'http://localhost:5000/api/shopping-list';

//Add Ingredients to shopping list
export async function addIngredientsToShoppingList(userId, ingredients) {
    const response = await fetch(`${API_BASE_URL}/add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, ingredients }),
    });

    if (!response.ok) {
        throw new Error('Failed to add ingredients to shopping list');
    }

    return response.json();
}


// Get the current shopping list for the user
export async function getShoppingList(userId) {
    const res = await fetch(`${API_BASE_URL}?userId=${userId}`);
    if (!res.ok) throw new Error('Failed to fetch shopping list');
    return res.json();
}


// Toggle checked status of an item
export async function toggleItemChecked(itemId, checked) {
    const res = await fetch(`${API_BASE_URL}/${itemId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ checked }),
    });

    if (!res.ok) throw new Error('Failed to update item');
    return res.json();
}


// Delete an item from the list
export async function deleteShoppingItem(itemId) {
    const res = await fetch(`${API_BASE_URL}/${itemId}`, {
        method: 'DELETE',
    });

    if (!res.ok) throw new Error('Failed to delete item');
    return res.json();
}

