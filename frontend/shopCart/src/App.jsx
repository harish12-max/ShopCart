import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/home";
import Landing from "./pages/landing";
import Login from "./pages/login";
import Signup from "./pages/signup";
import Products from "./pages/products";
import ProductDetails from "./pages/productDetails";
import Cart from "./pages/cart";
import { AuthProvider } from "./Context/AuthContext";
import { WishlistProvider } from "./Context/WishlistContext";
import { CartProvider } from "./Context/CartContext";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";
import AuthenticatedLayout from "./components/AuthenticatedLayout";
import WishList from "./pages/wishList";
import Checkout from "./pages/checkout";
import Orders from "./pages/orders";

function App() {
    return (
        <AuthProvider>
            <WishlistProvider>
                <BrowserRouter>
                    <Routes>
                        <Route path="/" element={<PublicRoute><Landing /></PublicRoute>} />
                        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
                        <Route path="/signup" element={<PublicRoute><Signup /></PublicRoute>} />

                        <Route
                            element={
                                <ProtectedRoute>
                                    <CartProvider>
                                        <AuthenticatedLayout />
                                    </CartProvider>
                                </ProtectedRoute>
                            }
                        >
                            <Route path="/home" element={<Home />} />
                            <Route path="/products" element={<Products />} />
                            <Route path="/products/:id" element={<ProductDetails />} />
                            <Route path="/wishlist" element={<WishList />} />
                            <Route path="/cart" element={<Cart />} />
                            <Route path="/checkout" element={<Checkout />} />
                            <Route path="/orders" element={<Orders />} />
                            <Route path="/orders/:id" element={<Orders />} />
                        </Route>
                    </Routes>
                </BrowserRouter>
            </WishlistProvider>
        </AuthProvider>
    );
}

export default App;
