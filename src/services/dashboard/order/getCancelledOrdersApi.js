import axiosInstance from"@/helpers/dashboard/axiosInstance";

async function getCancelledOrdersApi() {
    try {
        const response = await axiosInstance.get("/order/cancelled-orders");

        return response.data;
    } catch (error) {
        console.log("Error in getAcceptedOrdersApi:", error);
        return null;
    }
}

export default getCancelledOrdersApi;