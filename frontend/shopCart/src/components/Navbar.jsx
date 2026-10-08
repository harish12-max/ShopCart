import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import { useCart } from "../Context/CartContext";
import axiosInstance from "../AxiosCall/axios";
import "../styles/navbar.css";

const Navbar = () => {
    const { user, setUser } = useAuth();
    const { totalItems } = useCart();
    const [search, setSearch] = useState("");
    const [mobileOpen, setMobileOpen] = useState(false);

    const location = useLocation();
    const navigate = useNavigate();

    const profileName =
        user?.name ||
        user?.email?.split("@")[0] ||
        "Account";

    const isHomeActive = location.pathname === "/home";
    const isProductsActive = location.pathname.startsWith("/products");
    const isWishlistActive = location.pathname === "/wishlist";
    const isCartActive = location.pathname === "/cart";
    const isOrdersActive =
        location.pathname.startsWith("/orders") ||
        location.pathname === "/checkout";

    const closeMobileMenu = () => {
        setMobileOpen(false);
    };

    const handleLogout = async () => {
        try {
            await axiosInstance.post("/user/logout");
        } catch (error) {
            console.error("Logout error:", error);
        } finally {
            setUser(null);
            navigate("/login", { replace: true });
        }
    };

    const handleSearch = (event) => {
        event.preventDefault();

        const query = search.trim();

        if (!query) {
            navigate("/products");
            closeMobileMenu();
            return;
        }

        navigate(
            `/products?search=${encodeURIComponent(query)}`
        );
        closeMobileMenu();
    };

    return (
        <nav className="app-navbar">
            <div className="navbar-main">
                <Link
                    to="/home"
                    className="navbar-brand"
                    aria-label="ShopCart home"
                    onClick={closeMobileMenu}
                >
                    <span className="brand-icon">🛍️</span>
                    <span className="brand-name">ShopCart</span>
                </Link>

                <div
                    className={
                        mobileOpen
                            ? "navbar-menu open"
                            : "navbar-menu"
                    }
                >
                    <div className="navbar-links">
                        <Link
                            to="/home"
                            className={
                                isHomeActive
                                    ? "nav-link active"
                                    : "nav-link"
                            }
                            onClick={closeMobileMenu}
                        >
                            Home
                        </Link>

                        <Link
                            to="/products"
                            className={
                                isProductsActive
                                    ? "nav-link active"
                                    : "nav-link"
                            }
                            onClick={closeMobileMenu}
                        >
                            Products
                        </Link>

                        <Link
                            to="/wishlist"
                            className={
                                isWishlistActive
                                    ? "nav-link active"
                                    : "nav-link"
                            }
                            onClick={closeMobileMenu}
                        >
                            Wishlist
                        </Link>

                        <Link
                            to="/orders"
                            className={
                                isOrdersActive
                                    ? "nav-link active"
                                    : "nav-link"
                            }
                            onClick={closeMobileMenu}
                        >
                            My Orders
                        </Link>

                        <Link
                            to="/cart"
                            className={
                                isCartActive
                                    ? "nav-link active cart-nav-link"
                                    : "nav-link cart-nav-link"
                            }
                            onClick={closeMobileMenu}
                        >
                            <span>Cart</span>
                            <span className="cart-count">
                                ({totalItems})
                            </span>
                        </Link>
                    </div>

                    <form
                        className="navbar-search"
                        onSubmit={handleSearch}
                    >
                        <input
                            type="search"
                            placeholder="Search products or categories..."
                            name="search"
                            value={search}
                            onChange={(event) =>
                                setSearch(event.target.value)
                            }
                            aria-label="Search products"
                        />

                        <button
                            type="submit"
                            className="search-button"
                            aria-label="Search"
                        >
                            <span className="search-icon">⌕</span>
                        </button>
                    </form>

                    <div className="navbar-profile">
                        <div className="profile-info">
                            <span className="profile-avatar">
                                {profileName
                                    .charAt(0)
                                    .toUpperCase()}
                            </span>

                            <div className="profile-text">
                                <span className="profile-label">
                                    Signed in as
                                </span>
                                <span className="profile-name">
                                    {profileName}
                                </span>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={handleLogout}
                            className="logout-btn"
                        >
                            Logout
                        </button>
                    </div>
                </div>

                <button
                    type="button"
                    className="navbar-menu-button"
                    aria-label={
                        mobileOpen
                            ? "Close navigation menu"
                            : "Open navigation menu"
                    }
                    aria-expanded={mobileOpen}
                    onClick={() =>
                        setMobileOpen((open) => !open)
                    }
                >
                    <span></span>
                    <span></span>
                    <span></span>
                </button>
            </div>
        </nav>
    );
};

export default Navbar;
