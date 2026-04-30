import React from 'react';
import styles from './Skeleton.module.css';

interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  borderRadius?: string | number;
  className?: string;
}

const Skeleton: React.FC<SkeletonProps> = ({ width, height, borderRadius, className }) => {
  return (
    <div 
      className={`${styles.skeleton} ${className}`}
      style={{ 
        width: width || '100%', 
        height: height || '20px', 
        borderRadius: borderRadius || '4px' 
      }}
    />
  );
};

export const ProductSkeleton: React.FC = () => (
  <div className={styles.productSkeleton}>
    <Skeleton height="280px" borderRadius="16px" />
    <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <Skeleton width="40%" height="14px" />
      <Skeleton width="90%" height="20px" />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px' }}>
        <Skeleton width="30%" height="24px" />
        <Skeleton width="20%" height="16px" />
      </div>
    </div>
  </div>
);

export default Skeleton;
