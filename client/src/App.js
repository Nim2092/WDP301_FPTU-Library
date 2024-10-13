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
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
