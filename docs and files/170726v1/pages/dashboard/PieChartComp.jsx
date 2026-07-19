import React, { useState } from 'react';

const PieChartComp = ({ title, data, isLoading }) => {
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
  const values = data.data || (data.datasets ? data.datasets[0].data : []);
  const total = values.reduce((a, b) => a + b, 0);
  
  let cumulativePercent = 0;

  const getCoordinatesForPercent = (percent) => {
    const x = Math.cos(2 * Math.PI * percent);
    const y = Math.sin(2 * Math.PI * percent);
    return [x, y];
  };

  return (
    <div className="surface-card p-3 border-round shadow-2 h-full flex flex-column" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
      <div className="flex justify-content-between align-items-center mb-4">
        <h3 className="text-sm font-medium uppercase tracking-wider m-0" style={{ color: 'var(--text-muted)' }}>
          {title}
        </h3>
        <i className="pi pi-chart-pie text-muted"></i>
      </div>
      
      <div className="flex-grow-1 flex flex-column align-items-center justify-content-center">
        <div className="relative" style={{ width: '180px', height: '180px' }}>
          <svg viewBox="-1 -1 2 2" style={{ transform: 'rotate(-90deg)' }}>
            {values.map((val, index) => {
              const percent = val / total;
              const [startX, startY] = getCoordinatesForPercent(cumulativePercent);
              cumulativePercent += percent;
              const [endX, endY] = getCoordinatesForPercent(cumulativePercent);
              const largeArcFlag = percent > 0.5 ? 1 : 0;
              const pathData = [
                `M ${startX} ${startY}`,
                `A 1 1 0 ${largeArcFlag} 1 ${endX} ${endY}`,
                `L 0 0`,
              ].join(' ');
              
              return (
                <path 
                  key={index} 
                  d={pathData} 
                  fill={colors[index % colors.length]} 
                  className="transition-all cursor-pointer"
                  style={{ 
                    opacity: hovered === null || hovered === index ? 1 : 0.5,
                    transform: hovered === index ? 'scale(1.05)' : 'scale(1)',
                    transformOrigin: 'center'
                  }}
                  onMouseEnter={() => setHovered(index)}
                  onMouseLeave={() => setHovered(null)}
                />
              );
            })}
          </svg>
        </div>
        <div className="mt-4 flex flex-wrap justify-content-center gap-2">
          {labels.map((label, idx) => (
            <div key={idx} className="flex align-items-center p-1 px-2 border-round" style={{ backgroundColor: hovered === idx ? 'var(--hover-bg)' : 'transparent' }}>
              <div className="w-0-5rem h-0-5rem border-circle mr-2" style={{ backgroundColor: colors[idx % colors.length] }}></div>
              <span className="text-xs" style={{ color: hovered === idx ? 'var(--text-main)' : 'var(--text-muted)' }}>{label} ({Math.round((values[idx]/total)*100)}%)</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PieChartComp;
