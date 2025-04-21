export async function followUser(userId, currentUserId) {
    const response = await fetch(`/api/users/${userId}/follow`, {
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
    const response = await fetch(`/api/users/${userId}/unfollow`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentUserId }),
    });
    if (!response.ok) {
        throw new Error('Failed to unfollow user');
    }
    return response.json();
}
