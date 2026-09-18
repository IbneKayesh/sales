import InvoicePage from "@/pages/M02/invoice/InvoicePage";
import PosPage from "@/pages/M02/pos/PosPage";
import DeliveryTripsPage from "@/pages/M02/deliverytrips/DeliveryTripsPage";
import OrdersPage from "@/pages/M02/orders/OrdersPage";

const routes = [
  { path: "/sales/invoice", element: <InvoicePage /> },
  { path: "/sales/pos", element: <PosPage /> },
  { path: "/sales/delivery-trips", element: <DeliveryTripsPage /> },
  { path: "/sales/orders", element: <OrdersPage /> },
];

export default routes;
