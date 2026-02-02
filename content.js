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
    // Direct tag check
    if (el.tagName && el.tagName.toLowerCase() === 'video') return true;

    // Matches or is contained within known video/player selectors
    const directMatch = videoSelectors.some(selector => {
      try {
        return (el.matches && el.matches(selector)) || (el.closest && el.closest(selector));
      } catch (e) {
        return false;
      }
    });
    if (directMatch) return true;

    // Contains a video element or video iframe
    try {
      if (el.querySelector && (el.querySelector('video') || el.querySelector('iframe[src*="youtube"], iframe[src*="youtu.be"], iframe[src*="vimeo"], iframe[src*="twitch"]'))) return true;
    } catch (e) {}

    // Walk up ancestors to see if any ancestor contains a video or is a player container
    try {
      let p = el.parentElement;
      while (p) {
        if (p.querySelector && (p.querySelector('video') || p.querySelector('iframe[src*="youtube"], iframe[src*="vimeo"], iframe[src*="twitch"]'))) return true;
        if (p.matches && (p.matches('[class*="player"]') || p.matches('[class*="video"]') || p.matches('[id*="player"]') || p.matches('.html5-video-player'))) return true;
        p = p.parentElement;
      }
    } catch (e) {}

    return false;
  } catch (e) {
    return false;
  }
};

function hideElement(el) {
  try {
    if (!el || isVideoElement(el)) return false;

    // Don't hide elements on major video sites to avoid breaking players
    try {
      const host = (location && location.hostname) ? location.hostname.toLowerCase() : '';
      if (host.includes('youtube.com') || host.includes('youtu.be') || host.includes('vimeo.com') || host.includes('dailymotion.com') || host.includes('twitch.tv')) return false;
    } catch (e) {}

    // If element already contains a video/player, skip hiding
    try {
      if (el.querySelector && (el.querySelector('video') || el.querySelector('iframe[src*="youtube"], iframe[src*="youtu.be"], iframe[src*="vimeo"], iframe[src*="twitch"], iframe[src*="dailymotion"]'))) {
        return false;
      }
    } catch (e) {}

    // Mark pending hide and observe for any video insertion for a short period
    if (el.dataset) el.dataset.lunariasPending = '1';

    const observer = new MutationObserver(() => {
      try {
        if (isVideoElement(el) || (el.querySelector && el.querySelector('video, iframe[src*="youtube"], iframe[src*="vimeo"], iframe[src*="twitch"], iframe[src*="dailymotion"], iframe[src*="youtu.be"]'))) {
          if (el.dataset) delete el.dataset.lunariasPending;
          observer.disconnect();
        }
      } catch (e) {}
    });

    try { observer.observe(el, { childList: true, subtree: true }); } catch (e) {}

    // Finalize hide after a short delay if still safe
    setTimeout(() => {
      try {
        observer.disconnect();
        if (el.dataset && el.dataset.lunariasPending) {
          if (!isVideoElement(el) && !(el.querySelector && el.querySelector('video, iframe[src*="youtube"], iframe[src*="vimeo"], iframe[src*="twitch"], iframe[src*="dailymotion"], iframe[src*="youtu.be"]'))) {
            if (el.dataset) el.dataset.lunariasHidden = '1';
            el.style.setProperty('display', 'none', 'important');
          }
          delete el.dataset.lunariasPending;
        }
      } catch (e) {}
    }, 3000);

    return true;
  } catch (e) {
    return false;
  }
}

function removeAds() {
  try {
    // Aggressive removal - actually delete elements from DOM
    adSelectors.forEach(selector => {
      try {
        document.querySelectorAll(selector).forEach(el => {
          if (el) hideElement(el);
        });
      } catch (e) {
        console.warn('Error with selector:', selector, e);
      }
    });

    // Block ads by attribute patterns
    document.querySelectorAll('[data-ad-slot], [data-ad-format], [data-ad-client]').forEach(el => {
      hideElement(el);
    });

    // Remove ad scripts and tracking
    // Avoid removing scripts outright as this can break sites; only neutralize known ad scripts when safe
    // Skip script neutralization on major video sites
    let _host = '';
    try { _host = (location && location.hostname) ? location.hostname.toLowerCase() : ''; } catch (e) {}
    if (!_host.includes('youtube.com') && !_host.includes('youtu.be') && !_host.includes('vimeo.com') && !_host.includes('dailymotion.com') && !_host.includes('twitch.tv')) {
      document.querySelectorAll('script[src]').forEach(el => {
      try {
        const src = (el.src || '').toLowerCase();
        const isAdScript = src.includes('doubleclick') || src.includes('googleadservices') || src.includes('googlesyndication') || src.includes('pagead') || src.includes('ads') || src.includes('taboola') || src.includes('outbrain') || src.includes('criteo') || src.includes('amazon-adsystem');
        const isVideoScript = src.includes('youtube') || src.includes('youtube-nocookie') || src.includes('youtubeusercontent') || src.includes('vimeo') || src.includes('dailymotion') || src.includes('twitch') || src.includes('player');

        if (isAdScript && !isVideoScript) {
          if (!isVideoElement(el) && !(el.closest && el.closest('video, [class*="player"]'))) {
            el.dataset.lunariasOriginalSrc = el.src || '';
            try { el.removeAttribute('src'); } catch (e) {}
          }
        }
      } catch (e) {}
      });
    }

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
        hideElement(el);
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

// YouTube-specific lightweight ad handling: hide ad UI and attempt to click "Skip Ad"
function handleYouTubeAds() {
  try {
    const host = (location && location.hostname) ? location.hostname.toLowerCase() : '';
    if (!host.includes('youtube.com') && !host.includes('youtu.be')) return;

    // Remove or hide common YouTube ad overlays and banners
    const selectors = [
      '.ytp-ad-player-overlay',
      '.ytp-ad-module',
      '.ytp-ad-overlay-slot',
      '.ytp-paid-content-overlay',
      '.ytp-ad-text',
      '.ytp-paid-ad-badge',
      'ytd-companion-slot-renderer',
      '.video-ads',
      '.ytp-ad-image',
      '.ytp-ad-button',
      '#player-ads'
    ];

    selectors.forEach(sel => {
      document.querySelectorAll(sel).forEach(el => {
        try { el.style.setProperty('display', 'none', 'important'); } catch (e) {}
      });
    });

    // Remove ad-showing class from HTML5 player to force normal UI
    try {
      document.querySelectorAll('.html5-video-player.ad-showing').forEach(p => p.classList.remove('ad-showing'));
    } catch (e) {}

    // Auto-click "Skip Ad" button when present
    try {
      const skip = document.querySelector('.ytp-ad-skip-button.ytp-button');
      if (skip) {
        try { skip.click(); } catch (e) {}
      }
    } catch (e) {}

  } catch (e) {}
}

setInterval(handleYouTubeAds, 500);