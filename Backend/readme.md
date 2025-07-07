# Uber Backend API

## Endpoints

### 1. Register User

**POST** `/users/register`

Registers a new user.

#### Request Body

```json
{
  "fullname": {
    "firstname": "Deep",
    "lastname": "Shrestha"
  },
  "email": "deep.shrestha@example.com",
  "password": "yourpassword"
}
```

#### Validation

- `fullname.firstname`: required, minimum 3 characters
- `fullname.lastname`: optional, minimum 3 characters if provided
- `email`: required, must be a valid email
- `password`: required, minimum 6 characters

#### Responses

- **201 Created**
  ```json
  {
    "token": "<jwt_token>",
    "user": {
      "_id": "user_id",
      "fullname": {
        "firstname": "Deep",
        "lastname": "Shrestha"
      },
      "email": "deep.shrestha@example.com",
      "socketId": null
    }
  }
  ```
- **400 Bad Request**
  ```json
  {
    "errors": [
      {
        "msg": "first name must be atleast 3 characters",
        "param": "fullname.firstname",
        "location": "body"
      }
    ]
  }
  ```

---

### 2. Login User

**POST** `/users/login`

Logs in an existing user.

#### Request Body

```json
{
  "email": "deep.shrestha@example.com",
  "password": "yourpassword"
}
```

#### Validation

- `email`: required, must be a valid email
- `password`: required, minimum 6 characters

#### Responses

- **200 OK**
  ```json
  {
    "token": "<jwt_token>",
    "user": {
      "_id": "user_id",
      "fullname": {
        "firstname": "Deep",
        "lastname": "Shrestha"
      },
      "email": "deep.shrestha@example.com",
      "socketId": null
    }
  }
  ```
- **400 Bad Request**
  ```json
  {
    "errors": [
      {
        "msg": "Invalid Email",
        "param": "email",
        "location": "body"
      }
    ]
  }
  ```
- **401 Unauthorized**
  ```json
  {
    "message": "Invalid email or password"
  }
  ```
  ...

### 3. Get User Profile

**GET** `/users/profile`

Returns the authenticated user's profile.  
Requires a valid JWT token in the `Authorization` header or as a cookie.

#### Headers

```
Authorization: Bearer <jwt_token>
```

#### Response

- **200 OK**
  ```json
  {
    "_id": "user_id",
    "fullname": {
      "firstname": "Deep",
      "lastname": "Shrestha"
    },
    "email": "deep.shrestha@example.com",
    "socketId": null
  }
  ```
- **401 Unauthorized**
  ```json
  {
    "message": "Unauthorized"
  }
  ```

---

### 4. Logout User

**GET** `/users/logout`

Logs out the authenticated user.  
Requires a valid JWT token in the `Authorization` header or as a cookie.

#### Headers

```
Authorization: Bearer <jwt_token>
```

#### Response

- **200 OK**
  ```json
  {
    "message": "Logged out successfully"
  }
  ```
- **401 Unauthorized**
  ```json
  {
    "message": "Unauthorized"
  }
  ```

---

...

### 5. Register Captain

**POST** `/captains/register`

Registers a new captain (driver) with vehicle details.

#### Request Body

```json
{
  "fullname": {
    "firstname": "Deep",
    "lastname": "Shrestha"
  },
  "email": "deep.shrestha@example.com",
  "password": "yourpassword",
  "vehicle": {
    "color": "Red",
    "plate": "ABC123",
    "capacity": 4,
    "vehicleType": "car"
  }
}
```

#### Validation

- `fullname.firstname`: required, minimum 3 characters
- `fullname.lastname`: optional, minimum 3 characters if provided
- `email`: required, must be a valid email
- `password`: required, minimum 6 characters
- `vehicle.color`: required, minimum 3 characters
- `vehicle.plate`: required, minimum 3 characters
- `vehicle.capacity`: required, integer, minimum 1
- `vehicle.vehicleType`: required, must be one of `"car"`, `"motorcycle"`, `"auto"`

#### Responses

- **201 Created**
  ```json
  {
    "token": "<jwt_token>",
    "captain": {
      "_id": "captain_id",
      "fullname": {
        "firstname": "Deep",
        "lastname": "Shrestha"
      },
      "email": "deep.shrestha@example.com",
      "status": "inactive",
      "vehicle": {
        "color": "Red",
        "plate": "ABC123",
        "capacity": 4,
        "vehicleType": "car"
      },
      "location": {
        "lat": null,
        "lon": null
      }
    }
  }
  ```
- **400/401 Bad Request**
  ```json
  {
    "errors": [
      {
        "msg": "first name must have atleast 3 characters",
        "param": "fullname.firstname",
        "location": "body"
      }
    ]
  }
  ```
  or
  ```json
  {
    "message": "Caption already exists!"
  }
  ```

---

## Notes

- All endpoints accept and return JSON.
- Make sure to include the required fields in the request body.
