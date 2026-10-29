(function(){
  'use strict';
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var slides = Array.prototype.slice.call(document.querySelectorAll('.slide'));
  var total = slides.length;
  var body = document.body;
  var progress = document.querySelector('.progress');
  var counter = document.querySelector('.counter');

  document.querySelectorAll('a[href^="http"]').forEach(function(a){ a.target = '_blank'; a.rel = 'noopener'; });

  var dots = document.querySelector('.dots');
  var menuList = document.querySelector('.menu ol');
  slides.forEach(function(s, i){
    var d = document.createElement('button'); d.type = 'button'; d.title = s.dataset.title; d.setAttribute('aria-label', 'Go to ' + s.dataset.title);
    d.addEventListener('click', function(){ go(i); }); dots.appendChild(d);
    var li = document.createElement('li'); li.innerHTML = '<a href="#' + s.id + '"><span>' + (i + 1) + '</span>' + s.dataset.title + '</a>';
    li.querySelector('a').addEventListener('click', function(e){ e.preventDefault(); go(i); toggleMenu(false); });
    menuList.appendChild(li);
  });
  var dotEls = dots.children, menuLinks = menuList.querySelectorAll('a');
  var notesPanel = document.querySelector('.notes-panel .txt');
  var current = -1;
  var mapReady = false;

  function nearest(){
    var best = 0, bd = Infinity;
    slides.forEach(function(s, i){ var d = Math.abs(s.getBoundingClientRect().top); if (d < bd){ bd = d; best = i; } });
    return best;
  }
  function setActive(i){
    if (i === current) return; current = i;
    slides.forEach(function(s, k){ if (k === i) activate(s); });
    progress.style.width = ((i + 1) / total * 100) + '%';
    counter.textContent = String(i + 1).padStart(2, '0') + ' / ' + String(total).padStart(2, '0');
    for (var k = 0; k < dotEls.length; k++){ dotEls[k].classList.toggle('on', k === i); menuLinks[k].classList.toggle('on', k === i); }
    var n = slides[i].querySelector('.notes'); notesPanel.textContent = n ? n.textContent : 'No notes for this slide.';
    document.body.classList.toggle('on-dark', slides[i].classList.contains('dark'));
    if (slides[i].id === 's-map') ensureMap();
  }
  function activate(s){
    if (s.classList.contains('active')) return;
    s.classList.add('active');
  }

  if ('IntersectionObserver' in window){
    var io = new IntersectionObserver(function(es){ es.forEach(function(e){ if (e.isIntersecting) setActive(slides.indexOf(e.target)); }); }, { threshold: 0.45 });
    slides.forEach(function(s){ io.observe(s); });
  }
  var ticking = false;
  window.addEventListener('scroll', function(){ if (!ticking){ ticking = true; requestAnimationFrame(function(){ setActive(nearest()); ticking = false; }); } }, { passive: true });
  window.addEventListener('resize', function(){ setActive(nearest()); if (mapReady && window._scarletMap){ window._scarletMap.invalidateSize(); if (window._scarletMapPoints && window._scarletMapPoints.length){ window._scarletMap.fitBounds(L.latLngBounds(window._scarletMapPoints), { padding: [48, 48], maxZoom: 12, animate: false }); } } });
  setActive(nearest());

  function go(i){
    i = Math.max(0, Math.min(total - 1, i));
    slides[i].scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
  }
  window.goToSlide = go;

  function toggleMenu(force){ var on = typeof force === 'boolean' ? force : !body.classList.contains('menu-open'); body.classList.toggle('menu-open', on); }
  document.querySelector('.menu-btn').addEventListener('click', function(){ toggleMenu(); });
  document.querySelector('.menu-hot').addEventListener('mouseenter', function(){ toggleMenu(true); });
  document.querySelector('.menu').addEventListener('mouseleave', function(){ toggleMenu(false); });

  function fullscreen(){
    var d = document;
    if (!d.fullscreenElement && !d.webkitFullscreenElement){ var el = d.documentElement; (el.requestFullscreen || el.webkitRequestFullscreen).call(el); }
    else (d.exitFullscreen || d.webkitExitFullscreen).call(d);
  }

  document.addEventListener('keydown', function(e){
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    var k = e.key;
    var cur = nearest();
    if (k === 'ArrowDown' || k === 'ArrowRight' || k === 'PageDown' || (k === ' ' && !e.shiftKey)){ go(cur + 1); e.preventDefault(); }
    else if (k === 'ArrowUp' || k === 'ArrowLeft' || k === 'PageUp' || (k === ' ' && e.shiftKey)){ go(cur - 1); e.preventDefault(); }
    else if (k === 'Home'){ go(0); e.preventDefault(); }
    else if (k === 'End'){ go(total - 1); e.preventDefault(); }
    else if (k === 'n' || k === 'N'){ body.classList.toggle('notes-on'); }
    else if (k === 'm' || k === 'M'){ toggleMenu(); }
    else if (k === 'f' || k === 'F'){ fullscreen(); }
    else if (k === 'Escape'){ toggleMenu(false); body.classList.remove('notes-on'); }
  });

  function pin(color, ring){
    var html = ring
      ? '<span style="display:block;width:16px;height:16px;border-radius:50%;background:'+color+';box-shadow:0 0 0 3px #ED5D22;border:2px solid #fff"></span>'
      : '<span style="display:block;width:14px;height:14px;border-radius:50%;background:'+color+';border:2px solid #fff;box-shadow:0 1px 4px rgba(0,0,0,.35)"></span>';
    return L.divIcon({ className: '', html: html, iconSize: [16,16], iconAnchor: [8,8] });
  }


  // ---- Photo carousels ----
  document.querySelectorAll('[data-carousel]').forEach(function(car){
    var slides = Array.prototype.slice.call(car.querySelectorAll('.c-slide'));
    var dots = Array.prototype.slice.call(car.querySelectorAll('.c-dot'));
    var curEl = car.querySelector('.c-cur');
    var i = 0; var n = slides.length;
    function show(x){
      i = (x + n) % n;
      slides.forEach(function(s, k){ s.classList.toggle('on', k === i); });
      dots.forEach(function(d, k){ d.classList.toggle('on', k === i); });
      if (curEl) curEl.textContent = String(i + 1);
    }
    var prev = car.querySelector('.c-prev');
    var next = car.querySelector('.c-next');
    if (prev) prev.addEventListener('click', function(e){ e.stopPropagation(); show(i - 1); });
    if (next) next.addEventListener('click', function(e){ e.stopPropagation(); show(i + 1); });
    dots.forEach(function(d){ d.addEventListener('click', function(e){ e.stopPropagation(); show(+d.getAttribute('data-i')); }); });
    // swipe
    var sx = null;
    car.addEventListener('touchstart', function(e){ sx = e.changedTouches[0].screenX; }, {passive:true});
    car.addEventListener('touchend', function(e){
      if (sx == null) return;
      var dx = e.changedTouches[0].screenX - sx; sx = null;
      if (Math.abs(dx) < 40) return;
      if (dx < 0) show(i + 1); else show(i - 1);
    }, {passive:true});
  });

  function fitAllMarkers(map){
    var pts = window._scarletMapPoints || [];
    if (!map || !pts.length) return;
    map.invalidateSize();
    var bounds = L.latLngBounds(pts);
    map.fitBounds(bounds, { padding: [48, 48], maxZoom: 12, animate: false });
  }

  function ensureMap(){
    if (typeof L === 'undefined') return;
    var el = document.getElementById('map');
    if (!el) return;

    // Already built: just reflow + fit all markers when the map slide is shown
    if (mapReady && window._scarletMap){
      fitAllMarkers(window._scarletMap);
      setTimeout(function(){ fitAllMarkers(window._scarletMap); }, 200);
      return;
    }

    var map = L.map(el, { scrollWheelZoom: false }).setView([44.65, -79.78], 10);
    window._scarletMap = map;
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap'
    }).addTo(map);

    var mg = window.SCARLET_MAP_MG || [];
    var solds = window.SCARLET_MAP_SOLDS || [];
    var pts = [];
    mg.forEach(function(p){
      if (p.lat == null || p.lng == null) return;
      pts.push([p.lat, p.lng]);
      var c = p.kind === 'front' ? '#1a1a1a' : (p.kind === 'comp' ? '#8b5a2b' : '#ED5D22');
      L.marker([p.lat,p.lng], { icon: pin(c, p.kind==='front') }).addTo(map).bindPopup(p.label);
    });
    solds.forEach(function(p){
      if (p.lat == null || p.lng == null) return;
      pts.push([p.lat, p.lng]);
      L.marker([p.lat,p.lng], { icon: pin('#2f6fed', false) }).addTo(map).bindPopup(p.label);
    });
    window._scarletMapPoints = pts;
    L.circle([44.590715, -79.747146], { radius: 400, color:'#ED5D22', weight:2, fillColor:'#ED5D22', fillOpacity:0.08 }).addTo(map);
    mapReady = true;
    // Fit on load (and again after layout settles)
    fitAllMarkers(map);
    setTimeout(function(){ fitAllMarkers(map); }, 250);
    setTimeout(function(){ fitAllMarkers(map); }, 600);
  }
})();
