function generateCouponCode() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let couponCode = '';
    for (let i = 0; i < 4; i++) {
      couponCode += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return couponCode;
  }

  module.exports=generateCouponCode;