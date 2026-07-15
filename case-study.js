(function () {
  /* ── DARK MODE ── */
  window.toggleDark = function () {
    const isDark = document.documentElement.dataset.theme === 'dark';
    document.documentElement.dataset.theme = isDark ? '' : 'dark';
    localStorage.setItem('theme', isDark ? '' : 'dark');
    const wrap = document.getElementById('theme-icon-wrap');
    wrap.classList.remove('to-sun', 'to-moon');
    void wrap.offsetWidth;
    wrap.classList.add(isDark ? 'to-moon' : 'to-sun');
  };
  (function () {
    const saved = localStorage.getItem('theme');
    if (saved === 'dark') {
      document.documentElement.dataset.theme = 'dark';
      document.addEventListener('DOMContentLoaded', () => {
        const moon = document.getElementById('icon-moon');
        const sun = document.getElementById('icon-sun');
        if (moon) moon.style.transform = 'translateY(-100%)';
        if (sun) sun.style.transform = 'translateY(0)';
      });
    }
  })();

  /* ── CUSTOM CURSOR ── */
  var dot = null;
  var carouselCursor = null;
  var isOverCarousel = false;

  document.addEventListener('DOMContentLoaded', function () {
    dot = document.getElementById('cursor-dot');
    carouselCursor = document.getElementById('carousel-cursor');
    if (!dot) return;

    dot.style.opacity = '0';

    document.addEventListener('mousemove', function (e) {
      dot.style.transform = 'translate(calc(' + e.clientX + 'px - 50%), calc(' + e.clientY + 'px - 50%))';
      dot.style.opacity = '1';
      if (carouselCursor) {
        carouselCursor.style.left = e.clientX + 'px';
        carouselCursor.style.top = e.clientY + 'px';
      }
    });

    var CLICKABLE = 'a, button, [role="button"], label, select, input';
    document.addEventListener('mouseover', function (e) {
      if (!isOverCarousel && e.target.closest(CLICKABLE)) dot.classList.add('expanded');
    });
    document.addEventListener('mouseout', function (e) {
      if (e.target.closest(CLICKABLE)) dot.classList.remove('expanded');
    });


    /* ── BACK LINK LETTER ANIMATION ── */
    var backFull = document.querySelector('.back-full');
    if (backFull) {
      var text = backFull.textContent;
      var html = '';
      for (var i = 0; i < text.length; i++) {
        var ch = text[i];
        if (ch === ' ') {
          html += '<span style="display:inline"> </span>';
        } else {
          html += '<span class="bl" style="display:inline;transition:color 0.14s ease">' + ch + '</span>';
        }
      }
      backFull.innerHTML = html;
      var pillColors = ['#1557FF', '#00A63F', '#F5A800', '#D92B2B'];
      var timers = [];
      var link = backFull.closest('a');
      link.addEventListener('mouseenter', function () {
        timers.forEach(function (t) { clearTimeout(t); }); timers = [];
        var spans = backFull.querySelectorAll('.bl');
        spans.forEach(function (span, i) {
          var color = pillColors[i % pillColors.length];
          timers.push(setTimeout(function () { span.style.color = color; }, i * 45));
          timers.push(setTimeout(function () { span.style.color = ''; }, i * 45 + 300));
        });
      });
      link.addEventListener('mouseleave', function () {
        timers.forEach(function (t) { clearTimeout(t); }); timers = [];
        backFull.querySelectorAll('.bl').forEach(function (s) { s.style.color = ''; });
      });
    }

    /* ── H1 WORD ANIMATION + ASSET ── */
    var h1 = document.querySelector('.hero h1');
    if (h1) {
      var config = window.CS_H1_ASSET || null;
      var rawText = h1.textContent.trim();
      var wordsArr = rawText.split(/\s+/);
      h1.innerHTML = wordsArr.map(function (w) {
        var span = '<span class="word">' + w + '</span>';
        if (config && w === config.afterWord) {
          return span + ' <span class="h1-asset-wrap"><img src="' + config.src + '" alt=""></span>';
        }
        return span;
      }).join(' ');

      var words = h1.querySelectorAll('.word');
      var assetWrap = h1.querySelector('.h1-asset-wrap');
      var assetImg = assetWrap ? assetWrap.querySelector('img') : null;
      var assetWordIndex = config ? wordsArr.indexOf(config.afterWord) : -1;
      var wordsToShift = [];
      var revealed = false;

      function setAssetWidth() {
        if (!assetImg || !config) return;
        var h = parseFloat(getComputedStyle(h1).fontSize) * (config.height || 0.96);
        assetImg.style.height = h + 'px';
        assetImg.style.width = 'auto';
        var fw = assetImg.naturalWidth / assetImg.naturalHeight * h;
        assetWrap.style.width = fw + 'px';
        void assetWrap.getBoundingClientRect();
        var assetRect = assetWrap.getBoundingClientRect();
        var assetMidY = assetRect.top + assetRect.height / 2;
        wordsToShift = [];
        var afterAsset = false;
        for (var i = 0; i < h1.children.length; i++) {
          var child = h1.children[i];
          if (child === assetWrap) { afterAsset = true; continue; }
          if (afterAsset && child.classList.contains('word')) {
            var cr = child.getBoundingClientRect();
            var childMidY = cr.top + cr.height / 2;
            if (Math.abs(childMidY - assetMidY) < cr.height * 0.6) wordsToShift.push(child);
            else break;
          }
        }
        // If the reveal already fired (slow image load), don't re-hide the words behind the asset —
        // just let it pop in at its measured width.
        if (revealed) return;
        var shift = fw + h * 0.16;
        wordsToShift.forEach(function (c) { c.style.transition = 'none'; c.style.transform = 'translateX(-' + shift + 'px)'; });
      }

      if (assetImg) {
        if (assetImg.complete) setAssetWidth();
        else assetImg.addEventListener('load', setAssetWidth);
      }

      setTimeout(function () {
        words.forEach(function (span, i) {
          setTimeout(function () { span.classList.add('black'); }, i * 140);
        });
        if (assetWrap && assetWordIndex >= 0) {
          setTimeout(function () {
            revealed = true;
            assetWrap.classList.add('visible');
            wordsToShift.forEach(function (c) {
              c.style.transition = 'transform 0.4s cubic-bezier(0.34,1.56,0.64,1)';
              c.style.transform = 'translateX(0)';
            });
          }, assetWordIndex * 140 + 200);
        }
      }, 350);
    }

    /* ── H2 WORD COLOR ANIMATION ON SCROLL ── */
    var h2 = document.querySelector('.content-left h2');
    if (h2) {
      var h2Words = h2.textContent.trim().split(/\s+/);
      h2.innerHTML = h2Words.map(function(w) {
        return '<span class="word">' + w + '</span>';
      }).join(' ');
      var h2WordEls = h2.querySelectorAll('.word');
      var h2Observer = new IntersectionObserver(function(entries) {
        if (!entries[0].isIntersecting) return;
        h2Observer.disconnect();
        h2WordEls.forEach(function(span, i) {
          setTimeout(function() { span.classList.add('black'); }, i * 60);
        });
      }, { threshold: 0.3 });
      h2Observer.observe(h2);
    }

    /* ── HEADER BRAND REVEAL ON SCROLL ── */
    var brand = document.getElementById('header-brand');
    var heroAnchor = document.querySelector('.hero h1') || document.querySelector('.hero-image-section');
    if (brand && heroAnchor) {
      var titleObserver = new IntersectionObserver(function (entries) {
        brand.classList.toggle('visible', !entries[0].isIntersecting);
      }, { threshold: 0 });
      titleObserver.observe(heroAnchor);
    }

    /* ── STATS COUNTER ── */
    var statsData = window.CS_STATS || [];
    var statItems = document.querySelectorAll('.stat-item');
    var statValues = document.querySelectorAll('.stat-value');

    function animateCounter(el, target, suffix, prefix, duration) {
      var start = performance.now();
      var update = function (now) {
        var progress = Math.min((now - start) / duration, 1);
        var ease = 1 - Math.pow(1 - progress, 3);
        var current = Math.round(ease * target);
        el.textContent = (prefix || '') + current.toLocaleString() + (suffix || '');
        if (progress < 1) requestAnimationFrame(update);
      };
      requestAnimationFrame(update);
    }

    function animateCountdown(el, from, duration) {
      var start = performance.now();
      var update = function (now) {
        var progress = Math.min((now - start) / duration, 1);
        var ease = 1 - Math.pow(1 - progress, 3);
        var current = Math.round(from - ease * (from - 1));
        el.textContent = current + 's';
        if (progress < 1) requestAnimationFrame(update);
        else el.textContent = '<1s';
      };
      requestAnimationFrame(update);
    }

    function animateDecimal(el, target, suffix, prefix, duration) {
      var start = performance.now();
      var update = function (now) {
        var progress = Math.min((now - start) / duration, 1);
        var ease = 1 - Math.pow(1 - progress, 3);
        var current = (ease * target).toFixed(1);
        el.textContent = (prefix || '') + current + (suffix || '');
        if (progress < 1) requestAnimationFrame(update);
      };
      requestAnimationFrame(update);
    }

    function runStat(i) {
      var d = statsData[i];
      if (!d || !statValues[i]) return;
      statValues[i].classList.add('visible');
      if (d.countdown) animateCountdown(statValues[i], 8, 1200);
      else if (d.decimal) animateDecimal(statValues[i], d.target, d.suffix, d.prefix, 900);
      else if (d.static) { /* already set in HTML, no animation */ }
      else animateCounter(statValues[i], d.target, d.suffix, d.prefix, 900);
    }

    if (statItems.length) {
      var statsObserver = new IntersectionObserver(function (entries) {
        if (!entries[0].isIntersecting) return;
        statsObserver.disconnect();
        statItems.forEach(function (card, i) {
          setTimeout(function () {
            requestAnimationFrame(function () { card.classList.add('visible'); });
            setTimeout(function () { runStat(i); }, 250);
          }, i * 150);
        });
      }, { threshold: 0.3 });
      statsObserver.observe(statItems[0]);

    }

    /* ── MENU + BLADE ── */
    var menuToggleBtn = document.getElementById('menu-toggle-btn');
    var blade = document.getElementById('blade');
    var bladeOverlay = document.getElementById('blade-overlay');
    var bladeClose = document.getElementById('blade-close');
    var tabWork = document.getElementById('tab-work');
    var tabMind = document.getElementById('tab-mind');
    var panelWork = document.getElementById('panel-work');
    var panelMind = document.getElementById('panel-mind');
    var tabsUnderline = document.getElementById('tabs-underline');

    if (menuToggleBtn && blade) {
      function animateBladePanel(panel) {
        var items = panel.querySelectorAll('.blade-group, .mind-section');
        panel.classList.remove('animating');
        items.forEach(function(el) { el.style.animationDelay = ''; });
        void panel.offsetWidth;
        panel.classList.add('animating');
        items.forEach(function(el, i) { el.style.animationDelay = (i * 60) + 'ms'; });
        panel.addEventListener('animationend', function() { panel.classList.remove('animating'); }, { once: true });
      }

      function moveUnderline(activeTab) {
        if (!tabsUnderline) return;
        var tabsRect = activeTab.parentElement.getBoundingClientRect();
        var rect = activeTab.getBoundingClientRect();
        tabsUnderline.style.left = (rect.left - tabsRect.left) + 'px';
        tabsUnderline.style.width = rect.width + 'px';
      }

      function openBlade(tab) {
        blade.classList.add('open');
        bladeOverlay.classList.add('open');
        document.body.style.overflow = 'hidden';
        var isWork = (tab || 'work') === 'work';
        tabWork.classList.toggle('active', isWork);
        tabMind.classList.toggle('active', !isWork);
        panelWork.classList.toggle('active', isWork);
        panelMind.classList.toggle('active', !isWork);
        if (tabsUnderline) {
          tabsUnderline.style.transition = 'none';
          requestAnimationFrame(function() {
            moveUnderline(isWork ? tabWork : tabMind);
            requestAnimationFrame(function() { tabsUnderline.style.transition = ''; });
          });
        }
        setTimeout(function() { animateBladePanel(isWork ? panelWork : panelMind); }, 120);
      }

      function closeBlade() {
        blade.classList.remove('open');
        bladeOverlay.classList.remove('open');
        document.body.style.overflow = '';
      }

      function switchTab(tab) {
        var isWork = tab === 'work';
        tabWork.classList.toggle('active', isWork);
        tabMind.classList.toggle('active', !isWork);
        panelWork.classList.toggle('active', isWork);
        panelMind.classList.toggle('active', !isWork);
        moveUnderline(isWork ? tabWork : tabMind);
        animateBladePanel(isWork ? panelWork : panelMind);
      }

      menuToggleBtn.addEventListener('click', function() { openBlade('work'); });
      bladeClose.addEventListener('click', closeBlade);
      bladeOverlay.addEventListener('click', closeBlade);
      tabWork.addEventListener('click', function() { switchTab('work'); });
      tabMind.addEventListener('click', function() { switchTab('mind'); });
      document.getElementById('all-work-btn').addEventListener('click', function() { openBlade('work'); });
      document.getElementById('mind-btn').addEventListener('click', function() { openBlade('mind'); });
      document.addEventListener('keydown', function(e) { if (e.key === 'Escape') closeBlade(); });
    }

    /* ── GALLERY ITEM REVEAL ── */
    var galleryItems = document.querySelectorAll('.gallery-item');
    if (galleryItems.length) {
      var galleryObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          galleryObserver.unobserve(entry.target);
          entry.target.classList.add('visible');
        });
      }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
      galleryItems.forEach(function (el, i) {
        setTimeout(function () { galleryObserver.observe(el); }, i * 100);
      });
    }
  });
})();
