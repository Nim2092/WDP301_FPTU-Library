import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import React from "react";
import { GoogleOAuthProvider } from "@react-oauth/google";
import AuthContext, { AuthProvider, isTokenExpired } from "./contexts/UserContext";
import 'font-awesome/css/font-awesome.min.css';
import './App.scss'; // Import the overall CSS

// Import các trang
import LoginPage from "./pages/Login";
import Footer from "./components/Footer";
import Header from "./components/Header";
import Sidebar from "./components/SideBar/index";

import AdvancedSearch from "./pages/AdvancedSearch";
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
import UserProfile from "./pages/UserProfile";
import ListRule from "./pages/ListRule";
import CreateNewRule from "./pages/CreateNewRule";
import UpdateRule from "./pages/UpdateRule";
import RuleDetail from "./pages/RuleDetail";
import ListRuleUser from "./pages/ListRuleUser";
import OrderDetail from "./pages/OrderDetail";
import SearchResultsPage from "./pages/SearchResultsPage";

function App() {
  return (
    <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
      <AuthProvider>
        <BrowserRouter>
          <Header />
          <div className="app-container">
            <div className="main-layout row">
              <Routes>
                {/* Public route */}
                <Route path="/login" element={<LoginPage />} />
                {/* Shared routes for borrower and librarian */}
                <Route path="/" element={<ProtectedRoute roles={["borrower", "librarian", "admin"]}><HomePage /></ProtectedRoute>} />
                <Route path="/advanced-search" element={<ProtectedRoute roles={["borrower", "librarian"]}><AdvancedSearch /></ProtectedRoute>} />
                <Route path="/news" element={<ProtectedRoute roles={["borrower", "librarian"]}><NewsPage /></ProtectedRoute>} />
                <Route path="/book-detail" element={<ProtectedRoute roles={["borrower", "librarian"]}><BookDetail /></ProtectedRoute>} />
                <Route path="/profile/:id" element={<ProtectedRoute roles={["borrower", "librarian", "admin"]}><UserProfile /></ProtectedRoute>} />
                <Route path="/news-detail/:id" element={<ProtectedRoute roles={["borrower", "librarian"]}><NewsDetail /></ProtectedRoute>} />
                <Route path="/rule-detail/:id" element={<ProtectedRoute roles={["borrower", "librarian", "admin"]}><RuleDetail /></ProtectedRoute>} />
                <Route path="/list-rule-user" element={<ProtectedRoute roles={["borrower", "librarian"]}><ListRuleUser /></ProtectedRoute>} />
                <Route path="/search-results" element={<ProtectedRoute roles={["borrower", "librarian"]}><SearchResultsPage /></ProtectedRoute>} />


                {/* Borrower Routes */}
                <Route path="/list-book-borrowed" element={<ProtectedRoute roles={["borrower"]}><ListBookBorrowed /></ProtectedRoute>} />
                <Route path="/report-lost-book" element={<ProtectedRoute roles={["borrower"]}><ReportLostBook /></ProtectedRoute>} />
                <Route path="/renew-book/:orderId" element={<ProtectedRoute roles={["borrower"]}><RenewBook /></ProtectedRoute>} />
                <Route path="/order-book/:bookId" element={<ProtectedRoute roles={["borrower"]}><OrderBook /></ProtectedRoute>} />
                <Route path="/order-book-detail/:orderId" element={<ProtectedRoute roles={["borrower"]}><OrderDetail /></ProtectedRoute>} />

                {/* Librarian Routes */}
                <Route path="/manage-order" element={<ProtectedRoute roles={["librarian"]}><ManageOrder /></ProtectedRoute>} />
                <Route path="/create-news" element={<ProtectedRoute roles={["librarian"]}><CreateNews /></ProtectedRoute>} />
                <Route path="/list-news-admin" element={<ProtectedRoute roles={["librarian"]}><ListNews /></ProtectedRoute>} />
                <Route path="/update-news/:id" element={<ProtectedRoute roles={["librarian"]}><UpdateNews /></ProtectedRoute>} />
                <Route path="/manage-return-book" element={<ProtectedRoute roles={["librarian"]}><ManageReturnBook /></ProtectedRoute>} />


                {/* Admin Routes */}
                <Route path="/create-account" element={<ProtectedRoute roles={["admin"]}><CreateAccount /></ProtectedRoute>} />
                <Route path="/list-catalog" element={<ProtectedRoute roles={["admin"]}><CatalogList /></ProtectedRoute>} />
                <Route path="/account-list" element={<ProtectedRoute roles={["admin"]}><AccountList /></ProtectedRoute>} />
                <Route path="/update-account/:id" element={<ProtectedRoute roles={["admin"]}><UpdateAccount /></ProtectedRoute>} />
                <Route path="/create-book" element={<ProtectedRoute roles={["admin"]}><CreateBook /></ProtectedRoute>} />
                <Route path="/list-book-set" element={<ProtectedRoute roles={["admin"]}><ListBookSet /></ProtectedRoute>} />
                <Route path="/update-bookset/:id" element={<ProtectedRoute roles={["admin"]}><UpdateBookSet /></ProtectedRoute>} />
                <Route path="/list-rule" element={<ProtectedRoute roles={["admin"]}><ListRule /></ProtectedRoute>} />
                <Route path="/create-new-rule" element={<ProtectedRoute roles={["admin"]}><CreateNewRule /></ProtectedRoute>} />
                <Route path="/update-rule/:id" element={<ProtectedRoute roles={["admin"]}><UpdateRule /></ProtectedRoute>} />

                {/* Unauthorized and other routes */}
                <Route path="/unauthorized" element={<Unauthorized />} />
              </Routes>
            </div>
            
          </div>
          <Footer />
        </BrowserRouter>
      </AuthProvider>
    </GoogleOAuthProvider>
  );
}

// ProtectedRoute component
const ProtectedRoute = ({ roles, children }) => {
  const { user, login } = React.useContext(AuthContext);
  const [isLoading, setIsLoading] = React.useState(true);

  const menuItems = {
    borrower: [
      { path: "/", label: "Trang chủ", icon: "fa fa-home" }, 
      { path: "/advanced-search", label: "Tra cứu sách", icon: "fa fa-search" }, 
      { path: "/list-book-borrowed", label: "Danh sách đã mượn", icon: "fa fa-book" }, 
      { path: "/fines", label: "Tiền phạt", icon: "fa fa-money" }, 
      { path: "/list-rule-user", label: "Quy định", icon: "fa fa-list" }, 
      { path: "/news", label: "Tin tức", icon: "fa fa-newspaper-o" }, 
      { path: "/notification", label: "Thông báo", icon: "fa fa-bell" }, 
    ],
    librarian: [
      { path: "/", label: "Trang chủ", icon: "fa fa-home" }, 
      { path: "/manage-order", label: "Quản lý mượn sách", icon: "fa fa-tasks" }, 
      { path: "/manage-return-book", label: "Quản lý trả sách", icon: "fa fa-undo" }, 
      { path: "/list-news-admin", label: "Quản lý tin tức", icon: "fa fa-newspaper-o" }, 
      { path: "/list-rule-user", label: "Quy định", icon: "fa fa-list" }, 
    ],
    admin: [
      { path: "/", label: "Trang chủ", icon: "fa fa-home" }, 
      { path: "/account-list", label: "Quản lý tài khoản", icon: "fa fa-user-circle-o" },  
      { path: "/list-catalog", label: "Quản lý danh mục", icon: "fa fa-folder" },  
      { path: "/list-book-set", label: "Quản lý lô sách", icon: "fa fa-book" }, 
      { path: "/list-rule", label: "Quản lý quy định", icon: "fa fa-list" }, 
    ],
  };
  
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

  return (
    <>
      {/* Render Sidebar only after login */}
      <Sidebar menuItems={menuItems[user.role?.name] || []} />
      <div className="content-area col-10">
        {children}
      </div>
    </>
  );
};

export default App;
