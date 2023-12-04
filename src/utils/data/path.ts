const path = {
   // root dashboard
   DASHBOARD: '/dashboard',
   // admin
   ADMIN_STATISTICAL: 'admin/statistical',
   ADMIN_REQUEST: 'admin/admin/request',
   ADMIN_USERS: 'admin/users',
   // farmer
   FARMER_STATISTICAL: 'farmer/statistical',
   FARMER_PRODUCT: 'farmer/products',
   FARMER_ORDER: 'farmer/orders',
   FARMER_CATEGORY: 'farmer/categories',
   // -----------------------------------------
   LOGIN: '/login/:role',
   REGISTER: '/register/:role',
   VERIFY_OTP: '/register/:role/:email/verify-otp',
   HOME: '/*',
   SHOP: '/shop',
   SINGLE_PRODUCT: '/single-product/:code',
   BUY_TOKEN: '/buy-token'
}

export default path