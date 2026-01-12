import axiosInstance from "@/helpers/dashboard/axiosInstance";

async function getWarrentyByIdApi(warrentyId) {
    try {
        const response = await axiosInstance.get(`/warrenty/get-warrenty-by-id/${warrentyId}`);
        return response.data;
    } catch (error) {
        console.log("Error in getWarrentyByIdApi:", error);
        return null;
    }
}

export default getWarrentyByIdApi;