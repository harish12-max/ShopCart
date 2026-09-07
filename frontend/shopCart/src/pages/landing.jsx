import { useNavigate } from "react-router-dom";
import "../styles/landing.css";

function Landing() {
  const navigate = useNavigate();

  return (
    <div className="landing-page">

      {/* =========================
          BACKGROUND GLOW
      ========================= */}

      <div className="landing-glow landing-blue"></div>
      <div className="landing-glow landing-purple"></div>
      <div className="landing-glow landing-cyan"></div>


      {/* =========================
          NAVBAR
      ========================= */}

      <nav className="landing-navbar">

        <div className="landing-brand">
          <div className="landing-brand-logo">
            🛒
          </div>

          <span>ShopCart</span>
        </div>

        <div className="landing-nav-buttons">

          <button
            className="nav-login"
            onClick={() => navigate("/login")}
          >
            Login
          </button>

          <button
            className="nav-signup"
            onClick={() => navigate("/signup")}
          >
            Sign Up
          </button>

        </div>

      </nav>


      {/* =========================
          HERO SECTION
      ========================= */}

      <section className="hero-section">

        <div className="hero-content">

          <div className="landing-badge">
            ✦ YOUR SHOPPING JOURNEY STARTS HERE
          </div>

          <h1>
            Shop smarter.
            <br />
            <span>Live better.</span>
          </h1>

          <p className="landing-description">
            Discover products you love, explore amazing deals,
            and enjoy a simple and seamless shopping experience
            built for you.
          </p>


          {/* HERO BUTTONS */}

          <div className="landing-actions">

            <button
              className="landing-signup-btn"
              onClick={() => navigate("/signup")}
            >
              Create Account
              <span>→</span>
            </button>

            <button
              className="landing-login-btn"
              onClick={() => navigate("/login")}
            >
              Login
              <span>↗</span>
            </button>

          </div>


          {/* FEATURES */}

          <div className="landing-features">

            <div className="landing-feature">
              <div className="feature-icon">⚡</div>

              <div>
                <h3>Fast & Simple</h3>
                <p>Easy shopping experience</p>
              </div>
            </div>


            <div className="landing-feature">
              <div className="feature-icon">🛍️</div>

              <div>
                <h3>Everything You Need</h3>
                <p>Explore products effortlessly</p>
              </div>
            </div>


            <div className="landing-feature">
              <div className="feature-icon">🔒</div>

              <div>
                <h3>Secure</h3>
                <p>Your account stays protected</p>
              </div>
            </div>

          </div>

        </div>


        {/* =========================
            SHOPPING CARD
        ========================= */}

        <div className="landing-decoration">

          <div className="decoration-circle circle-one"></div>
          <div className="decoration-circle circle-two"></div>


          <div className="floating-card card-one">
            🛍️
          </div>

          <div className="floating-card card-two">
            ✨
          </div>

          <div className="floating-card card-three">
            🛒
          </div>


          <div className="discount-card">
            -20%
          </div>


          <div className="shopping-card">

            <div className="shopping-card-top">
              <span>YOUR CART</span>
              <span>•••</span>
            </div>


            <div className="shopping-product">

              <div className="product-image">
                👟
              </div>

              <div className="product-info">
                <h4>Premium Product</h4>
                <p>Ready for you</p>
              </div>

              <strong>₹449</strong>

            </div>


            <div className="shopping-product">

              <div className="product-image">
                🎧
              </div>

              <div className="product-info">
                <h4>Wireless Audio</h4>
                <p>Best seller</p>
              </div>

              <strong>₹779</strong>

            </div>


            <div className="shopping-product">

              <div className="product-image">
                ⌚
              </div>

              <div className="product-info">
                <h4>Smart Watch</h4>
                <p>Trending</p>
              </div>

              <strong>₹359</strong>

            </div>


            <div className="cart-total">
              <span>Total</span>
              <strong>₹1687</strong>
            </div>

          </div>

        </div>


        {/* SCROLL INDICATOR */}

        <div className="scroll-indicator">
          <span>↓</span>
          <p>Explore more</p>
        </div>

      </section>


      {/* =========================
          STATS
      ========================= */}

      <section className="stats-section">

        <div className="stat">
          <h2>10K+</h2>
          <p>Products</p>
        </div>

        <div className="stat">
          <h2>500+</h2>
          <p>Brands</p>
        </div>

        <div className="stat">
          <h2>4.8/5</h2>
          <p>Customer Rating</p>
        </div>

        <div className="stat">
          <h2>24/7</h2>
          <p>Support</p>
        </div>

      </section>


      {/* =========================
          WHY SHOPCART
      ========================= */}

      <section className="why-section">

        <div className="section-heading">

          <span>WHY SHOPCART</span>

          <h2>
            Everything you need for a
            <br />
            <strong>better shopping experience.</strong>
          </h2>

          <p>
            We make online shopping simple, convenient,
            and enjoyable.
          </p>

        </div>


        <div className="why-cards">

          <div className="why-card">

            <div className="why-icon">
              🛍️
            </div>

            <h3>Wide Variety</h3>

            <p>
              Discover a wide range of products
              across different categories.
            </p>

          </div>


          <div className="why-card">

            <div className="why-icon">
              ⚡
            </div>

            <h3>Fast Shopping</h3>

            <p>
              Find what you need quickly with
              a smooth shopping experience.
            </p>

          </div>


          <div className="why-card">

            <div className="why-icon">
              🔒
            </div>

            <h3>Secure Experience</h3>

            <p>
              Your account and shopping experience
              are designed with security in mind.
            </p>

          </div>


          <div className="why-card">

            <div className="why-icon">
              💎
            </div>

            <h3>Great Deals</h3>

            <p>
              Discover exciting products and
              deals at great prices.
            </p>

          </div>

        </div>

      </section>


      {/* =========================
          TRENDING PRODUCTS
      ========================= */}

      <section className="products-section">

        <div className="section-heading">

          <span>TRENDING NOW</span>

          <h2>
            Explore what's
            <strong> trending.</strong>
          </h2>

          <p>
            Check out some of the products
            everyone is talking about.
          </p>

        </div>


        <div className="products-grid">

          <div className="product-card">

            <div className="product-card-image">
              👟

              <span className="product-badge">
                Popular
              </span>
            </div>

            <div className="product-card-info">
              <h3>Premium Sneakers</h3>

              <p>
                Comfortable everyday sneakers
              </p>

              <div className="product-price">
                <strong>₹1,299</strong>
                <span>★★★★★</span>
              </div>
            </div>

          </div>


          <div className="product-card">

            <div className="product-card-image">
              🎧

              <span className="product-badge">
                Best Seller
              </span>
            </div>

            <div className="product-card-info">
              <h3>Wireless Headphones</h3>

              <p>
                Immersive wireless audio
              </p>

              <div className="product-price">
                <strong>₹899</strong>
                <span>★★★★★</span>
              </div>
            </div>

          </div>


          <div className="product-card">

            <div className="product-card-image">
              ⌚

              <span className="product-badge">
                Trending
              </span>
            </div>

            <div className="product-card-info">
              <h3>Smart Watch</h3>

              <p>
                Stay connected every day
              </p>

              <div className="product-price">
                <strong>₹2,499</strong>
                <span>★★★★★</span>
              </div>
            </div>

          </div>


          <div className="product-card">

            <div className="product-card-image">
              🎒

              <span className="product-badge">
                New
              </span>
            </div>

            <div className="product-card-info">
              <h3>Everyday Backpack</h3>

              <p>
                Simple, stylish and practical
              </p>

              <div className="product-price">
                <strong>₹699</strong>
                <span>★★★★★</span>
              </div>
            </div>

          </div>

        </div>


        <button
          className="explore-btn"
          onClick={() => navigate("/signup")}
        >
          Explore Products
          <span>→</span>
        </button>

      </section>


      {/* =========================
          CTA
      ========================= */}

      <section className="cta-section">

        <div className="cta-glow"></div>

        <div className="cta-content">

          <div className="cta-icon">
            🛒
          </div>

          <h2>
            Ready to start
            <span> shopping?</span>
          </h2>

          <p>
            Create your account and discover
            everything ShopCart has to offer.
          </p>

          <button
            className="cta-button"
            onClick={() => navigate("/signup")}
          >
            Get Started
            <span>→</span>
          </button>

        </div>

      </section>


      {/* =========================
          FOOTER
      ========================= */}

      <footer className="landing-footer">

        <div className="footer-main">

          <div className="footer-brand">

            <div className="landing-brand">
              <div className="landing-brand-logo">
                🛒
              </div>

              <span>ShopCart</span>
            </div>

            <p>
              Your everyday shopping companion.
            </p>

          </div>


          <div className="footer-column">

            <h3>Shop</h3>

            <a href="#products">Products</a>
            <a href="#products">Categories</a>
            <a href="#products">Deals</a>

          </div>


          <div className="footer-column">

            <h3>Company</h3>

            <a href="#why">About</a>
            <a href="#why">Features</a>
            <a href="#why">Why ShopCart</a>

          </div>


          <div className="footer-column">

            <h3>Support</h3>

            <a href="#support">Contact</a>
            <a href="#support">Help Center</a>
            <a href="#support">FAQ</a>

          </div>

        </div>


        <div className="footer-bottom">

          <p>
            © 2026 ShopCart. All rights reserved.
          </p>

          <div>
            <a href="#privacy">Privacy</a>
            <a href="#terms">Terms</a>
          </div>

        </div>

      </footer>

    </div>
  );
}

export default Landing;