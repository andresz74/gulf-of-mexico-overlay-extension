(() => {
  'use strict';

  const LABEL_TEXT = 'Gulf of Mexico';
  const LABEL_TEXT_HTML = 'Gulf<br>of Mexico';
  const OVERLAY_STYLES = {
    position:      'fixed',
    pointerEvents: 'none',
    whiteSpace:    'pre-line',
    textAlign:     'center',
    borderRadius:  '4px',
    padding:       '2px',
    transform:     'translate(-50%, -100%)',
    zIndex:        '9999',
    display:       'inline-block',
    color: 'rgb(12, 125, 148)'
  };
  const DEFAULT_OVERLAY = {
    lat:  24.745124,
    lng: -91.737921,
    backgroundColor: 'rgb(114, 212, 232)',
    fontSize:        '12px'
  };
  const OVERLAY_COORDS = [
    { zoom: 2,  lat: 24.941090, lng: -90.102396, backgroundColor: 'rgb(109, 212, 232)', fontSize: '12px' },
    { zoom: 3,  lat: 24.941090, lng: -90.102396, backgroundColor: 'rgb(109, 212, 232)', fontSize: '12px' },
    { zoom: 4,  lat: 24.501996, lng: -90.058450, backgroundColor: 'rgb(109, 212, 232)', fontSize: '12px' },
    { zoom: 5,  lat: 24.786898, lng: -90.065263, backgroundColor: 'rgb(114, 212, 232)', fontSize: '12px' },
    { zoom: 6,  lat: 25.100375, lng: -90.014505, backgroundColor: 'rgb(121, 212, 232)', fontSize: '12px' },
    { zoom: 7,  lat: 25.189882, lng: -90.047464, backgroundColor: 'rgb(127, 215, 235)', fontSize: '12px' },
    { zoom: 8,  lat: 25.239890, lng: -90.065263, backgroundColor: 'rgb(131, 214, 235)', fontSize: '12px' },
    { zoom: 9,  lat: 25.272183, lng: -90.061959, backgroundColor: 'rgb(138, 217, 237)', fontSize: '12px' },
    { zoom: 10, lat: 25.290499, lng: -90.063943, backgroundColor: 'rgb(145, 217, 237)', fontSize: '12px' },
    { zoom: 11, lat: 25.296707, lng: -90.066003, backgroundColor: 'rgb(145, 217, 237)', fontSize: '12px' },
    { zoom: 12, lat: 25.300121, lng: -90.066003, backgroundColor: 'rgb(145, 217, 237)', fontSize: '12px' },
    { zoom: 13, lat: 25.301983, lng: -90.065832, backgroundColor: 'rgb(145, 217, 237)', fontSize: '12px' },
    { zoom: 14, lat: 25.303225, lng: -90.065830, backgroundColor: 'rgb(145, 217, 237)', fontSize: '12px' },
    { zoom: 15, lat: 25.303225, lng: -90.065830, backgroundColor: 'rgb(145, 217, 237)', fontSize: '12px' },
    { zoom: 16, lat: 25.303225, lng: -90.065830, backgroundColor: 'rgb(145, 217, 237)', fontSize: '12px' },
    { zoom: 17, lat: 25.303225, lng: -90.065830, backgroundColor: 'rgb(145, 217, 237)', fontSize: '12px' },
    { zoom: 18, lat: 25.303225, lng: -90.065830, backgroundColor: 'rgb(145, 217, 237)', fontSize: '12px' },
    { zoom: 19, lat: 25.303225, lng: -90.065830, backgroundColor: 'rgb(145, 217, 237)', fontSize: '12px' },
    { zoom: 20, lat: 25.303225, lng: -90.065830, backgroundColor: 'rgb(145, 217, 237)', fontSize: '12px' },
    { zoom: 21, lat: 25.303225, lng: -90.065830, backgroundColor: 'rgb(145, 217, 237)', fontSize: '12px' }
  ];

  // ——— UNIVERSAL REPLACER ———
  function replaceLabels(root) {
    // 1) ARIA labels
    root.querySelectorAll('[aria-label]').forEach(el => {
      const aria = el.getAttribute('aria-label');
      if (aria.includes('Gulf of America')) {
        el.setAttribute(
          'aria-label',
          aria.replace(/Gulf of America/g, LABEL_TEXT)
        );
      }
    });

    // 2) Text nodes everywhere
    const walker = document.createTreeWalker(
      root,
      NodeFilter.SHOW_TEXT,
      null,
      false
    );
    let node;
    while (node = walker.nextNode()) {
      if (node.nodeValue.includes('Gulf of America')) {
        node.nodeValue = node.nodeValue.replace(
          /Gulf of America/g,
          LABEL_TEXT
        );
      }
    }
  }

  // run once immediately
  replaceLabels(document);

  // ——— SEARCH BOX SWAP ———
  function replaceSearchBox() {
    const input = document.getElementById('searchboxinput');
    if (input && input.value.includes('Gulf of America')) {
      input.value = input.value.replace(/Gulf of America/g, LABEL_TEXT);
      if (input.placeholder && input.placeholder.includes('Gulf of America')) {
        input.placeholder = input.placeholder.replace(/Gulf of America/g, LABEL_TEXT);
      }
    }
  }

  replaceSearchBox();

  // ——— MUTATION OBSERVER FOR POPUPS & TEXT CHANGES ———
  const observer = new MutationObserver(muts => {
    for (let m of muts) {
      // new nodes
      for (let n of m.addedNodes) {
        if (n.nodeType === 1) replaceLabels(n);
      }
      // characterData changes
      if (m.type === 'characterData') {
        const v = m.target.nodeValue;
        if (v.includes('Gulf of America')) {
          m.target.nodeValue = v.replace(/Gulf of America/g, LABEL_TEXT);
        }
      }
    }
    scheduleOverlayUpdate();
  });
  observer.observe(document.body, {
    childList:     true,
    subtree:       true,
    characterData: true,
    attributes:    true,
    attributeFilter: ['value']
  });

  // hook search-box attribute changes
  const searchInput = document.getElementById('searchboxinput');
  if (searchInput) {
    new MutationObserver(replaceSearchBox).observe(searchInput, {
      attributes:     true,
      attributeFilter: ['value']
    });
    searchInput.addEventListener('input', replaceSearchBox);
  }

  // re-run on marker hover
  document.body.addEventListener('mouseover', e => {
    if (e.target.classList.contains('ET197e')) {
      setTimeout(() => replaceLabels(document), 50);
    }
  });

  // ——— OVERLAY LOGIC ———
  function getEntryForZoom(z) {
    return OVERLAY_COORDS.find(o => o.zoom === z) || DEFAULT_OVERLAY;
  }
  function latLngToPoint(lat, lng, cLat, cLng, zoom, w, h) {
    const tile = 256, scale = tile * 2**zoom;
    const clamp = v => Math.min(Math.max(v, -0.9999), 0.9999);
    const sinC = clamp(Math.sin(cLat * Math.PI/180)),
          sinT = clamp(Math.sin(lat  * Math.PI/180));
    const worldCX = (cLng + 180)/360 * scale;
    const worldCY = (0.5 - Math.log((1+sinC)/(1-sinC))/(4*Math.PI)) * scale;
    const worldX  = (lng + 180)/360 * scale;
    const worldY  = (0.5 - Math.log((1+sinT)/(1-sinT))/(4*Math.PI)) * scale;
    return { x: worldX - worldCX + w/2, y: worldY - worldCY + h/2 };
  }

  let overlay;
  let lastMapState = null;
  let rafId = null;
  function createOverlay() {
    overlay = document.createElement('div');
    overlay.innerHTML = LABEL_TEXT_HTML;
    Object.assign(overlay.style, OVERLAY_STYLES);
    document.body.appendChild(overlay);
  }

  function parseMapStateFromUrl() {
    const match = location.pathname.match(/@(-?[\d.]+),(-?[\d.]+),([\d.]+)z/);
    if (match) {
      const [_, cLat, cLng, rz] = match;
      return { centerLat: +cLat, centerLng: +cLng, zoom: Math.round(+rz) };
    }

    const params = new URLSearchParams(location.search);
    const ll = params.get('ll');
    const z = params.get('z');
    if (ll && z) {
      const [cLat, cLng] = ll.split(',');
      return { centerLat: +cLat, centerLng: +cLng, zoom: Math.round(+z) };
    }

    return null;
  }

  function getMapState() {
    const state = parseMapStateFromUrl();
    if (state) {
      lastMapState = state;
      return state;
    }
    return lastMapState;
  }

  function getMapContainer() {
    return document.querySelector(
      '.widget-scene, #scene, #map, .widget-scene-canvas, [aria-label="Map"], canvas.widget-scene, canvas#scene'
    );
  }

  function updateOverlay() {
    if (!overlay) createOverlay();
    const state = getMapState();
    if (!state) return;
    const { centerLat, centerLng, zoom } = state;
    const { lat, lng, backgroundColor, fontSize } = getEntryForZoom(zoom);
    const c = getMapContainer();
    const rect = c
      ? c.getBoundingClientRect()
      : { left: 0, top: 0, width: window.innerWidth, height: window.innerHeight };
    const { x, y } = latLngToPoint(lat, lng, centerLat, centerLng, zoom, rect.width, rect.height);
    overlay.style.left            = `${rect.left + x}px`;
    overlay.style.top             = `${rect.top  + y}px`;
    overlay.style.backgroundColor = backgroundColor;
    overlay.style.fontSize        = fontSize;
  }

  function scheduleOverlayUpdate() {
    if (rafId !== null) return;
    rafId = requestAnimationFrame(() => {
      rafId = null;
      updateOverlay();
    });
  }

  scheduleOverlayUpdate();
  window.addEventListener('resize', scheduleOverlayUpdate);
  window.addEventListener('hashchange', scheduleOverlayUpdate);
  window.addEventListener('popstate', scheduleOverlayUpdate);
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
      scheduleOverlayUpdate();
    }
  });
  document.body.addEventListener('wheel', scheduleOverlayUpdate, { passive: true });
  document.body.addEventListener('mouseup', scheduleOverlayUpdate);
})();
