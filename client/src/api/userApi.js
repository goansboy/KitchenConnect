const API_BASE_URL = 'http://localhost:5000/api/users';

export async function followUser(userId, currentUserId) {
    const response = await fetch(`${API_BASE_URL}/${userId}/follow`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentUserId }),
    });
    if (!response.ok) {
        throw new Error('Failed to follow user');
    }
    return response.json();
}


export async function unfollowUser(userId, currentUserId) {
    const response = await fetch(`${API_BASE_URL}/${userId}/unfollow`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentUserId }),
    });
    if (!response.ok) {
        throw new Error('Failed to unfollow user');
    }
    return response.json();
}

