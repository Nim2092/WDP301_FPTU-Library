import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import React from "react";
import { GoogleOAuthProvider } from "@react-oauth/google";
import AuthContext, { AuthProvider, isTokenExpired } from "./contexts/UserContext";

// Import các trang
import LoginPage from "./pages/Login";
import AdvancedSearch from "./pages/AdvancedSearch";
import Footer from "./components/Footer";
import Header from "./components/Header";
import HomePage from "./pages/Home";
import NewsPage from "./pages/News";
import NewsDetail from "./pages/NewsDetail";
import BookDetail from "./pages/BookDetail";
import ListBookBorrowed from "./pages/ListBookBorrowed";
import ReportLostBook from "./pages/ReportLostBook";
import RenewBook from "./pages/RenewBook";
import OrderBook from "./pages/OrderBook";
import ManageOrder from "./pages/ManageOrder";
import CreateNews from "./pages/CreateNews";
import ListNews from "./pages/ListNews.Admin";
import UpdateNews from "./pages/UpdateNews";
import CreateAccount from "./pages/CreateAccount";
import CatalogList from "./pages/ListCatalog";
import Unauthorized from "./pages/Unauthorized";
import AccountList from "./pages/AccountList";
import UpdateAccount from "./pages/UpdateAccount";
import CreateBook from "./pages/CreateBookSet";
import ListBookSet from "./pages/ListBookSet";
import UpdateBookSet from "./pages/UpdateBookSet";
import ManageReturnBook from "./pages/ManageReturnBook";

function App() {
  return (
    <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
      <AuthProvider>
        <BrowserRouter>
          <Header />
          <Routes>
            {/* Route công khai */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/" element={<ProtectedRoute roles={["borrower", "librarian"]}><HomePage /></ProtectedRoute>} />

            {/* Routes dành cho Borrower */}
            <Route path="/advanced-search" element={<ProtectedRoute roles={["borrower"]}><AdvancedSearch /></ProtectedRoute>} />
            <Route path="/news" element={<ProtectedRoute roles={["borrower"]}><NewsPage /></ProtectedRoute>} />
            <Route path="/news/:id" element={<ProtectedRoute roles={["borrower"]}><NewsDetail /></ProtectedRoute>} />
            <Route path="/book-detail" element={<ProtectedRoute roles={["borrower"]}><BookDetail /></ProtectedRoute>} />
            <Route path="/list-book-borrowed" element={<ProtectedRoute roles={["borrower"]}><ListBookBorrowed /></ProtectedRoute>} />
            <Route path="/report-lost-book" element={<ProtectedRoute roles={["borrower"]}><ReportLostBook /></ProtectedRoute>} />
            <Route path="/renew-book" element={<ProtectedRoute roles={["borrower"]}><RenewBook /></ProtectedRoute>} />
            <Route path="/order-book" element={<ProtectedRoute roles={["borrower"]}><OrderBook /></ProtectedRoute>} />

            {/* Routes dành cho Librarian */}
            <Route path="/manage-order" element={<ProtectedRoute roles={["librarian"]}><ManageOrder /></ProtectedRoute>} />
            <Route path="/create-news" element={<ProtectedRoute roles={["librarian"]}><CreateNews /></ProtectedRoute>} />
            <Route path="/list-news-admin" element={<ProtectedRoute roles={["librarian"]}><ListNews /></ProtectedRoute>} />
            <Route path="/update-news/:id" element={<ProtectedRoute roles={["librarian"]}><UpdateNews /></ProtectedRoute>} />
            <Route path="/manage-return-book" element={<ProtectedRoute roles={["librarian"]}><ManageReturnBook /></ProtectedRoute>} />

            {/* Routes dành cho Admin */}
            <Route path="/create-account" element={<ProtectedRoute roles={["admin"]}><CreateAccount /></ProtectedRoute>} />
            <Route path="/list-catalog" element={<ProtectedRoute roles={["admin"]}><CatalogList /></ProtectedRoute>} />
            <Route path="/account-list" element={<ProtectedRoute roles={["admin"]}><AccountList /></ProtectedRoute>} />
            <Route path="/update-account/:id" element={<ProtectedRoute roles={["admin"]}><UpdateAccount /></ProtectedRoute>} />
            <Route path="/create-book" element={<ProtectedRoute roles={["admin"]}><CreateBook /></ProtectedRoute>} />
            <Route path="/list-book-set" element={<ProtectedRoute roles={["admin"]}><ListBookSet /></ProtectedRoute>} />
            <Route path="/update-bookset/:id" element={<ProtectedRoute roles={["admin"]}><UpdateBookSet /></ProtectedRoute>} />

            {/* Đường dẫn cho các trang khác */}
            <Route path="/unauthorized" element={<Unauthorized />} />
          </Routes>
          <Footer />
        </BrowserRouter>
      </AuthProvider>
    </GoogleOAuthProvider>
  );
}

// ProtectedRoute component
const ProtectedRoute = ({ roles, children }) => {
  const { user, token, login } = React.useContext(AuthContext);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const storedToken = localStorage.getItem("accessToken");
    if (!user && storedToken && !isTokenExpired(storedToken)) {
      login(storedToken).finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, [user, login]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!roles.includes(user.role?.name)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default App;
