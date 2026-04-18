import React from 'react';
import { Card } from 'primereact/card';

const HomePage = () => {
    return (
        <div>
            <h1 className="text-3xl font-bold mb-4">Welcome Home</h1>
            <div className="grid">
                <div className="col-12 md:col-6 lg:col-4">
                    <Card title="Quick Stats" className="h-full">
                        <p className="m-0">You have 12 new notifications today.</p>
                    </Card>
                </div>
                <div className="col-12 md:col-6 lg:col-4">
                    <Card title="Recent Activity" className="h-full">
                        <p className="m-0">Your profile was updated 2 hours ago.</p>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default HomePage;
