import { useNavigate } from "react-router-dom";

function Orders(){
    const navigate = useNavigate();
    return(
        <div className="flex flex-col w-[80%] justify-start items-center gap-50 p-10">
            <h1 className="text-5xl font-bold">Order Control</h1>

            <div className="flex justify-around gap-10 text-2xl font-semibold">

                <div onClick={() => navigate("pending-orders")} className="w-[230px] h-[100px] bg-gray-500 rounded-lg flex justify-center items-center hover:bg-white hover:text-black hover:scale-105 transition-all ease-in-out cursor-pointer">
                    Received Orders
                </div>

                <div onClick={() => navigate("accepted-orders")} className="w-[250px] h-[100px] bg-gray-500 rounded-lg flex justify-center items-center hover:bg-white hover:text-black hover:scale-105 transition-all ease-in-out cursor-pointer">
                    Accepted Orders
                </div>

                <div onClick={() => navigate("cancelled-orders")} className="w-[250px] h-[100px] bg-gray-500 rounded-lg flex justify-center items-center hover:bg-white hover:text-black hover:scale-105 transition-all ease-in-out cursor-pointer">
                    Cancelled Orders
                </div>

            </div>
        </div>
    )
}

export default Orders;