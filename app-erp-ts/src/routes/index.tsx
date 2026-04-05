import type { RouteObject } from "react-router-dom";
import BrandLayout from "@/pages/inventory/brands/layout";
import BrandPage from "@/pages/inventory/brands";

const AppRoutesList: RouteObject[] = [
  {
    path: "/inventory/brands",
    element: <BrandLayout />,
    children: [
      {
        index: true,
        element: <BrandPage />,
      },
    ],
  },
];

export default AppRoutesList;
