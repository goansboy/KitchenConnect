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

    return (
        <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
            <h2 style={{ fontSize: '1.8rem', textAlign: 'center', marginBottom: '20px' }}>
                Shopping List
            </h2>

            {loading ? (
                <p style={{ textAlign: 'center' }}>Loading shopping list...</p>
            ) : items.length === 0 ? (
                <p style={{ textAlign: 'center', color: '#666' }}>Your list is empty.</p>
            ) : (
                <ul style={{ listStyle: 'none', padding: 0 }}>
                    {items.map((item) => (
                        <li
                            key={item._id}
                            style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                padding: '10px',
                                marginBottom: '10px',
                                background: '#fff',
                                border: '1px solid #ddd',
                                borderRadius: '8px',
                                boxShadow: '2px 2px 4px rgba(0, 0, 0, 0.05)',
                            }}
                        >
                            <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <input
                                    type="checkbox"
                                    checked={item.checked}
                                    onChange={() => handleToggle(item._id, item.checked)}
                                />
                                <span
                                    style={{
                                        textDecoration: item.checked ? 'line-through' : 'none',
                                        color: item.checked ? '#888' : '#222',
                                    }}
                                >
                                    {item.name} ({item.quantity})
                                </span>
                            </label>

                            <button
                                onClick={() => handleDelete(item._id)}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    color: '#d33',
                                    fontSize: '0.9rem',
                                    cursor: 'pointer',
                                }}
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
