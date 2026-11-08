// Some routes must not be protected and need to be open for public access
// (e.g. a calculator linked from an email, a QR code or a shared document).
// Every path listed here is rendered outside <ProtectedRoute>.
import UnifiedProfitROIPage from "@/pages/M06/tool/unifiedprofitroi/UnifiedProfitROIPage";

const routes = [
  { path: "/crm/tool/unified-profit-roi", element: <UnifiedProfitROIPage /> },
];

export default routes;
