# User and Role Management System - Documentation

## Overview
The FinTech Application now includes a comprehensive user and role management system with three distinct roles:
- **Viewer**: Can view their own dashboard and add transactions
- **Analyst**: Can view multiple user accounts and their transaction details
- **Admin**: Can manage users, modify roles, control account status, and perform all operations

---

## Role Permissions Matrix

| Action | Viewer | Analyst | Admin |
|--------|--------|---------|-------|
| View own dashboard | ✅ | ✅ | ✅ |
| Add transactions | ✅ | ✅ | ✅ |
| View own transactions | ✅ | ✅ | ✅ |
| View all users list | ❌ | ✅ | ✅ |
| View other users' accounts | ❌ | ✅ | ✅ |
| View other users' transactions | ❌ | ✅ | ✅ |
| Manage user roles | ❌ | ❌ | ✅ |
| Change user status | ❌ | ❌ | ✅ |
| Delete users | ❌ | ❌ | ✅ |
| Access user management page | ❌ | ❌ | ✅ |

---

## Backend API Endpoints

### User Management Endpoints
All user management endpoints are protected by role-based middleware.

#### Get All Users
- **Endpoint**: `GET /api/users`
- **Required Role**: Analyst, Admin
- **Description**: Retrieves list of all users with their details (excludes passwords)
- **Response**: Array of user objects with `_id`, `name`, `email`, `role`, `status`, `createdAt`

#### Get User by ID
- **Endpoint**: `GET /api/users/:id`
- **Required Role**: Analyst, Admin
- **Description**: Get details of a specific user
- **Response**: User object without password

#### Get User with Transactions
- **Endpoint**: `GET /api/users/:userId/transactions`
- **Required Role**: Analyst, Admin
- **Description**: Retrieve user profile along with all their transactions and financial statistics
- **Response**: 
  ```json
  {
    "success": true,
    "user": { user object },
    "transactions": [ array of transactions ],
    "stats": {
      "totalIncome": number,
      "totalExpense": number,
      "netBalance": number,
      "categoryTotals": { category: amount },
      "transactionCount": number
    }
  }
  ```

#### Update User Status
- **Endpoint**: `PUT /api/users/:id/status`
- **Required Role**: Admin only
- **Request Body**: `{ "status": "active" | "inactive" }`
- **Description**: Change user account status to active or inactive

#### Update User Role
- **Endpoint**: `PUT /api/users/:id/role`
- **Required Role**: Admin only
- **Request Body**: `{ "role": "viewer" | "analyst" | "admin" }`
- **Description**: Assign a different role to a user

#### Delete User
- **Endpoint**: `DELETE /api/users/:id`
- **Required Role**: Admin only
- **Description**: Delete user and all associated transaction data

### Transaction Endpoints
Updated to allow viewers to create and view transactions:

- `POST /api/transactions` - **Required Role**: Viewer, Analyst, Admin
- `GET /api/transactions` - **Required Role**: Viewer, Analyst, Admin
- `GET /api/transactions/:id` - **Required Role**: Analyst, Admin
- `PUT /api/transactions/:id` - **Required Role**: Admin
- `DELETE /api/transactions/:id` - **Required Role**: Admin

---

## Frontend Pages

### Dashboard (`/dashboard`)
- **Accessible By**: All authenticated users (Viewer, Analyst, Admin)
- **Features**:
  - View personal financial summary (income, expenses, balance)
  - Add transactions button (visible for all roles)
  - View recent transactions
  - Category breakdown chart
  - Monthly trends chart
  - Refresh button to reload data

### User List (`/user-list`)
- **Accessible By**: Analyst, Admin
- **Location**: Navbar -> "👥 Users" link
- **Features**:
  - Table of all users with columns: Name, Email, Role, Status, Joined Date
  - Color-coded role badges (Viewer: Blue, Analyst: Purple, Admin: Red)
  - Status indicators (Active: Green, Inactive: Orange)
  - "View Details" button for each user

### User Details (`/user-details/:userId`)
- **Accessible By**: Analyst, Admin
- **Features**:
  - User profile information
  - User role and status
  - Account statistics (Income, Expenses, Balance, Transaction count)
  - Category breakdown of transactions
  - Complete transaction history table with:
    - Transaction date
    - Type (Income/Expense)
    - Category
    - Amount
    - Notes

### User Management (`/user-management`)
- **Accessible By**: Admin only
- **Location**: Navbar -> "⚙️ Manage" link
- **Features**:
  - Full user management table
  - Inline editing for:
    - User Role (Viewer, Analyst, Admin)
    - User Status (Active, Inactive)
  - Delete user button (with confirmation)
  - Edit, Save, and Cancel buttons for updates
  - Success/Error messages for operations

---

## User Model Schema

```javascript
{
  name: String,
  email: String,
  password: String,
  role: "viewer" | "analyst" | "admin",
  status: "active" | "inactive",
  createdAt: Date
}
```

---

## Navigation Structure

### Navbar Layout
The navbar now shows:
- **Title**: 💰 FinTech Dashboard
- **Navigation Links** (based on role):
  - 📊 Dashboard (all users)
  - 👥 Users (Analyst, Admin only)
  - ⚙️ Manage (Admin only)
- **User Info**: Shows logged-in user's name and role badge
- **Logout Button**: Sign out of application

### Role Badges Colors
- **Viewer**: Blue badge
- **Analyst**: Purple badge
- **Admin**: Red badge

### Status Indicators
- **Active**: Green background
- **Inactive**: Orange background

---

## Usage Scenarios

### Scenario 1: Viewer User
1. Login as a viewer
2. Access Dashboard to view personal financial data
3. Add transactions using the "Add Transaction" button
4. Click "Refresh" to update dashboard with new transactions
5. Cannot access user list or user management

### Scenario 2: Analyst User
1. Login as an analyst
2. Access Dashboard like a viewer
3. Click "👥 Users" in navbar to see list of all users
4. Click "View Details" on any user to see their account details
5. View their transactions and financial statistics
6. Cannot modify user roles or status

### Scenario 3: Admin User
1. Login as an admin
2. Access all features available to viewers and analysts
3. Click "⚙️ Manage" to access user management page
4. Edit user roles and status inline
5. Delete users if needed
6. Make all administrative changes

---

## Security Considerations

1. **Role-Based Access Control**: All endpoints are protected by `requireRole` middleware
2. **Password Excluded**: User APIs never return password fields
3. **Status Validation**: Only valid status values ("active", "inactive") are accepted
4. **Role Validation**: Only valid roles ("viewer", "analyst", "admin") are accepted
5. **Authorization Headers**: Role can be passed via:
   - `req.body.role` (for POST requests)
   - `req.query.role` (for GET requests)
   - `x-user-role` header

---

## Data Persistence

- All user information is stored in MongoDB
- User status and role changes are immediately persisted
- Transaction data associated with users is preserved
- Deleting a user also removes all their associated transactions

---

## Future Enhancements

1. Add user search functionality
2. Implement user export functionality (CSV/PDF)
3. Add activity logging for user management changes
4. Implement audit trail for sensitive operations
5. Add bulk user management operations
6. Multi-select delete for users
7. Advanced filtering and sorting options
8. User profile editing
9. Password reset functionality
10. Two-factor authentication

---

## Error Handling

- **401 Unauthorized**: User role is required but not provided
- **403 Forbidden**: User role does not have permission for the action
- **404 Not Found**: User not found in database
- **400 Bad Request**: Invalid status or role value
- **500 Server Error**: Database or server error

All errors return JSON response with `success: false` and a descriptive `message`.
