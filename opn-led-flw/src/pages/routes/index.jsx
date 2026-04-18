import React from 'react';
import { Navigate } from 'react-router-dom';
import Layout from '../layouts/layout';
import HomePage from '../HomePage';
import AccountPage from '../accounts/AccountPage';
import LoginPage from '../auth/LoginPage';
import { useAuth } from '../../hooks/AuthContext';

const ProtectedRoute = ({ children }) => {
    const { user } = useAuth();
    if (!user) {
        return <Navigate to="/login" replace />;
    }
    return children;
};

const routes = [
    {
        path: '/login',
        element: <LoginPage />
    },
    {
        path: '/',
        element: (
            <ProtectedRoute>
                <Layout />
            </ProtectedRoute>
        ),
        children: [
            {
                index: true,
                element: <HomePage />
            },
            {
                path: 'accounts',
                element: <AccountPage />
            }
        ]
    },
    {
        path: '*',
        element: <Navigate to="/" replace />
    }
];

export default routes;
