const path = {
   // dashboard
   DASHBOARD: '/dashboard',
   ECOMMERCE: 'ecommerce',
   // --------------
   LOGIN: '/login/:role',
   REGISTER: '/register/:role',
   VERIFY_OTP: '/register/:role/:email/verify-otp',
   HOME: '/*',
   SHOP: '/shop',
   SINGLE_PRODUCT: '/single-product/:code'
}

export default path