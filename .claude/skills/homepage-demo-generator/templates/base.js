/* base.js — shared behavior for homepage-demo-generator. Copy as-is, do not edit per-project. */
(() => {
  'use strict';
  const $ = (s,c=document)=>c.querySelector(s);
  const $$ = (s,c=document)=>Array.from(c.querySelectorAll(s));
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isDesktop = matchMedia('(hover: hover) and (pointer: fine)').matches;

  const nav = $('#nav'), navToggle = $('#navToggle'), progress = $('#scrollProgress');
  const bookingBar = $('#bookingBar');
  const yearEl = $('#year'); if(yearEl) yearEl.textContent = new Date().getFullYear();

  const start = () => document.body.classList.add('loaded');
  if(document.fonts?.ready) document.fonts.ready.then(start); else setTimeout(start, 300);

  let ticking = false;
  const onScroll = () => {
    if(ticking) return; ticking = true;
    requestAnimationFrame(()=>{
      const y = window.scrollY;
      const docH = document.documentElement.scrollHeight - window.innerHeight;
      if(progress) progress.style.transform = `scaleX(${Math.min(1, y/Math.max(docH,1))})`;
      if(nav) nav.classList.toggle('scrolled', y > 70);
      if(bookingBar) bookingBar.classList.toggle('visible', y > window.innerHeight * 0.85);
      ticking = false;
    });
  };
  onScroll();
  window.addEventListener('scroll', onScroll, {passive:true});

  navToggle?.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(open));
  });
  $$('.nav-links a').forEach(a => a.addEventListener('click', () => {
    nav?.classList.remove('open');
    navToggle?.setAttribute('aria-expanded','false');
  }));

  // Reveal on scroll — any .reveal, .stagger, .scroll-3d, .clip-reveal
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => { if(e.isIntersecting){ e.target.classList.add('visible'); io.unobserve(e.target); } });
  }, {threshold:.12, rootMargin:'0px 0px -80px 0px'});
  $$('.reveal, .stagger, .scroll-3d, .clip-reveal').forEach(el => io.observe(el));

  // Text morph — cycles .morph-word siblings inside .morph-wrapper
  if(!reduced){
    $$('.morph-wrapper').forEach(wrap => {
      const words = $$('.morph-word', wrap);
      if(words.length < 2) return;
      let cur = 0;
      setInterval(() => {
        words[cur].classList.remove('active'); words[cur].classList.add('leaving');
        setTimeout(() => words[cur].classList.remove('leaving'), 500);
        cur = (cur + 1) % words.length;
        words[cur].classList.add('active');
      }, 3000);
    });
  }

  // Sticky pair pattern — [data-sticky] container with .sticky-list-item[data-i] + .sticky-slide[data-i]
  $$('[data-sticky]').forEach(root => {
    const items = $$('.sticky-list-item', root), slides = $$('.sticky-slide', root);
    const activate = i => {
      items.forEach(el=>el.classList.remove('active'));
      slides.forEach(el=>el.classList.remove('active'));
      items[i]?.classList.add('active'); slides[i]?.classList.add('active');
    };
    items.forEach((item,i) => { item.addEventListener('click', ()=>activate(i)); item.addEventListener('mouseenter', ()=>activate(i)); });
    if(!reduced){
      const obs = new IntersectionObserver(entries => {
        entries.forEach(e => { if(e.isIntersecting && e.intersectionRatio > .5) activate(parseInt(e.target.dataset.i,10)); });
      }, {threshold:[.5,.7], rootMargin:'-30% 0px -40% 0px'});
      items.forEach(item => obs.observe(item));
    }
  });

  // Custom cursor
  if(isDesktop && !reduced){
    const cursor = $('#cursor'), ring = $('#cursorRing');
    if(cursor && ring){
      let mx=0,my=0,rx=0,ry=0,visible=false;
      document.addEventListener('mousemove', e => {
        mx=e.clientX; my=e.clientY;
        cursor.style.transform = `translate(${mx}px, ${my}px)`;
        if(!visible){cursor.classList.add('visible');ring.classList.add('visible');visible=true}
      });
      document.addEventListener('mouseleave', () => { cursor.classList.remove('visible'); ring.classList.remove('visible'); visible=false; });
      const tick = () => { rx+=(mx-rx)*.16; ry+=(my-ry)*.16; ring.style.transform=`translate(${rx}px, ${ry}px)`; requestAnimationFrame(tick); };
      tick();
      $$('[data-cursor]').forEach(el => {
        const kind = el.dataset.cursor;
        el.addEventListener('mouseenter', () => {
          if(kind==='hover'){ cursor.classList.add('hover'); ring.classList.add('hidden'); }
          else if(kind==='hover-view'){ cursor.classList.add('hover-view'); cursor.setAttribute('data-label', el.dataset.cursorLabel||''); ring.classList.add('hidden'); }
        });
        el.addEventListener('mouseleave', () => { cursor.classList.remove('hover','hover-view'); cursor.removeAttribute('data-label'); ring.classList.remove('hidden'); });
      });
    }
  }

  // Magnetic buttons — .magnetic > .btn
  if(isDesktop && !reduced){
    $$('.magnetic').forEach(wrap => {
      const btn = wrap.querySelector('.btn'); if(!btn) return;
      let raf;
      wrap.addEventListener('mousemove', e => {
        const r = wrap.getBoundingClientRect();
        const x = (e.clientX-r.left-r.width/2)*.28, y = (e.clientY-r.top-r.height/2)*.35;
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(()=>{ btn.style.transform = `translate(${x}px, ${y-2}px)`; });
      });
      wrap.addEventListener('mouseleave', () => {
        cancelAnimationFrame(raf);
        btn.style.transition = 'transform 500ms cubic-bezier(.68,-.55,.27,1.55)';
        btn.style.transform = '';
        setTimeout(()=>{ btn.style.transition=''; }, 500);
      });
    });
  }

  // 3D tilt — [data-tilt]
  if(isDesktop && !reduced){
    $$('[data-tilt]').forEach(card => {
      let raf; const maxTilt = 10;
      card.addEventListener('mousemove', e => {
        const r = card.getBoundingClientRect();
        const px=(e.clientX-r.left)/r.width, py=(e.clientY-r.top)/r.height;
        const rx=(.5-py)*maxTilt*2, ry=(px-.5)*maxTilt*2;
        cancelAnimationFrame(raf); card.classList.add('tilting');
        raf = requestAnimationFrame(()=>{ card.style.transform = `perspective(1200px) rotateX(${rx}deg) rotateY(${ry}deg) scale(1.02)`; });
      });
      card.addEventListener('mouseleave', () => { cancelAnimationFrame(raf); card.classList.remove('tilting'); card.style.transform=''; });
    });
  }

  // 3D gallery — [data-gallery-3d] container with .gallery-3d-card children
  if(!reduced){
    $$('[data-gallery-3d]').forEach(gallery => {
      const cards = $$('.gallery-3d-card', gallery);
      const apply = () => {
        const rect = gallery.getBoundingClientRect(), cx = rect.left+rect.width/2;
        cards.forEach(card => {
          const c = card.getBoundingClientRect(), dist = (c.left+c.width/2-cx)/rect.width;
          const rotY = dist*28, scale = 1-Math.min(Math.abs(dist)*.15,.15), tz = -Math.abs(dist)*90;
          card.style.transform = `rotateY(${-rotY}deg) translateZ(${tz}px) scale(${scale})`;
        });
      };
      gallery.addEventListener('scroll', apply, {passive:true});
      window.addEventListener('resize', apply);
      apply();
    });
  }

  // Default date-fill for [data-checkin]/[data-checkout] pairs
  $$('[data-checkin]').forEach(ci => {
    const co = document.getElementById(ci.dataset.checkin);
    const coEl = document.getElementById(ci.id === '' ? '' : ci.dataset.checkoutId);
  });
  $$('input[type=date][data-autofill]').forEach(input => {
    const offset = parseInt(input.dataset.autofill, 10) || 0;
    const d = new Date(); d.setDate(d.getDate() + offset);
    input.value = d.toISOString().slice(0,10);
  });
})();
