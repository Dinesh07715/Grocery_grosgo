# 🐛 DEBUGGING & TROUBLESHOOTING GUIDE

## Common Issues & Solutions

### 🔴 Issue 1: "User details showing in admin localStorage"

**Symptoms:**
```
You logged in as user, but see this in localStorage:
{
  "user": "...",
  "userToken": "...",
  "admin": "...",      // ❌ Should NOT be here!
  "adminToken": "..."  // ❌ Should NOT be here!
}
```

**Root Cause:**
- Admin login didn't clear user data properly
- OR User login didn't clear admin data properly

**Solution:**
```javascript
// Check AdminAuthContext.login() has this:
localStorage.removeItem('user')
localStorage.removeItem('userToken')

// Check authService.loginWithEmail() has this:
localStorage.removeItem('admin')
localStorage.removeItem('adminToken')

// Verify in AdminLogin.jsx before login() call:
localStorage.removeItem('user')
localStorage.removeItem('userToken')
```

**Debug Steps:**
1. Open DevTools → Application → Storage → LocalStorage
2. Clear localStorage: `localStorage.clear()`
3. Reload page
4. Log in again
5. Check localStorage - should have ONLY user data or ONLY admin data

---

### 🔴 Issue 2: "Can't access /admin/dashboard as admin"

**Symptoms:**
```
Logged in as admin, but:
- Going to /admin/dashboard → Redirect to /
- Console error: "Admin tried to access user route"
```

**Root Cause:**
- `ProtectedRoute` is blocking admin access (correct behavior)
- OR adminToken not being saved properly
- OR Token role validation failed

**Debug:**
```javascript
// In browser console:
localStorage.getItem('adminToken')    // Should be "eyJ..."
localStorage.getItem('admin')         // Should be {...}
localStorage.getItem('userToken')     // Should be null
localStorage.getItem('user')          // Should be null
```

**Solution:**
1. Check AdminLogin.jsx - is it calling `login()` from context?
   ```javascript
   const { login } = useAdminAuth()
   ```

2. Check AdminAuthContext - is it validating the token?
   ```javascript
   if (!isAdminToken(token)) {
     return false // Reject non-admin token
   }
   ```

3. Check your backend - is it returning role: "ADMIN" in token?
   ```javascript
   // Backend should return:
   {
     "token": "eyJ...",
     "user": {
       "id": "8",
       "role": "ADMIN"  // Must be "ADMIN"
     }
   }
   ```

---

### 🔴 Issue 3: "Page refresh loses admin authentication"

**Symptoms:**
```
1. Login as admin
2. See admin dashboard
3. Refresh page F5
4. → Redirected to /admin/login
5. → Lost admin session
```

**Root Cause:**
- AdminAuthProvider useEffect not validating token properly
- Token expired
- Token doesn't have correct role

**Debug:**
```javascript
// In browser console after login, before refresh:
const token = localStorage.getItem('adminToken')
console.log('Token:', token)

// Import token utils
import { isTokenValid, isAdminToken } from './utils/tokenUtils'
console.log('Is valid?', isTokenValid(token))
console.log('Is admin?', isAdminToken(token))
```

**Solution:**
1. Verify token has valid exp time:
   ```javascript
   // Token structure must have:
   {
     "exp": 1677000000,  // Future timestamp
     "role": "ADMIN"
   }
   ```

2. Check AdminAuthProvider initialization:
   ```javascript
   useEffect(() => {
     const savedToken = localStorage.getItem('adminToken')
     
     if (savedToken && isTokenValid(savedToken) && isAdminToken(savedToken)) {
       setAdminToken(savedToken)
       setAdmin(JSON.parse(localStorage.getItem('admin')))
     } else {
       // ❌ Token invalid - clear it
       localStorage.removeItem('adminToken')
       localStorage.removeItem('admin')
     }
   }, [])
   ```

3. If backend token expires too quickly:
   - Increase token expiry in backend (e.g., 7 days)
   - Or implement token refresh logic

---

### 🔴 Issue 4: "Both user and admin context returning data"

**Symptoms:**
```javascript
const { user, isAuthenticated } = useAuth()
const { admin, isAuthenticated: adminAuth } = useAdminAuth()

console.log(user) // { id: 3, role: "USER" } ❌
console.log(admin) // { id: 8, role: "ADMIN" } ❌ Should be null!
```

**Root Cause:**
- Both contexts are reading from localStorage
- No cleanup between login/logout

**Solution:**
Check useEffect in AuthContext:
```javascript
useEffect(() => {
  const savedToken = localStorage.getItem('userToken')
  const savedUser = localStorage.getItem('user')

  if (savedToken && savedUser) {
    if (isTokenValid(savedToken) && isUserToken(savedToken)) {
      setUserToken(savedToken)
      setUser(JSON.parse(savedUser))
    } else {
      // ❌ Clear invalid tokens
      localStorage.removeItem('user')
      localStorage.removeItem('userToken')
      setUser(null)
      setUserToken(null)
    }
  }
}, [])
```

Same for AdminAuthContext - it should NOT read userToken.

---

### 🔴 Issue 5: "Console error: Token decode error"

**Symptoms:**
```
Console: "Token decode error: undefined"
Token validation fails
isTokenValid() returns false
```

**Root Cause:**
- Token format is invalid
- Token doesn't have 3 parts (header.payload.signature)
- Backend generating malformed JWT

**Debug:**
```javascript
const token = localStorage.getItem('userToken')
const parts = token.split('.')
console.log('Parts:', parts.length) // Should be 3

// Try decoding manually
const payload = atob(parts[1])
console.log('Payload:', payload)
```

**Solution:**
1. Verify backend JWT creation:
   ```java
   // Backend should use proper JWT library
   Jwts.builder()
     .setSubject(userId)
     .claim("role", userRole)
     .setIssuedAt(new Date())
     .setExpiration(new Date(expiryTime))
     .signWith(key)
     .compact()
   ```

2. Verify token format in response:
   ```json
   {
     "token": "eyJhbGc...iOiJIUzI1NiJ9.eyJzdWI...",
     "user": { "id": "3", "role": "USER" }
   }
   ```

---

### 🔴 Issue 6: "ProtectedRoute shows loading spinner forever"

**Symptoms:**
```
Navigate to /
→ ProtectedRoute renders loading spinner
→ Never goes away, stays loading forever
```

**Root Cause:**
- `loading` state in AuthContext never becomes false
- useEffect not completing

**Solution:**
Check AuthContext useEffect:
```javascript
useEffect(() => {
  // ... validation code ...
  
  setLoading(false) // ✓ Must be called!
}, [])
```

**Debug:**
```javascript
const { loading } = useAuth()
console.log('AuthContext loading:', loading) // Should be false after init
```

---

### 🟡 Issue 7: "Get /admin/login → Still shows user data"

**Symptoms:**
```
1. Logged in as user
2. Go to /admin/login
3. See admin login form BUT:
   localStorage still has user data
   AdminAuthContext still empty
```

**Root Cause:**
- User login page useEffect not clearing admin
- Admin login page useEffect not clearing user

**Solution:**
Check AdminLogin.jsx and all user login pages:
```javascript
// AdminLogin.jsx
useEffect(() => {
  console.log('🔄 Admin Login page loaded - clearing user credentials')
  localStorage.removeItem('user')
  localStorage.removeItem('userToken')
}, [])
```

```javascript
// Login.jsx
useEffect(() => {
  console.log('🔄 User Login page loaded - clearing admin credentials')
  localStorage.removeItem('admin')
  localStorage.removeItem('adminToken')
}, [])
```

---

### 🟡 Issue 8: "API calls failing after login"

**Symptoms:**
```
1. Login successful
2. Navigate to protected route
3. API call from component → 401 Unauthorized
```

**Root Cause:**
- Token not being sent in API Authorization header
- API interceptor not configured

**Solution:**
Ensure API interceptor adds token:
```javascript
// src/api/api.js
API.interceptors.request.use((config) => {
  const userToken = localStorage.getItem('userToken')
  const adminToken = localStorage.getItem('adminToken')
  const token = adminToken || userToken

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})
```

**Debug:**
```javascript
// Before making API call
const token = localStorage.getItem('userToken') || localStorage.getItem('adminToken')
console.log('Token for API:', token)

// Check network tab in DevTools
// Headers → Authorization should have "Bearer eyJ..."
```

---

## 🧪 Debug Checklist

### Before Login:
- [ ] Clear localStorage: `localStorage.clear()`
- [ ] Close DevTools
- [ ] Hard refresh: Ctrl+Shift+R
- [ ] Check Application tab is empty

### During Login:
- [ ] Monitor console for errors
- [ ] Check Network tab → /api/users/login request
- [ ] Verify response has token and user
- [ ] Check localStorage after login

### After Login:
- [ ] Check localStorage has correct keys
- [ ] User logged in → userToken, user only
- [ ] Admin logged in → adminToken, admin only
- [ ] Navigate to dashboard → no errors
- [ ] Refresh page → state persists

### Before Logout:
- [ ] Check localStorage has data
- [ ] Call logout()
- [ ] Monitor console
- [ ] Check localStorage is cleared

### After Logout:
- [ ] localStorage should be empty
- [ ] Should redirect to login/admin-login
- [ ] Can't access protected routes

---

## 🔧 Quick Debugging Tools

### Check Current Auth State
```javascript
// In browser console
const user = localStorage.getItem('user')
const userToken = localStorage.getItem('userToken')
const admin = localStorage.getItem('admin')
const adminToken = localStorage.getItem('adminToken')

console.log('=== AUTH STATE ===')
console.log('User:', user ? JSON.parse(user) : null)
console.log('UserToken:', userToken ? 'EXISTS' : 'MISSING')
console.log('Admin:', admin ? JSON.parse(admin) : null)
console.log('AdminToken:', adminToken ? 'EXISTS' : 'MISSING')
```

### Decode Any Token
```javascript
// In browser console
function decodeToken(token) {
  const base64Url = token.split('.')[1]
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
  const jsonPayload = decodeURIComponent(
    atob(base64).split('').map(c => 
      '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
    ).join('')
  )
  return JSON.parse(jsonPayload)
}

const token = localStorage.getItem('userToken') || localStorage.getItem('adminToken')
console.log('Token payload:', decodeToken(token))
```

### Force Clear All Auth
```javascript
// In browser console
localStorage.removeItem('user')
localStorage.removeItem('userToken')
localStorage.removeItem('admin')
localStorage.removeItem('adminToken')
location.reload()
```

### Check Token Validity
```javascript
// Import in console or component
import { isTokenValid, isAdminToken, isUserToken } from './utils/tokenUtils'

const token = localStorage.getItem('userToken') || localStorage.getItem('adminToken')
console.log('Token valid?', isTokenValid(token))
console.log('Is admin token?', isAdminToken(token))
console.log('Is user token?', isUserToken(token))
```

---

## 🎯 Common Mistakes

### ❌ Mistake 1: Sharing Token Key
```javascript
// ❌ WRONG
localStorage.setItem('token', jwtToken)

// ✅ RIGHT
localStorage.setItem('userToken', jwtToken)    // for users
localStorage.setItem('adminToken', jwtToken)   // for admins
```

### ❌ Mistake 2: Not Clearing Opposite Role
```javascript
// ❌ WRONG
login(user) {
  localStorage.setItem('user', user)
  // No cleanup of admin data!
}

// ✅ RIGHT
login(user) {
  localStorage.removeItem('admin')
  localStorage.removeItem('adminToken')
  localStorage.setItem('user', user)
}
```

### ❌ Mistake 3: Not Validating Token
```javascript
// ❌ WRONG
if (token) {
  setUser(data) // Trust token without validation!
}

// ✅ RIGHT
if (token && isTokenValid(token) && isUserToken(token)) {
  setUser(data)
} else {
  throw new Error('Invalid token')
}
```

### ❌ Mistake 4: Sharing useAuth Hook
```javascript
// ❌ WRONG - In admin component
const { user } = useAuth() // Wrong context!

// ✅ RIGHT - In admin component
const { admin } = useAdminAuth() // Correct context!
```

### ❌ Mistake 5: Not Blocking Cross-Role Access
```javascript
// ❌ WRONG
function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth()
  if (!isAuthenticated) return <Navigate to="/login" />
  return children
  // Admin can access user routes!
}

// ✅ RIGHT
function ProtectedRoute({ children }) {
  const { isAuthenticated: userAuth } = useAuth()
  const { isAuthenticated: adminAuth } = useAdminAuth()
  
  if (adminAuth) {
    return <Navigate to="/admin/dashboard" />
  }
  if (!userAuth) {
    return <Navigate to="/login" />
  }
  return children
}
```

---

## 📞 Getting Help

If you encounter an issue:

1. **Check localStorage first**
   - What keys exist?
   - Are they for user or admin?
   - Is there contamination?

2. **Check console errors**
   - Any "Token decode error"?
   - Any "not authenticated"?
   - Any network errors (401, 403)?

3. **Check token validity**
   - Is token in localStorage?
   - Can it be decoded?
   - Is role correct?
   - Is it expired?

4. **Check context state**
   - Is user context initialized?
   - Is admin context initialized?
   - Are they mutually exclusive?

5. **Test the flow**
   - Clear localStorage
   - Fresh login
   - Check each step
   - Refresh page
   - Test logout

---

**All issues are debuggable with these tools!** 🔧
