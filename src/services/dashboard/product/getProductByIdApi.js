import axiosInstance from "@/helpers/dashboard/axiosInstance";

async function getProductByIdApi({productId}) {
    try {
        const response = await axiosInstance.get(`/product/get-product/${productId}`);
        return response.data;
    } catch (error) {
        console.log("Error in getProductByIdApi:", error);
        return null;
    }
}

export default getProductByIdApi;