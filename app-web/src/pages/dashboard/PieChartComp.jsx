import React, { useState } from 'react';

const PieChartComp = ({ title, data }) => {
    const colors = ['#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899', '#6366F1', '#06B6D4', '#F43F5E'];
    const [hovered, setHovered] = useState(null);
    
    const getCoordinatesForPercent = (percent) => {
        const x = Math.cos(2 * Math.PI * percent);
        const y = Math.sin(2 * Math.PI * percent);
        return [x, y];
    };

    let cumulativePercent = 0;

    return (
        <div className="surface-card shadow-2 p-3 border-round flex flex-column align-items-center justify-content-center h-full">
            <div className="text-xl font-medium text-900 mb-4 align-self-start">{title || 'Pie Chart'}</div>
            
            <svg viewBox="-1 -1 2 2" style={{ width: '150px', height: '150px', transform: 'rotate(-90deg)' }}>
                {data && data.map((item, index) => {
                    const [startX, startY] = getCoordinatesForPercent(cumulativePercent);
                    cumulativePercent += (item.value / 100);
                    const [endX, endY] = getCoordinatesForPercent(cumulativePercent);
                    const largeArcFlag = (item.value / 100) > 0.5 ? 1 : 0;
                    const pathData = [
                        `M ${startX} ${startY}`,
                        `A 1 1 0 ${largeArcFlag} 1 ${endX} ${endY}`,
                        `L 0 0`,
                    ].join(' ');
                    
                    const color = colors[index % colors.length];
                    return (
                        <path 
                            key={index} 
                            d={pathData} 
                            fill={color} 
                            className="transition-all cursor-pointer"
                            style={{ 
                                opacity: hovered === null || hovered === index ? 1 : 0.6,
                                transform: hovered === index ? 'scale(1.02)' : 'scale(1)',
                                transformOrigin: 'center'
                            }}
                            onMouseEnter={() => setHovered(index)}
                            onMouseLeave={() => setHovered(null)}
                        >
                            <title>{`${item.label}: ${item.value}%`}</title>
                        </path>
                    );
                })}
            </svg>

            <div className="mt-4 flex flex-wrap justify-content-center gap-3 text-sm">
                {data && data.map((item, idx) => (
                    <span key={idx} className="flex align-items-center">
                        <div 
                            className="w-1rem h-1rem border-round mr-2 transition-all" 
                            style={{ 
                                backgroundColor: colors[idx % colors.length],
                                transform: hovered === idx ? 'scale(1.2)' : 'scale(1)'
                            }}
                        ></div> 
                        <span className={hovered === idx ? 'font-bold' : ''}>{item.label} ({item.value}%)</span>
                    </span>
                ))}
            </div>
        </div>
    );
}

export default PieChartComp;
