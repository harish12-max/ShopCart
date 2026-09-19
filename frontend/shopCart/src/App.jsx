import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/home";
import Landing from "./pages/landing";
import Login from "./pages/login";
import Signup from "./pages/signup";
import Products from "./pages/products";
import { AuthProvider } from "./Context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";
import ProductDetails from "./pages/productDetails";


function App() {
  return (

    <AuthProvider>
      <BrowserRouter>
        <Routes>

          <Route path="/" element={<PublicRoute><Landing /></PublicRoute>} />
          <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
          <Route path="/signup" element={<PublicRoute><Signup /></PublicRoute>} />
          <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
          <Route path="/products" element={<ProtectedRoute><Products /></ProtectedRoute>} />
          <Route path="/products/:id" element={<ProtectedRoute><ProductDetails/></ProtectedRoute>} />

        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;