const checkTokenExpired = (token: any): boolean => {
   const decodedToken = JSON.parse(atob(token?.split('.')[1]));
   const expirationTime = decodedToken.exp * 1000; // Đổi từ giây sang mili-giây
   const currentTime = Date.now();
   return currentTime >= expirationTime;
}

export default checkTokenExpired;