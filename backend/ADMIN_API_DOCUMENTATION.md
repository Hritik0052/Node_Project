# Admin API Documentation

Base URL: `http://localhost:5000/api/admin`

**Authentication Required:** All admin endpoints require:
1. Valid JWT token in Authorization header
2. User role must be "ADMIN"

## Headers for All Requests
```
Authorization: Bearer <your_admin_jwt_token>
Content-Type: application/json
```

---

## User Management APIs

### 1. Get All Users
Get paginated list of all users with filters.

**Endpoint:** `GET /api/admin/users`

**Query Parameters:**
- `page` (number, optional): Page number (default: 1)
- `limit` (number, optional): Items per page (default: 20)
- `role` (string, optional): Filter by role (ADMIN, CUSTOMER)
- `search` (string, optional): Search in email, firstName, lastName, phone

**Example Request:**
```
GET /api/admin/users?page=1&limit=10&role=CUSTOMER&search=john
```

**Success Response (200):**
```json
{
  "success": true,
  "data": [
    {
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
  ],
  "pagination": {
    "total": 50,
    "page": 1,
    "limit": 10,
    "totalPages": 5
  }
}
```

---

### 2. Get User by ID
Get detailed information about a specific user.

**Endpoint:** `GET /api/admin/users/:id`

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
    "properties": [...],
    "reviews": [...],
    "blogs": [...],
    "_count": {
      "properties": 5,
      "reviews": 10,
      "favorites": 3,
      "blogs": 2
    }
  }
}
```

---

### 3. Create User
Create a new user account (admin can set role).

**Endpoint:** `POST /api/admin/users`

**Request Body:**
```json
{
  "email": "newuser@example.com",
  "password": "securePassword123",
  "firstName": "Jane",
  "lastName": "Smith",
  "phone": "+9876543210",
  "avatar": "https://example.com/avatar.jpg",
  "role": "CUSTOMER"
}
```

**Required Fields:**
- `email` (string)
- `password` (string)

**Optional Fields:**
- `firstName` (string)
- `lastName` (string)
- `phone` (string)
- `avatar` (string)
- `role` (string): "ADMIN" or "CUSTOMER" (default: "CUSTOMER")

**Success Response (201):**
```json
{
  "success": true,
  "data": {
    "id": 2,
    "email": "newuser@example.com",
    "firstName": "Jane",
    "lastName": "Smith",
    "phone": "+9876543210",
    "avatar": "https://example.com/avatar.jpg",
    "role": "CUSTOMER",
    "createdAt": "2026-03-05T11:00:00.000Z",
    "updatedAt": "2026-03-05T11:00:00.000Z"
  },
  "message": "User created successfully"
}
```

---

### 4. Update User
Update user information including role.

**Endpoint:** `PUT /api/admin/users/:id`

**Request Body:**
```json
{
  "firstName": "Updated",
  "lastName": "Name",
  "phone": "+1111111111",
  "avatar": "https://example.com/new-avatar.jpg",
  "role": "ADMIN",
  "password": "newPassword123"
}
```

**Optional Fields:**
- `firstName` (string)
- `lastName` (string)
- `phone` (string)
- `avatar` (string)
- `role` (string): "ADMIN" or "CUSTOMER"
- `password` (string): New password (will be hashed)

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "id": 2,
    "email": "newuser@example.com",
    "firstName": "Updated",
    "lastName": "Name",
    "phone": "+1111111111",
    "avatar": "https://example.com/new-avatar.jpg",
    "role": "ADMIN",
    "createdAt": "2026-03-05T11:00:00.000Z",
    "updatedAt": "2026-03-05T11:30:00.000Z"
  },
  "message": "User updated successfully"
}
```

---

### 5. Delete User
Delete a user account.

**Endpoint:** `DELETE /api/admin/users/:id`

**Success Response (200):**
```json
{
  "success": true,
  "message": "User deleted successfully"
}
```

---

### 6. Get User Statistics
Get overall user statistics.

**Endpoint:** `GET /api/admin/users/stats`

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "totalUsers": 150,
    "adminCount": 5,
    "customerCount": 145,
    "recentUsers": [...]
  }
}
```

---

## Category Management APIs

### 1. Get All Categories
Get paginated list of all categories with subcategories.

**Endpoint:** `GET /api/admin/categories`

**Query Parameters:**
- `page` (number, optional): Page number (default: 1)
- `limit` (number, optional): Items per page (default: 20)
- `search` (string, optional): Search in name, slug, description

**Success Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Residential",
      "slug": "residential",
      "description": "Residential properties",
      "createdAt": "2026-03-05T10:00:00.000Z",
      "subCategories": [
        {
          "id": 1,
          "name": "Apartment",
          "slug": "apartment"
        }
      ],
      "_count": {
        "subCategories": 5,
        "properties": 120
      }
    }
  ],
  "pagination": {
    "total": 10,
    "page": 1,
    "limit": 20,
    "totalPages": 1
  }
}
```

---

### 2. Get Category by ID
Get detailed information about a specific category.

**Endpoint:** `GET /api/admin/categories/:id`

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Residential",
    "slug": "residential",
    "description": "Residential properties",
    "createdAt": "2026-03-05T10:00:00.000Z",
    "subCategories": [...],
    "_count": {
      "subCategories": 5,
      "properties": 120
    }
  }
}
```

---

### 3. Create Category
Create a new category.

**Endpoint:** `POST /api/admin/categories`

**Request Body:**
```json
{
  "name": "Commercial",
  "slug": "commercial",
  "description": "Commercial properties"
}
```

**Required Fields:**
- `name` (string)
- `slug` (string): Must be unique, URL-friendly

**Optional Fields:**
- `description` (string)

**Success Response (201):**
```json
{
  "success": true,
  "data": {
    "id": 2,
    "name": "Commercial",
    "slug": "commercial",
    "description": "Commercial properties",
    "createdAt": "2026-03-05T11:00:00.000Z",
    "_count": {
      "subCategories": 0,
      "properties": 0
    }
  },
  "message": "Category created successfully"
}
```

---

### 4. Update Category
Update category information.

**Endpoint:** `PUT /api/admin/categories/:id`

**Request Body:**
```json
{
  "name": "Updated Commercial",
  "slug": "updated-commercial",
  "description": "Updated description"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "id": 2,
    "name": "Updated Commercial",
    "slug": "updated-commercial",
    "description": "Updated description",
    "createdAt": "2026-03-05T11:00:00.000Z",
    "subCategories": [...],
    "_count": {
      "subCategories": 0,
      "properties": 0
    }
  },
  "message": "Category updated successfully"
}
```

---

### 5. Delete Category
Delete a category (only if no subcategories or properties exist).

**Endpoint:** `DELETE /api/admin/categories/:id`

**Success Response (200):**
```json
{
  "success": true,
  "message": "Category deleted successfully"
}
```

**Error Response (400):**
```json
{
  "success": false,
  "error": {
    "status": 400,
    "message": "Cannot delete category with subcategories. Delete subcategories first."
  }
}
```

---

### 6. Get Category Statistics
Get overall category statistics.

**Endpoint:** `GET /api/admin/categories/stats`

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "totalCategories": 10,
    "totalSubCategories": 45,
    "recentCategories": [...]
  }
}
```

---

## SubCategory Management APIs

### 1. Get All SubCategories
Get paginated list of all subcategories.

**Endpoint:** `GET /api/admin/subcategories`

**Query Parameters:**
- `page` (number, optional): Page number (default: 1)
- `limit` (number, optional): Items per page (default: 20)
- `categoryId` (number, optional): Filter by category ID
- `search` (string, optional): Search in name, slug

**Success Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Apartment",
      "slug": "apartment",
      "categoryId": 1,
      "category": {
        "id": 1,
        "name": "Residential",
        "slug": "residential"
      },
      "_count": {
        "properties": 50
      }
    }
  ],
  "pagination": {
    "total": 45,
    "page": 1,
    "limit": 20,
    "totalPages": 3
  }
}
```

---

### 2. Get SubCategory by ID
Get detailed information about a specific subcategory.

**Endpoint:** `GET /api/admin/subcategories/:id`

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Apartment",
    "slug": "apartment",
    "categoryId": 1,
    "category": {
      "id": 1,
      "name": "Residential",
      "slug": "residential",
      "description": "Residential properties",
      "createdAt": "2026-03-05T10:00:00.000Z"
    },
    "_count": {
      "properties": 50
    }
  }
}
```

---

### 3. Create SubCategory
Create a new subcategory.

**Endpoint:** `POST /api/admin/subcategories`

**Request Body:**
```json
{
  "name": "Villa",
  "slug": "villa",
  "categoryId": 1
}
```

**Required Fields:**
- `name` (string)
- `slug` (string): Must be unique, URL-friendly
- `categoryId` (number): Must be a valid category ID

**Success Response (201):**
```json
{
  "success": true,
  "data": {
    "id": 6,
    "name": "Villa",
    "slug": "villa",
    "categoryId": 1,
    "category": {
      "id": 1,
      "name": "Residential",
      "slug": "residential"
    },
    "_count": {
      "properties": 0
    }
  },
  "message": "SubCategory created successfully"
}
```

---

### 4. Update SubCategory
Update subcategory information.

**Endpoint:** `PUT /api/admin/subcategories/:id`

**Request Body:**
```json
{
  "name": "Luxury Villa",
  "slug": "luxury-villa",
  "categoryId": 1
}
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "id": 6,
    "name": "Luxury Villa",
    "slug": "luxury-villa",
    "categoryId": 1,
    "category": {
      "id": 1,
      "name": "Residential",
      "slug": "residential"
    },
    "_count": {
      "properties": 0
    }
  },
  "message": "SubCategory updated successfully"
}
```

---

### 5. Delete SubCategory
Delete a subcategory (only if no properties exist).

**Endpoint:** `DELETE /api/admin/subcategories/:id`

**Success Response (200):**
```json
{
  "success": true,
  "message": "SubCategory deleted successfully"
}
```

**Error Response (400):**
```json
{
  "success": false,
  "error": {
    "status": 400,
    "message": "Cannot delete subcategory with associated properties."
  }
}
```

---

## Error Responses

### 401 Unauthorized
```json
{
  "success": false,
  "error": {
    "status": 401,
    "message": "No token provided. Please login first."
  }
}
```

### 403 Forbidden
```json
{
  "success": false,
  "error": {
    "status": 403,
    "message": "Access denied. Admin privileges required."
  }
}
```

### 404 Not Found
```json
{
  "success": false,
  "error": {
    "status": 404,
    "message": "User not found"
  }
}
```

### 400 Bad Request
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

## Testing with cURL

### Create Admin User (First, create via register then update role in database)
```bash
# 1. Register a user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "admin123",
    "firstName": "Admin",
    "lastName": "User"
  }'

# 2. Manually update role in database to ADMIN
# Then login to get admin token
```

### Get All Users
```bash
curl -X GET "http://localhost:5000/api/admin/users?page=1&limit=10" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

### Create Category
```bash
curl -X POST http://localhost:5000/api/admin/categories \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Residential",
    "slug": "residential",
    "description": "Residential properties"
  }'
```

### Create SubCategory
```bash
curl -X POST http://localhost:5000/api/admin/subcategories \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Apartment",
    "slug": "apartment",
    "categoryId": 1
  }'
```

---

## Notes

1. **Admin Access**: Only users with role "ADMIN" can access these endpoints
2. **Cascade Delete**: Deleting categories/subcategories is prevented if they have associated data
3. **Pagination**: All list endpoints support pagination with default values
4. **Search**: Search functionality is case-insensitive and searches across multiple fields
5. **Validation**: All endpoints validate input data and return descriptive error messages
