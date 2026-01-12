import axiosInstance from"@/helpers/dashboard/axiosInstance";

async function addWarrentyApi(warrentyData) {
    try {
        const response = await axiosInstance.post("/warrenty/add-warrenty", warrentyData);
        return response.data;
    } catch (error) {
        console.log("Error in addWarrentyApi:", error);
        return null;
    }
}

export default addWarrentyApi;