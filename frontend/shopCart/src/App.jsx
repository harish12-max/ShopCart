import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./Context/AuthContext";
import { CartProvider } from "./Context/CartContext";
import { WishlistProvider } from "./Context/WishlistContext";
import AuthenticatedLayout from "./components/AuthenticatedLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";
import Cart from "./pages/cart";
import Checkout from "./pages/checkout";
import Home from "./pages/home";
import Landing from "./pages/landing";
import Login from "./pages/login";
import Orders from "./pages/orders";
import ProductDetails from "./pages/productDetails";
import Products from "./pages/products";
import Signup from "./pages/signup";
import WishList from "./pages/wishList";

const App = () => (
    <BrowserRouter>
        <AuthProvider>
            <WishlistProvider>
                <Routes>
                    <Route
                        path="/"
                        element={
                            <PublicRoute>
                                <Landing />
                            </PublicRoute>
                        }
                    />

                    <Route
                        path="/login"
                        element={
                            <PublicRoute>
                                <Login />
                            </PublicRoute>
                        }
                    />

                    <Route
                        path="/signup"
                        element={
                            <PublicRoute>
                                <Signup />
                            </PublicRoute>
                        }
                    />

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
                        <Route
                            path="/products/:id"
                            element={<ProductDetails />}
                        />
                        <Route path="/wishlist" element={<WishList />} />
                        <Route path="/cart" element={<Cart />} />
                        <Route path="/checkout" element={<Checkout />} />
                        <Route path="/orders" element={<Orders />} />
                        <Route
                            path="/orders/:id"
                            element={<Orders />}
                        />
                    </Route>
                </Routes>
            </WishlistProvider>
        </AuthProvider>
    </BrowserRouter>
);

export default App;
