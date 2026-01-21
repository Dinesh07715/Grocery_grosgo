# GROGOS - Setup Instructions

## Quick Start Guide

### Prerequisites
- Node.js 16.x or higher
- npm 7.x or higher (or yarn/pnpm)

### Step 1: Install Dependencies
```bash
npm install
```

This will install all required dependencies including:
- React 18.2
- React Router DOM 6.20
- Tailwind CSS 3.3
- Axios 1.6
- Swiper 11.0
- React Hot Toast 2.4
- And other dependencies

### Step 2: Environment Setup
Copy `env.example` to `.env`:
```bash
cp env.example .env
```

Or create `.env` manually with:
```env
VITE_API_BASE_URL=http://localhost:8000/api
```

### Step 3: Run Development Server
```bash
npm run dev
```

The application will start at `http://localhost:3000`

### Step 4: Access the Application

1. **Signup/Login**
   - Visit `http://localhost:3000`
   - You'll be redirected to `/login`
   - For demo, use any 10-digit phone number
   - Use OTP: `123456` (for demo purposes)

2. **Explore Features**
   - Browse products on home page
   - Search for products
   - Add items to cart
   - Complete checkout flow

## Project Structure Overview

```
GROGOS/
├── public/              # Static files (icons, images)
├── src/
│   ├── components/      # Reusable UI components
│   ├── pages/          # Page-level components
│   ├── contexts/       # React Context providers
│   ├── services/       # API service layer
│   ├── utils/          # Helper functions & mock data
│   ├── config/         # Configuration files
│   └── assets/         # Images, icons (create if needed)
├── index.html          # HTML entry point
├── vite.config.js      # Vite configuration
├── tailwind.config.js  # Tailwind CSS configuration
└── package.json        # Dependencies and scripts
```

## Development Workflow

### Adding New Features
1. Create components in `src/components/`
2. Create pages in `src/pages/`
3. Add API services in `src/services/`
4. Update routes in `src/App.jsx`

### Styling
- Use Tailwind CSS utility classes
- Custom styles in `src/index.css`
- Theme colors in `tailwind.config.js`

### API Integration
1. Update `src/config/api.js` with your API base URL
2. Modify service files in `src/services/` to connect to real APIs
3. Remove mock data from `src/utils/mockData.js` when ready

## Mock Data

The application uses mock data for demonstration. To integrate with real backend:

1. **Replace Mock Data**
   - Update all service files (`authService.js`, `productService.js`, etc.)
   - Remove mock data imports from pages
   - Use actual API endpoints

2. **Update Context Providers**
   - Modify context providers to fetch from APIs
   - Add proper error handling
   - Implement loading states

## Building for Production

```bash
# Build optimized production bundle
npm run build

# Preview production build
npm run preview
```

The built files will be in the `dist/` directory.

## Troubleshooting

### Port Already in Use
If port 3000 is already in use, Vite will automatically use the next available port.

### Module Not Found Errors
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Tailwind CSS Not Working
Make sure `postcss.config.js` and `tailwind.config.js` are in the root directory.

### Images Not Loading
- Check image URLs in `src/utils/mockData.js`
- Ensure images are accessible
- Use placeholder images if CDN is down

## Next Steps

1. **Backend Integration**
   - Set up your backend API
   - Update API endpoints in `src/config/api.js`
   - Modify service files to use real APIs

2. **Testing**
   - Add unit tests with Jest
   - Add integration tests with React Testing Library
   - Add E2E tests with Cypress

3. **Deployment**
   - Deploy to Vercel, Netlify, or similar
   - Configure environment variables
   - Set up CI/CD pipeline

## Support

For issues or questions:
- Check the README.md for detailed documentation
- Review component code for implementation details
- Check service files for API integration patterns


