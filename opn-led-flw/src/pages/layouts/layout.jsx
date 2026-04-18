import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Menubar } from 'primereact/menubar';
import { Button } from 'primereact/button';
import { useAuth } from '../../hooks/AuthContext';

const Layout = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const items = [
        {
            label: 'Home',
            icon: 'pi pi-home',
            command: () => navigate('/')
        },
        {
            label: 'Accounts',
            icon: 'pi pi-users',
            command: () => navigate('/accounts')
        }
    ];

    const start = <img alt="logo" src="https://primefaces.org/cdn/primereact/images/logo.png" height="40" className="mr-2"></img>;
    const end = (
        <div className="flex align-items-center gap-2">
            <span className="font-bold text-blue-600">{user?.username}</span>
            <Button 
                label="Logout" 
                icon="pi pi-sign-out" 
                severity="danger" 
                text 
                onClick={() => {
                    logout();
                    navigate('/login');
                }} 
            />
        </div>
    );

    return (
        <div className="min-h-screen flex flex-column">
            <Menubar model={items} start={start} end={end} className="border-none bg-white shadow-2 px-4" />
            <main className="flex-1 p-4 surface-ground">
                <div className="card shadow-2 bg-white p-4 border-round-xl">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default Layout;
