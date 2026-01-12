import axiosInstance from "@/helpers/dashboard/axiosInstance";

async function confirmOrderApi(orderId, orderdata) {
    try {
        const response = await axiosInstance.patch(`/order/confirm-order/${orderId}`, orderdata);
        return response.data;
    } catch (error) {
        console.log("Error in confirmOrderApi:", error);
        return null;
    }
}

export default confirmOrderApi;