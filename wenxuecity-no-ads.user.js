// ==UserScript==
// @name         Wenxuecity Ad Hider
// @namespace    https://www.wenxuecity.com/
// @version      1.2.0
// @description  Hide Wenxuecity popup, floating, sidebar, and article advertisements.
// @match        *://wenxuecity.com/*
// @match        *://*.wenxuecity.com/*
// @run-at       document-start
// @grant        none
// ==/UserScript==

(function () {
  'use strict';

  const css = `
    /* Homepage ad-only side rails, including their large reserved spaces. */
    #pc .maincontent > #leftside,
    #pc .maincontent > #rightside,
    #pc [data-adnrail],
    #pc .hometop,
    #pc .midbannerw,
    #pc .contop > p:first-child:has(img[src*="adserver.wenxuecity.com"]),
    #pc #header .wrapper > div:has(> a > img[src*="adserver.wenxuecity.com"]),
    #pc .classified_left:has(> .adti:empty) {
      display: none !important;
    }

    /* News category and article pages: keep the surrounding news sidebar. */
    [id*="_SideBar_"],
    #gg_rightside,
    .sidebar .rightbannerw,
    aside.sidebar .rightbannerw,
    .sidebar .banners,
    aside.sidebar .banners,
    .rifz79 {
      display: none !important;
    }

    /* News article templates also reserve tall spaces above and within the story. */
    #wenxuecity-com_news_article_Top,
    #wenxuecity-com_news_article_bottom,
    .Article_InContent,
    .otherposts > .rightbannerw,
    aside.sidebar .sticky:has(> [id*="_SideBar_"]) {
      display: none !important;
    }

    /* Ad labels and empty inline ad placeholders. */
    .HPInContent,
    .adlab,
    .adlab_border,
    iframe[src*="vdo.ai"],
    iframe[src*="adncdn.net"] {
      display: none !important;
    }
  `;

  const style = document.createElement('style');
  style.id = 'wenxuecity-no-ads-style';
  style.textContent = css;
  (document.head || document.documentElement).appendChild(style);
  document.documentElement.dataset.wxcNoAds = '1.2.0';

  const adHost = /(?:^|\.)(?:adncdn\.net|adserver\.wenxuecity\.com|ads\.wenxuecity\.com|doubleclick\.net|googlesyndication\.com|googleadservices\.com|taboola\.com|outbrain\.com|vdo\.ai|srvb1\.com)$/i;
  const adName = /(?:^|[\s_-])(ad|ads|advert|advertisement|popup|popunder|vdo)(?:$|[\s_-])/i;

  function isAdUrl(value) {
    try {
      return adHost.test(new URL(value, location.href).hostname);
    } catch {
      return false;
    }
  }

  const originalOpen = window.open;
  window.open = function (url, ...args) {
    if (url && isAdUrl(url)) return null;
    return Reflect.apply(originalOpen, this, [url, ...args]);
  };

  function isAdElement(element) {
    if (adName.test(`${element.id} ${element.className || ''}`)) return true;
    if (element.matches('iframe[src], a[href], img[src]')) {
      if (isAdUrl(element.getAttribute('src') || element.getAttribute('href'))) return true;
    }
    if (element.textContent?.includes('Powered By VDO.AI')) return true;
    return Boolean(element.querySelector('iframe[src*="doubleclick.net"], iframe[src*="googlesyndication.com"], iframe[src*="adncdn.net"], iframe[src*="vdo.ai"], a[href*="doubleclick.net"], img[src*="adserver.wenxuecity.com"]'));
  }

  function floatingRect(element) {
    const position = getComputedStyle(element).position;
    if (position !== 'fixed' && position !== 'sticky') return null;
    const rect = element.getBoundingClientRect();
    return rect.width >= 100 && rect.height >= 80 ? rect : null;
  }

  function isBottomAdDock(element, rect) {
    if (getComputedStyle(element).position !== 'fixed') return false;
    if (rect.width < innerWidth * 0.55 || rect.height > innerHeight * 0.4) return false;
    if (rect.bottom < innerHeight - 30 || rect.top < innerHeight * 0.45) return false;
    return element.querySelectorAll('a, img, iframe').length >= 3;
  }

  function hideAdOverlay(element) {
    if (element.nodeType !== Node.ELEMENT_NODE || element === document.body) return;
    // Inspect only a few ancestors so a normal page containing an ad is never hidden.
    let candidate = element;
    for (let depth = 0; candidate && depth < 8; depth++, candidate = candidate.parentElement) {
      if (candidate === document.body || candidate === document.documentElement) break;
      const rect = floatingRect(candidate);
      if (rect && (isAdElement(candidate) || isBottomAdDock(candidate, rect))) {
        candidate.style.setProperty('display', 'none', 'important');
        return;
      }
    }
  }

  function scan(root) {
    if (root.nodeType !== Node.ELEMENT_NODE) return;
    hideAdOverlay(root);
    root.querySelectorAll('iframe[src], img[src*="adserver.wenxuecity.com"], [id], [class]').forEach(hideAdOverlay);
  }

  function start() {
    scan(document.body);
    new MutationObserver((records) => {
      for (const record of records) {
        if (record.type === 'attributes') hideAdOverlay(record.target);
        else for (const node of record.addedNodes) scan(node);
      }
    }).observe(document.documentElement, { childList: true, attributes: true, attributeFilter: ['class', 'style', 'src'], subtree: true });
  }

  if (document.body) start();
  else document.addEventListener('DOMContentLoaded', start, { once: true });
})();
