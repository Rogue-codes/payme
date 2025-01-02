export const genOtp = () => {
    const otp = Math.floor((Math.random() * 9000) + 1000).toString();
    return otp;
}