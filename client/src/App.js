import { BrowserRouter, Route, Routes } from "react-router-dom";
import LoginPage from "./pages/Login";
import AdvancedSearch from "./pages/AdvancedSearch";
import Footer from "./components/Footer";
import Header from "./components/Header";
function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        {/* <Route path="/" element={<LoginPage />} /> */}
        <Route path="/advanced-search" element={<AdvancedSearch />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
