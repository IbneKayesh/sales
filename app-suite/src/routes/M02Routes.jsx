import InvoicePage from "@/pages/M02/invoice/InvoicePage";
import PosPage from "@/pages/M02/pos/PosPage";

const routes = [
  { path: "/sales/invoice", element: <InvoicePage /> },
  { path: "/sales/pos", element: <PosPage /> },
];

export default routes;
