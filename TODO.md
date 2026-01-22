# Fix Double /api in Controller Mappings

## Issue
- API baseURL: http://localhost:8080/api
- Controllers have @RequestMapping("/api/...") 
- Results in double /api: http://localhost:8080/api/api/foods

## Solution
Remove "/api" from all controller @RequestMapping annotations

## Controllers to Fix
- [x] AdminCategoryController.java
- [x] AdminController.java
- [x] AdminOrderController.java
- [x] AdminProductController.java
- [x] CartController.java
- [x] CategoryController.java
- [x] FoodController.java
- [x] MailTestController.java
- [x] OrderController.java
- [x] PaymentController.java
- [x] ProductController.java
- [x] UserController.java

## Followup Steps
- [ ] Test the /api/foods endpoint after fixes
- [ ] Verify other endpoints work
