import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getAllRecipes } from '../api/recipeApi';
import { addRecipeToSchedule, getSchedule } from '../api/scheduleApi';

const Scheduler = () => {
    const { currentUser } = useAuth();
    const [userRecipes, setUserRecipes] = useState([]);
    const [selectedRecipeId, setSelectedRecipeId] = useState('');
    const [selectedDay, setSelectedDay] = useState('Monday');
    const [scheduled, setScheduled] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');

    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    useEffect(() => {
        const fetchRecipes = async () => {
            if (!currentUser?.mongoId) return;
            try {
                const data = await getAllRecipes();
                const myRecipes = data.filter((r) => r.createdBy?.toString() === currentUser.mongoId);
                setUserRecipes(myRecipes);
            } catch (err) {
                console.error('Failed to fetch recipes:', err);
            }
        };

        fetchRecipes();
    }, [currentUser]);

    useEffect(() => {
        const fetchSchedule = async () => {
            try {
                const data = await getSchedule(currentUser.mongoId);
                setScheduled(data.schedule || []);
            } catch (err) {
                console.error('Failed to load schedule:', err);
            } finally {
                setLoading(false);
            }
        };

        if (currentUser?.mongoId) {
            fetchSchedule();
        }
    }, [currentUser]);

    const handleSchedule = async () => {
        if (!selectedRecipeId) {
            setMessage('Please select a recipe.');
            setTimeout(() => setMessage(''), 3000);
            return;
        }

        try {
            await addRecipeToSchedule(currentUser.mongoId, selectedDay, selectedRecipeId);
            const updatedSchedule = await getSchedule(currentUser.mongoId);
            setScheduled(updatedSchedule.schedule || []);
            setMessage('✅ Recipe scheduled!');
            setSelectedRecipeId('');
            setSelectedDay('Monday');
        } catch (err) {
            console.error(err);
            setMessage('❌ Failed to schedule recipe.');
        } finally {
            setTimeout(() => setMessage(''), 3000);
        }
    };

    return (
        <div style={container}>
            <h2 style={heading}>Meal Scheduler</h2>

            <div style={formRow}>
                <select
                    value={selectedRecipeId}
                    onChange={(e) => setSelectedRecipeId(e.target.value)}
                    style={selectStyle}
                >
                    <option value="">Select a recipe</option>
                    {userRecipes.map((recipe) => (
                        <option key={recipe._id} value={recipe._id}>
                            {recipe.title}
                        </option>
                    ))}
                </select>

                <select
                    value={selectedDay}
                    onChange={(e) => setSelectedDay(e.target.value)}
                    style={selectStyle}
                >
                    {days.map((day) => (
                        <option key={day} value={day}>{day}</option>
                    ))}
                </select>

                <button onClick={handleSchedule} style={buttonStyle}>
                    Schedule
                </button>
            </div>

            {message && (
                <p style={{ textAlign: 'center', color: '#007BFF', fontSize: '0.9rem', marginTop: '10px' }}>{message}</p>
            )}

            <div style={{ marginTop: '30px' }}>
                {days.map((day) => {
                    const recipesForDay = scheduled.find((entry) => entry.day === day)?.recipes || [];
                    return (
                        <div key={day} style={dayBox}>
                            <h3 style={dayTitle}>{day}</h3>
                            {recipesForDay.length === 0 ? (
                                <p style={{ color: '#666' }}>No recipes scheduled.</p>
                            ) : (
                                <ul style={{ listStyleType: 'disc', paddingLeft: '20px' }}>
                                    {recipesForDay.map((recipe) => (
                                        <li key={recipe._id} style={listItemStyle}>
                                            {recipe.title}
                                            <button
                                                onClick={async () => {
                                                    try {
                                                        const res = await fetch(`${process.env.REACT_APP_API_URL}/api/schedule/remove`, {
                                                            method: 'DELETE',
                                                            headers: { 'Content-Type': 'application/json' },
                                                            body: JSON.stringify({
                                                                userId: currentUser.mongoId,
                                                                day,
                                                                recipeId: recipe._id,
                                                            }),
                                                        });

                                                        if (!res.ok) throw new Error('Failed to remove recipe');

                                                        const updated = await getSchedule(currentUser.mongoId);
                                                        setScheduled(updated.schedule || []);
                                                    } catch (err) {
                                                        console.error('Failed to remove recipe from schedule:', err);
                                                    }
                                                }}
                                                style={removeBtn}
                                            >
                                                Remove
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

const container = {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '20px'
};

const heading = {
    fontSize: '2rem',
    textAlign: 'center',
    marginBottom: '20px'
};

const formRow = {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '12px',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: '10px'
};

const selectStyle = {
    padding: '8px',
    borderRadius: '6px',
    border: '1px solid #ccc',
    minWidth: '160px'
};

const buttonStyle = {
    backgroundColor: '#007BFF',
    color: 'white',
    padding: '8px 16px',
    borderRadius: '6px',
    border: 'none',
    cursor: 'pointer'
};

const dayBox = {
    backgroundColor: '#fff',
    border: '1px solid #ddd',
    borderRadius: '8px',
    padding: '16px',
    marginBottom: '16px',
    boxShadow: '0 2px 5px rgba(0,0,0,0.05)'
};

const dayTitle = {
    fontSize: '1.25rem',
    fontWeight: 'bold',
    marginBottom: '8px'
};

const listItemStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '6px'
};

const removeBtn = {
    color: '#dc3545',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    marginLeft: '12px',
    fontSize: '0.85rem'
};

export default Scheduler;
