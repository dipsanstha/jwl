(function(){
  // Determine API base; overridden by data/config.json if present
  const isLocalhost = ['localhost','127.0.0.1'].includes(window.location.hostname);
  const isFile = window.location.protocol === 'file:';
  let API_BASE = (isLocalhost || isFile) ? 'http://localhost:3001' : window.location.origin;

  const grid = document.querySelector('.ornaments-grid');
  if (!grid) return; // nothing to do

  function createCard(img){
    const card = document.createElement('div');
    card.className = 'ornament-card visible';
    // Build safe image URL
    const makeSrc = (u) => {
      try{
        if (!u) return '';
        if (/^https?:\/\//i.test(u)) return u;
        return new URL(u, API_BASE).href;
      }catch(e){
        const joined = (u.startsWith('/') ? API_BASE + u : API_BASE + '/' + u);
        return joined.replace(/\s/g, '%20');
      }
    };
    const src = makeSrc(img.url);
    const title = img.title || 'Beautiful Ornament';
    const desc = img.description || '';
    const cat = (img.category || 'all').toString();
    card.innerHTML = `
      <div class="card-image">
        <img src="${src}" alt="${title}" onerror="this.onerror=null;this.src='${API_BASE}/static-images/photo.svg'">
      </div>
      <div class="card-content">
        <h3>${title}</h3>
        ${desc ? `<p>${desc}</p>` : ''}
        <span class="category-tag">${cat.charAt(0).toUpperCase() + cat.slice(1)}</span>
      </div>
    `;
    return card;
  }

  async function loadFromAPI(){
    try{
      const res = await fetch(`${API_BASE}/api/gallery`, { cache: 'no-cache' });
      if (!res.ok) throw new Error('Gallery API not available');
      const data = await res.json();
      const images = Array.isArray(data.images) ? data.images : [];
      if (!images.length){
        grid.innerHTML = '<div class="note">No items found yet.</div>';
        return;
      }
      grid.innerHTML = '';
      images.forEach(img => grid.appendChild(createCard(img)));
    }catch(err){
      const note = document.createElement('div');
      note.className = 'note';
      note.style.margin = '12px 0';
      note.style.color = '#b45309';
      note.textContent = 'Gallery is temporarily unavailable. Please try again shortly.';
      grid.appendChild(note);
    }
  }

  async function init(){
    try{
      const res = await fetch('data/config.json', { cache: 'no-cache' });
      if (res.ok){
        const cfg = await res.json();
        if (cfg && typeof cfg.apiBase === 'string' && cfg.apiBase.trim()){
          API_BASE = cfg.apiBase.trim().replace(/\/$/, '');
        }
      }
    }catch(e){ /* ignore */ }
    loadFromAPI();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
