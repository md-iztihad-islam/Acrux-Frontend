import axiosInstance from "@/helpers/dashboard/axiosInstance";

async function deleteCouponApi(couponId) {
    try {
        const response = await axiosInstance.delete(`/coupon/delete-coupon/${couponId}`);
        return response.data;
    } catch (error) {
        console.log('Error deleting coupon:', error);
        return null;
    }
}

export default deleteCouponApi;