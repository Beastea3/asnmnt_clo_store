import React, { useState, useEffect, useRef } from 'react';
import { ContentItem } from '../types';

interface ContentCardProps {
  item: ContentItem;
  priority?: boolean; // load immediately (in or near viewport)
}

export const ContentCard: React.FC<ContentCardProps> = ({ item, priority = false }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const cardRef = useRef<HTMLDivElement>(null);

  // IntersectionObserver: detect when card nears viewport
  useEffect(() => {
    if (priority) return; // priority cards skip observation

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        root: null,
        rootMargin: '200px', // start loading 200px before visible
        threshold: 0,
      }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, [priority]);

  const formatPrice = () => {
    if (item.pricing === 'Free') return 'FREE';
    if (item.pricing === 'View Only') return 'View Only';
    return `$${item.price?.toFixed(2)}`;
  };

  const priceClass = item.pricing === 'Free' 
    ? 'content-price free' 
    : item.pricing === 'View Only' 
    ? 'content-price view-only' 
    : 'content-price';

  return (
    <article ref={cardRef} className="content-card">
      <div className="content-card-inner">
        <div className={`content-image ${isLoaded ? 'loaded' : 'loading'}`}>
          {!isLoaded && <div className="image-skeleton" aria-hidden />}
          {isInView && (
            <img
              src={item.image}
              alt={item.title}
              onLoad={() => setIsLoaded(true)}
              onError={() => setIsLoaded(true)}
              style={{ opacity: isLoaded ? 1 : 0, transition: 'opacity 0.3s ease' }}
            />
          )}
        </div>
        <div className="content-card-footer">
          <div className="content-card-meta">
            <span className="content-title">{item.title}</span>
            <span className="content-user">{item.userName}</span>
          </div>
          <span className={priceClass}>{formatPrice()}</span>
        </div>
      </div>
    </article>
  );
};
