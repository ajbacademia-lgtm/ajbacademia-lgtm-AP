import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { VisitorTracker } from '../services/visitorTrackingService';

/**
 * Hook to automatically track page visits on route change
 */
export const useVisitorTracking = () => {
  const location = useLocation();
  const lastPathRef = useRef<string>('');

  useEffect(() => {
    const currentPath = location.pathname + location.search;
    
    // Avoid double firing for the exact same path
    if (lastPathRef.current === currentPath) {
      return;
    }
    lastPathRef.current = currentPath;

    // Small delay to allow document.title to update if set by page components
    const timer = setTimeout(() => {
      VisitorTracker.pageView(currentPath, document.title || undefined);
    }, 250);

    return () => clearTimeout(timer);
  }, [location.pathname, location.search]);
};
