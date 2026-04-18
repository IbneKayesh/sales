import React from 'react';
import { BrowserRouter, useRoutes } from 'react-router-dom';
import { AuthProvider } from './hooks/AuthContext';
import routes from './pages/routes';
import { PrimeReactProvider } from 'primereact/api';

const AppRoutes = () => {
    const element = useRoutes(routes);
    return element;
};

function App() {
    return (
        <PrimeReactProvider>
            <AuthProvider>
                <BrowserRouter>
                    <AppRoutes />
                </BrowserRouter>
            </AuthProvider>
        </PrimeReactProvider>
    );
}

export default App;
