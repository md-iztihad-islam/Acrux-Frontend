import axiosInstance from "@/helpers/dashboard/axiosInstance";

async function getAllWarrentiesApi() {
    try {
        const response = await axiosInstance.get("/warrenty/get-all-warrenties");
        return response.data;
    } catch (error) {
        console.log("Error in getAllWarrentiesApi:", error);
        return null;
    }
}

export default getAllWarrentiesApi;