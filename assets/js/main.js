/* Abdulrahman Alkholi — portfolio behaviour */
(function () {
  var root = document.documentElement;
  root.classList.remove('no-js');
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- theme ---------- */
  function stored(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function store(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }

  var saved = stored('aa-theme');
  if (saved === 'dark' || saved === 'light') root.setAttribute('data-theme', saved);

  function currentTheme() {
    var t = root.getAttribute('data-theme');
    if (t) return t;
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  document.addEventListener('click', function (e) {
    var t = e.target.closest ? e.target.closest('[data-theme-toggle]') : null;
    if (!t) return;
    var next = currentTheme() === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    store('aa-theme', next);
  });

  /* ---------- toast ---------- */
  var toastEl;
  function toast(msg) {
    if (!toastEl) {
      toastEl = document.createElement('div');
      toastEl.className = 'toast';
      toastEl.setAttribute('role', 'status');
      document.body.appendChild(toastEl);
    }
    toastEl.textContent = msg;
    toastEl.classList.add('show');
    clearTimeout(toastEl._t);
    toastEl._t = setTimeout(function () { toastEl.classList.remove('show'); }, 2200);
  }

  /* ---------- mobile nav ---------- */
  var burger = document.querySelector('[data-nav-toggle]');
  var links = document.querySelector('.nav-links');
  if (burger && links) {
    burger.addEventListener('click', function () {
      var open = links.classList.toggle('open');
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    links.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') { links.classList.remove('open'); burger.setAttribute('aria-expanded', 'false'); }
    });
  }

  /* ---------- scroll progress + back to top ---------- */
  var bar = document.querySelector('.progress');
  var topBtn = document.querySelector('.to-top');
  var ticking = false;
  function onScroll() {
    var h = document.documentElement.scrollHeight - window.innerHeight;
    var p = h > 0 ? window.scrollY / h : 0;
    if (bar) bar.style.transform = 'scaleX(' + p + ')';
    if (topBtn) topBtn.classList.toggle('show', window.scrollY > 700);
    ticking = false;
  }
  window.addEventListener('scroll', function () {
    if (!ticking) { ticking = true; requestAnimationFrame(onScroll); }
  }, { passive: true });
  onScroll();
  if (topBtn) topBtn.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
  });

  /* ---------- reveal on scroll + skill bars ---------- */
  var targets = document.querySelectorAll('.reveal, .skill-card');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        en.target.classList.add('in');
        io.unobserve(en.target);
      });
    }, { rootMargin: '0px 0px -60px 0px', threshold: 0.12 });
    Array.prototype.forEach.call(targets, function (t) { io.observe(t); });
  } else {
    Array.prototype.forEach.call(targets, function (t) { t.classList.add('in'); });
  }

  /* ---------- hero rotating skill ---------- */
  var rot = document.querySelector('[data-rotate]');
  if (rot) {
    var words = rot.getAttribute('data-rotate').split('|');
    if (reduce) {
      rot.textContent = words[0];
    } else {
      var wi = 0, ci = 0, deleting = false;
      (function tick() {
        var w = words[wi];
        ci += deleting ? -1 : 1;
        rot.textContent = w.slice(0, ci);
        var delay = deleting ? 38 : 78;
        if (!deleting && ci === w.length) { deleting = true; delay = 1700; }
        else if (deleting && ci === 0) { deleting = false; wi = (wi + 1) % words.length; delay = 320; }
        setTimeout(tick, delay);
      })();
    }
  }

  /* ---------- lightbox (certificates + project screenshots) ---------- */
  var groups = {};
  Array.prototype.forEach.call(document.querySelectorAll('[data-lightbox]'), function (el) {
    var g = el.getAttribute('data-lightbox');
    (groups[g] = groups[g] || []).push(el);
  });
  if (Object.keys(groups).length) {
    var ico = function (d) { return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="' + d + '"/></svg>'; };
    var lb = document.createElement('div');
    lb.className = 'lightbox';
    lb.setAttribute('role', 'dialog');
    lb.setAttribute('aria-modal', 'true');
    lb.setAttribute('aria-label', 'Image viewer');
    lb.innerHTML =
      '<button class="lb-btn lb-close" aria-label="Close">' + ico('M6 6l12 12M18 6L6 18') + '</button>' +
      '<button class="lb-btn lb-prev" aria-label="Previous image">' + ico('M15 6l-6 6 6 6') + '</button>' +
      '<button class="lb-btn lb-next" aria-label="Next image">' + ico('M9 6l6 6-6 6') + '</button>' +
      '<figure><img alt=""><figcaption></figcaption></figure>';
    document.body.appendChild(lb);
    var lbImg = lb.querySelector('img');
    var lbCap = lb.querySelector('figcaption');
    var cur = null, idx = 0, opener = null;

    function show(i) {
      var list = groups[cur];
      idx = (i + list.length) % list.length;
      var el = list[idx];
      lbImg.src = el.getAttribute('data-src');
      lbImg.alt = el.getAttribute('data-caption') || '';
      lbCap.innerHTML = '';
      lbCap.appendChild(document.createTextNode(el.getAttribute('data-caption') || ''));
      if (list.length > 1) {
        var n = document.createElement('span');
        n.textContent = (idx + 1) + ' / ' + list.length;
        lbCap.appendChild(n);
      }
    }
    function open(g, i, from) {
      cur = g; opener = from;
      lb.classList.toggle('solo', groups[g].length < 2);
      show(i);
      lb.classList.add('open');
      document.body.classList.add('no-scroll');
      lb.querySelector('.lb-close').focus();
    }
    function close() {
      lb.classList.remove('open');
      document.body.classList.remove('no-scroll');
      if (opener) opener.focus();
    }
    Object.keys(groups).forEach(function (g) {
      groups[g].forEach(function (el, i) {
        el.addEventListener('click', function () { open(g, i, el); });
      });
    });
    lb.querySelector('.lb-close').addEventListener('click', close);
    lb.querySelector('.lb-prev').addEventListener('click', function () { show(idx - 1); });
    lb.querySelector('.lb-next').addEventListener('click', function () { show(idx + 1); });
    lb.addEventListener('click', function (e) { if (e.target === lb || e.target.tagName === 'FIGURE') close(); });
    document.addEventListener('keydown', function (e) {
      if (!lb.classList.contains('open')) return;
      if (e.key === 'Escape') close();
      else if (e.key === 'ArrowLeft') show(idx - 1);
      else if (e.key === 'ArrowRight') show(idx + 1);
      else if (e.key === 'Tab') {
        var f = Array.prototype.filter.call(lb.querySelectorAll('button'), function (b) { return b.offsetParent !== null; });
        var at = f.indexOf(document.activeElement);
        e.preventDefault();
        f[(at + (e.shiftKey ? -1 : 1) + f.length) % f.length].focus();
      }
    });
    var sx = null;
    lb.addEventListener('touchstart', function (e) { sx = e.touches[0].clientX; }, { passive: true });
    lb.addEventListener('touchend', function (e) {
      if (sx === null) return;
      var dx = e.changedTouches[0].clientX - sx;
      if (Math.abs(dx) > 50) show(idx + (dx < 0 ? 1 : -1));
      sx = null;
    });
  }

  /* ---------- click-to-load interactive embeds ---------- */
  Array.prototype.forEach.call(document.querySelectorAll('[data-embed]'), function (btn) {
    btn.addEventListener('click', function () {
      var f = document.createElement('iframe');
      f.src = btn.getAttribute('data-embed');
      f.title = btn.getAttribute('data-title') || 'Interactive preview';
      f.setAttribute('allowfullscreen', '');
      f.setAttribute('loading', 'lazy');
      btn.parentNode.replaceChild(f, btn);
    });
  });

  /* ---------- copy email ---------- */
  Array.prototype.forEach.call(document.querySelectorAll('[data-copy]'), function (btn) {
    btn.addEventListener('click', function () {
      var text = btn.getAttribute('data-copy');
      function done() { toast('Copied ' + text); }
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text).then(done, fallback);
      } else fallback();
      function fallback() {
        var ta = document.createElement('textarea');
        ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0';
        document.body.appendChild(ta); ta.select();
        try { document.execCommand('copy'); done(); } catch (e) { toast(text); }
        document.body.removeChild(ta);
      }
    });
  });

  /* ---------- contact form -> opens the visitor's email app ---------- */
  var form = document.querySelector('[data-contact-form]');
  if (form) {
    form.setAttribute('novalidate', '');
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var ok = true;
      Array.prototype.forEach.call(form.querySelectorAll('[required]'), function (input) {
        var v = input.value.trim();
        var bad = !v || (input.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v));
        input.closest('.field').classList.toggle('bad', bad);
        if (bad && ok) { input.focus(); ok = false; }
      });
      if (!ok) return;
      var to = form.getAttribute('data-to');
      var name = form.elements.name.value.trim();
      var from = form.elements.email.value.trim();
      var subject = form.elements.subject.value.trim() || 'Portfolio enquiry';
      var msg = form.elements.message.value.trim();
      var body = msg + '\n\n—\n' + name + '\n' + from;
      window.location.href = 'mailto:' + to +
        '?subject=' + encodeURIComponent(subject) +
        '&body=' + encodeURIComponent(body);
      var note = form.querySelector('.form-note');
      if (note) note.textContent = 'Opening your email app… if nothing happens, email ' + to + ' directly.';
    });
    form.addEventListener('input', function (e) {
      var f = e.target.closest('.field');
      if (f) f.classList.remove('bad');
    });
  }

  /* ---------- active nav link on scroll (home only) ---------- */
  var navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
  if (navLinks.length && 'IntersectionObserver' in window) {
    var map = {};
    Array.prototype.forEach.call(navLinks, function (a) { map[a.getAttribute('href').slice(1)] = a; });
    var so = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting || !map[en.target.id]) return;
        Array.prototype.forEach.call(navLinks, function (l) { l.classList.remove('active'); });
        map[en.target.id].classList.add('active');
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    Object.keys(map).forEach(function (id) {
      var el = document.getElementById(id);
      if (el) so.observe(el);
    });
  }
})();
