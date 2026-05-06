import React from 'react';

const BoxComp = ({ title, subtitle, number, subNumber, icon, iconColor, iconBg, onClick }) => {
    return (
        <div 
            className="surface-card shadow-2 p-3 border-round cursor-pointer hover:shadow-4 transition-all transition-duration-200"
            onClick={onClick}
        >
            <div className="flex justify-content-between mb-3">
                <div>
                    <span className="block text-500 font-medium mb-3">{title}</span>
                    <div className="text-900 font-medium text-xl">{number}</div>
                </div>
                <div className={`flex align-items-center justify-content-center ${iconBg || 'bg-blue-100'} border-round`} style={{ width: '2.5rem', height: '2.5rem' }}>
                    <i className={`${icon || 'pi pi-chart-bar'} ${iconColor || 'text-blue-500'} text-xl`}></i>
                </div>
            </div>
            <span className="text-green-500 font-medium">{subNumber} </span>
            <span className="text-500">{subtitle}</span>
        </div>
    );
};

export default BoxComp;