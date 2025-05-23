// src/analytics.js
import ReactGA from 'react-ga4';

export const initGA = () => {
  ReactGA.initialize('G-CGSG9RXXVJ');
};
console.log('GA initialized');
export const logPageView = (url) => {
  ReactGA.send({ hitType: 'pageview', page: url });
};
