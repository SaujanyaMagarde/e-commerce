# Shopify E-commerce Platform

A full-stack e-commerce platform built with React, Node.js, and MongoDB, consisting of three main applications: Customer Frontend, Admin Dashboard, and Backend API.

## Project Structure

```
├── Admin/           # Seller/Admin dashboard
├── Backend/         # REST API server
├── ecommerce/       # Customer-facing frontend
└── sample image/    # Product images and assets
```

## Features

### Customer Frontend (ecommerce/)
- Responsive product catalog with filtering and search
- Shopping cart functionality
- User authentication and profiles
- Newsletter subscription
- Product categories and collections
- Secure checkout process
- Breadcrumb navigation
- New arrivals section

### Admin Dashboard (Admin/)
- Product management (add, edit, delete)
- Order management
- Sales analytics
- Inventory tracking
- Seller profile management
- Secure authentication

### Backend API (Backend/)
- RESTful API endpoints
- JWT-based authentication
- Password encryption
- File upload support with Multer
- MongoDB data models
- Access and refresh token management

## Tech Stack

- **Frontend**: React, Redux, CSS
- **Backend**: Node.js, Express
- **Database**: MongoDB
- **Authentication**: JWT
- **File Storage**: Cloudinary
- **Build Tool**: Vite

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/yourusername/shopify-ecommerce.git
```

2. Install dependencies for each application:
```bash
# Install Backend dependencies
cd Backend
npm install

# Install Admin dashboard dependencies
cd ../Admin
npm install

# Install Customer frontend dependencies
cd ../ecommerce
npm install
```

3. Configure environment variables:
Create `.env` files in Backend/, Admin/, and ecommerce/ directories with necessary configurations.

4. Start the applications:
```bash
# Start Backend server
cd Backend
npm run dev

# Start Admin dashboard
cd ../Admin
npm run dev

# Start Customer frontend
cd ../ecommerce
npm run dev
```

## Environment Variables

### Backend
```
ACCESS_TOKEN_SECRET=your_access_token_secret
REFRESH_TOKEN_SECRET=your_refresh_token_secret
ACCESS_TOKEN_EXPIRY=1d
REFRESH_TOKEN_EXPIRY=10d
MONGODB_URI=your_mongodb_connection_string
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- React.js team for the amazing frontend library
- MongoDB team for the robust database
- Node.js community for the backend runtime
- All contributors who helped in building this project