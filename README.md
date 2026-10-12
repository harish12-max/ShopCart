# ShopCart

ShopCart is a full-stack e-commerce application built with React and Vite on the frontend, and Node.js, Express, and MongoDB/Mongoose on the backend. It includes user authentication, product browsing/search, cart and wishlist management, checkout with Razorpay, and order history.

> **Deployment note:** This repository is a development project and requires production configuration and payment-flow hardening before handling real customers or live payments. See [Pre-deployment checklist](#pre-deployment-checklist).

## Features

- User registration and login using hashed passwords and JWT authentication stored in an HTTP-only cookie
- Product listing, category/search filtering, and product details
- Cloudinary image uploads for products
- Cart quantity updates with stock checks
- Wishlist add/remove and listing
- Shipping address form and Razorpay checkout
- Order history and order detail views
- React Context for authentication, cart and wishlist state

## Repository structure

```text
ShopCart/
├── backend/
│   ├── config/              # Cloudinary and Razorpay configuration
│   ├── controllers/         # API controllers
│   ├── middleware/          # Authentication and image upload middleware
│   ├── modules/             # Mongoose models
│   ├── routes/               # Express API routes
│   ├── utils/                # JWT helper
│   ├── index.js              # Backend entry point
│   └── package.json
└── frontend/
    └── shopCart/
        ├── src/
        │   ├── AxiosCall/    # Axios API client
        │   ├── components/
        │   ├── Context/
        │   ├── pages/
        │   └── styles/
        ├── package.json
        └── vite.config.js
```

## Prerequisites

Install the following before starting:

- Node.js (use a current supported LTS release)
- npm
- MongoDB database, either local MongoDB or a MongoDB Atlas cluster
- Cloudinary account if you intend to upload product images through the API
- Razorpay account and API keys for testing checkout

## Environment variables

### Backend

Create `backend/.env` (do not commit it):

```dotenv
# MongoDB connection string
dbUrl=mongodb+srv://<username>:<password>@<cluster>/<database>?retryWrites=true&w=majority

# Long, random secret used to sign JWTs
gen_secret=<use-a-long-random-secret>

# Cloudinary credentials (required for uploading product images)
cloudinaryCloudName=<cloudinary-cloud-name>
cloudinaryApiKey=<cloudinary-api-key>
cloudinaryApiSecret=<cloudinary-api-secret>

# Razorpay server credentials
RAZORPAY_KEY_ID=<razorpay-key-id>
RAZORPAY_KEY_SECRET=<razorpay-key-secret>
```

Use the exact variable names shown above; they match the backend configuration files. Do not put the Razorpay secret, JWT secret, or Cloudinary API secret in frontend environment variables or browser code. The Razorpay key ID is returned to the checkout client; the key secret must remain on the server.

### Frontend

The current Axios client is hard-coded to `http://localhost:8082`. For production, configure the API origin using a Vite environment variable (for example, `VITE_API_BASE_URL`) and update the Axios client to read it. Do not set it to a localhost URL in the deployed build.

For local development, the backend base URL is currently:

```text
http://localhost:8082
```

The current backend CORS configuration only permits `http://localhost:5173`. When deploying, set the allowed origin to the exact deployed frontend origin and configure cookies for the hosting topology (see [Pre-deployment checklist](#pre-deployment-checklist)).

## Run locally

Run the backend and frontend in **separate terminals**.

### 1. Clone the repository

```bash
git clone https://github.com/harish12-max/ShopCart.git
cd ShopCart
```

### 2. Configure and start the backend

```bash
cd backend
npm install
```

Create `backend/.env` using the template above, then start the server:

```bash
node index.js
```

The current server listens on port `8082`. Confirm that the console reports that MongoDB has connected and the server has started. The backend currently does not define a `start` script in `package.json`.

### 3. Start the frontend

Open a second terminal in the repository root:

```bash
cd frontend/shopCart
npm install
npm run dev
```

Vite normally serves the app at `http://localhost:5173`. Open that address in the browser. Keep the backend running in the first terminal.

### 4. Build the frontend

From `frontend/shopCart`:

```bash
npm run build
npm run preview
```

The production build is written to `frontend/shopCart/dist`. `vite preview` is for local build verification; it is not a production server.

## API overview

All endpoints use the backend origin (locally `http://localhost:8082`). Most routes require the JWT cookie named `token`.

| Method | Endpoint | Purpose | Authentication |
|---|---|---|---|
| POST | `/user/signup` | Register a user | No |
| POST | `/user/login` | Log in | No |
| GET | `/user/me` | Get the current user | Yes |
| POST | `/user/logout` | Log out | No |
| GET | `/product/products` | List products | Yes |
| GET | `/product/products/:id` | Get one product | Yes |
| GET | `/product/search?search=&category=` | Search/filter products | Yes |
| POST | `/product/products` | Create a product; accepts multipart image upload | Yes |
| GET | `/wishlist/` | List wishlist | Yes |
| POST | `/wishlist/:productId` | Add product to wishlist | Yes |
| DELETE | `/wishlist/:productId` | Remove product from wishlist | Yes |
| GET | `/cart/` | Get cart | Yes |
| POST | `/cart/:productId` | Add/increment cart quantity | Yes |
| PATCH | `/cart/:productId` | Set cart quantity; JSON body: `{"quantity":2}` | Yes |
| DELETE | `/cart/:productId` | Remove item from cart | Yes |
| POST | `/orders/create-payment-order` | Create a pending order and Razorpay order | Yes |
| POST | `/orders/verify-payment` | Verify payment and mark the order paid | Yes |
| GET | `/orders/` | List the signed-in user's orders | Yes |
| GET | `/orders/:orderId` | Get one of the signed-in user's orders | Yes |

Product listing/search and cart/wishlist/order endpoints are currently behind authentication as implemented in the backend. Therefore, users need to sign in to browse products in the authenticated app.

## Razorpay testing

1. Configure Razorpay test-mode credentials in `backend/.env`.
2. Run the backend and frontend locally.
3. Sign in, add an in-stock product to the cart, and open checkout.
4. Complete the flow using Razorpay's test-mode payment method and credentials from Razorpay's official test documentation.
5. Confirm the order status, payment status, inventory stock, and cart state in the application/database.

Never test with a live key until the security and deployment checklist below has been addressed. A successful browser callback should not be treated as proof of payment on its own; payment must be verified on the server.

## Pre-deployment checklist

- [ ] Replace the hard-coded frontend Axios base URL with `VITE_API_BASE_URL` and set it in the deployment environment.
- [ ] Replace the backend's fixed CORS origin with an environment-configured allowlist for the deployed frontend. Keep `credentials: true`; do not use a wildcard origin with credentialed requests.
- [ ] Configure cookies for production: `Secure` on HTTPS, an appropriate `SameSite` policy, and consistent cookie options when clearing cookies. If the frontend and API use different sites, cross-site cookies generally require `SameSite=None; Secure` and must be tested in the target browsers.
- [ ] Configure a production port using `process.env.PORT` and bind the server as required by the deployment platform.
- [ ] Add health/readiness handling and avoid reporting server readiness before the MongoDB connection succeeds.
- [ ] Ensure secrets are stored only in the deployment platform's secret manager; rotate any credential that was ever committed or shared.
- [ ] Add request validation, rate limiting for authentication/payment endpoints, secure headers, appropriate logging, and production-safe error responses.
- [ ] Review product creation permissions. The current product creation endpoint requires login but does not implement an admin/owner role.
- [ ] Harden payment and inventory operations before live payments: prevent duplicate verification from decrementing stock twice, verify the payment/order association and amount, prevent overselling under concurrent checkouts, and handle abandoned/failed pending orders.
- [ ] Consider a server-side payment status reconciliation/webhook flow. Verify webhook signatures and make all payment/inventory state changes idempotent.
- [ ] Add backend `start` and test scripts; add real automated tests for auth, products, cart, wishlist, order creation, payment verification and stock behavior.
- [ ] Run `npm run build` for the frontend and fix build/lint issues before deployment.
- [ ] Test the deployed app end-to-end over HTTPS, including sign-in persistence, refresh on nested routes, CORS, Razorpay checkout, cancellation/failure, retry, stock changes and cart clearing.
- [ ] Configure frontend hosting to rewrite SPA routes to `index.html`, so direct visits to routes such as `/orders/:id` work after refresh.
- [ ] Add screenshots, a deployed demo link (once available), and licensing information if you intend this repository to be used publicly.

## Current limitations

- The backend package has no working test script or standard `start` script yet.
- The frontend API base URL and backend CORS origin are currently configured for local development only.
- Cookie options are currently only `httpOnly`; production cross-site deployment needs additional configuration.
- The order/payment implementation needs idempotency and inventory-concurrency protection before it should be trusted for real transactions.
- The `/product/products` creation endpoint currently allows any authenticated user to create products; there is no role-based admin authorization.
- No automated deployment pipeline or backend test suite is currently defined in the checked-in package scripts.

## License

No license file is currently present. Add a license if you want to define terms for reuse or distribution.
