import axiosInstance from "@/helpers/dashboard/axiosInstance";

async function updateProductApi(productId, productData) {
    try {
        console.log("Updating product with ID:", productId);
        console.log("Product data being sent:", productData);
        const response = await axiosInstance.put(`/product/update-product/${productId}`, productData);
        return response.data;
    } catch (error) {
        console.log("Error in updateProductApi:", error);
        return null;
    }
}

export default updateProductApi;