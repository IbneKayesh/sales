import React, { useState } from 'react';

const BarChartComp = ({ title, data, isLoading }) => {
  const [hovered, setHovered] = useState(null);
  const colors = ['var(--primary)', 'var(--info)', 'var(--success)', 'var(--warning)', 'var(--danger)', '#8b5cf6', '#ec4899'];

  if (isLoading) {
    return (
      <div className="surface-card p-3 border-round shadow-2 flex align-items-center justify-content-center h-full" style={{ minHeight: '300px', backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
        <i className="pi pi-spin pi-spinner text-4xl" style={{ color: 'var(--primary)' }}></i>
      </div>
    );
  }

  if (!data || !data.labels) return null;

  const labels = data.labels;
  const values = data.datasets ? data.datasets[0].data : (data.data || []);
  const maxVal = Math.max(...values, 1);

  return (
    <div className="surface-card p-3 border-round shadow-2 h-full flex flex-column" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
      <div className="flex justify-content-between align-items-center mb-4">
        <h3 className="text-sm font-medium uppercase tracking-wider m-0" style={{ color: 'var(--text-muted)' }}>
          {title}
        </h3>
        <i className="pi pi-chart-bar text-muted"></i>
      </div>
      
      <div className="flex-grow-1 flex align-items-end justify-content-around h-15rem w-full mt-4">
        {values.map((val, idx) => {
          const heightPercent = (val / maxVal) * 100;
          return (
            <div key={idx} className="flex flex-column align-items-center h-full justify-content-end w-full px-1">
              <div 
                className="border-round-top cursor-pointer transition-all transition-duration-300 w-full" 
                style={{ 
                  height: `${heightPercent}%`, 
                  maxWidth: '2rem',
                  backgroundColor: colors[idx % colors.length],
                  opacity: hovered === null || hovered === idx ? 1 : 0.6,
                  transform: hovered === idx ? 'scaleY(1.05)' : 'scaleY(1)',
                  transformOrigin: 'bottom',
                  boxShadow: hovered === idx ? `0 4px 12px ${colors[idx % colors.length]}40` : 'none'
                }}
                onMouseEnter={() => setHovered(idx)}
                onMouseLeave={() => setHovered(null)}
              >
                <div className="flex justify-content-center pt-2">
                   <span className="text-xs font-bold text-white" style={{ writingMode: heightPercent < 15 ? 'horizontal-tb' : 'vertical-rl' }}>{val}</span>
                </div>
              </div>
              <span className="text-xs mt-2 text-500 text-center w-full overflow-hidden text-overflow-ellipsis white-space-nowrap">{labels[idx]}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BarChartComp;
