import InvoicePage from "@/pages/M02/invoice/InvoicePage";
import PosPage from "@/pages/M02/pos/PosPage";
import DeliveryTripsPage from "@/pages/M02/deliverytrips/DeliveryTripsPage";

const routes = [
  { path: "/sales/invoice", element: <InvoicePage /> },
  { path: "/sales/pos", element: <PosPage /> },
  { path: "/sales/delivery-trips", element: <DeliveryTripsPage /> },
];

export default routes;
