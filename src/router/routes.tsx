import { createBrowserRouter } from "react-router-dom";
import MainPage from "../components/pages/MainPage";
import OrdersMain from "../components/orders/OrdersMain";
import TrackerMain from "../components/tracker/TrackerMain";
import DishesMain from "../components/dishes/DishesMain";
import SalesMain from "../components/sales/SalesMain";
import InventoryMain from "../components/inventory/InventoryMain";
import CategoriesMain from "../components/categories/CategoriesMain";

const routes = createBrowserRouter([
    {
        path: "/",
        element: <MainPage />,
        errorElement: <div>Error</div>,
        children: [
            {
                path: "orders",
                element: <OrdersMain />
            },
            {
                path: "tracker",
                element: <TrackerMain />
            },
            {
                path: "dishes",
                element: <DishesMain />
            },
            {
                path: "sales",
                element: <SalesMain />
            },
            {
                path: "inventory",
                element: <InventoryMain />
            },
            {
                path: "categories",
                element: <CategoriesMain />
            }
        ]
    }
]);

export default routes;