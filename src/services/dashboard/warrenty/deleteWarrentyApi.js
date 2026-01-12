import axiosInstance from "@/helpers/dashboard/axiosInstance";

async function deleteWarrentyApi(warrentyId) {
    try {
        const response = await axiosInstance.delete(`/warrenty/delete-warrenty/${warrentyId}`);
        return response.data;
    } catch (error) {
        console.log("Error in deleteWarrentyApi:", error);
        return null;
    }
}

export default deleteWarrentyApi;