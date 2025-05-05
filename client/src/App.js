import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Signup from './pages/Signup';
import Login from './pages/Login';
import PrivateRoute from './components/PrivateRoute';
import { AuthProvider } from './contexts/AuthContext';
import Navigation from './components/Navigation';
import MyRecipeList from './components/MyRecipeList';
import RecipeDetail from './pages/RecipeDetail';
import RecipeForm from './components/RecipeForm';
import SearchUsers from './pages/SearchUsers';
import UserProfile from './pages/UserProfiles';
import ShoppingList from './pages/ShoppingList';
import Scheduler from './pages/Scheduler';
import Feed from './pages/Feed';
import './index.css'


function App() {
    return (
        <Router>
            <AuthProvider>
                <div className="min-h-screen bg-gray-100">
                    <h1 className="text-3xl font-bold text-center p-6">Kitchen Connect</h1>

                    <Navigation />



                    <Routes>
                        <Route
                            path="/"
                            element={
                                <PrivateRoute>
                                    <Feed />
                                </PrivateRoute>
                            }
                        />

                        <Route
                            path="/my-recipes"
                            element={
                                <PrivateRoute>
                                    <MyRecipeList />
                                </PrivateRoute>
                            }
                        />

                        <Route
                            path="/shopping-list"
                            element={
                                <PrivateRoute>
                                    <ShoppingList />
                                </PrivateRoute>
                            }
                        />

                        <Route
                            path="/recipes/:id"
                            element={
                                <PrivateRoute>
                                    <RecipeDetail />
                                </PrivateRoute>
                            }
                        />

                        <Route
                            path="/search"
                            element={
                                <PrivateRoute>
                                    <SearchUsers />
                                </PrivateRoute>
                            }
                        />

                        <Route
                            path="/user/:username"
                            element={
                                <PrivateRoute>
                                    <UserProfile />
                                </PrivateRoute>
                            }
                        />

                        <Route
                            path="/scheduler"
                            element={
                                <PrivateRoute>
                                    <Scheduler />
                                </PrivateRoute>
                            }
                        />

                        <Route path="/signup" element={<Signup />} />
                        <Route path="/login" element={<Login />} />
                    </Routes>
                </div>
            </AuthProvider>
        </Router>
    );
}

export default App;
