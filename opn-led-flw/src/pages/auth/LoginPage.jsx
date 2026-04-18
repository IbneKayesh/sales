import React, { useState } from 'react';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Card } from 'primereact/card';
import { useAuth } from '../../hooks/AuthContext';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleLogin = () => {
        if (username.trim()) {
            const userData = { username, role: 'admin' };
            login(userData);
            navigate('/');
        }
    };

    return (
        <div className="flex align-items-center justify-content-center min-h-screen surface-ground">
            <Card title="Login" className="w-full md:w-25rem shadow-4">
                <div className="flex flex-column gap-3">
                    <div className="flex flex-column gap-2">
                        <label htmlFor="username">Username</label>
                        <InputText 
                            id="username" 
                            value={username} 
                            onChange={(e) => setUsername(e.target.value)} 
                            placeholder="Enter any username"
                            className="w-full"
                        />
                    </div>
                    <Button 
                        label="Login" 
                        icon="pi pi-sign-in" 
                        onClick={handleLogin} 
                        className="w-full mt-2" 
                    />
                </div>
            </Card>
        </div>
    );
};

export default LoginPage;
