import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import RecipeCard from '../components/RecipeCard'; 

const Feed = () => {
    const { currentUser } = useAuth();
    const [recipes, setRecipes] = useState([]);

    useEffect(() => {
        const fetchFeed = async () => {
            try {
                console.log("Fetching feed for MongoID:", currentUser?.mongoId);
                const res = await fetch(`${process.env.REACT_APP_API_URL}/api/recipes/feed/${currentUser.mongoId}`);

                const data = await res.json();
                setRecipes(data);
            } catch (err) {
                console.error('Error fetching feed:', err);
            }
        };

        if (currentUser?.mongoId) {
            fetchFeed();
        }
    }, [currentUser]);

    return (
        <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '20px' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: 'bold', textAlign: 'center', marginBottom: '20px' }}>
                Your Recipe Feed
            </h2>

            {recipes.length === 0 ? (
                <p style={{ textAlign: 'center', color: '#777' }}>
                    No recipes from followed users yet.
                </p>
            ) : (
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '20px'
                    }}>
                        {recipes.map((recipe) => (
                            <RecipeCard key={recipe._id} recipe={recipe} />
                        ))}
                    </div>

            )}
        </div>
    );
};

export default Feed;
