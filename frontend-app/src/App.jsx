import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import "./App.css";
import { AuthProvider, useAuth } from "./hooks/useAuth.jsx";
import { AppUIProvider } from "./hooks/useAppUI.jsx";
import LoadingSpinner from "@/components/common/LoadingSpinner";

// --- Layout Imports (Static) ---
import Layout from "./pages/layout/Layout.jsx";
import MobileLayout from "./mobile/layout";

// --- Lazy-loaded Page Imports ---

// Core & General
const LandingPage = React.lazy(() => import("./pages/LandingPage"));
const HomePage = React.lazy(() => import("./pages/HomePage.jsx"));
const ModulePage = React.lazy(() => import("./pages/ModulePage.jsx"));
const AuthPage = React.lazy(() => import("./pages/auth/AuthPage"));

// CRM
const ContactPage = React.lazy(
  () => import("./pages/crm/contacts/ContactPage.jsx"),
);
const OrderRoutePage = React.lazy(
  () => import("./pages/crm/orderroute/OrderRoutePage.jsx"),
);
const DeliveryVanPage = React.lazy(
  () => import("./pages/crm/deliveryvan/DeliveryVanPage.jsx"),
);
const DZonePage = React.lazy(() => import("./pages/crm/dzone/DZonePage.jsx"));
const TAreaPage = React.lazy(() => import("./pages/crm/tarea/TAreaPage.jsx"));
const TerritoryPage = React.lazy(
  () => import("./pages/crm/territory/TerritoryPage.jsx"),
);

// HRMS
const EmployeesPage = React.lazy(
  () => import("./pages/hrms/employee/EmployeesPage.jsx"),
);

// Accounts
const AccountsPage = React.lazy(
  () => import("./pages/accounts/accounts/AccountsPage"),
);
const HeadsPage = React.lazy(() => import("./pages/accounts/heads/HeadsPage"));
const LedgerPage = React.lazy(
  () => import("./pages/accounts/ledger/LedgerPage"),
);
const PayablesPage = React.lazy(
  () => import("./pages/accounts/payables/PayablesPage"),
);
const ExpensesPage = React.lazy(
  () => import("./pages/accounts/expneses/ExpensesPage"),
);
const ReceivablesPage = React.lazy(
  () => import("./pages/accounts/receivables/ReceivablesPage"),
);

// Inventory
const UnitPage = React.lazy(() => import("./pages/inventory/units/UnitPage"));
const BrandPage = React.lazy(
  () => import("./pages/inventory/brands/BrandPage"),
);
const CategoryPage = React.lazy(
  () => import("./pages/inventory/category/CategoryPage"),
);
const ProductsPage = React.lazy(
  () => import("./pages/inventory/products/ProductsPage"),
);
const StockReportsPage = React.lazy(
  () => import("./pages/inventory/stockreports/StockReportsPage"),
);
const TransferPage = React.lazy(
  () => import("./pages/inventory/itransfer/TransferPage"),
);

// Purchase
const BookingPage = React.lazy(
  () => import("./pages/purchase/pbooking/BookingPage"),
);
const ReceiptPage = React.lazy(
  () => import("./pages/purchase/preceipt/ReceiptPage"),
);
const InvoicePage = React.lazy(
  () => import("./pages/purchase/pinvoice/InvoicePage"),
);

// Sales
const SInvoicePage = React.lazy(
  () => import("./pages/sales/sinvoice/SInvoicePage"),
);
const SBookingPage = React.lazy(
  () => import("./pages/sales/sbooking/SBookingPage"),
);
const SReceiptPage = React.lazy(
  () => import("./pages/sales/sreceipt/SReceiptPage"),
);

// Support
const GrainsPage = React.lazy(() => import("./pages/support/GrainsPage"));
const NotesPage = React.lazy(() => import("./pages/support/notes/NotesPage"));
const TicketsPage = React.lazy(
  () => import("./pages/support/tickets/TicketsPage"),
);
const SessionsPage = React.lazy(
  () => import("./pages/support/SessionsPage.jsx"),
);

// Setup
const DatabasePage = React.lazy(
  () => import("./pages/setup/database/DatabasePage.jsx"),
);
const BusinessPage = React.lazy(
  () => import("./pages/setup/business/BusinessPage.jsx"),
);
const UsersPage = React.lazy(() => import("./pages/setup/users/UsersPage.jsx"));
const ProfileSettings = React.lazy(
  () => import("./pages/setup/users/ProfileSettings.jsx"),
);
const PasswordPage = React.lazy(
  () => import("./pages/setup/users/PasswordPage.jsx"),
);
const DefaultDataPage = React.lazy(
  () => import("./pages/setup/settings/DefaultDataPage.jsx"),
);

// Reports
const DashboardPage = React.lazy(
  () => import("./pages/reports/shop/DashboardPage.jsx"),
);

// Mobile Specific
const MobileHome = React.lazy(() => import("./mobile/home"));
const MobileAbout = React.lazy(() => import("./mobile/about"));
const MobileMenus = React.lazy(() => import("./mobile/menus"));
const MobileSample = React.lazy(() => import("./mobile/sample"));

function App() {
  return (
    <AppUIProvider>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </AppUIProvider>
  );
}

function AppRoutes() {
  const { user, isMobileView } = useAuth();

  if (isMobileView) {
    return (
      <Router>
        <MobileLayout>
          <React.Suspense
            fallback={
              <LoadingSpinner
                fullScreen
                message="Loading..."
                subMessage="Setting up your experience"
              />
            }
          >
            <Routes>
              <Route path="/" element={<MobileHome />} />
              <Route path="/home" element={<MobileHome />} />
              <Route path="/menus" element={<MobileMenus />} />
              <Route path="/sample" element={<MobileSample />} />
              <Route path="/about" element={<MobileAbout />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </React.Suspense>
        </MobileLayout>
      </Router>
    );
  }

  return (
    <Router>
      <div style={{ position: "relative" }}>
        <React.Suspense
          fallback={
            <LoadingSpinner
              fullScreen
              message="Loading..."
              subMessage="Preparing your dashboard"
            />
          }
        >
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route
              path="/login"
              element={
                user ? <Navigate to="/home" /> : <AuthPage defComp="login" />
              }
            />
            <Route
              path="/home"
              element={user ? <Layout /> : <Navigate to="/login" />}
            >
              <Route index element={<HomePage />} />
              <Route path="module" element={<ModulePage />} />
              //auth //crm
              <Route path="crm/contact" element={<ContactPage />} />
              <Route path="crm/order-route" element={<OrderRoutePage />} />
              <Route path="crm/delivery-van" element={<DeliveryVanPage />} />
              <Route path="crm/dzone" element={<DZonePage />} />
              <Route path="crm/tarea" element={<TAreaPage />} />
              <Route path="crm/territory" element={<TerritoryPage />} />
              //hrms
              <Route path="hrms/employees" element={<EmployeesPage />} />
              //accounts
              <Route path="accounts/accounts" element={<AccountsPage />} />
              <Route path="accounts/heads" element={<HeadsPage />} />
              <Route path="accounts/ledger" element={<LedgerPage />} />
              <Route path="accounts/payables" element={<PayablesPage />} />
              <Route path="accounts/expenses" element={<ExpensesPage />} />
              <Route
                path="accounts/receivables"
                element={<ReceivablesPage />}
              />
              //inventory
              <Route path="inventory/units" element={<UnitPage />} />
              <Route path="inventory/brands" element={<BrandPage />} />
              <Route path="inventory/category" element={<CategoryPage />} />
              <Route path="inventory/products" element={<ProductsPage />} />
              <Route
                path="inventory/stockreports"
                element={<StockReportsPage />}
              />
              <Route path="inventory/itransfer" element={<TransferPage />} />
              //support
              <Route path="support/grains" element={<GrainsPage />} />
              //purchase
              <Route path="purchase/pbooking" element={<BookingPage />} />
              <Route path="purchase/preceipt" element={<ReceiptPage />} />
              <Route path="purchase/pinvoice" element={<InvoicePage />} />
              //sales
              <Route path="sales/sinvoice" element={<SInvoicePage />} />
              <Route path="sales/sbooking" element={<SBookingPage />} />
              <Route path="sales/sreceipt" element={<SReceiptPage />} />
              //support
              <Route path="support/notes" element={<NotesPage />} />
              <Route path="support/tickets" element={<TicketsPage />} />
              <Route path="support/sessions" element={<SessionsPage />} />
              //setup
              <Route path="setup/database" element={<DatabasePage />} />
              <Route path="setup/business" element={<BusinessPage />} />
              <Route path="setup/users" element={<UsersPage />} />
              <Route path="setup/users/profile" element={<ProfileSettings />} />
              <Route path="setup/users/password" element={<PasswordPage />} />
              <Route path="setup/default-data" element={<DefaultDataPage />} />
              //reports
              <Route
                path="reports/shop/dashboard"
                element={<DashboardPage />}
              />
              <Route path="*" element={<Navigate to="/home" replace />} />
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </React.Suspense>
      </div>
    </Router>
  );
}

export default App;
