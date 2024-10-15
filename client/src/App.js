import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import React from 'react';
import { GoogleOAuthProvider } from '@react-oauth/google';
import AuthContext, { AuthProvider } from './contexts/UserContext';

// Import các trang
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import AdvancedSearch from './pages/AdvancedSearch';
import NewsPage from './pages/NewsPage';
import NewsDetail from './pages/NewsDetail';
import BookDetail from './pages/BookDetail';
import ListBookBorrowed from './pages/ListBookBorrowed';
import ReportLostBook from './pages/ReportLostBook';
import RenewBook from './pages/RenewBook';
import OrderBook from './pages/OrderBook';
import ManageOrder from './pages/ManageOrder';
import CreateNews from './pages/CreateNews';
import ListNews from './pages/ListNews';
import UpdateNews from './pages/UpdateNews';
import CreateAccount from './pages/CreateAccount';
import CatalogList from './pages/CatalogList';

function App() {
  return (
    <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Route công khai */}
            <Route path="/login" element={<LoginPage />} />

            {/* Routes dành cho Borrower */}
            <Route path="/" element={
              <ProtectedRoute roles={['borrower', 'librarian']}>
                <HomePage />
              </ProtectedRoute>
            } />
            <Route path="/advanced-search" element={
              <ProtectedRoute roles={['borrower']}>
                <AdvancedSearch />
              </ProtectedRoute>
            } />
            <Route path="/news" element={
              <ProtectedRoute roles={['borrower']}>
                <NewsPage />
              </ProtectedRoute>
            } />
            <Route path="/news/:id" element={
              <ProtectedRoute roles={['borrower']}>
                <NewsDetail />
              </ProtectedRoute>
            } />
            <Route path="/book-detail" element={
              <ProtectedRoute roles={['borrower']}>
                <BookDetail />
              </ProtectedRoute>
            } />
            <Route path="/list-book-borrowed" element={
              <ProtectedRoute roles={['borrower']}>
                <ListBookBorrowed />
              </ProtectedRoute>
            } />
            <Route path="/report-lost-book" element={
              <ProtectedRoute roles={['borrower']}>
                <ReportLostBook />
              </ProtectedRoute>
            } />
            <Route path="/renew-book" element={
              <ProtectedRoute roles={['borrower']}>
                <RenewBook />
              </ProtectedRoute>
            } />
            <Route path="/order-book" element={
              <ProtectedRoute roles={['borrower']}>
                <OrderBook />
              </ProtectedRoute>
            } />

            {/* Routes dành cho Librarian */}
            <Route path="/manage-order" element={
              <ProtectedRoute roles={['librarian']}>
                <ManageOrder />
              </ProtectedRoute>
            } />
            <Route path="/create-news" element={
              <ProtectedRoute roles={['librarian']}>
                <CreateNews />
              </ProtectedRoute>
            } />
            <Route path="/list-news-admin" element={
              <ProtectedRoute roles={['librarian']}>
                <ListNews />
              </ProtectedRoute>
            } />
            <Route path="/update-news/:id" element={
              <ProtectedRoute roles={['librarian']}>
                <UpdateNews />
              </ProtectedRoute>
            } />

            {/* Routes dành cho Admin */}
            <Route path="/create-account" element={
              <ProtectedRoute roles={['admin']}>
                <CreateAccount />
              </ProtectedRoute>
            } />
            <Route path="/list-catalog" element={
              <ProtectedRoute roles={['admin']}>
                <CatalogList />
              </ProtectedRoute>
            } />

            {/* Đường dẫn cho các trang khác */}
            <Route path="/unauthorized" element={<h2>Unauthorized Access</h2>} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </GoogleOAuthProvider>
  );
}

// ProtectedRoute component for role-based access
const ProtectedRoute = ({ roles, children }) => {
  const { user } = React.useContext(AuthContext);

  // Nếu không có người dùng đăng nhập, chuyển hướng đến trang login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Nếu vai trò của người dùng không khớp với các vai trò được phép, chuyển hướng đến trang unauthorized
  if (!roles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default App;
