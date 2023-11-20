const path = {
   // dashboard
   DASHBOARD: '/dashboard/*',
   ECOMMERCE: 'ecommerce',
   // -------------
   LOGIN: '/login/:role',
   REGISTER: '/register/:role',
   // user
   HOME: '/*',
   VERIFY_OTP: '/register/:role/:email/verify-otp'
}

export default path