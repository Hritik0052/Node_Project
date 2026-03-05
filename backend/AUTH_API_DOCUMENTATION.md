# Authentication API Documentation

Base URL: `http://localhost:5000/api/auth`

## API Endpoints

### 1. Register User
Create a new user account.

**Endpoint:** `POST /api/auth/register`

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+1234567890",
  "avatar": "https://example.com/avatar.jpg"
}
```

**Required Fields:**
- `email` (string): Valid email address
- `password` (string): Minimum 6 characters

**Optional Fields:**
- `firstName` (string)
- `lastName` (string)
- `phone` (string): Must be unique
- `avatar` (string): URL to profile picture

**Success Response (201):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "phone": "+1234567890",
      "avatar": "https://example.com/avatar.jpg",
      "role": "CUSTOMER",
      "createdAt": "2026-03-05T10:00:00.000Z",
      "updatedAt": "2026-03-05T10:00:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "message": "User registered successfully"
}
```

**Error Response (400):**
```json
{
  "success": false,
  "error": {
    "status": 400,
    "message": "User with this email already exists"
  }
}
```

---

### 2. Login User
Authenticate user and receive access token.

**Endpoint:** `POST /api/auth/login`

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**Required Fields:**
- `email` (string)
- `password` (string)

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "phone": "+1234567890",
      "avatar": "https://example.com/avatar.jpg",
      "role": "CUSTOMER",
      "createdAt": "2026-03-05T10:00:00.000Z",
      "updatedAt": "2026-03-05T10:00:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "message": "Login successful"
}
```

**Error Response (401):**
```json
{
  "success": false,
  "error": {
    "status": 401,
    "message": "Invalid email or password"
  }
}
```

---

### 3. Get User Profile
Retrieve authenticated user's profile information.

**Endpoint:** `GET /api/auth/profile`

**Headers:**
```
Authorization: Bearer <your_jwt_token>
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "phone": "+1234567890",
    "avatar": "https://example.com/avatar.jpg",
    "role": "CUSTOMER",
    "createdAt": "2026-03-05T10:00:00.000Z",
    "updatedAt": "2026-03-05T10:00:00.000Z",
    "_count": {
      "properties": 5,
      "reviews": 10,
      "favorites": 3,
      "blogs": 2
    }
  }
}
```

**Error Response (401):**
```json
{
  "success": false,
  "error": {
    "status": 401,
    "message": "No token provided. Please login first."
  }
}
```

**Error Response (404):**
```json
{
  "success": false,
  "error": {
    "status": 404,
    "message": "User not found"
  }
}
```

---

### 4. Update User Profile
Update authenticated user's profile information.

**Endpoint:** `PUT /api/auth/profile`

**Headers:**
```
Authorization: Bearer <your_jwt_token>
```

**Request Body:**
```json
{
  "firstName": "Jane",
  "lastName": "Smith",
  "phone": "+9876543210",
  "avatar": "https://example.com/new-avatar.jpg"
}
```

**Optional Fields:**
- `firstName` (string)
- `lastName` (string)
- `phone` (string): Must be unique
- `avatar` (string): URL to profile picture

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "email": "user@example.com",
    "firstName": "Jane",
    "lastName": "Smith",
    "phone": "+9876543210",
    "avatar": "https://example.com/new-avatar.jpg",
    "role": "CUSTOMER",
    "createdAt": "2026-03-05T10:00:00.000Z",
    "updatedAt": "2026-03-05T10:30:00.000Z"
  },
  "message": "Profile updated successfully"
}
```

**Error Response (400):**
```json
{
  "success": false,
  "error": {
    "status": 400,
    "message": "Phone number already in use"
  }
}
```

---

### 5. Logout User
Logout authenticated user (client-side token removal).

**Endpoint:** `POST /api/auth/logout`

**Headers:**
```
Authorization: Bearer <your_jwt_token>
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Logout successful. Please remove the token from client storage."
}
```

**Note:** Since this is a JWT-based authentication system, logout is primarily handled on the client-side by removing the token from storage (localStorage, sessionStorage, or cookies). This endpoint is provided for consistency and can be extended to implement token blacklisting if needed.

---

## Authentication Flow

1. **Register/Login**: User receives a JWT token
2. **Store Token**: Client stores token (localStorage/sessionStorage)
3. **Authenticated Requests**: Include token in Authorization header
4. **Logout**: Client removes token from storage

## Token Format

All authenticated requests must include the JWT token in the Authorization header:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Token Expiration

- Tokens expire after 7 days
- After expiration, users must login again to receive a new token

## Error Codes

- `400`: Bad Request (validation errors, duplicate data)
- `401`: Unauthorized (invalid/missing token, wrong credentials)
- `404`: Not Found (user not found)
- `500`: Internal Server Error

## Testing with cURL

### Register
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "firstName": "Test",
    "lastName": "User"
  }'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### Get Profile
```bash
curl -X GET http://localhost:5000/api/auth/profile \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Update Profile
```bash
curl -X PUT http://localhost:5000/api/auth/profile \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Updated",
    "lastName": "Name"
  }'
```

### Logout
```bash
curl -X POST http://localhost:5000/api/auth/logout \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## Testing with Postman

1. Import the endpoints into Postman
2. For authenticated endpoints, add Authorization header:
   - Type: Bearer Token
   - Token: Paste your JWT token
3. Test each endpoint with sample data

## Security Notes

- Passwords are hashed using bcrypt with 10 salt rounds
- JWT tokens are signed with a secret key
- Tokens include user ID, email, and role
- Always use HTTPS in production
- Store JWT_SECRET securely in environment variables
- Never expose JWT_SECRET in client-side code
