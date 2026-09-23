import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import ProtectedRoute from './routes/ProtectedRoute';
import AdminRoute from './routes/AdminRoute';

// Layouts
import UserLayout from './components/layout/UserLayout';
import AdminLayout from './components/layout/AdminLayout';

// Public Pages
import Home from './pages/Home';
import FindParking from './pages/FindParking';
import ParkingDetails from './pages/ParkingDetails';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// User Pages
import Dashboard from './pages/user/Dashboard';
import MyBookings from './pages/user/MyBookings';
import BookingDetails from './pages/user/BookingDetails';
import Profile from './pages/user/Profile';

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard';
import ManageParking from './pages/admin/ManageParking';
import ManageSlots from './pages/admin/ManageSlots';
import ManageUsers from './pages/admin/ManageUsers';
import ManageBookings from './pages/admin/ManageBookings';

function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <Router>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/parking" element={<FindParking />} />
            <Route path="/parking/:id" element={<ParkingDetails />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected User Routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<UserLayout><Dashboard /></UserLayout>} />
              <Route path="/bookings" element={<UserLayout><MyBookings /></UserLayout>} />
              <Route path="/booking/:id" element={<UserLayout><BookingDetails /></UserLayout>} />
              <Route path="/profile" element={<UserLayout><Profile /></UserLayout>} />
            </Route>

            {/* Protected Admin Routes */}
            <Route element={<AdminRoute />}>
              <Route path="/admin" element={<AdminLayout><AdminDashboard /></AdminLayout>} />
              <Route path="/admin/parking" element={<AdminLayout><ManageParking /></AdminLayout>} />
              <Route path="/admin/parking/:id" element={<AdminLayout><ManageSlots /></AdminLayout>} />
              <Route path="/admin/users" element={<AdminLayout><ManageUsers /></AdminLayout>} />
              <Route path="/admin/bookings" element={<AdminLayout><ManageBookings /></AdminLayout>} />
            </Route>

            {/* 404 Route */}
            <Route path="*" element={<Home />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ToastProvider>
  );
}

export default App;
