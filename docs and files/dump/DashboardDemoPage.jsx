import React from 'react';
import BoxComp from './BoxComp';
import TableComp from './TableComp';
import PieChartComp from './PieChartComp';
import DoughnutChartComp from './DoughnutChartComp';
import BarChartComp from './BarChartComp';

const dashboardData = {
    boxes: [
        { id: 1, title: 'Total Sales', number: '$45,000', subNumber: '+12%', subtitle: 'since last week', icon: 'pi pi-shopping-cart', iconBg: 'bg-blue-100', iconColor: 'text-blue-500' },
        { id: 2, title: 'Revenue', number: '$3,200', subNumber: '+5%', subtitle: 'since last week', icon: 'pi pi-dollar', iconBg: 'bg-green-100', iconColor: 'text-green-500' },
        { id: 3, title: 'Customers', number: '1,245', subNumber: '+22%', subtitle: 'since last week', icon: 'pi pi-users', iconBg: 'bg-orange-100', iconColor: 'text-orange-500' }
    ],
    tables: [
        {
            id: 1,
            title: 'Recent Transactions',
            columns: [
                { field: 'id', header: 'ID' },
                { field: 'date', header: 'Date' },
                { field: 'amount', header: 'Amount' },
                { field: 'status', header: 'Status' }
            ],
            data: [
                { id: '1001', date: '2023-10-01', amount: '$120.00', status: 'Completed' },
                { id: '1002', date: '2023-10-02', amount: '$45.00', status: 'Pending' },
                { id: '1003', date: '2023-10-03', amount: '$250.00', status: 'Completed' },
                { id: '1004', date: '2023-10-04', amount: '$85.00', status: 'Failed' },
                { id: '1005', date: '2023-10-05', amount: '$190.00', status: 'Completed' }
            ]
        },
        {
            id: 2,
            title: 'Top Products',
            columns: [
                { field: 'code', header: 'Code' },
                { field: 'name', header: 'Product' },
                { field: 'sales', header: 'Sales' },
            ],
            data: [
                { code: 'P-001', name: 'Laptop Pro', sales: '145' },
                { code: 'P-002', name: 'Wireless Mouse', sales: '320' },
                { code: 'P-003', name: 'Keyboard', sales: '210' },
                { code: 'P-004', name: 'Monitor 27"', sales: '85' },
                { code: 'P-005', name: 'USB-C Hub', sales: '410' }
            ]
        }
    ],
    charts: {
        pie: [
            { label: 'Electronics', value: 40 },
            { label: 'Accessories', value: 35 },
            { label: 'Software', value: 25 }
        ],
        doughnut: [
            { label: 'Direct', value: 30 },
            { label: 'Social', value: 50 },
            { label: 'Referral', value: 20 }
        ],
        bardouble: [
            { label: 'Jan', value: [80, 45] },
            { label: 'Feb', value: [40, 60] },
            { label: 'Mar', value: [60, 30] },
            { label: 'Apr', value: [90, 70] },
            { label: 'May', value: [50, 40] }
        ],
        barsingle: [
            { label: 'Jan', value: 10 },
            { label: 'Feb', value: 20 },
            { label: 'Mar', value: 30 },
            { label: 'Apr', value: 25 },
            { label: 'May', value: 30 }
        ]
    }
};

const DashboardDemoPage = () => {
    return (
        <div className="p-4 flex flex-column gap-4">
            <div className="text-2xl font-bold text-900">Dashboard</div>
            
            <div className="grid">
                {dashboardData.boxes.map((box) => (
                    <div key={box.id} className="col-12 md:col-4">
                        <BoxComp 
                            title={box.title} 
                            number={box.number} 
                            subNumber={box.subNumber} 
                            subtitle={box.subtitle}
                            icon={box.icon}
                            iconBg={box.iconBg}
                            iconColor={box.iconColor}
                            onClick={() => console.log(`Clicked on ${box.title}`)}
                        />
                    </div>
                ))}
            </div>

            <div className="grid">
                <div className="col-12 lg:col-3">
                    <PieChartComp title="Sales by Category" data={dashboardData.charts.pie} />
                </div>
                <div className="col-12 lg:col-3">
                    <DoughnutChartComp title="User Demographics" data={dashboardData.charts.doughnut} />
                </div>
                <div className="col-12 lg:col-3">
                    <BarChartComp 
                        title="Revenue vs Target" 
                        data={dashboardData.charts.bardouble} 
                        legendLabels={['Revenue', 'Target']}
                    />
                </div>
                <div className="col-12 lg:col-3">
                    <BarChartComp 
                        title="Monthly Growth" 
                        data={dashboardData.charts.barsingle} 
                    />
                </div>
            </div>

            <div className="grid">
                {dashboardData.tables.map((table) => (
                    <div key={table.id} className="col-12 lg:col-6">
                        <TableComp 
                            title={table.title} 
                            columns={table.columns} 
                            data={table.data} 
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DashboardDemoPage;