export async function followUser(userId) {
    const response = await fetch(`/api/users/follow/${userId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
    });
    return response.json();
}

export async function unfollowUser(userId) {
    const response = await fetch(`/api/users/unfollow/${userId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
    });
    return response.json();
}
