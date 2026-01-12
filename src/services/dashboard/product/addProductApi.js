import axiosInstance from "@/helpers/dashboard/axiosInstance";

async function addProductApi(productData) {
    try {
        const response = await axiosInstance.post("/product/add-product", productData);
        return response.data;
    } catch (error) {
        console.log("Error in addProductApi:", error);
        return null;
    }
}

export default addProductApi;