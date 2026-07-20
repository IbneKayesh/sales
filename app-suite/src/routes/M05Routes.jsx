import ProductionPage from "@/pages/M05/setup/productions/ProductionPage";
import BOMPage from "@/pages/M05/setup/bom/BOMPage";

const routes = [
  { path: "/manufacturing/setup/productions", element: <ProductionPage /> },
  { path: "/manufacturing/setup/bom", element: <BOMPage /> },
];

export default routes;
