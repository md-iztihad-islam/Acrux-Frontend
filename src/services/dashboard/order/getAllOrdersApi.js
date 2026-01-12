import axiosInstance from "@/helpers/dashboard/axiosInstance";

async function getAllOrdersApi() {
    try {
        const response = await axiosInstance.get(`/order/all-orders`);
        return response.data;
    } catch (error) {
        console.log("Error in cancelOrderApi:", error);
        return null;
    }
}

export default getAllOrdersApi;