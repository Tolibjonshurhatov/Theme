// Maps each bundled file to a category + display name.
// Add new wallpapers here after dropping the image file into /wallpapers.
const CATALOG = {
  'nightfall-gt.jpg':  { cat: 'cars',     name: 'Nightfall GT' },
  'chrome-curve.jpg':  { cat: 'cars',     name: 'Chrome Curve' },
  'pine-ridge.jpg':    { cat: 'nature',   name: 'Pine Ridge' },
  'fog-valley.jpg':    { cat: 'nature',   name: 'Fog Valley' },
  'fluid-motion.jpg':  { cat: 'abstract', name: 'Fluid Motion' },
  'soft-noise.jpg':    { cat: 'abstract', name: 'Soft Noise' },
  'bare-grid.jpg':     { cat: 'minimal',  name: 'Bare Grid' },
  'quiet-frame.jpg':   { cat: 'minimal',  name: 'Quiet Frame' },
  'deep-field.jpg':    { cat: 'space',    name: 'Deep Field' },
  'orbit-line.jpg':    { cat: 'space',    name: 'Orbit Line' },
  'concrete-line.jpg': { cat: 'arch',     name: 'Concrete Line' },
  'glass-facade.jpg':  { cat: 'arch',     name: 'Glass Facade' },
};

const CAT_LABELS = {
  all: 'Hammasi', cars: 'Mashinalar', nature: 'Tabiat', abstract: 'Abstrakt',
  minimal: 'Minimal', space: 'Kosmos', arch: 'Arxitektura',
};

let wallpapers = [];   // [{file, absolutePath, fileUrl, cat, name}]
let activeCat = 'all';
let selectedScope = 'all';
let pendingWallpaper = null;

const grid = document.getElementById('grid');
const sectionTitle = document.getElementById('sectionTitle');
const sectionCount = document.getElementById('sectionCount');
const modalOverlay = document.getElementById('modalOverlay');
const modalImg = document.getElementById('modalImg');
const modalName = document.getElementById('modalName');
const toast = document.getElementById('toast');

async function init() {
  const list = await window.aurora.listWallpapers();
  wallpapers = list.map(w => ({
    ...w,
    cat: CATALOG[w.file]?.cat || 'minimal',
    name: CATALOG[w.file]?.name || w.file,
  }));
  render();
}

function render() {
  const items = wallpapers.filter(w => activeCat === 'all' || w.cat === activeCat);
  sectionTitle.textContent = CAT_LABELS[activeCat];
  sectionCount.textContent = `${items.length} ta wallpaper`;
  grid.innerHTML = '';
  items.forEach(w => {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <img src="${w.fileUrl}" loading="lazy">
      <div class="shade"></div>
      <button class="apply-btn">O'rnatish</button>
      <div class="meta"><div class="name">${w.name}</div></div>
    `;
    card.addEventListener('click', () => openModal(w));
    grid.appendChild(card);
  });
}

document.querySelectorAll('.cat-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    activeCat = btn.dataset.cat;
    render();
  });
});

function openModal(w) {
  pendingWallpaper = w;
  modalImg.src = w.fileUrl;
  modalName.textContent = w.name;
  modalOverlay.classList.add('show');
}

document.getElementById('cancelBtn').addEventListener('click', () => {
  modalOverlay.classList.remove('show');
});

document.querySelectorAll('.scope-opt').forEach(opt => {
  opt.addEventListener('click', () => {
    document.querySelectorAll('.scope-opt').forEach(o => o.classList.remove('selected'));
    opt.classList.add('selected');
    selectedScope = opt.dataset.scope;
  });
});

document.getElementById('applyBtn').addEventListener('click', async () => {
  if (!pendingWallpaper) return;
  const btn = document.getElementById('applyBtn');
  btn.textContent = "O'rnatilmoqda...";
  btn.disabled = true;

  const result = await window.aurora.setWallpaper(pendingWallpaper.absolutePath, selectedScope);

  btn.textContent = "O'rnatish";
  btn.disabled = false;
  modalOverlay.classList.remove('show');

  if (result.ok) {
    showToast(`"${pendingWallpaper.name}" o'rnatildi ✓`);
  } else {
    showToast('Xatolik yuz berdi: ' + result.error);
  }
});

function showToast(msg) {
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2600);
}

init();
