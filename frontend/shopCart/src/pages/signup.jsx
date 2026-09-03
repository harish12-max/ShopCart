import "./signup.css";

function Signup() {
  return (
    <div className="signup-page">

      {/* Background Glow */}
      <div className="signup-glow signup-blue"></div>
      <div className="signup-glow signup-purple"></div>
      <div className="signup-glow signup-cyan"></div>

      <div className="signup-container">

        {/* SIGNUP CARD */}

        <div className="signup-card">

          <div className="signup-icon">
            🛍️
          </div>

          <h1>Create Account</h1>

          <p className="signup-subtitle">
            Join ShopCart and start your shopping journey.
          </p>

          <form>

            <div className="input-group">

              <label>Name</label>

              <input
                type="text"
                placeholder="Enter your name"
              />

            </div>

            <div className="input-group">

              <label>Gmail</label>

              <input
                type="email"
                placeholder="Enter your Gmail"
              />

            </div>

            <div className="input-group">

              <label>Password</label>

              <input
                type="password"
                placeholder="Create your password"
              />

            </div>

            <div className="input-group">

              <label>Phone Number</label>

              <input
                type="tel"
                placeholder="Enter your phone number"
              />

            </div>

            <button
              type="submit"
              className="signup-btn"
            >
              Create Account
              <span>→</span>
            </button>

          </form>

          <div className="signup-divider">

            <span></span>

            <p>OR</p>

            <span></span>

          </div>

          <p className="login-text">

            Already have an account?

            <a href="/login">
              {" "}Login
            </a>

          </p>

        </div>

        {/* RIGHT SIDE */}

        <div className="signup-right">

          <div className="signup-brand">

            <div className="signup-brand-logo">
              🛒
            </div>

            <span>ShopCart</span>

          </div>

          <p className="signup-small-title">
            EVERYTHING YOU NEED
          </p>

          <h2>

            Your next
            <br />

            <span>favorite thing</span>

            <br />

            is waiting.

          </h2>

          <p className="signup-description">

            Create your account and discover a world
            of products, exciting offers and effortless
            shopping.

          </p>

          <div className="signup-tags">

            <div className="tag">
              🛍️ Easy Shopping
            </div>

            <div className="tag">
              ⚡ Great Deals
            </div>

            <div className="tag">
              ✨ New Arrivals
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Signup;