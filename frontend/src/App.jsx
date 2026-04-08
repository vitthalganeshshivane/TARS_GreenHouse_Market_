import { Navigate, Route, Routes } from "react-router-dom";
import Signup from "./pages/signup.jsx";
import Login from "./pages/login.jsx";
import ForgotPassword from "./pages/forgot.jsx";
import VerifyOTP from "./pages/verify.jsx";
import Success from "./pages/success.jsx";
import { Button } from "./components/ui/button.jsx";
import SearchProduct from "./components/searchProduct.jsx";
import NavbarBtn from "./components/navbarBtn.jsx";
import { Recycle } from "lucide-react";
import CategoryEntry from "./components/categoryEntry.jsx";
import CategoryCard from "./components/categoryCard.jsx";
import ProductCard from "./components/productCard.jsx";
import Topbar from "./components/pages/home/topbar.jsx";
import ProtectedRoute from "./routes/ProtectedRoute.jsx";
import PublicRoute from "./routes/PublicRoute.jsx";
import Home from "./pages/home.jsx";
import { useAuth } from "./hooks/useAuth.js";

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
      {/* <Route path="*" element={<Navigate to="/signup" replace />} /> */}
    </Routes>
  );
}

export default App;

// Component Usage
// <>
//   <SearchProduct />
//
//   <NavbarBtn icon={<Recycle />} text='Compare' badge={{ status: true, value: 5 }} link='https://ritish.site' />
//
//   <CategoryCard title='Category' >
//     <CategoryEntry icon={<Recycle />} text='compare' number='4' link='https://ritish.site' />
//   </CategoryCard>
//
//   <ProductCard image='https://www.sirimart.in/wp-content/uploads/2023/12/Organic_Red_Rice.jpg' ratingCount={20} category='Fresh Food' name='Organic Red Rice' rating={4} brand="NestFood" price={200} discount={5} sale={true} />
//
//
//   <Navbar />
//
//
// </>
