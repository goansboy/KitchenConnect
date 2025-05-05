import React, { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../firebase";
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
} from "firebase/auth";

// Create the context
const AuthContext = createContext();

// Export the hook for easy access
export const useAuth = () => useContext(AuthContext);

// Provider component
export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Sign up
    const signup = async (email, password) => {
        const firebaseUser = await createUserWithEmailAndPassword(auth, email, password);

        // Create user in Mongo
        await fetch(`${process.env.REACT_APP_API_URL}/api/users/create`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                uid: firebaseUser.user.uid,
                email: firebaseUser.user.email,
                username: email.split('@')[0], // fallback default username
            }),
        });

        return firebaseUser;
    };

    // Log in
    const login = (email, password) =>
        signInWithEmailAndPassword(auth, email, password);

    // Log out
    const logout = () => signOut(auth);

    // Track auth state and fetch Mongo user
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                try {
                    const res = await fetch(`${process.env.REACT_APP_API_URL}/api/users/search?q=${firebaseUser.email}`);
                    const data = await res.json();
                    const mongoUser = data.find((u) => u.email === firebaseUser.email);

                    if (mongoUser) {
                        setCurrentUser({
                            uid: firebaseUser.uid,
                            email: firebaseUser.email,
                            mongoId: mongoUser._id,
                            username: mongoUser.username,
                        });
                    } else {
                        console.warn('Mongo user not found');
                        setCurrentUser(null);
                    }
                } catch (err) {
                    console.error("Failed to fetch Mongo user:", err);
                    setCurrentUser(null);
                }
            } else {
                setCurrentUser(null);
            }
            setLoading(false);
        });

        return unsubscribe;
    }, []);

    const value = {
        currentUser,
        signup,
        login,
        logout,
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};