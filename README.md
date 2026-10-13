# ShopCart

A full-stack e-commerce application built with **React, Vite, Node.js, Express, and MongoDB**. ShopCart includes authentication, product browsing and search, cart and wishlist management, and an order checkout flow integrated with Razorpay.

## Live Demo

- **Frontend (Vercel):** [https://shop-cart-bay-six.vercel.app](https://shop-cart-bay-six.vercel.app)
- **Backend API (Render):** [https://shopcart-bklx.onrender.com](https://shopcart-bklx.onrender.com)
- **Backend health check:** [https://shopcart-bklx.onrender.com/health](https://shopcart-bklx.onrender.com/health)

> **Important:** This is a development project. Review the security and deployment checklist before exposing it publicly or accepting real payments. The current frontend API URL and backend CORS origin are configured for local development, and payment/inventory handling needs additional hardening before production use.

## Features

- **Authentication:** User registration and login, password hashing, and JWT authentication in an HTTP-only cookie
- **Product catalogue:** Product listing, search, category filtering, product details, and image uploads through Cloudinary
- **Cart:** Add items, change quantities, remove items, and check stock limits
- **Wishlist:** Add, list, and remove saved products
- **Checkout:** Shipping-address form and Razorpay payment flow
- **Orders:** View order history and order details
- **Client state:** React Context for authentication, cart, and wishlist state

## Tech stack

| Area | Technology |
| --- | --- |
| Frontend | React, Vite, React Router, Axios |
| Backend | Node.js, Express |
| Database | MongoDB, Mongoose |
| Authentication | bcrypt, JSON Web Tokens, HTTP-only cookies |
| Product images | Cloudinary |
| Payments | Razorpay |

## Repository structure

```text
ShopCart/
├── backend/
│   ├── config/                 # Cloudinary and Razorpay configuration
│   ├── controllers/             # Request handlers
│   ├── middleware/              # Authentication and upload middleware
│   ├── modules/                 # Mongoose models
│   ├── routes/                  # API routes
│   ├── utils/                   # JWT helper utilities
│   ├── index.js                 # Express entry point
│   └── package.json
└── frontend/
    └── shopCart/
        ├── src/
        │   ├── AxiosCall/       # Axios instance
        │   ├── components/
        │   ├── Context/
        │   ├── pages/
        │   ├── styles/
        │   └── utils/
        ├── package.json
        └── vite.config.js
```

## Prerequisites

Install the following:

- Node.js with npm
- A MongoDB database (local MongoDB or MongoDB Atlas)
- A Cloudinary account if you use product image uploads
- Razorpay test-mode credentials to test checkout

## Getting started

### 1. Clone the repository

```bash
git clone https://github.com/harish12-max/ShopCart.git
cd ShopCart
```

### 2. Configure the backend

```bash
cd backend
npm install
```

Create a file named `backend/.env` and add your own credentials:

```dotenv
# MongoDB connection string
dbUrl=mongodb+srv://<username>:<password>@<cluster>/<database>?retryWrites=true&w=majority

# Long, random secret for signing JWTs
gen_secret=<long-random-secret>

# Cloudinary credentials
cloudinaryCloudName=<cloudinary-cloud-name>
cloudinaryApiKey=<cloudinary-api-key>
cloudinaryApiSecret=<cloudinary-api-secret>

# Razorpay server credentials (use test-mode keys during development)
RAZORPAY_KEY_ID=<razorpay-key-id>
RAZORPAY_KEY_SECRET=<razorpay-key-secret>
```

Use the **exact variable names** above because the backend configuration reads them directly. Never commit `.env` files. Keep JWT, Razorpay, and Cloudinary secrets on the server; do not put secrets in frontend code or `VITE_*` variables.

Start the backend from the `backend` directory:

```bash
node index.js
```

The current backend listens on `http://localhost:8082`. Check the terminal for the server and database connection messages. The backend package currently does not define a standard `start` script.

### 3. Configure and start the frontend

Open a **second terminal** at the repository root:

```bash
cd frontend/shopCart
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser. Keep the backend running in the first terminal.

The frontend Axios instance currently uses `http://localhost:8082`, and the backend CORS configuration currently allows `http://localhost:5173`. These settings work for the current local-development setup, not for a deployed environment.

### 4. Build the frontend

From `frontend/shopCart`:

```bash
npm run build
npm run preview
```

The build output is generated in `frontend/shopCart/dist`. `vite preview` is useful for locally checking the build; it is not intended to be the production web server.

## API overview

The API examples below use the local backend origin: `http://localhost:8082`. Routes marked **Yes** require authentication through the `token` cookie.

| Method | Endpoint | Purpose | Authentication |
| --- | --- | --- | --- |
| POST | `/user/signup` | Register a user | No |
| POST | `/user/login` | Log in | No |
| GET | `/user/me` | Get the current user | Yes |
| POST | `/user/logout` | Log out | No |
| GET | `/product/products` | List products | Yes |
| GET | `/product/products/:id` | Get a product by ID | Yes |
| GET | `/product/search?search=&category=` | Search/filter products | Yes |
| POST | `/product/products` | Create a product; supports image upload | Yes |
| GET | `/wishlist/` | Get the wishlist | Yes |
| POST | `/wishlist/:productId` | Add a product to the wishlist | Yes |
| DELETE | `/wishlist/:productId` | Remove a product from the wishlist | Yes |
| GET | `/cart/` | Get the cart | Yes |
| POST | `/cart/:productId` | Add/increment a cart item | Yes |
| PATCH | `/cart/:productId` | Set cart quantity; JSON body: `{"quantity":2}` | Yes |
| DELETE | `/cart/:productId` | Remove an item from the cart | Yes |
| POST | `/orders/create-payment-order` | Create a pending order and Razorpay order | Yes |
| POST | `/orders/verify-payment` | Verify payment | Yes |
| GET | `/orders/` | List the signed-in user's orders | Yes |
| GET | `/orders/:orderId` | Get one of the signed-in user's orders | Yes |

**Note:** Product listing/search, cart, wishlist, and order routes are currently protected by authentication. The product-creation endpoint requires login but does not currently provide admin/owner role authorization.

## Testing the Razorpay flow

1. Use **test-mode** Razorpay credentials in `backend/.env`.
2. Start the backend and frontend.
3. Sign in, add an in-stock product to your cart, and open checkout.
4. Follow the Razorpay test checkout flow using the test methods and credentials in the [official Razorpay documentation](https://razorpay.com/docs/).
5. Check the resulting order/payment status, inventory stock, and cart state in the application and database.

Do not use live payment keys until you have completed the security and deployment review. A client-side callback alone is not proof of payment; payment must be verified server-side.

## Pre-deployment checklist

- [ ] **Frontend API URL:** Replace the hard-coded `http://localhost:8082` Axios base URL with an environment-configured API origin, such as `VITE_API_BASE_URL`, and configure it in the frontend hosting environment.
- [ ] **CORS:** Configure the backend to allow the exact deployed frontend origin. Keep credentialed requests configured correctly; do not combine credentialed requests with a wildcard origin.
- [ ] **Cookies:** Configure production cookies for HTTPS, including `Secure`, an appropriate `SameSite` policy, and consistent options when clearing cookies. Cross-site cookies commonly require `SameSite=None; Secure`; test in the actual hosting setup and target browsers.
- [ ] **Port and startup:** Read the listening port from `process.env.PORT` where required by the hosting provider, and make startup/readiness behavior reflect whether MongoDB has connected successfully.
- [ ] **Secrets:** Store credentials in the hosting provider's secret manager. Rotate any secret that has ever been committed or exposed.
- [ ] **Security controls:** Add validation, rate limiting for authentication/payment routes, secure headers, safe production error responses, and appropriate logging.
- [ ] **Authorization:** Restrict product creation to an authorized admin/owner role instead of any authenticated user.
- [ ] **Payment idempotency:** Ensure repeated payment verification cannot decrement stock or otherwise process the same order more than once. Verify the payment, order association, and amount on the server.
- [ ] **Inventory concurrency:** Prevent overselling when multiple checkouts occur at the same time, and define behavior for abandoned or failed pending orders.
- [ ] **Payment reconciliation:** Consider Razorpay webhooks or server-side reconciliation, with signature verification and idempotent state changes.
- [ ] **Testing:** Replace the placeholder backend test script with real tests for authentication, product access, cart, wishlist, order creation, payment verification, and inventory behavior.
- [ ] **Build and lint:** Run `npm run build` and `npm run lint` in `frontend/shopCart`; resolve any relevant failures before deployment.
- [ ] **End-to-end deployment test:** Test over HTTPS, including sign-in persistence, refreshes on nested routes, CORS, payment success/failure/cancellation, retry behavior, stock updates, and cart clearing.
- [ ] **SPA routing:** Configure frontend hosting to serve `index.html` for client-side routes so direct navigation and refreshes on pages such as order details work.
- [ ] **Project presentation:** Add screenshots, a demo link when available, and a license file if you want to define reuse/distribution terms.

## Known limitations

- The backend currently has no standard `start` script, and its test script is a placeholder.
- The frontend Axios URL and backend CORS origin are hard-coded for local development.
- The current cookie configuration needs production review for cross-origin deployment.
- Payment/inventory behavior needs additional idempotency and concurrency protection before handling real transactions.
- Product creation currently lacks role-based authorization.
- No automated deployment pipeline or backend test suite is configured in the checked-in package scripts.

## License

No license file is currently present. Unless a license is added, do not assume the repository is licensed for reuse or redistribution.
