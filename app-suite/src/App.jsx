import { Suspense, lazy } from 'react';

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/context/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute/ProtectedRoute';
import DesktopLayout from '@/layouts/DesktopLayout/DesktopLayout';
import PageLoader from '@/components/PageLoader/PageLoader';
import { APP_ROUTES, LAZY_PAGES } from '@/routes/appConfig';

const LoginPage = lazy(() => import('@/pages/auth/LoginPage'));
const NotFoundPage = lazy(() => import('@/pages/system/NotFoundPage/NotFoundPage'));

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/login" element={<LoginPage />} />

            <Route element={<ProtectedRoute />}>
              <Route element={<DesktopLayout />}>
                <Route path="/" element={null} />
                <Route path="/home" element={null} />

                {/* Generate routes dynamically from appConfig */}
                {APP_ROUTES.filter((r) => r.id !== 'home').map((route) => {
                  const PageComponent = LAZY_PAGES[route.id];
                  if (!PageComponent) return null;
                  return (
                    <Route
                      key={route.id}
                      path={route.url}
                      element={<PageComponent />}
                    />
                  );
                })}

                <Route path="*" element={<NotFoundPage />} />
              </Route>
            </Route>
          </Routes>
        </Suspense>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
