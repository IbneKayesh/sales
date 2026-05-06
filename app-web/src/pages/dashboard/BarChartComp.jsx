import React from 'react';

const BarChartComp = ({ title, data, legendLabels }) => {
    const barColors = ['bg-blue-500', 'bg-orange-500', 'bg-green-500', 'bg-purple-500'];

    // Check if any item has multiple values to show legend
    const isComparable = data && data.some(item => Array.isArray(item.value));
    const labels = legendLabels || ['Actual', 'Target', 'Previous', 'Forecast'];

    return (
        <div className="surface-card shadow-2 p-3 border-round flex flex-column h-full">
            <div className="text-xl font-medium text-900 mb-2">{title || 'Bar Chart'}</div>
            
            {isComparable && (
                <div className="flex flex-wrap gap-3 mb-4 text-xs text-500">
                    {data[0].value.map((_, i) => (
                        <span key={i} className="flex align-items-center">
                            <div className={`w-1rem h-1rem ${barColors[i % barColors.length]} border-round mr-1`}></div> {labels[i]}
                        </span>
                    ))}
                </div>
            )}

            <div className="flex align-items-end justify-content-around h-12rem mt-auto">
                {data && data.map((item, idx) => (
                    <div key={idx} className="flex flex-column align-items-center h-full justify-content-end w-full px-1">
                        <div className="flex align-items-end gap-1 w-full justify-content-center h-full">
                            {Array.isArray(item.value) ? (
                                item.value.map((val, vIdx) => (
                                    <div 
                                        key={vIdx} 
                                        className={`${barColors[vIdx % barColors.length]} border-round-top cursor-pointer flex flex-column align-items-center justify-content-start pt-1 transition-all transition-duration-200`} 
                                        style={{ 
                                            height: `${val}%`, 
                                            width: '1rem',
                                            transformOrigin: 'bottom'
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.transform = 'scaleY(1.05)';
                                            e.currentTarget.style.filter = 'brightness(1.1)';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.transform = 'scaleY(1)';
                                            e.currentTarget.style.filter = 'brightness(1)';
                                        }}
                                        title={`${labels[vIdx]}: ${val}%`}
                                    >
                                        <span className="text-white font-bold" style={{ fontSize: '0.5rem', writingMode: 'vertical-rl' }}>{val}</span>
                                    </div>
                                ))
                            ) : (
                                <div 
                                    className="bg-blue-500 border-round-top cursor-pointer flex flex-column align-items-center justify-content-start pt-1 transition-all transition-duration-200" 
                                    style={{ 
                                        height: `${item.value}%`, 
                                        width: '2rem',
                                        transformOrigin: 'bottom'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.transform = 'scaleY(1.05)';
                                        e.currentTarget.style.filter = 'brightness(1.1)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.transform = 'scaleY(1)';
                                        e.currentTarget.style.filter = 'brightness(1)';
                                    }}
                                    title={`${item.value}%`}
                                >
                                    <span className="text-white font-bold" style={{ fontSize: '0.6rem' }}>{item.value}</span>
                                </div>
                            )}
                        </div>
                        <span className="text-xs mt-2 text-500">{item.label}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default BarChartComp;
