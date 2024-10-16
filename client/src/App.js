import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import React from "react";
import { GoogleOAuthProvider } from "@react-oauth/google";
import AuthContext, { AuthProvider, isTokenExpired } from "./contexts/UserContext";
import 'font-awesome/css/font-awesome.min.css';

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
import ListRule from "./pages/ListRule";
import CreateNewRule from "./pages/CreateNewRule";
import UpdateRule from "./pages/UpdateRule";
import RuleDetail from "./pages/RuleDetail";
import Sidebar from "./components/SideBar/index";

function App() {
  

  return (
    // <BrowserRouter>
    //   <Header />
    //   <Routes>
    //     <Route path="/" element={<HomePage />} />
    //     <Route path="/login" element={<LoginPage />} />
    //     <Route path="/advanced-search" element={<AdvancedSearch />} />
    //     <Route path="/news" element={<NewsPage />} />
    //     <Route path="/news/:id" element={<NewsDetail />} />
    //     <Route path="/book-detail" element={<BookDetail />} />
    //     <Route path="/list-book-borrowed" element={<ListBookBorrowed />} />
    //     <Route path="/report-lost-book" element={<ReportLostBook />} />
    //     <Route path="/renew-book" element={<RenewBook />} />
    //     <Route path="/order-book" element={<OrderBook />} />
    //     <Route path="/manage-order" element={<ManageOrder />} />
    //     <Route path="/create-news" element={<CreateNews />} />
    //     <Route path="/list-news-admin" element={<ListNews />} />
    //     <Route path="/update-news/:id" element={<UpdateNews />} />
    //     <Route path="/create-account" element={<CreateAccount />} />
    //     <Route path="/list-catalog" element={<CatalogList />} />
    //     <Route path="/account-list" element={<AccountList />} />
    //     <Route path="/update-account/:id" element={<UpdateAccount />} />
    //     <Route path="/create-book" element={<CreateBook />} />
    //     <Route path="/list-book-set" element={<ListBookSet />} />
    //     <Route path="/update-bookset/:id" element={<UpdateBookSet />} />
    //     <Route path="/manage-return-book" element={<ManageReturnBook />} />
    //     <Route path="/list-rule" element={<ListRule />} />
    //     <Route path="/create-new-rule" element={<CreateNewRule />} />
    //     <Route path="/update-rule/:id" element={<UpdateRule />} />
    //     <Route path="/rule-detail/:id" element={<RuleDetail />} />
    //     <Route path="/news-detail/:id" element={<NewsDetail />} />
    //   </Routes>
    //   <Footer />
    // </BrowserRouter>
    <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
      <AuthProvider>
        <BrowserRouter>
          <Header />
          <Routes>
            {/* Route công khai */}
            <Route path="/login" element={<LoginPage />} />

            {/* Route chung của borrower và librarian */}
            <Route path="/" element={<ProtectedRoute roles={["borrower", "librarian"]}><HomePage /></ProtectedRoute>} />
            <Route path="/advanced-search" element={<ProtectedRoute roles={["borrower", "librarian"]}><AdvancedSearch /></ProtectedRoute>} />
            <Route path="/news" element={<ProtectedRoute roles={["borrower", "librarian"]}><NewsPage /></ProtectedRoute>} />
            <Route path="/news/:id" element={<ProtectedRoute roles={["borrower", "librarian"]}><NewsDetail /></ProtectedRoute>} />
            <Route path="/book-detail" element={<ProtectedRoute roles={["borrower", "librarian"]}><BookDetail /></ProtectedRoute>} />
            
            {/* Routes dành cho Borrower */}
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

  const menuItems = {
    borrower: [
      { path: "/list-book-borrowed", label: "Danh sách sách đã mượn", icon: "fa fa-book" },
      { path: "/report-lost-book", label: "Báo mất sách", icon: "fa fa-exclamation-circle" },
      { path: "/renew-book", label: "Gia hạn sách", icon: "fa fa-refresh" },
      { path: "/order-book", label: "Đặt sách", icon: "fa fa-shopping-cart" },
    ],
    librarian: [
      { path: "/manage-order", label: "Quản lý đơn hàng", icon: "fa fa-list" },
      { path: "/create-news", label: "Tạo tin tức", icon: "fa fa-pencil" },
      // ... (các mục khác cho librarian)
    ],
    admin: [
      { path: "/create-account", label: "Tạo tài khoản", icon: "fa fa-user-plus" },
      { path: "/account-list", label: "Danh sách tài khoản", icon: "fa fa-users" },
      // ... (các mục khác cho admin)
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
      {children}
    </>
  );
};

export default App;
