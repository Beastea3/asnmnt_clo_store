import React from 'react';

export const ContentGridSkeleton: React.FC = () => {
  // 生成 8 个骨架卡片
  const skeletonCards = Array.from({ length: 8 }, (_, i) => i);

  return (
    <div className="content-grid-section">
      <div className="content-grid-header">
        <div className="content-grid-header-left">
          <span className="content-count">Loading...</span>
        </div>
      </div>
      <div className="content-grid">
        {skeletonCards.map((index) => (
          <div key={index} className="content-card skeleton-card">
            <div className="content-card-inner">
              <div className="content-image skeleton-image" />
              <div className="content-card-footer">
                <div className="skeleton-text-row">
                  <div className="skeleton-title" />
                  <div className="skeleton-user" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
