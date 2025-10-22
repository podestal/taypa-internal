import { createBrowserRouter } from "react-router-dom";
import MainPage from "../components/pages/MainPage";
import OrdersMain from "../components/orders/OrdersMain";
import TrackerMain from "../components/tracker/TrackerMain";

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
            }
        ]
    }
]);

export default routes;