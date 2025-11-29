# BenineEats - Application Architecture & Data Flow

## 1. DATA MODELS

### User (Base Model)
```
User (AbstractUser)
├── Roles: client, driver, manager, admin
├── Fields:
│   ├── username, email, password
│   ├── first_name, last_name
│   ├── phone
│   ├── address
│   ├── avatar (image)
│   ├── is_available (for drivers)
│   └── role (enum)
└── Relations:
    ├── managed_restaurants (Manager → Restaurant)
    ├── orders (Client → Order)
    ├── deliveries (Driver → Order)
    ├── cart (OneToOne)
    └── schedules (Driver → DriverSchedule)
```

### Restaurant
```
Restaurant
├── Fields:
│   ├── name, description
│   ├── image, cover_image
│   ├── address, phone
│   ├── rating, rating_count
│   ├── delivery_time, delivery_fee
│   ├── minimum_order
│   ├── is_open, is_active
│   └── created_at
└── Relations:
    ├── manager (User - ForeignKey)
    ├── categories (ManyToMany)
    ├── products (Product)
    ├── orders (Order)
    ├── team_members (TeamMember)
    └── banners (Banner)
```

### Product
```
Product
├── Fields:
│   ├── name, description
│   ├── price (int)
│   ├── image
│   ├── is_available, is_popular, is_featured
│   └── created_at
└── Relations:
    ├── restaurant (Restaurant - ForeignKey)
    ├── category (Category - ForeignKey)
    └── cart_items (CartItem)
```

### Category
```
Category
├── Fields:
│   ├── name, icon
│   ├── image
│   ├── is_active
│   ├── order
│   └── restaurants (ManyToMany)
└── Products (reverse relation)
```

### Order & OrderItem
```
Order
├── Fields:
│   ├── status (pending → delivered)
│   ├── total, delivery_fee
│   ├── delivery_address
│   ├── customer_name, customer_phone
│   ├── notes
│   ├── created_at, updated_at
│   └── Relations:
│       ├── user (Client - ForeignKey)
│       ├── restaurant (Restaurant - ForeignKey)
│       ├── driver (User - ForeignKey, nullable)
│       └── items (OrderItem)
│
OrderItem
├── Fields:
│   ├── product_name (snapshot)
│   ├── product_price (snapshot)
│   ├── quantity
│   └── Relations:
│       ├── order (Order - ForeignKey)
│       └── product (Product - ForeignKey)
```

### Cart & CartItem
```
Cart (OneToOne with User)
├── Fields:
│   ├── created_at, updated_at
│   └── Relations:
│       └── user (User)
│
CartItem
├── Fields:
│   ├── quantity
│   └── Relations:
│       ├── cart (Cart - ForeignKey)
│       └── product (Product - ForeignKey)
```

### DriverSchedule
```
DriverSchedule
├── Fields:
│   ├── day (enum: monday-sunday)
│   ├── is_enabled (boolean)
│   ├── start_time, end_time
│   └── Relations:
│       └── driver (User - ForeignKey)
├── Unique: [driver, day]
└── One schedule entry per driver per day
```

### Banner
```
Banner
├── Fields:
│   ├── title, subtitle
│   ├── image
│   ├── link_type, link_id
│   ├── is_active
│   ├── order
│   └── Relations:
│       └── restaurant (Restaurant - ForeignKey, nullable)
```

### TeamMember
```
TeamMember
├── Fields:
│   ├── name, role, phone
│   ├── status (active/inactive)
│   ├── created_at
│   └── Relations:
│       └── restaurant (Restaurant - ForeignKey)
```

---

## 2. DATA FLOW ARCHITECTURE

### Authentication Flow
```
Mobile App
    ↓
[Login Screen]
    ↓
POST /api/auth/login/ {email, password}
    ↓
Backend validates credentials
    ↓
Generate JWT tokens (access, refresh)
    ↓
Return: { user, tokens: {access, refresh} }
    ↓
Store in: AsyncStorage + Context
    ↓
Load role-specific data
```

### Client (Customer) Flow
```
1. Authentication
   └─ Login → getProfile()

2. Browse
   ├─ getCategories()
   ├─ getRestaurants()
   ├─ getPopularProducts()
   ├─ getFeaturedRestaurants()
   └─ getBanners()

3. Shopping
   ├─ getRestaurant(id) → getProductsByRestaurant(id)
   ├─ addToCart(productId, quantity)
   ├─ updateCartQuantity(productId, quantity)
   ├─ removeFromCart(productId)
   └─ getCart()

4. Checkout
   ├─ createOrder(orderData)
   ├─ getOrders()
   └─ getOrder(id)
```

### Manager (Restaurant) Flow
```
1. Authentication
   └─ Login → getProfile() → loadManagerRestaurant()

2. Dashboard
   ├─ getManagerDashboard()
   ├─ getManagerRestaurant()
   ├─ updateRestaurant(data)
   ├─ toggleRestaurantOpen()

3. Products
   ├─ getProducts()
   ├─ addProduct(data) → uploadProductImage()
   ├─ updateProduct(id, data)
   └─ deleteProduct(id)

4. Orders
   ├─ getPendingOrders()
   ├─ updateOrderStatus(orderId, status, driverId?)

5. Banners
   ├─ getBanners()
   ├─ addBanner(data) → uploadBannerImage()
   ├─ updateBanner(id, data)
   └─ deleteBanner(id)

6. Team
   ├─ getTeam()
   ├─ addTeamMember(data)
   ├─ updateTeamMember(id, data)
   └─ deleteTeamMember(id)
```

### Driver Flow
```
1. Authentication
   └─ Login → getProfile() → loadDriverData()

2. Availability
   ├─ toggleDriverAvailability()
   │  └─ Updates User.is_available
   │
   └─ Schedule Management
      ├─ getDriverSchedule()
      └─ updateDriverDay(day, {is_enabled, start_time, end_time})

3. Missions
   ├─ getDriverMissions()
   ├─ getDriverDashboard()
   │  └─ Returns: {deliveries, rating, this_month}
   │
   └─ Orders
      ├─ getPendingOrders()
      └─ updateOrderStatus(orderId, 'delivering'|'delivered')
```

---

## 3. STATE MANAGEMENT (React Context)

### DataContext Structure
```
DataContext
├── Data State
│   ├── categories: []
│   ├── companies (restaurants): []
│   ├── products: []
│   ├── banners: []
│   ├── cart: []
│   ├── orders: []
│   ├── driverSchedule: {}
│   ├── driverAvailability: bool
│   └── drivers: []
│
├── Auth State
│   ├── user: {details + role-specific data}
│   ├── isAuthenticated: bool
│   ├── hasApiToken: bool
│   └── role: string
│
├── UI State
│   ├── isLoading: bool
│   ├── isOnline: bool
│   ├── userLocation: {lat, lng, address, city}
│   └── locationLoading: bool
│
└── Functions
    ├── Auth: login(), signup(), logout(), loadProfile()
    ├── Data: loadData(), refreshData(), loadDriverData()
    ├── Cart: addToCart(), removeFromCart(), updateCartQuantity(), clearCart()
    ├── Orders: placeOrder(), updateOrderStatus(), getOrders()
    ├── Driver: toggleDriverAvailability(), updateDriverSchedule(), toggleDayAvailability()
    ├── Products: addProduct(), updateProduct(), deleteProduct()
    ├── Banners: addBanner(), updateBanner(), deleteBanner()
    └── Profile: loadProfile(), updateProfile()
```

---

## 4. API ENDPOINTS

### Auth
```
POST   /api/auth/login/              → {user, tokens}
POST   /api/auth/register/           → {user, tokens}
POST   /api/auth/logout/             → status
POST   /api/auth/refresh/            → {access}
GET    /api/auth/profile/            → user details
PATCH  /api/auth/profile/            → update user
```

### Categories & Restaurants
```
GET    /api/categories/              → []
GET    /api/restaurants/             → []
GET    /api/restaurants/{id}/        → details
GET    /api/restaurants/featured/    → []
GET    /api/restaurants/by_category/?category_id=X
```

### Products
```
GET    /api/products/                → []
GET    /api/products/{id}/           → details
GET    /api/products/popular/        → []
GET    /api/products/featured/       → []
GET    /api/products/by_restaurant/?restaurant_id=X
POST   /api/products/                → create
PATCH  /api/products/{id}/           → update
DELETE /api/products/{id}/           → delete
POST   /api/products/{id}/upload_image/
```

### Cart
```
GET    /api/cart/                    → cart data
POST   /api/cart/items/              → add item
PUT    /api/cart/items/              → update quantity
DELETE /api/cart/items/?product_id=X
DELETE /api/cart/items/              → clear cart
```

### Orders
```
GET    /api/orders/                  → []
GET    /api/orders/{id}/             → details
POST   /api/orders/create_from_cart/ → create order
GET    /api/orders/pending/          → pending orders
POST   /api/orders/{id}/update_status/ → {status, driver_id?}
```

### Driver
```
GET    /api/driver/schedule/my_schedule/
POST   /api/driver/schedule/update_day/ → {day, is_enabled, start_time, end_time}
POST   /api/driver/schedule/toggle_availability/
GET    /api/driver/missions/
GET    /api/driver/dashboard/        → {deliveries, rating, this_month}
```

### Manager
```
GET    /api/manager/dashboard/
GET    /api/manager/restaurant/      → restaurant details
PATCH  /api/manager/restaurant/      → update
POST   /api/manager/restaurant/toggle_open/
```

### Banners
```
GET    /api/banners/
POST   /api/banners/                 → create
PATCH  /api/banners/{id}/            → update
DELETE /api/banners/{id}/
POST   /api/banners/{id}/upload_image/
```

### Team
```
GET    /api/team/
POST   /api/team/                    → add member
PATCH  /api/team/{id}/               → update
DELETE /api/team/{id}/
```

---

## 5. MOBILE APP SCREENS & DATA FLOW

### Client App
```
AuthStack
├─ LoginScreen
│  └─ login() → getProfile() → Browse Stack
│
BrowseStack
├─ HomeScreen
│  ├─ getCategories()
│  ├─ getRestaurants()
│  ├─ getPopularProducts()
│  └─ getFeaturedRestaurants()
│
├─ RestaurantDetailsScreen
│  └─ getRestaurant(id)
│     └─ Products → addToCart()
│
├─ CartScreen
│  ├─ getCart()
│  ├─ updateCartQuantity()
│  └─ placeOrder() → createOrder()
│
├─ OrdersScreen
│  ├─ getOrders()
│  └─ getOrder(id)
│
└─ ProfileScreen
   └─ loadProfile()
       └─ updateProfile()
```

### Manager App
```
AuthStack
├─ LoginScreen
│  └─ login() → loadManagerRestaurant()
│
ManagerStack
├─ DashboardScreen
│  ├─ getManagerDashboard()
│  └─ getManagerRestaurant()
│
├─ ProductsScreen
│  ├─ getProducts()
│  ├─ addProduct() → uploadProductImage()
│  ├─ updateProduct()
│  └─ deleteProduct()
│
├─ BannersScreen
│  ├─ getBanners()
│  ├─ addBanner() → uploadBannerImage()
│  ├─ updateBanner()
│  └─ deleteBanner()
│
├─ TeamScreen
│  ├─ getTeam()
│  ├─ addTeamMember()
│  ├─ updateTeamMember()
│  └─ deleteTeamMember()
│
├─ OrdersScreen
│  ├─ getPendingOrders()
│  └─ updateOrderStatus()
│
└─ ProfileScreen
   └─ loadProfile()
```

### Driver App
```
AuthStack
├─ LoginScreen
│  └─ login() → loadDriverData()
│
DriverStack
├─ DashboardScreen
│  ├─ getDriverDashboard()
│  ├─ toggleDriverAvailability()
│  └─ getPendingOrders()
│
├─ ScheduleScreen
│  ├─ getDriverSchedule()
│  ├─ toggleDayAvailability()
│  └─ updateDriverDay()
│
├─ MissionsScreen
│  ├─ getDriverMissions()
│  └─ updateOrderStatus()
│
└─ ProfileScreen
   ├─ loadProfile()
   └─ getDriverDashboard() (stats)
```

---

## 6. IMAGE UPLOAD FLOW

### For Products
```
1. User selects image from gallery
   └─ Image stored locally: file:///path/to/image
   
2. Product created with image URI
   ├─ POST /products/
   ├─ Response: {id, ...}
   ├─ Then: POST /products/{id}/upload_image/ (FormData)
   └─ Backend stores image
```

### For Banners
```
1. User selects image from gallery
   └─ Image stored locally: file:///path/to/image
   
2. Banner created with image URI
   ├─ POST /banners/
   ├─ Response: {id, ...}
   ├─ Then: POST /banners/{id}/upload_image/ (FormData)
   └─ Backend stores image
```

### For Restaurants
```
1. User selects image from gallery
   └─ Image stored locally: file:///path/to/image
   
2. Restaurant updated
   ├─ POST /restaurants/{id}/upload_image/ (FormData)
   └─ Backend stores image
```

---

## 7. FIELD MAPPING (Frontend ↔ Backend)

### Driver Schedule
```
Frontend                Backend
─────────────────────────────
enabled              ← is_enabled
startTime            ← start_time
endTime              ← end_time
```

### Driver Dashboard
```
Frontend                Backend
─────────────────────────────
deliveries           ← deliveries
rating               ← rating
thisMonth            ← this_month
```

---

## 8. CACHING STRATEGY

### Local Storage (AsyncStorage)
```
- user (JSON)
- accessToken (string)
- refreshToken (string)
- categories (JSON array)
- companies (JSON array)
- products (JSON array)
- cart (JSON array)
- orders (JSON array)
```

### Cache Loading
```
1. On app start → Load from AsyncStorage
2. If online → Fetch from API & update cache
3. If offline → Use cached data (read-only)
4. On auth change → Clear cache & reload
```

---

## 9. ERROR HANDLING

### API Errors
```
if (401) → Token expired
         → Try refresh token
         → If refresh fails → Logout

if (4xx) → Show user-friendly message
         → Keep local state

if (5xx) → Show "Server error" message
       → Retry if network available
       → Use cached data
```

### Field Mapping Errors
```
Always map field names when:
- Sending to API
- Receiving from API
- Storing in state
```

---

## 10. ROLE-BASED ACCESS

### Client
- Browse products & restaurants
- Manage cart & orders
- View profile & order history

### Manager
- Manage restaurant details
- Manage products & banners
- Manage team members
- View pending orders

### Driver
- Manage availability & schedule
- View assigned missions
- Update delivery status
- View performance stats

### Admin
- Full system management
- User management
- All data access
