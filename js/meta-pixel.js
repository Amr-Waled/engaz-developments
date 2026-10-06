(function initializeMetaPixel(windowRef, documentRef) {
  // Development and deployment previews must not enter the production dataset.
  if (!['engazdevelopments.com', 'www.engazdevelopments.com'].includes(windowRef.location.hostname)) return;
  const datasetId = '1825147448913242';
  if (windowRef.fbq) return;

  const fbq = windowRef.fbq = function metaPixelQueue() {
    if (fbq.callMethod) fbq.callMethod.apply(fbq, arguments);
    else fbq.queue.push(arguments);
  };
  if (!windowRef._fbq) windowRef._fbq = fbq;
  fbq.push = fbq;
  fbq.loaded = true;
  fbq.version = '2.0';
  fbq.queue = [];

  const script = documentRef.createElement('script');
  script.async = true;
  script.src = 'https://connect.facebook.net/en_US/fbevents.js';
  const firstScript = documentRef.getElementsByTagName('script')[0];
  firstScript.parentNode.insertBefore(script, firstScript);

  fbq('init', datasetId);
  fbq('track', 'PageView');
})(window, document);
