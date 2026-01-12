import axiosInstance from "@/helpers/dashboard/axiosInstance";

async function getExpiredCouponApi() {
    try {
        const response = await axiosInstance.get('/coupon/get-expired-coupons');
        return response.data;
    } catch (error) {
        console.log('Error fetching expired coupons:', error);
        return null;
    }
}

export default getExpiredCouponApi;