import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { logPageView } from './analytics';
import ReactGA from 'react-ga4';

function AnalyticsTracker() {
  const location = useLocation();

  useEffect(() => {
    const currentPath = location.pathname + location.search;
    // Gửi sự kiện truy cập tab
    ReactGA.event({
      category: 'Page',
      action: 'TabOpened',
      label: window.location.pathname,
      value: 1,
    });

    logPageView(currentPath);
    console.log(`GA Pageview logged for: ${currentPath}`);
  }, [location]);

  return null;
}

export default AnalyticsTracker;
