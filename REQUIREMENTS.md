# Restaurant Management System - Complete Requirements Document

## 📋 Table of Contents
1. [Project Overview](#project-overview)
2. [Functional Requirements](#functional-requirements)
3. [Technical Requirements](#technical-requirements)
4. [Data Models](#data-models)
5. [User Interface Requirements](#user-interface-requirements)
6. [User Stories](#user-stories)
7. [Features List](#features-list)
8. [Technical Stack](#technical-stack)
9. [Storage Requirements](#storage-requirements)
10. [Security Requirements](#security-requirements)
11. [Performance Requirements](#performance-requirements)
12. [Future Enhancements](#future-enhancements)
13. [Testing Requirements](#testing-requirements)
14. [Deployment Requirements](#deployment-requirements)

---

## 🎯 Project Overview

### Project Name
**Restaurant Management System (RMS)**

### Project Description
A comprehensive web-based restaurant management system that enables customers to browse menus, place orders, and allows restaurant administrators to manage food inventory, track orders, monitor revenue, and oversee table management.

### Project Goals
- Provide an intuitive ordering system for customers
- Enable efficient order management for restaurant staff
- Track revenue and sales analytics for management
- Manage food inventory and menu items
- Monitor table status and customer orders in real-time

### Target Users
1. **Customers**: Browse menu, place orders, select tables
2. **Restaurant Administrators**: Manage food items, view orders, track revenue, manage tables

---

## 📝 Functional Requirements

### 1. Customer-Facing Features

#### 1.1 Welcome Page
- **FR-1.1**: Display attractive welcome page with restaurant branding
- **FR-1.2**: Show "Order Now" button that navigates to menu selection
- **FR-1.3**: Display "Login" option for admin access
- **FR-1.4**: Include loading animation during navigation
- **FR-1.5**: Use high-quality background image with overlay effect

#### 1.2 Menu Selection
- **FR-1.6**: Display three main menu categories:
  - Breakfast
  - Lunch & Dinner
  - Drinks
- **FR-1.7**: Each category should have an icon and be clickable
- **FR-1.8**: Provide smooth hover effects and transitions
- **FR-1.9**: Enable navigation back to welcome page

#### 1.3 Food Category Pages
- **FR-1.10**: Display all food items in selected category
- **FR-1.11**: Show food item details:
  - Food name
  - Price (in USD)
  - Food image
- **FR-1.12**: Quantity selection for each item:
  - Decrease quantity button (-)
  - Display current quantity
  - Increase quantity button (+)
  - Minimum quantity: 1
- **FR-1.13**: Add/Remove items from cart:
  - "Add" button for items not in cart
  - "Added ✓" indicator for items in cart
  - Ability to toggle items in/out of cart
- **FR-1.14**: Display cart item count in header
- **FR-1.15**: Navigation back to menu selection page
- **FR-1.16**: Support for Breakfast, Lunch/Dinner, and Drinks categories

#### 1.4 Order Placement
- **FR-1.17**: Display order modal with cart items:
  - Food name
  - Unit price
  - Quantity
  - Item total
  - Delete option for each item
- **FR-1.18**: Calculate and display grand total
- **FR-1.19**: Table selection (Tables 1-6)
- **FR-1.20**: Validate table selection before order confirmation
- **FR-1.21**: Validate cart is not empty before placing order
- **FR-1.22**: Success notification upon order placement
- **FR-1.23**: Clear cart after successful order

#### 1.5 Order Editing
- **FR-1.24**: Access order edit modal from category pages
- **FR-1.25**: Select table number to load existing order
- **FR-1.26**: Load order items into cart for editing
- **FR-1.27**: Modify quantities and items in loaded order
- **FR-1.28**: Update order with new changes
- **FR-1.29**: Success notification upon order update

### 2. Administrator Features

#### 2.1 Authentication
- **FR-2.1**: Admin login page
- **FR-2.2**: Username and password authentication
- **FR-2.3**: Default credentials:
  - Username: `afghan`
  - Password: `123`
- **FR-2.4**: Form validation:
  - Check for empty fields
  - Validate credentials
- **FR-2.5**: Display error messages for invalid credentials
- **FR-2.6**: Success notification upon login
- **FR-2.7**: Redirect to admin dashboard after successful login
- **FR-2.8**: Loading animation during login process
- **FR-2.9**: Protected routes that require authentication

#### 2.2 Admin Dashboard Overview
- **FR-2.10**: Display key metrics:
  - Today's Total Orders count
  - Daily Revenue (calculated from today's orders)
- **FR-2.11**: Revenue and Orders Chart:
  - Line chart showing daily revenue
  - Line chart showing daily order count
  - Data grouped by date
  - Auto-refresh every 2 seconds
- **FR-2.12**: Responsive sidebar navigation
- **FR-2.13**: Mobile-friendly hamburger menu

#### 2.3 Food Management
- **FR-2.14**: Display all food items in grid
- **FR-2.15**: Food item display:
  - Food image (circular thumbnail)
  - Food name
  - Category badge
  - Price
- **FR-2.16**: Add new food item:
  - Food name (text input)
  - Price (number input)
  - Category selection (dropdown):
    - Breakfast
    - Lunch & Dinner
    - Drinks
  - Image upload (file input)
  - Form validation
  - Success notification
- **FR-2.17**: Edit existing food item:
  - Pre-populate form with existing data
  - Update all fields including image
  - Form validation
  - Success notification
- **FR-2.18**: Delete food item:
  - Confirmation modal before deletion
  - Success notification after deletion
- **FR-2.19**: Search functionality:
  - Search food items by name
  - Case-insensitive search
  - Real-time filtering
- **FR-2.20**: Store food data in browser localStorage
- **FR-2.21**: Persist food data across sessions

#### 2.4 Order History
- **FR-2.22**: Display all orders in table/card format
- **FR-2.23**: Order information display:
  - Food items (comma-separated names)
  - Categories
  - Total amount
  - Order date
- **FR-2.24**: Filter orders by:
  - Date (date picker)
  - Category (dropdown: All, Breakfast, Lunch, Drinks)
- **FR-2.25**: Calculate and display grand total of filtered orders
- **FR-2.26**: View detailed food items for each order (modal)
- **FR-2.27**: Delete orders with confirmation
- **FR-2.28**: Empty state when no orders match filters
- **FR-2.29**: Responsive design (table for desktop, cards for mobile)

#### 2.5 Table Management
- **FR-2.30**: Display all tables (1-6) in grid layout
- **FR-2.31**: Visual status indicator:
  - Green border and "Available" for empty tables
  - Yellow border and "Occupied" for tables with orders
- **FR-2.32**: Click table to view details (modal)
- **FR-2.33**: Display all orders for selected table:
  - Order ID/Number
  - Customer number (if multiple orders)
  - Order items with quantities and prices
  - Order total
  - Delivered checkbox
- **FR-2.34**: Mark order as delivered (checkbox toggle)
- **FR-2.35**: Mark order as paid (button):
  - Remove order from table
  - Update table status
- **FR-2.36**: Empty state when table has no orders

### 3. System Features

#### 3.1 Notifications
- **FR-3.1**: Toast notifications for:
  - Successful operations (green)
  - Error messages (red)
  - Warning messages (yellow)
  - Information messages (blue)
- **FR-3.2**: Auto-dismiss notifications after 3 seconds
- **FR-3.3**: Position notifications at top-right corner
- **FR-3.4**: Pause on hover functionality

#### 3.2 Loading States
- **FR-3.5**: Loading animation during:
  - Navigation to menu page
  - Admin login process
- **FR-3.6**: Customizable loading messages
- **FR-3.7**: Full-screen overlay during loading

#### 3.3 Data Persistence
- **FR-3.8**: Store food data in localStorage
- **FR-3.9**: Store order data in localStorage
- **FR-3.10**: Persist data across browser sessions
- **FR-3.11**: Handle localStorage errors gracefully

---

## 🔧 Technical Requirements

### Technology Stack

#### Frontend Framework
- **React 19.2.0**: UI library
- **React Router DOM 7.10.1**: Client-side routing
- **Vite**: Build tool and development server

#### Styling
- **Tailwind CSS 4.1.17**: Utility-first CSS framework
- **Autoprefixer**: CSS vendor prefixing
- **PostCSS**: CSS processing

#### UI Components & Icons
- **React Icons 5.5.0**: Icon library
- **Font Awesome React 3.1.1**: Font Awesome icons
- **Font Awesome Solid Icons 7.1.0**: Solid icon set

#### Data Visualization
- **Recharts 3.6.0**: Charting library for revenue analytics

#### Notifications
- **React Toastify 11.0.5**: Toast notification system
- **React Hot Toast 2.6.0**: Alternative toast notifications

#### Development Tools
- **ESLint 9.39.1**: Code linting
- **TypeScript Types**: Type definitions for React

### Browser Compatibility
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

### Responsive Design
- Mobile devices (320px+)
- Tablets (768px+)
- Desktops (1024px+)
- Large screens (1440px+)

---

## 🗄️ Data Models

### Food Item Model
```javascript
{
  id: Number,              // Unique identifier (timestamp)
  name: String,            // Food item name
  price: Number,           // Price in USD
  image: String,           // Image URL or path
  category: String         // "Breakfast" | "Lunch" | "Dinner" | "Drinks" | "Lunch & Dinner"
}
```

### Order Model
```javascript
{
  id: Number,              // Unique identifier (timestamp)
  date: String,            // Date string (MM/DD/YYYY)
  table: String,           // Table number ("1" to "6")
  items: Array,            // Array of order items
  orderTotal: Number,      // Total order amount
  delivered: Boolean       // Delivery status (optional)
}
```

### Order Item Model
```javascript
{
  id: Number,              // Food item ID
  name: String,            // Food item name
  category: String,        // Food category
  price: Number,           // Unit price
  quantity: Number,        // Quantity ordered
  total: Number            // Item total (price * quantity)
}
```

### Authentication Model
```javascript
{
  userName: String,        // Admin username
  password: String,        // Admin password
  isAuth: Boolean          // Authentication status
}
```

### Chart Data Model
```javascript
{
  date: String,            // Date string
  revenue: Number,         // Total revenue for date
  orders: Number           // Total orders count for date
}
```

---

## 🎨 User Interface Requirements

### Design Principles
1. **Color Scheme**:
   - Primary: Yellow (#facc15 / yellow-600)
   - Secondary: White (#ffffff)
   - Accent: Green (#22c55e / green-500)
   - Danger: Red (#ef4444 / red-500)
   - Background: Gray (#f9fafb / gray-50)

2. **Typography**:
   - Headings: Bold, extra-bold weights
   - Body: Regular weight
   - Font family: System default (sans-serif)

3. **Spacing**:
   - Consistent padding and margins
   - Grid system for layouts
   - Responsive gap spacing

4. **Effects**:
   - Smooth transitions (300ms)
   - Hover effects (scale, shadow)
   - Loading animations
   - Modal overlays

### Component Layouts

#### Welcome Page
- Full-screen layout
- Background image with blur overlay
- Centered content
- Animated button

#### Menu Selection Page
- Centered layout
- Grid of 3 category cards
- Equal spacing
- Hover animations

#### Food Category Pages
- Header with navigation and action buttons
- Responsive grid (1-5 columns based on screen size)
- Food cards with image, name, price
- Quantity controls and add button

#### Admin Dashboard
- Sidebar navigation (fixed on desktop, collapsible on mobile)
- Main content area
- Responsive grid for metrics
- Full-width chart section

#### Modals
- Centered overlay
- White background with rounded corners
- Close button or cancel action
- Responsive width (90% max-width)

---

## 👥 User Stories

### Customer Stories

**US-1**: As a customer, I want to view the restaurant welcome page, so I can learn about the restaurant and start ordering.

**US-2**: As a customer, I want to browse menu categories, so I can find the type of food I want.

**US-3**: As a customer, I want to see all available items in a category, so I can choose what to order.

**US-4**: As a customer, I want to adjust the quantity of items, so I can order the right amount.

**US-5**: As a customer, I want to add items to my cart, so I can build my order.

**US-6**: As a customer, I want to see my cart items and total, so I can review my order before placing it.

**US-7**: As a customer, I want to select a table number, so my order can be delivered to the correct location.

**US-8**: As a customer, I want to place my order, so I can receive my food.

**US-9**: As a customer, I want to edit my order, so I can modify items before receiving them.

**US-10**: As a customer, I want to see confirmation when my order is placed, so I know it was successful.

### Administrator Stories

**US-11**: As an administrator, I want to login securely, so I can access admin features.

**US-12**: As an administrator, I want to see today's revenue and order count, so I can track business performance.

**US-13**: As an administrator, I want to view revenue trends over time, so I can analyze business growth.

**US-14**: As an administrator, I want to add new food items, so I can update the menu.

**US-15**: As an administrator, I want to edit existing food items, so I can update prices or details.

**US-16**: As an administrator, I want to delete food items, so I can remove items that are no longer available.

**US-17**: As an administrator, I want to search for food items, so I can quickly find and manage specific items.

**US-18**: As an administrator, I want to view all orders, so I can track customer orders.

**US-19**: As an administrator, I want to filter orders by date, so I can analyze specific time periods.

**US-20**: As an administrator, I want to filter orders by category, so I can see what types of food are popular.

**US-21**: As an administrator, I want to view detailed order information, so I can see what items were ordered.

**US-22**: As an administrator, I want to delete orders, so I can remove incorrect or cancelled orders.

**US-23**: As an administrator, I want to see table statuses, so I can know which tables are occupied.

**US-24**: As an administrator, I want to view orders for a specific table, so I can manage table service.

**US-25**: As an administrator, I want to mark orders as delivered, so I can track order status.

**US-26**: As an administrator, I want to mark orders as paid, so I can update table status and revenue.

---

## ✨ Features List

### Implemented Features ✅

#### Customer Features
- [x] Welcome page with branding
- [x] Menu category selection
- [x] Food browsing by category
- [x] Quantity selection
- [x] Shopping cart functionality
- [x] Order placement with table selection
- [x] Order editing
- [x] Loading animations
- [x] Responsive design

#### Admin Features
- [x] Admin login system
- [x] Protected routes
- [x] Dashboard overview with metrics
- [x] Revenue and orders chart
- [x] Food management (CRUD)
- [x] Image upload for food items
- [x] Food search functionality
- [x] Order history view
- [x] Order filtering (date, category)
- [x] Order deletion
- [x] Table management
- [x] Order status tracking (delivered/paid)
- [x] Sidebar navigation
- [x] Responsive admin interface

#### System Features
- [x] Toast notifications
- [x] LocalStorage persistence
- [x] Error handling
- [x] Form validation
- [x] Loading states

### Known Issues & Missing Features ⚠️

#### Critical Issues
- [ ] **Food data initialization**: `foods.json` is not automatically loaded into localStorage
- [ ] **Category inconsistency**: Mismatch between "Lunch", "Dinner", and "Lunch & Dinner" categories
- [ ] **Image path validation**: Some image paths in foods.json may not match actual files

#### Recommended Enhancements
- [ ] Backend API integration (currently localStorage only)
- [ ] User authentication with JWT tokens
- [ ] Multiple admin accounts support
- [ ] Password encryption
- [ ] Order status workflow (Pending → Cooking → Ready → Delivered)
- [ ] Receipt printing functionality
- [ ] Email/SMS order confirmations
- [ ] Customer order tracking
- [ ] Payment integration
- [ ] Inventory management (stock levels)
- [ ] Food item availability toggle
- [ ] Advanced analytics and reports
- [ ] Multi-language support
- [ ] Dark mode theme
- [ ] Order cancellation feature
- [ ] Customer feedback/reviews
- [ ] Loyalty program
- [ ] Print kitchen tickets
- [ ] Table reservation system
- [ ] Staff management module

---

## 💾 Storage Requirements

### Browser localStorage Keys

1. **FoodData**: Array of food items
   ```javascript
   localStorage.setItem("FoodData", JSON.stringify([...foodItems]))
   ```

2. **Orders**: Array of order objects
   ```javascript
   localStorage.setItem("Orders", JSON.stringify([...orders]))
   ```

### Data Persistence
- All data stored in browser's localStorage
- Data persists across browser sessions
- Maximum localStorage size: ~5-10MB (browser dependent)
- No server-side storage currently

### Image Storage
- Images stored in `public/foodsImages/` directory
- Image paths referenced in food items
- Support for: .jpg, .jpeg, .png, .webp formats

---

## 🔒 Security Requirements

### Current Implementation
- **SR-1**: Basic username/password authentication
- **SR-2**: Protected routes using React Router
- **SR-3**: Client-side authentication state

### Security Gaps & Recommendations
- **SR-4**: ⚠️ Passwords stored in plain text (should be encrypted)
- **SR-5**: ⚠️ No session management (should implement JWT)
- **SR-6**: ⚠️ No password reset functionality
- **SR-7**: ⚠️ Client-side only authentication (should use backend)
- **SR-8**: ⚠️ No CSRF protection
- **SR-9**: ⚠️ No input sanitization (XSS risk)
- **SR-10**: ⚠️ localStorage can be accessed by any script

### Recommended Security Measures
- Implement backend authentication API
- Use JWT tokens for session management
- Hash passwords using bcrypt
- Implement HTTPS for all communications
- Add input validation and sanitization
- Implement rate limiting for login attempts
- Add CSRF tokens for state-changing operations
- Regular security audits

---

## ⚡ Performance Requirements

### Performance Targets
- **PR-1**: Initial page load: < 3 seconds
- **PR-2**: Navigation between pages: < 500ms
- **PR-3**: Order placement: < 1 second
- **PR-4**: Admin operations: < 2 seconds
- **PR-5**: Chart rendering: < 1 second

### Optimization Requirements
- **PR-6**: Lazy load images
- **PR-7**: Code splitting for routes
- **PR-8**: Minimize bundle size
- **PR-9**: Efficient localStorage operations
- **PR-10**: Debounce search inputs

### Browser Performance
- Support for browsers with localStorage
- Graceful degradation for older browsers
- Efficient re-rendering with React optimization

---

## 🚀 Future Enhancements

### Phase 2 Features (High Priority)
1. **Backend Integration**
   - RESTful API development
   - Database integration (PostgreSQL/MongoDB)
   - Server-side authentication
   - API documentation

2. **Enhanced Authentication**
   - JWT token-based auth
   - Password hashing
   - Multi-user support
   - Role-based access control

3. **Order Management**
   - Real-time order status updates
   - Kitchen display system
   - Order queue management
   - Order cancellation

4. **Data Initialization**
   - Auto-load foods.json on first run
   - Data migration scripts
   - Seed data functionality

### Phase 3 Features (Medium Priority)
1. **Payment Integration**
   - Multiple payment methods
   - Payment gateway integration
   - Receipt generation

2. **Analytics & Reporting**
   - Advanced analytics dashboard
   - Sales reports
   - Popular items analysis
   - Time-based analytics

3. **Customer Features**
   - Order tracking
   - Order history for customers
   - Customer accounts
   - Favorites/wishlist

4. **Inventory Management**
   - Stock levels
   - Low stock alerts
   - Supplier management
   - Cost tracking

### Phase 4 Features (Low Priority)
1. **Mobile Application**
   - React Native mobile app
   - Push notifications
   - Offline functionality

2. **Additional Features**
   - Table reservation system
   - Customer loyalty program
   - Reviews and ratings
   - Multi-language support
   - Dark mode
   - Print functionality
   - Email notifications

---

## 🧪 Testing Requirements

### Unit Testing
- **TR-1**: Test React components in isolation
- **TR-2**: Test utility functions
- **TR-3**: Test localStorage operations
- **TR-4**: Test form validations

### Integration Testing
- **TR-5**: Test order flow end-to-end
- **TR-6**: Test admin operations
- **TR-7**: Test authentication flow
- **TR-8**: Test data persistence

### User Acceptance Testing
- **TR-9**: Test on multiple browsers
- **TR-10**: Test on multiple devices (mobile, tablet, desktop)
- **TR-11**: Test with real user scenarios
- **TR-12**: Performance testing

### Test Coverage Goals
- Component coverage: > 80%
- Function coverage: > 75%
- Critical paths: 100%

---

## 📦 Deployment Requirements

### Build Process
- **DR-1**: Use Vite build command: `npm run build`
- **DR-2**: Optimize assets (minification, compression)
- **DR-3**: Generate production-ready bundle
- **DR-4**: Static file hosting ready

### Hosting Requirements
- **DR-5**: Static file hosting (Netlify, Vercel, AWS S3)
- **DR-6**: CDN for assets
- **DR-7**: HTTPS enabled
- **DR-8**: Custom domain support

### Environment Configuration
- **DR-9**: Environment variables for API endpoints
- **DR-10**: Production vs development configurations
- **DR-11**: Error logging and monitoring

### Deployment Checklist
- [ ] Build successful
- [ ] All assets optimized
- [ ] Environment variables configured
- [ ] HTTPS enabled
- [ ] Error tracking setup
- [ ] Analytics integration (optional)
- [ ] Performance monitoring
- [ ] Backup strategy

---

## 📊 Project Structure

```
restaurant-project/
├── public/
│   ├── foodsImages/      # Food item images
│   └── logo.jpg          # Restaurant logo
├── src/
│   ├── Admin/            # Admin components
│   │   ├── AdminDashbord.jsx
│   │   ├── FoodDataStorage.jsx
│   │   ├── OrderHistory.jsx
│   │   ├── OverviewChart.jsx
│   │   ├── ProtectedRoute.jsx
│   │   └── Tables.jsx
│   ├── Components/       # Customer-facing components
│   │   ├── BrekFast.jsx
│   │   ├── Drinks.jsx
│   │   ├── LunchAndDinner.jsx
│   │   └── sd.jsx
│   ├── Data/            # Static data
│   │   └── foods.json
│   ├── Pages/           # Page components
│   │   ├── MenusPage.jsx
│   │   ├── RestaurantLoader.jsx
│   │   ├── SignUp.jsx
│   │   └── Willcome.jsx
│   ├── images/          # Image assets
│   ├── App.jsx          # Main app component
│   ├── App.css          # Global styles
│   ├── index.css        # Base styles
│   └── main.jsx         # Entry point
├── eslint.config.js     # ESLint configuration
├── index.html           # HTML template
├── package.json         # Dependencies
├── vite.config.js       # Vite configuration
└── README.md            # Project documentation
```

---

## 📝 Additional Notes

### Development Guidelines
1. Use functional components with React Hooks
2. Follow React best practices
3. Use Tailwind CSS for styling
4. Implement error handling for all async operations
5. Add loading states for better UX
6. Validate all user inputs
7. Use semantic HTML elements
8. Ensure accessibility (a11y) compliance

### Code Quality
- Use ESLint for code linting
- Follow consistent naming conventions
- Comment complex logic
- Keep components focused and reusable
- Avoid prop drilling (use Context API when needed)

### Browser Support
- Modern browsers (last 2 versions)
- Chrome, Firefox, Safari, Edge
- Mobile browsers (iOS Safari, Chrome Mobile)

---

## 📞 Support & Maintenance

### Maintenance Tasks
- Regular dependency updates
- Security patches
- Bug fixes
- Performance optimization
- Feature enhancements

### Version History
- **v1.0.0**: Initial release with core features

---

## ✅ Acceptance Criteria

### Customer Features
- ✅ Can navigate from welcome to menu selection
- ✅ Can browse food items by category
- ✅ Can add items to cart with quantities
- ✅ Can place orders with table selection
- ✅ Can edit existing orders
- ✅ Receives visual feedback for all actions

### Admin Features
- ✅ Can login with valid credentials
- ✅ Can view dashboard with metrics and charts
- ✅ Can manage food items (add, edit, delete)
- ✅ Can view and filter order history
- ✅ Can manage tables and order status
- ✅ Cannot access admin pages without authentication

### System Features
- ✅ Data persists in browser localStorage
- ✅ Notifications display for user actions
- ✅ Loading states show during operations
- ✅ Responsive design works on all devices
- ✅ Smooth navigation between pages

---

**Document Version**: 1.0  
**Last Updated**: 2024  
**Status**: Active Development
