import MrrPage from "@/pages/M03/mrr/MrrPage";
import PorPage from "@/pages/M03/por/PorPage";

const routes = [
  { path: "/purchase/mrr-direct", element: <MrrPage /> },
  { path: "/purchase/orders", element: <PorPage /> },
];

export default routes;
