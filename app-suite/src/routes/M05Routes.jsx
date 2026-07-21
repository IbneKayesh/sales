import ProductionPage from "@/pages/M05/setup/productions/ProductionPage";
import BOMPage from "@/pages/M05/setup/bom/BOMPage";
import ProcessPage from "@/pages/M05/setup/process/ProcessPage";

const routes = [
  { path: "/manufacturing/setup/productions", element: <ProductionPage /> },
  { path: "/manufacturing/setup/bom", element: <BOMPage /> },
  { path: "/manufacturing/setup/process", element: <ProcessPage /> },
];

export default routes;
