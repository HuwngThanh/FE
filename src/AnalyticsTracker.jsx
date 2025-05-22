import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { logPageView } from './analytics';

function AnalyticsTracker() {
  const location = useLocation();

  useEffect(() => {
    const currentPath = location.pathname + location.search;
    logPageView(currentPath);
    console.log(`GA Pageview logged for: ${currentPath}`);
  }, [location]);

  return null;
}

export default AnalyticsTracker;
