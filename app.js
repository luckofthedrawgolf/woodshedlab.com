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

// --- Auth UI wiring (header) ---
import { supabase } from './supabase.js';

const authBtn  = document.querySelector('#auth-btn');
const userChip = document.querySelector('#user-chip');

async function refreshAuthUI() {
  const { data: { session } } = await supabase.auth.getSession();
  const user = session?.user;

  if (user) {
    // show "Sign out" and user email
    authBtn.textContent = 'Sign out';
    userChip.textContent = user.email;
    userChip.classList.remove('hidden');

    // ensure a profile row exists/updated
    await supabase.from('profiles').upsert(
      {
        id: user.id,
        full_name: user.user_metadata?.full_name || '',
        role: 'student'
      },
      { onConflict: 'id' }
    );
  } else {
    // show "Sign in"
    authBtn.textContent = 'Sign in';
    userChip.textContent = '';
    userChip.classList.add('hidden');
  }
}

// react to auth changes + run once on load
supabase.auth.onAuthStateChange(() => refreshAuthUI());
refreshAuthUI();

// clicking the button either opens the modal or signs out
authBtn.addEventListener('click', async (e) => {
  e.preventDefault();
  const { data: { session } } = await supabase.auth.getSession();
  if (session) {
    await supabase.auth.signOut();
  } else {
    // open your existing auth modal
    if (typeof ui === 'function') ui('open');
  }
});
// --- Cloudinary Upload + Supabase Save ---

// initialize upload button
const uploadBtn = document.getElementById('upload-btn');
if (uploadBtn) {
  uploadBtn.addEventListener('click', async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      alert('Please sign in first.');
      return;
    }

    const widget = cloudinary.createUploadWidget(
      {
        cloudName: 'degawkws3',
        uploadPreset: 'unsigned_upload',
        resourceType: 'video',
        multiple: false,
        folder: 'woodshedlab_uploads',
      },
      async (error, result) => {
        if (!error && result && result.event === 'success') {
          console.log('Upload successful:', result.info);

          // Save video info to Supabase
          const { data, error: dbError } = await supabase
            .from('videos')
            .insert([
              {
                uploader_id: user.id,
                title: result.info.original_filename,
                url: result.info.secure_url,
              },
            ]);

          if (dbError) {
            console.error('Error saving to Supabase:', dbError);
            alert('Video uploaded but not saved to database.');
          } else {
            alert('Video uploaded successfully!');
            location.reload();
          }
        }
      }
    );

    widget.open();
  });
}
// ----- Mobile/desktop auth button handling -----
const authBtns = ['#auth-btn', '#auth-btn-mobile']
  .map(sel => document.querySelector(sel))
  .filter(Boolean);

async function refreshAuthButtons() {
  const { data: { session } } = await supabase.auth.getSession();
  authBtns.forEach(btn => {
    btn.textContent = session?.user ? 'Sign out' : 'Sign in';
  });
}

authBtns.forEach(btn => {
  btn.addEventListener('click', async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      await supabase.auth.signOut();
      await refreshAuthButtons();
    } else {
      // open your existing auth modal
      document.getElementById('auth-modal')?.classList.remove('hidden');
      document.body.classList.remove('nav-open'); // close menu if it's open
    }
  });
});

refreshAuthButtons();

// ----- Mobile menu toggle (keeps panel on-screen) -----
const menuBtn   = document.querySelector('[data-menu-btn]') || document.querySelector('.hamburger');
const menuCloseEls = document.querySelectorAll('[data-menu-close], .nav-backdrop');

menuBtn?.addEventListener('click', () => {
  document.body.classList.add('nav-open');
});

menuCloseEls.forEach(el => el.addEventListener('click', () => {
  document.body.classList.remove('nav-open');
}));

