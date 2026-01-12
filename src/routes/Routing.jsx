import Home from "@/clientPart/home/Home";
import Dashboard from "@/dashboard/dashboard";
import CancelledOrders from "@/dashboard/orderControl/cancelledOrders/CancelledOrders";
import Orders from "@/dashboard/orderControl/Orders";
import AcceptedOrders from "@/dashboard/orderControl/receivedOrders/AccpetedOrders";
import OrderDetails from "@/dashboard/orderControl/receivedOrders/OrderDetails";
import ReceivedOrders from "@/dashboard/orderControl/receivedOrders/ReceivedOrders";
import AddProduct from "@/dashboard/productControl/addProduct/AddProduct";
import DashboardProducts from "@/dashboard/productControl/manageProduct/DashboardProducts";
import UpdateProduct from "@/dashboard/productControl/manageProduct/UpdateProduct";
import Product from "@/dashboard/productControl/Product";
import AnalyticsDashboard from "@/dashboard/reportControl/AnalyticsDashboard";
import DashboardLayout from "@/layout/DashboardLayout";
import MainLayout from "@/layout/MainLayout";
import { Routes, Route } from "react-router-dom";

function Routing(){
    return(
        <Routes>
            <Route path="/" element={<MainLayout />}>
                <Route index element={<Home />} />
            </Route>
            <Route path="dashboard" element={<DashboardLayout />}>
                <Route index element={<Dashboard />} />

                <Route path="productcontrol" element={<Product />} />
                <Route path="productcontrol/add-product" element={<AddProduct />} />
                <Route path="productcontrol/manage-product" element={<DashboardProducts />} />
                <Route path="productcontrol/manage-product/edit-product/:productId" element={<UpdateProduct />} />

                <Route path="ordercontrol" element={<Orders />} />
                <Route path="ordercontrol/pending-orders" element={<ReceivedOrders />} />
                <Route path="ordercontrol/pending-orders/details/:orderId" element={<OrderDetails />} />
                <Route path="ordercontrol/accepted-orders" element={<AcceptedOrders />} />
                <Route path="ordercontrol/accepted-orders/details/:orderId" element={<OrderDetails />} />
                <Route path="ordercontrol/cancelled-orders" element={<CancelledOrders />} />

                <Route path="reportcontrol" element={<AnalyticsDashboard />} />


                <Route path="*" element={<div>404 Not Found</div>} />
                
            </Route>
        </Routes>
    )
}

export default Routing;