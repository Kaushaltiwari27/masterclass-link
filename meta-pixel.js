/**
 * Meta Pixel & Conversion Tracking Reusable Utility
 * 
 * This file is compatible with:
 * 1. Vanilla JavaScript (loaded via script tags)
 * 2. React / Next.js (imported via ESM or CommonJS)
 * 3. Vercel static/server deployments
 */

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.MetaPixel = factory();
  }
}(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  /**
   * Resolves the Meta Pixel ID from the environment or window configuration
   * @returns {string|null} The resolved Meta Pixel ID, or null if not set
   */
  function getPixelId() {
    // 1. Check for Next.js / React build-time process.env variables
    if (typeof process !== 'undefined' && process.env && process.env.NEXT_PUBLIC_META_PIXEL_ID) {
      return process.env.NEXT_PUBLIC_META_PIXEL_ID;
    }
    // 2. Check for global window object configuration (vanilla HTML/JS static sites)
    if (typeof window !== 'undefined' && window.NEXT_PUBLIC_META_PIXEL_ID) {
      return window.NEXT_PUBLIC_META_PIXEL_ID;
    }
    // 3. Fallback placeholder
    return 'YOUR_PIXEL_ID';
  }

  /**
   * Initializes Meta Pixel script and registers the PageView event
   * @param {string} [pixelId] Optional overrides for the Pixel ID
   */
  function initMetaPixel(pixelId) {
    if (typeof window === 'undefined') return;

    const id = pixelId || getPixelId();

    if (!id || id === 'YOUR_PIXEL_ID' || id.trim() === '') {
      console.warn('[Meta Pixel] ID is not set. Events will be logged to the console but not sent to Meta.');
      // Stub fbq to prevent errors and show local logs
      if (!window.fbq) {
        window.fbq = function (action, event, params) {
          console.log(`[Meta Pixel Sandbox - STUB] fbq('${action}', '${event}')`, params || '');
        };
      }
      return;
    }

    if (window.fbq && typeof window.fbq.queue === 'object') {
      console.log('[Meta Pixel] Already initialized.');
      return;
    }

    // Standard Meta Pixel snippet
    !function(f,b,e,v,n,t,s)
    {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
    n.callMethod.apply(n,arguments):n.queue.push(arguments)};
    if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
    n.queue=[];t=b.createElement(e);t.async=!0;
    t.src=v;s=b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t,s)}(window, document,'script',
    'https://connect.facebook.net/en_US/fbevents.js');

    window.fbq('init', id);
    console.log(`[Meta Pixel] Initialized successfully with ID: ${id}`);
  }

  /**
   * Tracks a standard or custom Meta Event
   * @param {string} eventName Name of the event (e.g. PageView, ViewContent, Lead)
   * @param {Object} [params] Optional parameters payload for the event
   */
  function trackEvent(eventName, params = {}) {
    if (typeof window !== 'undefined' && window.fbq) {
      window.fbq('track', eventName, params);
      console.log(`[Meta Pixel] Event Tracked: ${eventName}`, params);
    } else {
      console.warn(`[Meta Pixel] Could not track event: ${eventName} (fbq is not initialized)`);
    }
  }

  return {
    getPixelId: getPixelId,
    initMetaPixel: initMetaPixel,
    trackEvent: trackEvent
  };
}));
