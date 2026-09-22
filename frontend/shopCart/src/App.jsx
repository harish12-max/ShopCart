import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/home";
import Landing from "./pages/landing";
import Login from "./pages/login";
import Signup from "./pages/signup";
import Products from "./pages/products";
import ProductDetails from "./pages/productDetails";
import { AuthProvider } from "./Context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";
import AuthenticatedLayout from "./components/AuthenticatedLayout";

function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    {/* Public pages */}
                    <Route path="/" element={<PublicRoute><Landing /></PublicRoute>} />
                    <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
                    <Route path="/signup" element={<PublicRoute><Signup /></PublicRoute>} />

                    {/* Authenticated application */}
                    <Route
                        element={
                            <ProtectedRoute>
                                <AuthenticatedLayout />
                            </ProtectedRoute>
                        }
                    >
                        <Route path="/home" element={<Home />} />
                        <Route path="/products" element={<Products />} />
                        <Route path="/products/:id" element={<ProductDetails />} />
                    </Route>
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;
