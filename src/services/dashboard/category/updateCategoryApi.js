import axiosInstance from "@/helpers/dashboard/axiosInstance";

async function updateCategoryApi(categoryId, updatedCategory) {
    try {
        const response = await axiosInstance.put(`/category/update-category/${categoryId}`, updatedCategory);
        return response.data;
    } catch (error) {
        console.log("Error in updateCategoryApi:", error);
        return null;
    }
}

export default updateCategoryApi;