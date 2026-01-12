import axiosInstance from "@/helpers/dashboard/axiosInstance";

async function getOrderByOrderIdApi(orderId) {
    try {
        const response = await axiosInstance.get(`/order/order-by-orderid/${orderId}`);
        return response.data;
    } catch (error) {
        console.log("Error in getOrderByOrderIdApi:", error);
        return null;
    }
}

export default getOrderByOrderIdApi;