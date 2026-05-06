import React, { useState } from 'react';

const DoughnutChartComp = ({ title, data }) => {
    const colors = ['#8B5CF6', '#EC4899', '#6366F1', '#3B82F6', '#10B981', '#F59E0B', '#06B6D4', '#F43F5E'];
    const [hovered, setHovered] = useState(null);

    const getCoordinatesForPercent = (percent) => {
        const x = Math.cos(2 * Math.PI * percent);
        const y = Math.sin(2 * Math.PI * percent);
        return [x, y];
    };

    let cumulativePercent = 0;

    return (
        <div className="surface-card shadow-2 p-3 border-round flex flex-column align-items-center justify-content-center h-full">
            <div className="text-xl font-medium text-900 mb-4 align-self-start">{title || 'Doughnut Chart'}</div>
            <div className="relative" style={{ width: '150px', height: '150px' }}>
                <svg viewBox="-1 -1 2 2" style={{ transform: 'rotate(-90deg)' }}>
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
                {/* Center Cutout with hover info */}
                <div className="absolute top-0 left-0 w-full h-full flex flex-column align-items-center justify-content-center pointer-events-none">
                    <div className="flex flex-column align-items-center justify-content-center" style={{ width: '60%', height: '60%', borderRadius: '50%', backgroundColor: 'var(--surface-card, #ffffff)' }}>
                        {hovered !== null ? (
                            <>
                                <span className="text-sm font-bold text-900">{data[hovered].value}%</span>
                                <span className="text-xs text-500 text-center px-1" style={{ fontSize: '0.6rem' }}>{data[hovered].label}</span>
                            </>
                        ) : (
                            <span className="text-xs text-500">Hover me</span>
                        )}
                    </div>
                </div>
            </div>
             <div className="mt-4 flex flex-wrap justify-content-center gap-3 text-sm">
                {data && data.map((item, idx) => (
                    <span key={idx} className="flex align-items-center">
                        <div 
                            className={`w-1rem h-1rem border-round mr-2 transition-all`} 
                            style={{ 
                                backgroundColor: colors[idx % colors.length],
                                transform: hovered === idx ? 'scale(1.2)' : 'scale(1)',
                                boxShadow: hovered === idx ? '0 0 8px rgba(0,0,0,0.2)' : 'none'
                            }}
                        ></div> 
                        <span className={hovered === idx ? 'font-bold' : ''}>{item.label} ({item.value}%)</span>
                    </span>
                ))}
            </div>
        </div>
    );
}

export default DoughnutChartComp;
