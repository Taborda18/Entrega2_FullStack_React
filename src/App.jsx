import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Suspense } from "react";

// Components
import Layout from "./components/templates/Layout";
import Login from "./components/organisms/login/Login";
import Register from "./components/organisms/register/Register";
import Gallery from "./components/organisms/gallery/Gallery";
import Cart from "./components/organisms/cart/Cart";
import Checkout from "./components/organisms/checkout/Checkout";
import ProductDetail from "./components/organisms/productDetail/ProductDetail";
import Profile from "./components/organisms/profile/Profile";

function App() {
  return (
    <Router>
      <Suspense fallback={<div className="flex justify-center items-center min-h-screen">Loading...</div>}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          <Route element={<Layout />}>
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/" element={<Navigate to="/gallery" replace />} />
          </Route>
          
          <Route path="*" element={<Navigate to="/gallery" replace />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
