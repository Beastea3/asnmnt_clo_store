import type { FC } from 'react';

export const ContentGridSkeleton: FC = () => {
  // Build 8 skeleton placeholder cards
  const skeletonCards = Array.from({ length: 8 }, (_, i) => i);

  return (
    <div className="content-grid-section content-grid-section--plain">
      <div className="content-grid">
        {skeletonCards.map((index) => (
          <div key={index} className="content-card skeleton-card">
            <div className="content-card-inner">
              <div className="content-image skeleton-image" />
              <div className="content-card-footer skeleton-footer">
                <div className="skeleton-text-row">
                  <div className="skeleton-title" />
                  <div className="skeleton-user" />
                </div>
                <div className="skeleton-price" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
