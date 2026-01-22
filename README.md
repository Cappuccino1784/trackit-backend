# 🔧 TrackIt - Backend API

RESTful API server for the Expense Tracker application built with Node.js, Express, TypeScript, and MongoDB.

## 🛠️ Tech Stack

- **Node.js** - Runtime environment
- **Express** - Web framework
- **TypeScript** - Type-safe JavaScript
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **dotenv** - Environment configuration
- **ts-node-dev** - Development server with hot reload

## 📋 Prerequisites

- Node.js v18 or higher
- MongoDB v6 or higher
- npm or yarn (preferably yarn)

## 🚀 Installation

1. **Install dependencies:**
```bash
npm install
```

2. **Create environment file:**

Create a `.env` file in the root directory:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/expense-tracker
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
NODE_ENV=development
```

3. **Start MongoDB:**
```bash
# Using MongoDB service
mongod

# Or using Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

## 🎯 Running the Server

### Development Mode (with hot reload)
```bash
npm run dev
```

### Build for Production
```bash
npm run build
```

### Production Mode
```bash
npm start
```

The server will run on `http://localhost:5000`

## 📁 Project Structure

```
server/
├── src/
│   ├── config/
│   │   └── db.ts                  # MongoDB connection
│   ├── controllers/               # Route controllers
│   │   ├── accounts.controllers.ts
│   │   ├── auth.controllers.ts
│   │   ├── currency.controllers.ts
│   │   ├── trans.controllers.ts
│   │   └── user.controllers.ts
│   ├── middlewares/               # Custom middlewares
│   │   └── auth.middleware.ts     # JWT authentication
│   ├── models/                    # Mongoose schemas
│   │   ├── Account.ts             # Account model
│   │   ├── CurrencyRate.ts        # Currency rates model
│   │   ├── Transaction.ts         # Transaction model
│   │   └── User.ts                # User model
│   ├── routes/                    # API routes
│   │   ├── accounts.routes.ts
│   │   ├── auth.routes.ts
│   │   ├── currency.routes.ts
│   │   ├── trans.routes.ts
│   │   ├── user.routes.ts
│   │   └── router.ts              # Main router
│   ├── utils/                     # Utility functions
│   │   └── currencies.ts          # Currency utilities
│   ├── app.ts                     # Express app setup
│   └── server.ts                  # Server entry point
├── package.json
├── tsconfig.json
└── .env                           # Environment variables (create this)
```

## 🔌 API Endpoints

### Authentication Routes (`/api/auth`)

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securePassword123"
}

Response:
{
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

#### Get Profile
```http
GET /api/auth/profile
Authorization: Bearer <token>
```

### Account Routes (`/api/accounts`)
All routes require authentication.

#### Get All Accounts
```http
GET /api/accounts
Authorization: Bearer <token>
```

#### Create Account
```http
POST /api/accounts
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Main Account",
  "balance": 1000,
  "currency": "USD"
}
```

#### Update Account
```http
PUT /api/accounts/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Updated Account Name",
  "balance": 2000
}
```

#### Delete Account
```http
DELETE /api/accounts/:id
Authorization: Bearer <token>
```

### Transaction Routes (`/api/transactions`)
All routes require authentication.

#### Get All Transactions
```http
GET /api/transactions
Authorization: Bearer <token>
```

#### Create Transaction
```http
POST /api/transactions
Authorization: Bearer <token>
Content-Type: application/json

{
  "accountId": "account_id",
  "amount": 100,
  "type": "expense",
  "category": "Food",
  "description": "Groceries",
  "date": "2026-01-22"
}
```

#### Update Transaction
```http
PUT /api/transactions/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "amount": 150,
  "category": "Shopping"
}
```

#### Delete Transaction
```http
DELETE /api/transactions/:id
Authorization: Bearer <token>
```

### Currency Routes (`/api/currency`)
All routes require authentication.

#### Get Exchange Rates
```http
GET /api/currency/get-rates
Authorization: Bearer <token>

Response:
{
  "date": "2026-01-22T00:00:00.000Z",
  "baseCurrency": "USD",
  "rates": {
    "EUR": 0.85,
    "GBP": 0.73,
    "JPY": 110.5,
    ...
  }
}
```

#### Get Supported Currencies
```http
GET /api/currency/get-supported
Authorization: Bearer <token>

Response:
["USD", "EUR", "GBP", "JPY", "AUD", ...]
```

### User Routes (`/api/user`)
All routes require authentication.

#### Get User Profile
```http
GET /api/user/profile
Authorization: Bearer <token>
```

#### Update User Profile
```http
PUT /api/user/profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Updated Name",
  "email": "newemail@example.com"
}
```

## 🗄️ Database Models

### User Model
```typescript
{
  name: string,
  email: string (unique),
  password: string (hashed),
  createdAt: Date
}
```

### Account Model
```typescript
{
  userId: ObjectId (ref: User),
  name: string,
  balance: number,
  currency: string,
  createdAt: Date
}
```

### Transaction Model
```typescript
{
  userId: ObjectId (ref: User),
  accountId: ObjectId (ref: Account),
  amount: number,
  type: 'income' | 'expense' | 'transfer',
  category: string,
  description?: string,
  date: Date,
  createdAt: Date
}
```

### CurrencyRate Model
```typescript
{
  date: Date (unique),
  baseCurrency: string,
  rates: Map<string, number>,
  lastUpdated: Date
}
```

## 🔒 Authentication & Security

- **JWT Authentication**: Stateless authentication using JSON Web Tokens
- **Password Hashing**: bcrypt with salt rounds for secure password storage
- **Protected Routes**: Middleware validates JWT tokens on protected endpoints
- **CORS**: Configured to accept requests from frontend origin
- **Environment Variables**: Sensitive data stored in `.env` file

### Middleware: `authenticateToken`

Validates JWT tokens and attaches user information to request:
```typescript
// Usage in routes
router.get('/protected', authenticateToken, controller.protectedRoute);
```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | 5000 |
| `MONGODB_URI` | MongoDB connection string | mongodb://localhost:27017/expense-tracker |
| `JWT_SECRET` | Secret key for JWT signing | (required) |
| `NODE_ENV` | Environment mode | development |

### MongoDB Connection

The database connection is established in `src/config/db.ts`:
- Auto-retry on connection failure
- Connection pooling enabled
- Mongoose strict mode enabled

## 🧪 Testing

```bash
# Run tests (when implemented)
npm test
```

## 📊 Features

### Currency Management
- Daily automatic exchange rate updates
- 50+ supported currencies
- Base currency: USD
- Cached rates in database for performance

### Transaction Management
- Three transaction types: Income, Expense, Transfer
- Category-based organization
- Date-based querying
- Automatic account balance updates

### Account Management
- Multi-currency support
- Real-time balance tracking
- User-specific accounts
- Soft delete support

## 🐛 Error Handling

The API uses standard HTTP status codes:

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `404` - Not Found
- `500` - Internal Server Error

Error responses follow this format:
```json
{
  "message": "Error description"
}
```

## 🚀 Deployment

### Using PM2
```bash
npm install -g pm2
npm run build
pm2 start dist/server.js --name expense-tracker-api
```

### Using Docker
```bash
# Build image
docker build -t expense-tracker-api .

# Run container
docker run -d -p 5000:5000 \
  -e MONGODB_URI=your_mongodb_uri \
  -e JWT_SECRET=your_secret \
  --name expense-tracker-api \
  expense-tracker-api
```

## 📝 Development Notes

### Hot Reload
The development server uses `ts-node-dev` for automatic restart on file changes.

### TypeScript
All code is written in TypeScript with strict type checking enabled.

### Code Organization
- **Controllers**: Business logic and request handling
- **Models**: Database schema definitions
- **Routes**: API endpoint definitions
- **Middlewares**: Request processing and authentication
- **Utils**: Helper functions and utilities

## 🤝 Contributing

1. Follow TypeScript best practices
2. Maintain consistent code style
3. Add comments for complex logic
4. Update API documentation for new endpoints

## 📄 License

MIT License

---

Built with ❤️ for efficient expense tracking
