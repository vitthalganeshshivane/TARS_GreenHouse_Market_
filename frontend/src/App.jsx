import { Navigate, Route, Routes } from "react-router-dom";
import Signup from "./pages/signup.jsx";
import Login from "./pages/login.jsx";
import ForgotPassword from "./pages/forgot.jsx";
import VerifyOTP from "./pages/verify.jsx";
import Success from "./pages/success.jsx";
import { Button } from "./components/ui/button.jsx";
import SearchProduct from "./components/product/searchProduct.jsx";
import NavbarBtn from "./components/layout/navbarBtn.jsx";
import { Recycle } from "lucide-react";
import CategoryEntry from "./components/common/categoryEntry.jsx";
import CategoryCard from "./components/common/categoryCard.jsx";
import ProductCard from "./components/product/productCard.jsx";
import Topbar from "./components/layout/topbar.jsx";
import ProtectedRoute from "./routes/ProtectedRoute.jsx";
import PublicRoute from "./routes/PublicRoute.jsx";
import Home from "./pages/home.jsx";
import { useAuth } from "./hooks/useAuth.js";
import Product from "./pages/product.jsx";
import ProductDetail from "./components/customer/ProductDetails/layout.jsx";
import BrowseCategory from "./components/customer/Category/BrowseCategory.jsx";
import BrowseAllProducts from "./components/customer/BrowseAllProducts.jsx";

function RootRedirect() {
  const { user, loading } = useAuth();

  if (loading) return <p>Loading...</p>;

  return user ? (
    <Navigate to="/home" replace />
  ) : (
    <Navigate to="/login" replace />
  );
}

function App() {
  return (
    <Routes>
      {/* <Route path="/" element={<Navigate to="/signup" replace />} /> */}
      <Route path="/" element={<RootRedirect />} />
      <Route
        path="/home"
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
      />
      <Route
        path="/signup"
        element={
          // <PublicRoute>
          <Signup />
          // </PublicRoute>
        }
      />
      <Route
        path="/login"
        element={
          // <PublicRoute>
          <Login />
          // </PublicRoute>
        }
      />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/verify" element={<VerifyOTP />} />
      <Route path="/success" element={<Success />} />

      <Route
        path="/product"
        element={
          <ProtectedRoute>
            <Product />
          </ProtectedRoute>
        }
      />

      <Route path="/category/:slug" element={<BrowseCategory />} />

      <Route path="/all-products" element={<BrowseAllProducts />} />

      <Route
        path="/product/:id"
        element={
          <ProtectedRoute>
            <ProductDetail />
          </ProtectedRoute>
        }
      />
      {/* <Route path="*" element={<Navigate to="/signup" replace />} /> */}
    </Routes>
  );
}

export default App;
