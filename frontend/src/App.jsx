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
import DashboardLayout from "./components/Vendor/dashboard/Layout.jsx";
import DashboardPage from "./pages/vendor/dashboards/DashboardPage.jsx";
import OrdersPage from "./pages/vendor/dashboards/OrdersPage.jsx";
import ProductsPage from "./pages/vendor/dashboards/ProductsPage.jsx";
import AddProductPage from "./pages/vendor/dashboards/AddProductPage.jsx";
import InventoryPage from "./pages/vendor/dashboards/InventoryPage.jsx";
import CategoriesPage from "./pages/vendor/dashboards/CategoriesPage.jsx";
import TransactionsPage from "./pages/vendor/dashboards/TransactionsPage.jsx";
import SettingsPage from "./pages/vendor/dashboards/SettingsPage.jsx";
import EditProductPage from "./pages/vendor/dashboards/EditProductPage.jsx";
import VendorRoute from "./routes/VendorRoute.jsx";
import MainLayout from "./components/layout/MainLayout.jsx";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { fetchCart } from "./redux/slices/cartSlice.js";
import AddressPage from "./components/customer/Address/layout.jsx";
import { fetchAddresses } from "./redux/slices/addressSlice.js";
import CartPage from "./components/customer/cart/layout.jsx";
import OrderDetailsPage from "./components/customer/order/OrderDetailsPage.jsx";
import PaymentStatusPage from "./components/customer/payment/PaymentStatusPage.jsx";
import WishlistPage from "./pages/wishlist.jsx";
import { fetchWishlist } from "./redux/slices/wishlistSlice";
import AccountLayout from "./components/customer/Account/layout.jsx";
import MyOrders from "./components/customer/Account/MyOrders.jsx";

function RootRedirect() {
  const { user, loading } = useAuth();

  if (loading) return <p>Loading...</p>;

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return user.role === "vendor" ? (
    <Navigate to="/vendor" replace />
  ) : (
    <Navigate to="/home" replace />
  );
}

function App() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchCart());
    dispatch(fetchAddresses());
    dispatch(fetchWishlist());
  }, [dispatch]);

  return (
    <Routes>
      <Route path="/" element={<RootRedirect />} />

      {/* 🔥 FIXED: Nested routes */}
      {/* <Route
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      > */}
      <Route path="/home" element={<Home />} />
      {/* <Route path="/address" element={<AddressPage />} /> */}
      <Route path="/address" element={<AddressPage />} />
      <Route path="/product" element={<Product />} />
      <Route path="/product/:id" element={<ProductDetail />} />
      <Route path="/category/:slug" element={<BrowseCategory />} />
      <Route path="/all-products" element={<BrowseAllProducts />} />

      <Route path="/cart" element={<CartPage />} />

      <Route path="/order/:id" element={<OrderDetailsPage />} />
      <Route path="/payment-status" element={<PaymentStatusPage />} />

      <Route path="/account" element={<AccountLayout />} />

      <Route
        path="/orders"
        element={
          <div className="bg-white px-5 py-5">
            <MyOrders />
          </div>
        }
      />
      {/* </Route> */}

      {/* Public routes */}
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />
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

      <Route
        path="/wishlist"
        element={
          <ProtectedRoute>
            <WishlistPage />
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

      {/* <Route path="/vendor" element={<DashboardLayout />} /> */}
      <Route
        path="/vendor"
        element={
          <VendorRoute>
            {" "}
            <DashboardLayout />{" "}
          </VendorRoute>
        }
      >
        <Route index element={<DashboardPage />} />
        <Route path="orders" element={<OrdersPage />} />
        <Route path="products" element={<ProductsPage />} />
        <Route path="products/add" element={<AddProductPage />} />
        <Route path="products/edit/:id" element={<EditProductPage />} />
        <Route path="inventory" element={<InventoryPage />} />
        <Route path="categories" element={<CategoriesPage />} />
        <Route path="transactions" element={<TransactionsPage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>

      {/* <Route path="*" element={<Navigate to="/signup" replace />} /> */}
    </Routes>
  );
}

export default App;
