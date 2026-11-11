import { Navigate, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import SearchPage from './pages/SearchPage';
import BookingsPage from './pages/BookingsPage';
import BookingDetailPage from './pages/BookingDetailPage';

export default function App() {
  return (
    <>
      <Navbar />
      <main>
        <Routes>
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/search" element={<SearchPage />} />
            <Route path="/bookings" element={<BookingsPage />} />
            <Route path="/bookings/:id" element={<BookingDetailPage />} />
          </Route>
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </main>
    </>
  );
}