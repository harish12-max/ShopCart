import "./login.css";

function Login() {
  return (
    <div className="login-page">

      {/* Background Glow */}
      <div className="login-glow login-blue"></div>
      <div className="login-glow login-purple"></div>
      <div className="login-glow login-cyan"></div>

      <div className="login-container">

        {/* LEFT SIDE */}
        <div className="login-left">

          <div className="brand">
            <div className="brand-logo">
              🛒
            </div>

            <span>ShopCart</span>
          </div>

          <div className="welcome-content">

            <p className="small-title">
              YOUR SHOPPING JOURNEY STARTS HERE
            </p>

            <h1>
              Shop what you
              <span> love.</span>
            </h1>

            <p className="description">
              Discover amazing products, exclusive deals and
              everything you need — all in one place.
            </p>

            <div className="shopping-features">

              <div className="feature">
                <span>✦</span>
                <p>Thousands of products</p>
              </div>

              <div className="feature">
                <span>✦</span>
                <p>Exclusive deals & offers</p>
              </div>

              <div className="feature">
                <span>✦</span>
                <p>Simple & secure shopping</p>
              </div>

            </div>

          </div>

        </div>

        {/* LOGIN CARD */}
        <div className="login-card">

          <div className="card-icon">
            👋
          </div>

          <h2>Welcome Back!</h2>

          <p className="card-subtitle">
            Login to continue your shopping journey.
          </p>

          <form>

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
                placeholder="Enter your password"
              />

            </div>

            <button
              type="submit"
              className="login-btn"
            >
              Login
              <span>→</span>
            </button>

          </form>

          <div className="divider">
            <span></span>
            <p>OR</p>
            <span></span>
          </div>

          <p className="bottom-text">
            Don't have an account?
            <a href="/signup"> Create Account</a>
          </p>

        </div>

      </div>

    </div>
  );
}

export default Login;