import React from "react";

const BoxComp = ({ title, subtitle, value, subNumber, icon, iconBg, iconColor, hasChildren, onClick, isLoading }) => {
  return (
    <div
      onClick={hasChildren || onClick ? onClick : undefined}
      className={`
        surface-card shadow-2 p-3 border-round transition-all transition-duration-300
        ${hasChildren || onClick ? "cursor-pointer" : "cursor-default"}
        flex flex-column h-full
      `}
      style={{ 
        border: '1px solid var(--border-color)',
        backgroundColor: 'var(--bg-card)',
        position: 'relative',
        overflow: 'hidden',
        transition: 'var(--transition)'
      }}
      onMouseEnter={(e) => {
        if (hasChildren || onClick) {
          e.currentTarget.style.borderColor = 'var(--primary)';
          e.currentTarget.style.transform = 'translateY(-4px)';
          e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
        }
      }}
      onMouseLeave={(e) => {
        if (hasChildren || onClick) {
          e.currentTarget.style.borderColor = 'var(--border-color)';
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
        }
      }}
    >
      <div className="flex justify-content-between mb-3">
        <div className="flex-grow-1">
          <span className="block font-medium mb-1" style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>{title}</span>
          {subtitle && <span className="block text-xs mb-2" style={{ color: 'var(--text-muted)', opacity: 0.7 }}>{subtitle}</span>}
          <div className="text-2xl font-bold" style={{ color: 'var(--text-main)' }}>
            {isLoading ? (
              <i className="pi pi-spin pi-spinner opacity-50"></i>
            ) : (
              typeof value === 'number' && !title.toLowerCase().includes('rate') && !title.toLowerCase().includes('progress') && !title.toLowerCase().includes('%')
                ? `$${value.toLocaleString()}` 
                : (value !== undefined ? (typeof value === 'number' && (title.toLowerCase().includes('rate') || title.toLowerCase().includes('progress') || title.toLowerCase().includes('%')) ? `${value}%` : value) : '0')
            )}
          </div>
        </div>
        <div className={`flex align-items-center justify-content-center border-round ${iconBg || ''}`} style={{ width: '2.5rem', height: '2.5rem', backgroundColor: iconBg ? undefined : (hasChildren ? 'var(--primary-glow)' : 'var(--info-light)') }}>
          <i className={`${icon || (hasChildren ? 'pi pi-arrow-right' : 'pi pi-chart-bar')} text-xl ${iconColor || ''}`} style={{ color: iconColor ? undefined : (hasChildren ? 'var(--primary)' : 'var(--info)') }}></i>
        </div>
      </div>

      <div className="mt-auto flex justify-content-between align-items-center">
        <span className="text-xs font-medium" style={{ color: 'var(--success)' }}>
          {hasChildren ? 'Click to view details' : 'Updated just now'}
        </span>
        {subNumber && (
          <span className={`text-xs font-bold px-2 py-1 border-round ${subNumber.toString().startsWith('-') ? 'bg-pink-100 text-pink-600' : 'bg-green-100 text-green-600'}`}>
            {subNumber.toString().startsWith('-') ? '' : '+'}{subNumber}
          </span>
        )}
      </div>

      {/* Subtle background glow */}
      <div
        className="absolute"
        style={{
          right: '-1rem',
          bottom: '-1rem',
          width: '4rem',
          height: '4rem',
          borderRadius: '50%',
          filter: 'blur(30px)',
          opacity: 0.1,
          backgroundColor: 'var(--primary)',
          zIndex: 0
        }}
      ></div>
    </div>
  );
};


export default BoxComp;
