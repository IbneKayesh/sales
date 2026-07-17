
import { getAppIcon } from '@/routes/appConfig';
import './DesktopIcon.css';

const DesktopIcon = ({ id, label, isSelected, onClick, onDoubleClick }) => {
  const Icon = getAppIcon(id);

  return (
    <button
      className={`desktop-icon d-flex flex-column ai-center gap-6 px-1 py-2 rounded-lg bg-transparent border-none cursor-pointer ${isSelected ? 'desktop-icon-selected' : ''}`}
      style={{width:'80px'}}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      onDoubleClick={(e) => {
        e.stopPropagation();
        onDoubleClick();
      }}
      aria-label={`${label} Shortcut`}
    >
      <div className="desktop-icon-wrap d-flex ai-center jc-center w-48 h-48 rounded-xl pos-relative">
        <div className="desktop-icon-glow" />
        {Icon ? <Icon className="w-32 h-32 text-primary" style={{filter:'drop-shadow(0 2px 4px rgba(0,0,0,0.3))'}} /> : null}
      </div>
      <span className="fs-11 fw-500 text-white text-center user-select-none" style={{wordBreak:'break-word', textShadow:'0 1px 3px rgba(0,0,0,0.8), 0 2px 6px rgba(0,0,0,0.5)', lineHeight:1.2}}>{label}</span>
    </button>
  );
};

export default DesktopIcon;
