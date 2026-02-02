// Hide common ad elements (more specific selectors to avoid video players)
const adSelectors = [
  // Generic ad classes
  '.advertisement',
  '.ad',
  '.ads',
  '.ad-box',
  '.ad-container',
  '.ad-content',
  '.ad-frame',
  '.ad-item',
  '.ad-label',
  '.ad-panel',
  '.ad-region',
  '.ad-section',
  '.ad-slot',
  '.ad-space',
  '.ad-unit',
  '.ad-wrapper',
  '.adblock',
  '.adbox',
  '.adcontainer',
  '.adframe',
  '.adspot',
  '.adspace',
  '.adunit',
  '.advert',
  '.advertise',
  '.advertisement-container',
  '.advertising',
  '.advertising-wrapper',
  '.adverts',
  '.adzone',
  '.banner',
  '.banner-ad',
  '.banner-container',
  '.banner-wrapper',
  '.top-ad',
  '.bottom-ad',
  '.sidebar-ad',
  '.side-ad',
  '.left-ad',
  '.right-ad',
  '.floating-ad',
  '.sticky-ad',
  '.header-ad',
  '.footer-ad',
  '.leaderboard',
  '.skyscraper',
  '.promoted',
  '.promoted-content',
  '.promoted-item',
  '.promoted-post',
  '.promotion',
  '.promotional',
  '.promo',
  '.promo-ad',
  '.sponsored',
  '.sponsored-content',
  '.sponsored-item',
  '.sponsored-post',
  '.sponsor',
  '.sponsor-section',
  '.native-ad',
  '.native-ads',
  '.content-recommendation',
  '.content-recommendations',
  '.recommendation-widget',
  '.recommendations',
  '.related-articles',
  '.related-content',
  '.feed-ad',
  '.feed-sponsored',
  '.popup-ad',
  '.modal-ad',
  '.overlay-ad',
  '.interstitial',
  '[class*="banner-ad"]',
  '[class*="ad-"]',
  '[class*="advert"]',
  '[class*="sponsored"]',
  '[class*="promoted"]',
  '[class*="taboola"]',
  '[class*="outbrain"]',
  '[class*="criteo"]',
  '[class*="adsense"]',
  '[class*="google_ad"]',
  '[id*="advertisement"]',
  '[id*="banner-ad"]',
  '[id*="ad-"]',
  '[id*="advert"]',
  '[id*="sponsored"]',
  '[data-ad-slot]',
  '[data-ad-format]',
  '[data-ad-client]',
  '[data-ad-region]',
  '[data-ad-type]',
  '[data-ad-code]',
  '[data-native-ad]',
  '[data-promoted]',
  '[data-sponsor]',
  'iframe[src*="ads"]',
  'iframe[src*="ad.doubleclick"]',
  'iframe[src*="pagead2"]',
  'iframe[src*="googleadservices"]',
  'iframe[src*="googlesyndication"]'
];

// Video player elements to exclude
const videoSelectors = [
  'video',
  '[class*="player"]',
  '[class*="video"]',
  '[id*="player"]',
  '[id*="video"]',
  'iframe[src*="youtube"]',
  'iframe[src*="youtu.be"]',
  'iframe[src*="vimeo"]',
  'iframe[src*="dailymotion"]',
  'iframe[src*="twitch"]'
];

const isVideoElement = (el) => {
  if (!el) return false;
  try {
    // Check if element is or contains a video player
    return videoSelectors.some(selector => {
      try {
        return el.matches(selector) || el.closest(selector);
      } catch (e) {
        return false;
      }
    }) || el.querySelector('video') !== null;
  } catch (e) {
    return false;
  }
};

function removeAds() {
  try {
    // Aggressive removal - actually delete elements from DOM
    adSelectors.forEach(selector => {
      try {
        document.querySelectorAll(selector).forEach(el => {
          if (el && !isVideoElement(el)) {
            // Reclaim space by removing the element
            el.remove();
          }
        });
      } catch (e) {
        console.warn('Error with selector:', selector, e);
      }
    });

    // Block ads by attribute patterns
    document.querySelectorAll('[data-ad-slot], [data-ad-format], [data-ad-client]').forEach(el => {
      if (!isVideoElement(el) && !el.closest('video') && !el.closest('[class*="player"]')) {
        el.remove();
      }
    });

    // Remove ad scripts and tracking
    document.querySelectorAll('script[src*="doubleclick"], script[src*="googleadservices"], script[src*="googlesyndication"], script[src*="pagead"], script[src*="ads"]').forEach(el => {
      el.remove();
    });

    // Remove common ad iframes (but keep video iframes)
    document.querySelectorAll('iframe').forEach(el => {
      const src = el.src || '';
      const shouldRemove = 
        src.includes('ads') || 
        src.includes('ad.doubleclick') || 
        src.includes('pagead') || 
        src.includes('googleadservices') || 
        src.includes('googlesyndication') ||
        src.includes('facebook.com/plugins') ||
        src.includes('taboola') ||
        src.includes('outbrain') ||
        src.includes('criteo') ||
        src.includes('amazon-adsystem');
      
      const isVideo = 
        src.includes('youtube') || 
        src.includes('youtu.be') || 
        src.includes('vimeo') || 
        src.includes('dailymotion') ||
        src.includes('twitch');

      if (shouldRemove && !isVideo) {
        el.remove();
      }
    });

  } catch (e) {
    console.error('Error in removeAds:', e);
  }
}

// Run immediately if DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', removeAds);
} else {
  removeAds();
}

// Monitor for new ads added dynamically
const observer = new MutationObserver((mutations) => {
  // Debounce rapid mutations
  clearTimeout(window.adBlockerTimeout);
  window.adBlockerTimeout = setTimeout(removeAds, 100);
});

observer.observe(document.documentElement, { 
  childList: true, 
  subtree: true,
  attributes: false,
  characterData: false
});

// Also check periodically in case mutations don't catch everything
setInterval(removeAds, 500);