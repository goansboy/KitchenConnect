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
                console.log('Current user ID:', currentUser.mongoId);
                data.forEach((r) => {
                    console.log('Recipe:', r.title, '| createdBy:', r.createdBy);
                });
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


    return (
        <div className="max-w-4xl mx-auto p-4 space-y-6">
            <h2 className="text-3xl font-bold text-center">Meal Scheduler</h2>

            <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
                <select
                    value={selectedRecipeId}
                    onChange={(e) => setSelectedRecipeId(e.target.value)}
                    className="p-2 border rounded"
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
                    className="p-2 border rounded"
                >
                    {days.map((day) => (
                        <option key={day} value={day}>{day}</option>
                    ))}
                </select>

                <button
                    className="bg-blue-600 text-white px-4 py-2 rounded"
                    onClick={async () => {
                        if (!selectedRecipeId) {
                            setMessage('Please select a recipe.');
                            setTimeout(() => setMessage(''), 3000);
                            return;
                        }

                        try {
                            await addRecipeToSchedule(currentUser.mongoId, selectedDay, selectedRecipeId);

                            const updatedSchedule = await getSchedule(currentUser.mongoId);
                            setScheduled(updatedSchedule.schedule || []);

                            setMessage('Recipe scheduled!');
                            setSelectedRecipeId('');
                            setSelectedDay('Monday');
                        } catch (err) {
                            console.error(err);
                            setMessage('Failed to schedule recipe.');
                        } finally {
                            setTimeout(() => setMessage(''), 3000);
                        }
                    }}
                >
                    Schedule
                </button>

                {message && (
                    <p className="text-center text-green-600 mt-2">{message}</p>
                )}

            </div>

            <div className="mt-8 space-y-4">
                {days.map((day) => {
                    const recipesForDay = scheduled.find((entry) => entry.day === day)?.recipes || [];

                    return (
                        <div key={day} className="p-4 border rounded bg-white shadow">
                            <h3 className="text-xl font-bold mb-2">{day}</h3>
                            {recipesForDay.length === 0 ? (
                                <p className="text-gray-500">No recipes scheduled.</p>
                            ) : (
                                    <ul className="list-disc list-inside">
                                        {recipesForDay.map((recipe) => (
                                            <li key={recipe._id} className="flex items-center justify-between">
                                                <span>{recipe.title}</span>
                                                <button
                                                    onClick={async () => {
                                                        try {
                                                            const res = await fetch('/api/schedule/remove', {
                                                                method: 'DELETE',
                                                                headers: { 'Content-Type': 'application/json' },
                                                                body: JSON.stringify({
                                                                    userId: currentUser.mongoId,
                                                                    day,
                                                                    recipeId: recipe._id,
                                                                }),
                                                            });


                                                            if (!res.ok) throw new Error('Failed to remove recipe');

                                                            // Refetch updated schedule after deletion
                                                            const updated = await getSchedule(currentUser.mongoId);
                                                            setScheduled(updated.schedule || []);
                                                        } catch (err) {
                                                            console.error('Failed to remove recipe from schedule:', err);
                                                        }
                                                    }}
                                                    className="text-red-600 text-sm hover:underline ml-2"
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

export default Scheduler;
