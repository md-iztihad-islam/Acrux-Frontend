import axiosInstance from "@/helpers/dashboard/axiosInstance";

async function cancelOrderApi(orderId) {
    try {
        const response = await axiosInstance.patch(`/order/cancel-order/${orderId}`);
        return response.data;
    } catch (error) {
        console.log("Error in cancelOrderApi:", error);
        return null;
    }
}

export default cancelOrderApi;