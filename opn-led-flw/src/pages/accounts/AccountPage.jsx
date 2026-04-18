import React from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

const AccountPage = () => {
    const customers = [
        { id: 1, name: 'John Doe', email: 'john@example.com', status: 'Active' },
        { id: 2, name: 'Jane Smith', email: 'jane@example.com', status: 'Inactive' },
        { id: 3, name: 'Bob Johnson', email: 'bob@example.com', status: 'Pending' },
    ];

    return (
        <div>
            <h1 className="text-3xl font-bold mb-4">Account Management</h1>
            <DataTable value={customers} stripedRows tableStyle={{ minWidth: '50rem' }}>
                <Column field="id" header="ID"></Column>
                <Column field="name" header="Name"></Column>
                <Column field="email" header="Email"></Column>
                <Column field="status" header="Status"></Column>
            </DataTable>
        </div>
    );
};

export default AccountPage;
