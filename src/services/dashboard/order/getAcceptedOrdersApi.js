import axiosInstance from"@/helpers/dashboard/axiosInstance";

async function getAcceptedOrdersApi() {
    try {
        const response = await axiosInstance.get("/order/accepted-orders");

        return response.data;
    } catch (error) {
        console.log("Error in getAcceptedOrdersApi:", error);
        return null;
    }
}

export default getAcceptedOrdersApi;