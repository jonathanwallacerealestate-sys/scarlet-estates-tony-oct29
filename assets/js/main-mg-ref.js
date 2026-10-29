(function(){
  'use strict';
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var slides = Array.prototype.slice.call(document.querySelectorAll('.slide'));
  var total = slides.length;
  var body = document.body;

  // Outbound links in new tabs
  document.querySelectorAll('a[href^="http"]').forEach(function(a){ a.target = '_blank'; a.rel = 'noopener'; });

  // ---------- Lots ----------
  var LOTS = [
    { c:'Scarlett Estates · Hillsdale', no:'Lot 4', addr:'18 Rumble Crt', ac:'0.71', img:'survey-lot4.jpg', fit:'cover', alt:'Survey extract with Lot 4 outlined', rows:[['Lot size','About 0.71 acre'],['Services','Town water, septic, natural gas, fibre optics'],['New build price range','$1.3M to $1.5M']] },
    { c:'Scarlett Estates · Hillsdale', no:'Lot 7', addr:'96 Scarlett Line', ac:'0.59', img:'survey-lot7.jpg', fit:'cover', alt:'Survey extract with Lot 7 outlined', rows:[['Lot size','About 0.59 acre'],['Services','Town water, septic, natural gas, fibre optics'],['New build price range','$1.3M to $1.5M']] },
    { c:'Scarlett Estates · Hillsdale', no:'Lot 13', addr:'15 Greenlaw Crt', ac:'0.69', img:'survey-lot13.jpg', fit:'cover', alt:'Survey extract with Lot 13 outlined', rows:[['Lot size','About 0.69 acre'],['Services','Town water, septic, natural gas, fibre optics'],['New build price range','$1.3M to $1.5M']] },
    { c:'Scarlett Estates · Hillsdale', no:'Lot 14', addr:'12 Greenlaw Crt', ac:'1.01', img:'survey-lot14.jpg', fit:'cover', alt:'Survey extract with Lot 14 outlined', rows:[['Lot size','About 1.01 acres'],['Services','Town water, septic, natural gas, fibre optics'],['New build price range','$1.3M to $1.5M']] },
    { c:'Swan Lane · Port McNicoll', no:'9 Swan Lane', addr:'Unit 44 · gated', ac:'0.41', img:'sketch-swan9.jpg', fit:'contain', alt:'Lot sketch, 9 Swan Lane, Unit 44', rows:[['Lot size','About 0.41 acre'],['Services','Town water and sewer'],['Connectivity','Rogers and Bell'],['Condo fees','$176.73/month']] },
    { c:'Swan Lane · Port McNicoll', no:'11 Swan Lane', addr:'Unit 45 · gated', ac:'0.42', img:'sketch-swan11.jpg', fit:'contain', alt:'Lot sketch, 11 Swan Lane, Unit 45', rows:[['Lot size','About 0.42 acre'],['Services','Town water and sewer'],['Connectivity','Rogers and Bell'],['Condo fees','$176.73/month']] }
  ];
  var cards = document.getElementById('lotCards');
  if (cards){
    LOTS.forEach(function(l, i){
      var b = document.createElement('button');
      b.className = 'lot r'; b.style.setProperty('--d', 2 + i * 0.5); b.type = 'button';
      b.setAttribute('aria-label', 'Open lot sheet: ' + l.no + ', ' + l.addr);
      b.innerHTML = '<div class="thumb' + (l.fit === 'contain' ? ' contain' : '') + '"><img src="assets/img/' + l.img + '" alt=""></div>' +
        '<div class="meta"><div class="comm">' + l.c.split(' · ')[0] + '</div><div class="no">' + l.no + '</div><div class="addr">' + l.addr + '</div><span class="ac">' + l.ac + ' acre' + (l.ac === '1.01' ? 's' : '') + '</span></div>';
      b.addEventListener('click', function(){ openLot(i); });
      cards.appendChild(b);
    });
  }
  var lb = document.getElementById('lb'), lbIdx = 0, lbMode = '', lbReturn = null;
  function openLot(i){
    lbMode = 'lot'; if (!lb.classList.contains('open')) lbReturn = document.activeElement;
    lbIdx = (i + LOTS.length) % LOTS.length; var l = LOTS[lbIdx];
    lb.innerHTML = '<div class="sheet" role="dialog" aria-modal="true" aria-label="Lot sheet ' + l.no + '">' +
      '<div class="head"><img src="assets/img/mg-homes-logo.png" alt="MG Homes"><div><span class="c">' + l.c + '</span><button type="button" data-close aria-label="Close">Close ✕</button></div></div>' +
      '<div class="main"><div class="plan"><img src="assets/img/' + l.img + '" alt="' + l.alt + '"></div>' +
      '<div><h4>' + l.no + '</h4><div class="sub">' + l.addr + '</div>' +
      '<div class="box">MG custom plan and render for this lot<br>(designed with Tony)</div>' +
      '<table>' + l.rows.map(function(r){ return '<tr><td>' + r[0] + '</td><td>' + r[1] + '</td></tr>'; }).join('') + '</table></div></div>' +
      '<div class="foot"><span>Faris Team x MG Homes · lot details as provided by MG Homes</span><span class="nav"><button type="button" data-prev>← Prev</button><button type="button" data-next>Next →</button></span></div></div>';
    lb.classList.add('open');
    lb.querySelector('[data-close]').focus();
  }
  function closeLot(){
    lb.classList.remove('open'); lb.innerHTML = ''; lbMode = '';   // clearing innerHTML also stops the video
    if (lbReturn && lbReturn.focus) lbReturn.focus({ preventScroll: true }); lbReturn = null;
  }

  // ---------- Showcase video (YouTube in the lightbox; "Watch on YouTube" fallback for file:// playback) ----------
  var YT_ID = '7DDawthzjuA', YT_WATCH = 'https://www.youtube.com/watch?v=' + YT_ID;
  function openVideo(){
    lbMode = 'video'; lbReturn = document.activeElement;
    lb.innerHTML = '<div class="sheet vsheet" role="dialog" aria-modal="true" aria-label="Video tour: 7 Reynolds Road, Tiny">' +
      '<div class="head"><span class="c">Example · our video tour of 7 Reynolds Road, Tiny</span><button type="button" data-close aria-label="Close video">Close ✕</button></div>' +
      '<div class="vframe"><iframe src="https://www.youtube-nocookie.com/embed/' + YT_ID + '?autoplay=1&amp;rel=0" title="7 Reynolds Road, Tiny | Home for Sale | Faris Team" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe></div>' +
      '<div class="foot"><span>Faris Team video · filmed with the homeowner\'s permission</span><a class="yt" href="' + YT_WATCH + '" target="_blank" rel="noopener">Not playing? Watch on YouTube ↗</a></div></div>';
    lb.classList.add('open');
    lb.querySelector('[data-close]').focus();
  }
  var showVideo = document.getElementById('showVideo');
  if (showVideo && lb) showVideo.addEventListener('click', openVideo);
  if (lb){
    lb.addEventListener('click', function(e){
      if (e.target === lb || e.target.closest('[data-close]')) closeLot();
      else if (e.target.closest('[data-prev]')) openLot(lbIdx - 1);
      else if (e.target.closest('[data-next]')) openLot(lbIdx + 1);
    });
  }

  // ---------- Lot animation video (loads only if the file exists) ----------
  var vbox = document.getElementById('lotVideo');
  if (vbox){
    var v = vbox.querySelector('video');
    v.addEventListener('loadeddata', function(){ vbox.classList.add('has-video'); if (!reduce) v.play().catch(function(){}); });
    v.addEventListener('error', function(){ vbox.classList.remove('has-video'); }, true);
    var s = document.createElement('source'); s.src = 'assets/video/lot-animation.mp4'; s.type = 'video/mp4';
    s.addEventListener('error', function(){ vbox.classList.remove('has-video'); });
    v.appendChild(s); v.load();
  }

  // ---------- Chrome: progress, dots, counter, menu ----------
  var progress = document.querySelector('.progress');
  var counter = document.querySelector('.counter');
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

  function idxNow(){ return Math.max(0, Math.min(total - 1, Math.round(window.scrollY / window.innerHeight))); }
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
  }
  function activate(s){
    if (s.classList.contains('active')) return;
    s.classList.add('active');
    s.querySelectorAll('[data-count]').forEach(countUp);
  }
  function fmt(n){ return Math.round(n).toLocaleString('en-CA'); }
  function countUp(el){
    if (el.dataset.done) return; el.dataset.done = 1;
    var to = +el.dataset.count, suf = el.dataset.suffix || '', pre = el.dataset.prefix || '';
    if (reduce){ el.textContent = pre + fmt(to) + suf; return; }
    var t0 = null, dur = 1400;
    function step(t){ if (!t0) t0 = t; var p = Math.min(1, (t - t0) / dur); var e = 1 - Math.pow(1 - p, 3);
      el.textContent = pre + fmt(to * e) + suf; if (p < 1) requestAnimationFrame(step); }
    el.textContent = pre + '0' + suf; requestAnimationFrame(step);
  }
  // Observe slides becoming visible
  if ('IntersectionObserver' in window){
    var io = new IntersectionObserver(function(es){ es.forEach(function(e){ if (e.isIntersecting) activate(e.target); }); }, { threshold: 0.45 });
    slides.forEach(function(s){ io.observe(s); });
  } else slides.forEach(activate);
  var ticking = false;
  window.addEventListener('scroll', function(){ if (!ticking){ ticking = true; requestAnimationFrame(function(){ setActive(nearest()); ticking = false; }); } }, { passive: true });
  window.addEventListener('resize', function(){ setActive(nearest()); });
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
    if (lb && lb.classList.contains('open')){
      // While any lightbox is open, keys never move the slides underneath.
      if (k === 'Escape'){ closeLot(); e.preventDefault(); }
      else if (lbMode === 'lot' && k === 'ArrowRight'){ openLot(lbIdx + 1); e.preventDefault(); }
      else if (lbMode === 'lot' && k === 'ArrowLeft'){ openLot(lbIdx - 1); e.preventDefault(); }
      else if (/^(Arrow(Up|Down|Left|Right)|PageUp|PageDown|Home|End| )$/.test(k)){ if (!(k === ' ' && e.target.closest && e.target.closest('button, a'))) e.preventDefault(); }
      return;
    }
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
})();
