# E-commerce Frontend Application

A modern, responsive e-commerce frontend built with React, Redux, and CSS.

## Project Structure

```
src/
├── Components/
│   ├── Assets/        # Static assets and images
│   ├── Breadcrum/     # Navigation breadcrumbs
│   ├── CartItem/      # Shopping cart components
│   ├── Footer/        # Site footer
│   ├── Hero_sec/      # Homepage hero section
│   ├── Navbar/        # Navigation header
│   ├── NewCollections/# New products showcase
│   ├── NewsLetter/    # Newsletter subscription
│   ├── Offers/        # Special offers section
│   ├── Popular/       # Popular products
│   └── Profile/       # User profile management
├── Pages/
│   ├── CartPage/      # Shopping cart view
│   ├── LoginPage/     # User authentication
│   ├── Product/       # Product details
│   └── Signup/        # User registration
├── ReduxStore/        # State management
└── utils/            # Helper functions
```

## Key Features

- 📱 Responsive design for all devices
- 🔐 User authentication system
- 🛍️ Product catalog with filters
- 🛒 Shopping cart functionality
- 👤 User profile management
- 📦 Order tracking
- 📧 Newsletter subscription
- 🔍 Product search
- 📂 Category navigation

## Tech Stack

- React 18
- Redux Toolkit
- React Router v6
- CSS Modules
- Vite

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```env
VITE_API_URL=your_backend_url
```

3. Start development server:
```bash
npm run dev
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/name`)
3. Commit changes (`git commit -m 'Add feature'`)
4. Push to branch (`git push origin feature/name`)
5. Open Pull Request

## License

MIT License - See LICENSE file for details