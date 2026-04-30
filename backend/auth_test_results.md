# Local Authentication Testing Results

## Test 1: Weak Password (Should Fail)
**Payload:**
```json
{
  "email": "weak@nexmart.in",
  "fullName": "Test User",
  "password": "weakpassword",
  "confirmPassword": "weakpassword"
}
```

**Status Code:** 400
**Response:**
```json
{
  "success": false,
  "error": {
    "name": "ZodError",
    "message": "[\n  {\n    \"origin\": \"string\",\n    \"code\": \"invalid_format\",\n    \"format\": \"regex\",\n    \"pattern\": \"/[A-Z]/\",\n    \"path\": [\n      \"password\"\n    ],\n    \"message\": \"Password must contain at least one uppercase letter\"\n  },\n  {\n    \"origin\": \"string\",\n    \"code\": \"invalid_format\",\n    \"format\": \"regex\",\n    \"pattern\": \"/[0-9]/\",\n    \"path\": [\n      \"password\"\n    ],\n    \"message\": \"Password must contain at least one number\"\n  },\n  {\n    \"origin\": \"string\",\n    \"code\": \"invalid_format\",\n    \"format\": \"regex\",\n    \"pattern\": \"/[\\\\W_]/\",\n    \"path\": [\n      \"password\"\n    ],\n    \"message\": \"Password must contain at least one special character\"\n  }\n]"
  }
}
```

---

## Test 2: Passwords Do Not Match (Should Fail)
**Payload:**
```json
{
  "email": "nomatch@nexmart.in",
  "fullName": "Test User",
  "password": "Str0ngP@ssw0rd!",
  "confirmPassword": "WrongPassword!"
}
```

**Status Code:** 400
**Response:**
```json
{
  "success": false,
  "error": {
    "name": "ZodError",
    "message": "[\n  {\n    \"code\": \"custom\",\n    \"path\": [\n      \"confirmPassword\"\n    ],\n    \"message\": \"Passwords don't match\"\n  }\n]"
  }
}
```

---

## Test 3: Strong Password & Match (Should Succeed)
**Payload:**
```json
{
  "email": "success@nexmart.in",
  "fullName": "Aman Shekar",
  "password": "Str0ngP@ssw0rd!",
  "confirmPassword": "Str0ngP@ssw0rd!"
}
```

**Status Code:** 201
**Response:**
```json
{
  "message": "User registered successfully",
  "userId": "ce5e2ad5-ede4-4687-858f-46db4f7208ba"
}
```

---

## Test 4: Login with newly created user (Should Succeed)
**Payload:**
```json
{
  "email": "success@nexmart.in",
  "password": "Str0ngP@ssw0rd!"
}
```

**Status Code:** 200
**Response:**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJjZTVlMmFkNS1lZGU0LTQ2ODctODU4Zi00NmRiNGY3MjA4YmEiLCJlbWFpbCI6InN1Y2Nlc3NAbmV4bWFydC5pbiIsInJvbGUiOiJidXllciIsImV4cCI6MTc3NzQ5MDY2OX0.upcioTzcU1eaWq1V6oQ3noKxlh85d0oIqY6_fCuoUzU",
  "user": {
    "id": "ce5e2ad5-ede4-4687-858f-46db4f7208ba",
    "email": "success@nexmart.in",
    "fullName": "Aman Shekar",
    "role": "buyer"
  }
}
```

---

