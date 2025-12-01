import { createBrowserRouter } from "react-router-dom";
import MainPage from "../pages/MainPage";
import OrdersMain from "../components/orders/OrdersMain";
import TrackerMain from "../components/tracker/TrackerMain";
import SalesMain from "../components/sales/SalesMain";
import InventoryMain from "../components/inventory/InventoryMain";
import KitchenMain from "../components/kitchen/KitchenMain";
import LoginPage from "../components/auth/LoginPage";
import PrivateRoutes from "../components/auth/PrivateRoutes";
import TaxesMain from "../components/taxes/TaxesMain";
import CategoriesPage from "../components/categories/page/CategoriesPage";
import DishesPage from "../components/dishes/page/DishesPage";

const routes = createBrowserRouter([
    {
        path: "/login",
        element: <LoginPage />,
    },
    {
        path: "/",
        element: <PrivateRoutes />,
        errorElement: <div>Error</div>,
        children: [
            {
                path: "",
                element: <MainPage />,
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
                        element: <DishesPage />
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
                        element: <CategoriesPage /> 
                    },
                    {
                        path: "kitchen",
                        element: <KitchenMain />
                    },
                    {
                        path: "taxes",
                        element: <TaxesMain />
                    }
                ]
            }
        ]
    }
]);

export default routes;