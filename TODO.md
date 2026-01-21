# TODO: Fix Token Handling Issues

## Issues Identified
- JWT token decode failure in api.js request interceptor
- Invalid token causing 403 Forbidden on cart API calls
- CartContext not handling authentication errors properly

## Plan
1. Fix api.js: Clear invalid tokens when JWT decode fails
2. Update CartContext: Handle 403 errors by clearing tokens and logging out
3. Test the fixes

## Files to Edit
- src/api/api.js
- src/contexts/CartContext.jsx
