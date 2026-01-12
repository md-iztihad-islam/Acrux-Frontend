import axiosInstance from "@/helpers/dashboard/axiosInstance";

async function getPendingOrdersApi() {
    try {
        const response = await axiosInstance.get("/order/pending-orders");
        return response.data;
    } catch (error) {
        console.log("Error in getPendingOrdersApi:", error);
        return null;
    }
}

export default getPendingOrdersApi;