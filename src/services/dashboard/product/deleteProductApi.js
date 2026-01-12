import axiosInstance from "@/helpers/dashboard/axiosInstance";

async function deleteProductApi(productId) {
    try {
        const response = await axiosInstance.delete(`/product/delete-product/${productId}`);
        return response.data;
    } catch (error) {
        console.log("Error in deleteProductApi:", error);
        return null;
    }
}

export default deleteProductApi;