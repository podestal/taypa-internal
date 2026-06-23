import { createBrowserRouter } from "react-router-dom";
import MainPage from "../pages/MainPage";
import OrdersMain from "../components/orders/OrdersMain";
import TrackerMain from "../components/tracker/TrackerMain";
// import SalesMain from "../components/sales/SalesMain";
// import InventoryMain from "../components/inventory/InventoryMain";
import KitchenMain from "../components/kitchen/KitchenMain";
import LoginPage from "../components/auth/LoginPage";
import PrivateRoutes from "../components/auth/PrivateRoutes";
import TaxesMain from "../components/taxes/TaxesMain";
import CategoriesPage from "../components/categories/page/CategoriesPage";
import DishesPage from "../components/dishes/page/DishesPage";
import NotFoundError from "../components/errores/NotFoundError";
import RouteError from "../components/errores/RouteError";
import ProductsMain from "../components/darkKitchen/products/ProductsMain";
import InventoryMain from "../components/darkKitchen/inventory/InventoryMain";
import PurchaseMain from "../components/darkKitchen/purchases/PurchaseMain";
import AccountMain from "../components/darkKitchen/account/AccountMain";
import CategoriesMain from "../components/darkKitchen/categories/CategoriesMain";
import DishesMain from "../components/darkKitchen/dishes/DishesMain";
import SalesMain from "../components/darkKitchen/sales/SalesMain";
import ToppingsMain from "../components/darkKitchen/toppings/ToppingsMain";
import DashboardMain from "../components/darkKitchen/dashboard/DashboardMain";

const routes = createBrowserRouter([
    {
        path: "/login",
        element: <LoginPage />,
    },
    {
        path: "/",
        element: <PrivateRoutes />,
        errorElement: <RouteError />,
        children: [
            {
                path: "",
                element: <MainPage />,
                children: [
                    {
                        path: "dashboard",
                        element: <DashboardMain />
                    },
                    {
                        path: "products",
                        element: <ProductsMain />
                    },
                    {
                        path: "inventory",
                        element: <InventoryMain />
                    },
                    {
                        path: "inventario",
                        element: <InventoryMain />
                    },
                    {
                        path: "compras",
                        element: <PurchaseMain />
                    },
                    {
                        path: "purchases",
                        element: <PurchaseMain />
                    },
                    {
                        path: "cuentas",
                        element: <AccountMain />
                    },
                    {
                        path: "accounts",
                        element: <AccountMain />
                    },
                    {
                        path: "orders",
                        element: <OrdersMain />
                    },
                    {
                        path: "tracker",
                        element: <TrackerMain />
                    },
                    {
                        path: "platos",
                        element: <DishesMain />
                    },
                    {
                        path: "ventas",
                        element: <SalesMain />
                    },
                    {
                        path: "toppings",
                        element: <ToppingsMain />
                    },
                    {
                        path: "sales",
                        element: <SalesMain />
                    },
                    {
                        path: "dishes",
                        element: <DishesPage />
                    },
                    // {
                    //     path: "sales",
                    //     element: <SalesMain />
                    // },
                    // {
                    //     path: "inventory",
                    //     element: <InventoryMain />
                    // },
                    {
                        path: "categorias",
                        element: <CategoriesMain />
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
    },
    {
        path: "*",
        element: <NotFoundError />
    }
]);

export default routes;