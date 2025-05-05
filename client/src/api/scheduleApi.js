const API_BASE_URL = 'http://localhost:5000/api/schedule';

export async function addRecipeToSchedule(userId, day, recipeId) {
    const res = await fetch(`${API_BASE_URL}/add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, day, recipeId }),
    });

    if (!res.ok) throw new Error('Failed to add to schedule');
    return res.json();
}


export async function getSchedule(userId) {
    const res = await fetch(`${API_BASE_URL}?userId=${userId}`);
    if (!res.ok) throw new Error('Failed to fetch schedule');
    return res.json();
}


export async function removeRecipeFromSchedule(userId, day, recipeId) {
    const res = await fetch(`${API_BASE_URL}/remove`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, day, recipeId }),
    });

    if (!res.ok) throw new Error('Failed to remove recipe from schedule');
    return res.json();
}

