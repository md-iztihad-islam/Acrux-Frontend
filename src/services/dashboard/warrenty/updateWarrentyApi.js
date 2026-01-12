import axiosInstance from "@/helpers/dashboard/axiosInstance";

async function updateWarrentyApi(warrentyId, warrentyData) {
    try {
        const response = await axiosInstance.put(`/warrenty/update-warrenty/${warrentyId}`, warrentyData);
        return response.data;
    } catch (error) {
        console.log("Error in updateWarrentyApi:", error);
        return null;
    }
}

export default updateWarrentyApi;