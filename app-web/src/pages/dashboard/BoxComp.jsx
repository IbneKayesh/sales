import React, { useState } from 'react';

const BoxComp = ({ title, subtitle, number, subNumber, icon, iconColor, iconBg, onClick, clickable = true, className = "" }) => {
    const [isHighlighting, setIsHighlighting] = useState(false);

    const handleClick = () => {
        if (clickable) {
            onClick();
        } else {
            // Visual feedback for last layer (End of the road)
            setIsHighlighting(true);
            setTimeout(() => setIsHighlighting(false), 400);
        }
    };

    return (
        <div 
            className={`surface-card shadow-2 p-3 border-round transition-all transition-duration-200 
                ${clickable ? 'cursor-pointer hover:shadow-4' : 'cursor-default'} 
                ${isHighlighting ? 'border-1 border-yellow-500 bg-yellow-100' : ''} 
                ${className}`}
            onClick={handleClick}
        >

            <div className="flex justify-content-between mb-3">
                <div>
                    <span className="block text-500 font-medium mb-3">{title}</span>
                    <div className="text-900 font-medium text-2xl">{number}</div>
                </div>
                <div className="flex flex-column align-items-end gap-2">
                    <div className={`flex align-items-center justify-content-center ${iconBg || 'bg-blue-100'} border-round`} style={{ width: '2.5rem', height: '2.5rem' }}>
                        <i className={`${icon || 'pi pi-chart-bar'} ${iconColor || 'text-blue-500'} text-xl`}></i>
                    </div>
                    {clickable && (
                        <i className="pi pi-chevron-right text-400 text-xs mt-auto"></i>
                    )}
                </div>
            </div>
            <div className="flex align-items-center gap-1 overflow-hidden">
                <span className={`${subNumber?.toString().startsWith('-') ? 'text-pink-500' : 'text-green-500'} font-medium white-space-nowrap`}>{subNumber} </span>
                <span className="text-500 text-sm white-space-nowrap text-overflow-ellipsis overflow-hidden">{subtitle}</span>
            </div>
        </div>
    );
};

export default BoxComp;

