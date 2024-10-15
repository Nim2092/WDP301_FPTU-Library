import { BrowserRouter, Route, Routes } from "react-router-dom";
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
import AccountList from "./pages/AccountList";
import UpdateAccount from "./pages/UpdateAccount";
import CreateBook from "./pages/CreateBookSet";
import ListBookSet from "./pages/ListBookSet";
import UpdateBookSet from "./pages/UpdateBookSet";
import ManageReturnBook from "./pages/ManageReturnBook";
function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/advanced-search" element={<AdvancedSearch />} />
        <Route path="/news" element={<NewsPage />} />
        <Route path="/news/:id" element={<NewsDetail />} />
        <Route path="/book-detail" element={<BookDetail />} />
        <Route path="/list-book-borrowed" element={<ListBookBorrowed />} />
        <Route path="/report-lost-book" element={<ReportLostBook />} />
        <Route path="/renew-book" element={<RenewBook />} />
        <Route path="/order-book" element={<OrderBook />} />
        <Route path="/manage-order" element={<ManageOrder />} />
        <Route path="/create-news" element={<CreateNews />} />
        <Route path="/list-news-admin" element={<ListNews />} />
        <Route path="/update-news/:id" element={<UpdateNews />} />
        <Route path="/create-account" element={<CreateAccount />} />
        <Route path="/list-catalog" element={<CatalogList />} />
        <Route path="/account-list" element={<AccountList />} />
        <Route path="/update-account/:id" element={<UpdateAccount />} />
        <Route path="/create-book" element={<CreateBook />} />
        <Route path="/list-book-set" element={<ListBookSet />} />
        <Route path="/update-bookset/:id" element={<UpdateBookSet />} />
        <Route path="/manage-return-book" element={<ManageReturnBook />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
