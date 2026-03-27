import { useEffect, useState } from 'react';
import { useContentStore } from './store/contentStore';
import { fetchContent } from './services/api';
import { Filter } from './components/Filter';
import { SearchBar } from './components/SearchBar';
import { ContentGrid } from './components/ContentGrid';
import { ContentGridSkeleton } from './components/ContentGridSkeleton';
import { Sorter } from './components/Sorter';
import './App.css';

function App() {
  const { setContent, syncFromUrl } = useContentStore();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Listen for browser back/forward navigation
    const handlePopState = () => {
      syncFromUrl();
    };
    
    window.addEventListener('popstate', handlePopState);
    
    // Fetch content on initial load
    setLoading(true);
    setError(null);
    
    fetchContent()
      .then((data) => {
        setContent(data.contents, data.pricingOptions);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Failed to fetch content:', error);
        setError('Failed to load content. Please try again.');
        setLoading(false);
      });
    
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [setContent, syncFromUrl]);

  return (
    <div className="app">
      <header className="header">
        <span aria-label="Go to Connect Main Page" className="header-logo"></span>
      </header>
      
      <main className="main">
        <div className="controls-bar">
          <SearchBar />
          <Filter />
          <div className="sorter-container">
            <Sorter />
          </div>
        </div>
        
        {error ? (
          <div className="content-grid-section content-grid-section--plain">
            <div className="error-container">
              <p>{error}</p>
              <button type="button" onClick={() => window.location.reload()}>Retry</button>
            </div>
          </div>
        ) : loading ? (
          <ContentGridSkeleton />
        ) : (
          <ContentGrid />
        )}
      </main>
      
      <div className="bottom-bar" />
    </div>
  );
}

export default App;
