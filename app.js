// Header becomes solid after scroll
const header = document.querySelector('[data-header]');
function onScroll(){ 
  if(window.scrollY > 24) header.classList.add('solid'); 
  else header.classList.remove('solid');
}
onScroll(); window.addEventListener('scroll', onScroll);

// Mobile drawer
const menuBtn = document.querySelector('[data-menu-btn]');
const drawer = document.querySelector('[data-drawer]');
if (menuBtn && drawer){
  menuBtn.addEventListener('click', ()=> drawer.classList.toggle('open'));
}

// Hero video: fade in after ~1s if file exists
const heroVideo = document.querySelector('[data-hero-video]');
setTimeout(()=> {
  if (heroVideo) heroVideo.addEventListener('loadeddata', ()=> heroVideo.style.opacity = '1');
  // If video is blocked/missing, we just keep the gradient/poster
  if (heroVideo && heroVideo.readyState >= 2) heroVideo.style.opacity = '1';
}, 900);

// Scroll reveal
const io = new IntersectionObserver((entries)=>{
  entries.forEach(e=>{
    if(e.isIntersecting){ e.target.classList.add('is-visible'); io.unobserve(e.target); }
  });
},{ threshold: 0.12 });

document.querySelectorAll('.section, .cta-row, .footer-grid').forEach(el=>{
  el.classList.add('reveal'); io.observe(el);
});

// Footer year
const y = document.getElementById('year'); if (y) y.textContent = new Date().getFullYear();
