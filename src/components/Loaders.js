import React from 'react';

// 1. Spinning Circle Loader
export const SpinnerLoader = ({ size = 'normal', className = '' }) => {
  const sizeClass = size === 'large' ? 'spinner-large' : 'spinner';
  return <div className={`${sizeClass} ${className}`}></div>;
};

// 2. Dots Loader
export const DotsLoader = ({ className = '' }) => {
  return (
    <div className={`dots-loader ${className}`}>
      <div className="dot"></div>
      <div className="dot"></div>
      <div className="dot"></div>
    </div>
  );
};

// 3. Pulse Loader
export const PulseLoader = ({ className = '' }) => {
  return <div className={`pulse-loader ${className}`}></div>;
};

// 4. Wave Loader
export const WaveLoader = ({ className = '' }) => {
  return (
    <div className={`wave-loader ${className}`}>
      <div className="wave-bar"></div>
      <div className="wave-bar"></div>
      <div className="wave-bar"></div>
      <div className="wave-bar"></div>
      <div className="wave-bar"></div>
    </div>
  );
};

// 5. Skeleton Loaders
export const SkeletonText = ({ lines = 1, className = '', size = 'normal' }) => {
  const sizeClass = size === 'large' ? 'large' : size === 'small' ? 'small' : '';
  
  return (
    <div className={className}>
      {Array.from({ length: lines }).map((_, index) => (
        <div key={index} className={`skeleton skeleton-text ${sizeClass}`}></div>
      ))}
    </div>
  );
};

export const SkeletonAvatar = ({ className = '' }) => {
  return <div className={`skeleton skeleton-avatar ${className}`}></div>;
};

export const SkeletonButton = ({ className = '' }) => {
  return <div className={`skeleton skeleton-button ${className}`}></div>;
};

// 6. Loading Overlay
export const LoadingOverlay = ({ message = 'Yuklanmoqda...', children }) => {
  return (
    <div className="loading-overlay">
      <div className="loading-content">
        {children || <SpinnerLoader size="large" />}
        {message && <div className="loading-text">{message}</div>}
      </div>
    </div>
  );
};

// 7. Progress Bar Loader
export const ProgressLoader = ({ className = '' }) => {
  return (
    <div className={`progress-loader ${className}`}>
      <div className="progress-bar"></div>
    </div>
  );
};

// 8. Card Loading State
export const LoadingCard = ({ className = '' }) => {
  return (
    <div className={`loading-card ${className}`}>
      <div className="loading-card-header">
        <SkeletonAvatar />
        <div style={{ flex: 1 }}>
          <SkeletonText size="large" />
          <SkeletonText size="small" />
        </div>
      </div>
      <div className="loading-card-content">
        <SkeletonText lines={2} />
        <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
          <SkeletonButton />
          <SkeletonButton />
        </div>
      </div>
    </div>
  );
};

// 9. Inline Loader
export const InlineLoader = ({ text = 'Yuklanmoqda...', className = '' }) => {
  return (
    <div className={`inline-loader ${className}`}>
      <SpinnerLoader />
      <span>{text}</span>
    </div>
  );
};

// 10. Button Loading State
export const LoadingButton = ({ 
  children, 
  loading = false, 
  className = '', 
  disabled = false,
  ...props 
}) => {
  return (
    <button 
      className={`${className} ${loading ? 'btn-loading' : ''}`}
      disabled={disabled || loading}
      {...props}
    >
      {children}
    </button>
  );
};

// 11. Page Loading State
export const PageLoader = ({ message = 'Sahifa yuklanmoqda...' }) => {
  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      minHeight: '200px',
      gap: '15px'
    }}>
      <SpinnerLoader size="large" />
      <div className="loading-text">{message}</div>
    </div>
  );
};

// 12. List Loading State
export const LoadingList = ({ items = 3, className = '' }) => {
  return (
    <div className={className}>
      {Array.from({ length: items }).map((_, index) => (
        <LoadingCard key={index} />
      ))}
    </div>
  );
};

export default {
  SpinnerLoader,
  DotsLoader,
  PulseLoader,
  WaveLoader,
  SkeletonText,
  SkeletonAvatar,
  SkeletonButton,
  LoadingOverlay,
  ProgressLoader,
  LoadingCard,
  InlineLoader,
  LoadingButton,
  PageLoader,
  LoadingList
};