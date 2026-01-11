import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastProvider } from './context/ToastContext';
import './App.css'

// Components
import Navbar from './components/Navbar';
import Home from './components/Home';
import Login from './components/Login';
import Signup from './components/Signup';
import GuestDashboard from './components/GuestDashboard';
import ManagerDashboard from './components/ManagerDashboard';
import AdminDashboard from './components/AdminDashboard';

function App() {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('hotel_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('hotel_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('hotel_user');
    }
  }, [user]);

  // Private Route Helper
  const PrivateRoute = ({ children, allowedRoles }) => {
    if (!user) return <Navigate to="/login" />;
    if (!allowedRoles.includes(user.role)) return <Navigate to="/" />;
    return children;
  };

  return (
    <ToastProvider>
      <Router>
        <div className="d-flex flex-column min-vh-100">
          <Navbar user={user} setUser={setUser} />
          
          <div className="flex-grow-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login setUser={setUser} />} />
              <Route path="/signup" element={<Signup setUser={setUser} />} />
              
              {/* Guest Routes */}
              <Route path="/rooms" element={<PrivateRoute allowedRoles={['GUEST']}><GuestDashboard user={user} initialTab="browse" /></PrivateRoute>} />
              <Route path="/my-bookings" element={<PrivateRoute allowedRoles={['GUEST']}><GuestDashboard user={user} initialTab="my-bookings" /></PrivateRoute>} />
              <Route path="/my-bills" element={<PrivateRoute allowedRoles={['GUEST']}><GuestDashboard user={user} initialTab="billing" /></PrivateRoute>} />
              <Route path="/services" element={<PrivateRoute allowedRoles={['GUEST']}><GuestDashboard user={user} initialTab="services" /></PrivateRoute>} />

              {/* Manager Routes */}
              <Route path="/manager" element={<PrivateRoute allowedRoles={['MANAGER']}><ManagerDashboard initialTab="overview" /></PrivateRoute>} />
              <Route path="/manager/bookings" element={<PrivateRoute allowedRoles={['MANAGER']}><ManagerDashboard initialTab="bookings" /></PrivateRoute>} />
              <Route path="/manager/rooms" element={<PrivateRoute allowedRoles={['MANAGER']}><ManagerDashboard initialTab="rooms" /></PrivateRoute>} />
              <Route path="/manager/services" element={<PrivateRoute allowedRoles={['MANAGER']}><ManagerDashboard initialTab="services" /></PrivateRoute>} />
              <Route path="/manager/maintenance" element={<PrivateRoute allowedRoles={['MANAGER']}><ManagerDashboard initialTab="maintenance" /></PrivateRoute>} />
              <Route path="/manager/reviews" element={<PrivateRoute allowedRoles={['MANAGER']}><ManagerDashboard initialTab="reviews" /></PrivateRoute>} />
              <Route path="/manager/bills" element={<PrivateRoute allowedRoles={['MANAGER']}><ManagerDashboard initialTab="bills" /></PrivateRoute>} />

              {/* Admin Routes */}
              <Route path="/admin" element={<PrivateRoute allowedRoles={['ADMIN']}><AdminDashboard /></PrivateRoute>} />
            </Routes>
          </div>
          
          <footer className="bg-dark text-light text-center py-3 mt-5">
            <div className="container">
              <small>&copy; 2024 Grand Luxury Hotel. All rights reserved.</small>
            </div>
          </footer>
        </div>
      </Router>
    </ToastProvider>
  )
}

export default App
