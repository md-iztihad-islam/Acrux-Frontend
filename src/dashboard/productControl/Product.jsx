import { useNavigate } from "react-router-dom";

function Product(){
    const navigate = useNavigate();
    return(
        <div className="flex flex-col w-[80%] justify-start items-center gap-50 p-10">
            <h1 className="text-5xl font-bold">Product Control</h1>

            <div className="flex justify-around gap-10 text-2xl font-semibold">

                <div onClick={() => navigate("add-product")} className="w-[200px] h-[100px] bg-gray-500 rounded-lg flex justify-center items-center hover:bg-white hover:text-black hover:scale-105 transition-all ease-in-out cursor-pointer">
                    Add Product
                </div>

                <div onClick={() => navigate("manage-product")} className="w-[200px] h-[100px] bg-gray-500 rounded-lg flex justify-center items-center hover:bg-white hover:text-black hover:scale-105 transition-all ease-in-out cursor-pointer">
                    Manage Products
                </div>

            </div>
        </div>
    )
}

export default Product;