
import { useAuth } from './context/AuthContext';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';

import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';


const ProtectedRoute = ({ children }) => {
    const { user, loading } = useAuth();
    if (loading) return <div>Loading...</div>; 
    return user ? children : <Navigate to="/login" replace />;
};

function App() {
    return (
        <div className="App">
            <header>

            </header>
<main>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route 
                        path="/" 
                        element={
                            <ProtectedRoute>
                                <Dashboard />
                            </ProtectedRoute>
                        } 
                    />

                    <Route path="/share/:token" element={<Dashboard isSharing={true} />} />
                </Routes>
            </main>
        </div>
    );
}

export default App;