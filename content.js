// Hide common ad elements (more specific selectors to avoid video players)
const adSelectors = [
  '[class*="ad-"]',
  '[id*="ad-"]',
  '.advertisement',
  '.sponsored',
  '[class*="sponsor"]',
  '.ad-container',
  '.ad-banner'
];

function hideAds() {
  adSelectors.forEach(selector => {
    document.querySelectorAll(selector).forEach(el => {
      el.style.display = 'none';
    });
  });
}

hideAds();
const observer = new MutationObserver(hideAds);
observer.observe(document.body, { childList: true, subtree: true });