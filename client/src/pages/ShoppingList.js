import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import {
    getShoppingList,
    toggleItemChecked,
    deleteShoppingItem,
} from '../api/shoppingListApi';

const ShoppingList = () => {
    const { currentUser } = useAuth();
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchItems = async () => {
            try {
                const data = await getShoppingList(currentUser.mongoId);
                setItems(data);
            } catch (err) {
                console.error('Failed to load shopping list:', err);
            } finally {
                setLoading(false);
            }
        };

        if (currentUser) fetchItems();
    }, [currentUser]);

    const handleToggle = async (itemId, checked) => {
        try {
            await toggleItemChecked(itemId, !checked);
            setItems((prev) =>
                prev.map((item) =>
                    item._id === itemId ? { ...item, checked: !checked } : item
                )
            );
        } catch (err) {
            console.error('Failed to update item:', err);
        }
    };

    const handleDelete = async (itemId) => {
        try {
            await deleteShoppingItem(itemId);
            setItems((prev) => prev.filter((item) => item._id !== itemId));
        } catch (err) {
            console.error('Failed to delete item:', err);
        }
    };

    if (loading) return <p className="text-center">Loading shopping list...</p>;

    return (
        <div className="max-w-xl mx-auto p-4 space-y-4">
            <h2 className="text-2xl font-bold text-center">Shopping List</h2>
            {items.length === 0 ? (
                <p className="text-center text-gray-500">Your list is empty.</p>
            ) : (
                <ul className="space-y-2">
                    {items.map((item) => (
                        <li
                            key={item._id}
                            className="flex justify-between items-center p-2 border rounded bg-white shadow"
                        >
                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={item.checked}
                                    onChange={() => handleToggle(item._id, item.checked)}
                                />
                                <span className={item.checked ? 'line-through text-gray-500' : ''}>
                                    {item.name} ({item.quantity})
                                </span>
                            </div>
                            <button
                                onClick={() => handleDelete(item._id)}
                                className="text-red-500 text-sm hover:underline"
                            >
                                Remove
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default ShoppingList;
