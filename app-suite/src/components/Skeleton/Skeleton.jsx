
import './Skeleton.css';
/**
 * Skeleton — animated shimmer loading placeholder.
 *
 * Primitive types:
 *   <Skeleton.Line width="200px" />
 *   <Skeleton.Circle size={40} />
 *   <Skeleton.Block height={80} />
 *   <Skeleton.Text lines={3} />
 *   <Skeleton.Card width={300} height={120} />
 */

const SkeletonLine = ({ width = '100%', height = 12, className }) => (
  <div
    className={`skeleton line ${className || ''}`}
    style={{ width, height }}
  />
);

const SkeletonCircle = ({ size = 32, className }) => (
  <div
    className={`skeleton circle ${className || ''}`}
    style={{ width: size, height: size }}
  />
);

const SkeletonBlock = ({ width = '100%', height = 60, className }) => (
  <div
    className={`skeleton block ${className || ''}`}
    style={{ width, height }}
  />
);

const SkeletonText = ({ lines = 3, lineHeight = 12, gap = 8, className }) => (
  <div className={`textGroup ${className || ''}`} style={{ gap }}>
    {Array.from({ length: lines }).map((_, i) => (
      <div
        key={i}
        className={`skeleton line`}
        style={{
          width: i === lines - 1 ? '60%' : '100%',
          height: lineHeight,
        }}
      />
    ))}
  </div>
);

const SkeletonCard = ({ width = '100%', height = 100, className }) => (
  <div
    className={`skeleton card ${className || ''}`}
    style={{ width, height }}
  />
);

const Skeleton = { Line: SkeletonLine, Circle: SkeletonCircle, Block: SkeletonBlock, Text: SkeletonText, Card: SkeletonCard };
export default Skeleton;
