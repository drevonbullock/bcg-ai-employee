(function () {
  if (document.getElementById('aria-widget-iframe')) return;

  var WIDGET_URL = 'https://bcg-ai-employee.vercel.app';

  // Outer container — full bottom-right area, transparent, blocks no mouse events
  var container = document.createElement('div');
  container.id = 'aria-widget-iframe';
  container.style.cssText = [
    'position:fixed',
    'bottom:0',
    'right:0',
    'width:420px',
    'height:700px',
    'z-index:2147483647',
    'pointer-events:none',
    'border:none',
    'overflow:hidden',
  ].join(';');

  // iframe — pointer-events re-enabled so the widget inside is clickable
  var iframe = document.createElement('iframe');
  iframe.src = WIDGET_URL;
  iframe.title = 'Aria — BCG AI Assistant';
  iframe.style.cssText = [
    'position:absolute',
    'bottom:0',
    'right:0',
    'width:100%',
    'height:100%',
    'border:none',
    'background:transparent',
    'pointer-events:auto',
    'color-scheme:normal',
  ].join(';');
  iframe.setAttribute('allow', 'clipboard-write');
  iframe.setAttribute('loading', 'lazy');
  iframe.setAttribute('referrerpolicy', 'origin');

  // Keep iframe background transparent so the host page shows through
  iframe.onload = function () {
    try {
      iframe.contentDocument.documentElement.style.background = 'transparent';
      iframe.contentDocument.body.style.background = 'transparent';
    } catch (_) {
      // Cross-origin — fine, the app's own background handles it
    }
  };

  container.appendChild(iframe);
  document.body.appendChild(container);

  // On mobile (<480px wide screens) shrink the container so it doesn't crowd the viewport
  function adjustForMobile() {
    if (window.innerWidth <= 480) {
      container.style.width = '100%';
      container.style.height = '650px';
    } else {
      container.style.width = '420px';
      container.style.height = '700px';
    }
  }

  adjustForMobile();
  window.addEventListener('resize', adjustForMobile);
})();
