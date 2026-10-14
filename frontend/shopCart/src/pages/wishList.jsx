import ProductCard from "../components/ProductCard";
import { useWishlist } from "../Context/WishlistContext";
import "../styles/wishlist.css";

const WishList = () => {
    const { wishlistProducts, loading, error } = useWishlist();

    return (
        <div className="wishlist-page">
            <div className="wishlist-header">
                <h1>My Wishlist</h1>
                <p>{wishlistProducts.length} items saved</p>
            </div>

            {loading ? (
                <div className="wishlist-state">
                    <div className="wishlist-loader"></div>
                    <p>Loading your wishlist...</p>
                </div>
            ) : error ? (
                <div className="wishlist-state wishlist-state--error">
                    <h2>Something went wrong</h2>
                    <p>{error}</p>
                </div>
            ) : wishlistProducts.length > 0 ? (
                <div className="wishlist-grid">
                    {wishlistProducts.map((product) => (
                        <ProductCard
                            key={product._id}
                            product={product}
                            variant="wishlist"
                        />
                    ))}
                </div>
            ) : (
                <div className="empty-wishlist">
                    <h2>Your wishlist is empty ❤️</h2>
                    <p>Add some products you love!</p>
                </div>
            )}
        </div>
    );
};

export default WishList;
