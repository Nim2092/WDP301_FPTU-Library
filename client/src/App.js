import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import React from "react";
import { GoogleOAuthProvider } from "@react-oauth/google";
import AuthContext, { AuthProvider, isTokenExpired } from "./contexts/UserContext";
import 'font-awesome/css/font-awesome.min.css';
import './App.scss'; // Import the overall CSS
import { ToastContainer } from 'react-toastify';

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
import Notification from "./pages/Notification";
import Fines from "./pages/Fines";
import Chart from "./pages/Chart";
import ListFines from "./pages/ListFines";
import ScrollTop from "./components/ScrollTop";
import Breadcrumb from "./components/Breadcrumb";
import ListPenaltyReasons from "./pages/PenaltyReasons";
import CreatePenaltyReason from "./pages/CreatePenaltyReasons";
import UpdatePenaltyReason from "./pages/UpdatePenaltyReasons";
import ReturnBook from "./pages/ReturnBook";
function App() {
  return (
    <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
      <AuthProvider>
        <ToastContainer />
        <BrowserRouter>
          <Header />
          <div className="app-container">
            <div className="main-layout row" style={{ height: '100%' }}>
              <Routes>
                {/* Public route */}
                <Route path="/login" element={<LoginPage />} />
                {/* Shared routes for borrower and librarian */}
                <Route path="/" element={<ProtectedRoute roles={["borrower", "librarian", "admin"]}><HomePage /></ProtectedRoute>} />
                <Route path="/advanced-search" element={<ProtectedRoute roles={["borrower", "librarian"]}><AdvancedSearch /></ProtectedRoute>} />
                <Route path="/news" element={<ProtectedRoute roles={["borrower", "librarian"]}><NewsPage /></ProtectedRoute>} />
                <Route path="/book-detail/:id" element={<ProtectedRoute roles={["borrower", "librarian", "admin"]}><BookDetail /></ProtectedRoute>} />
                <Route path="/profile/:id" element={<ProtectedRoute roles={["borrower", "librarian", "admin"]}><UserProfile /></ProtectedRoute>} />
                <Route path="/news/news-detail/:id" element={<ProtectedRoute roles={["borrower", "librarian"]}><NewsDetail /></ProtectedRoute>} />
                <Route path="/list-rule-user/rule-detail/:id" element={<ProtectedRoute roles={["borrower", "librarian", "admin"]}><RuleDetail /></ProtectedRoute>} />
                <Route path="/list-rule-user" element={<ProtectedRoute roles={["borrower", "librarian"]}><ListRuleUser /></ProtectedRoute>} />
                <Route path="/search-results" element={<ProtectedRoute roles={["borrower", "librarian"]}><SearchResultsPage /></ProtectedRoute>} />
                <Route path="/chart" element={<ProtectedRoute roles={["admin", "librarian"]}><Chart /></ProtectedRoute>} />

                {/* Borrower Routes */}
                <Route path="/list-book-borrowed" element={<ProtectedRoute roles={["borrower"]}><ListBookBorrowed /></ProtectedRoute>} />
                <Route path="/report-lost-book" element={<ProtectedRoute roles={["borrower"]}><ReportLostBook /></ProtectedRoute>} />
                <Route path="/renew-book/:orderId" element={<ProtectedRoute roles={["borrower"]}><RenewBook /></ProtectedRoute>} />
                <Route path="/order-book/:bookId" element={<ProtectedRoute roles={["borrower"]}><OrderBook /></ProtectedRoute>} />
                <Route path="/list-book-borrowed/order-book-detail/:orderId" element={<ProtectedRoute roles={["borrower"]}><OrderDetail /></ProtectedRoute>} />
                <Route path="/notification" element={<ProtectedRoute roles={["borrower"]}><Notification /></ProtectedRoute>} />
                <Route path="/fines" element={<ProtectedRoute roles={["borrower"]}><Fines /></ProtectedRoute>} />

                {/* Librarian Routes */}
                <Route path="/manage-order" element={<ProtectedRoute roles={["librarian"]}><ManageOrder /></ProtectedRoute>} />
                <Route path="/list-news-admin/create-news" element={<ProtectedRoute roles={["librarian"]}><CreateNews /></ProtectedRoute>} />
                <Route path="/list-news-admin" element={<ProtectedRoute roles={["librarian"]}><ListNews /></ProtectedRoute>} />
                <Route path="/list-news-admin/update-news/:id" element={<ProtectedRoute roles={["librarian"]}><UpdateNews /></ProtectedRoute>} />
                <Route path="/return-book" element={<ProtectedRoute roles={["librarian"]}><ReturnBook /></ProtectedRoute>} />
                <Route path="/list-fines" element={<ProtectedRoute roles={["librarian"]}><ListFines /></ProtectedRoute>} />

                {/* Admin Routes */}
                <Route path="/account-list/create-account" element={<ProtectedRoute roles={["admin"]}><CreateAccount /></ProtectedRoute>} />
                <Route path="/list-catalog" element={<ProtectedRoute roles={["admin"]}><CatalogList /></ProtectedRoute>} />
                <Route path="/account-list" element={<ProtectedRoute roles={["admin"]}><AccountList /></ProtectedRoute>} />
                <Route path="/account-list/update-account/:id" element={<ProtectedRoute roles={["admin"]}><UpdateAccount /></ProtectedRoute>} />
                <Route path="/list-book-set/create-book" element={<ProtectedRoute roles={["admin"]}><CreateBook /></ProtectedRoute>} />
                <Route path="/list-book-set" element={<ProtectedRoute roles={["admin"]}><ListBookSet /></ProtectedRoute>} />
                <Route path="/list-book-set/update-bookset/:id" element={<ProtectedRoute roles={["admin"]}><UpdateBookSet /></ProtectedRoute>} />
                <Route path="/list-rule" element={<ProtectedRoute roles={["admin"]}><ListRule /></ProtectedRoute>} />
                <Route path="/list-rule/create-new-rule" element={<ProtectedRoute roles={["admin"]}><CreateNewRule /></ProtectedRoute>} />
                <Route path="/list-rule/update-rule/:id" element={<ProtectedRoute roles={["admin"]}><UpdateRule /></ProtectedRoute>} />
                <Route path="/list-penalty-reasons" element={<ProtectedRoute roles={["admin"]}><ListPenaltyReasons /></ProtectedRoute>} />
                <Route path="/list-penalty-reasons/update-penalty-reason/:id" element={<ProtectedRoute roles={["admin"]}><UpdatePenaltyReason /></ProtectedRoute>} />
                <Route path="/list-penalty-reasons/create-penalty-reason" element={<ProtectedRoute roles={["admin"]}><CreatePenaltyReason /></ProtectedRoute>} />


                {/* Unauthorized and other routes */}
                <Route path="/unauthorized" element={<Unauthorized />} />
              </Routes>
            </div>
            <ScrollTop />
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
      { path: "/return-book", label: "Quản lý trả sách", icon: "fa fa-undo" },
      { path: "/list-news-admin", label: "Quản lý tin tức", icon: "fa fa-newspaper-o" },
      { path: "/list-rule-user", label: "Quy định", icon: "fa fa-list" },
      { path: "/chart", label: "Thống kê", icon: "fa fa-bar-chart" },
      { path: "/list-fines", label: "Danh sách tiền phạt", icon: "fa fa-money" },
    ],
    admin: [
      { path: "/", label: "Trang chủ", icon: "fa fa-home" },
      { path: "/account-list", label: "Quản lý tài khoản", icon: "fa fa-user-circle-o" },
      { path: "/list-catalog", label: "Quản lý danh mục", icon: "fa fa-folder" },
      { path: "/list-book-set", label: "Quản lý lô sách", icon: "fa fa-book" },
      { path: "/list-rule", label: "Quản lý quy định", icon: "fa fa-list" },
      { path: "/list-penalty-reasons", label: "Quản lý mức phạt", icon: "fa fa fa-window-close-o" },
      { path: "/chart", label: "Thống kê", icon: "fa fa-bar-chart" },

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
        <Breadcrumb />
        {children}
      </div>
    </>
  );
};

export default App;