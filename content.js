// Hide common ad elements (more specific selectors to avoid video players)
const adSelectors = [
  '.advertisement',
  '.sponsored',
  '.ad-container',
  '.ad-banner',
  '.ad-sidebar',
  '.ads',
  '[class*="banner-ad"]',
  '[class*="video-ad"]',
  '[id*="advertisement"]',
  '[id*="banner-ad"]'
];

// Video player elements to exclude
const videoSelectors = [
  'video',
  '[class*="player"]',
  '[class*="video"]',
  '[id*="player"]',
  '[id*="video"]',
  'iframe[src*="youtube"]',
  'iframe[src*="vimeo"]',
  'iframe[src*="dailymotion"]'
];

function hideAds() {
  try {
    adSelectors.forEach(selector => {
      try {
        document.querySelectorAll(selector).forEach(el => {
          if (!el) return; // Safety check
          
          // Don't hide if element is a video player or contains one
          const isVideoPlayer = Array.from(videoSelectors).some(videoSel => {
            try {
              return el.matches(videoSel) || el.closest(videoSel);
            } catch (e) {
              return false;
            }
          });
          
          const hasVideo = el.querySelector('video') !== null;
          
          if (!isVideoPlayer && !hasVideo) {
            el.style.display = 'none';
          }
        });
      } catch (e) {
        console.warn('Error processing selector:', selector, e);
      }
    });
  } catch (e) {
    console.error('Error in hideAds:', e);
  }
}

if (document.body) {
  hideAds();
} else {
  document.addEventListener('DOMContentLoaded', hideAds);
}

const observer = new MutationObserver(hideAds);
if (document.body) {
  observer.observe(document.body, { childList: true, subtree: true });
} else {
  document.addEventListener('DOMContentLoaded', () => {
    observer.observe(document.body, { childList: true, subtree: true });
  });
}