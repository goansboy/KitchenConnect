import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RecipeForm from './components/RecipeForm';
import RecipeList from './components/RecipeList';
import Signup from './pages/Signup';
import Login from './pages/Login';
import PrivateRoute from './components/PrivateRoute';
import { AuthProvider } from './contexts/AuthContext';
import Navigation from './components/Navigation'; 
import MyRecipeList from './components/MyRecipeList';
import RecipeDetail from './pages/RecipeDetail';


function App() {
    return (
        <Router>
            <AuthProvider>
                <div className="min-h-screen bg-gray-100">
                    <h1 className="text-3xl font-bold text-center p-6">Kitchen Connect</h1>

                    {/* Clean Navigation */}
                    <Navigation />

                    <Routes>
                        <Route
                            path="/"
                            element={
                                <PrivateRoute>
                                    <>
                                        <RecipeForm />
                                        <hr className="my-8 border-t-2 border-gray-300" />
                                        <RecipeList />
                                    </>
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
                            path="/recipes/:id"
                            element={
                                <PrivateRoute>
                                    <RecipeDetail />
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
