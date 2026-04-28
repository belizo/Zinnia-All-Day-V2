/* ════════════════════════════════════════════════════════
   ZINNIA ALL DAY — app.js v4
   • Real Zinnia TV video data + CDN thumbnails
   • Distinct per-playlist colors (12-color palette)
   • Scheduled items visually greyed-out in Available panel
   • Queue + Calendar are ONE data source (playQueue)
   • No Vimeo API config
════════════════════════════════════════════════════════ */

// ─────────────────────────────────── CONSTANTS

const DAYS = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];

const GENRES = [
  'Daily Living','Animals','Caregiver Education','Exercise & Meditation',
  'Faith','Fun & Games','Holidays','Interests','Nature','Quizzes','Travel',
];

// 12 visually distinct colors — each new playlist gets the next one
const PL_COLORS = [
  '#3a7dc9', // blue
  '#2ea07b', // teal
  '#d46b2f', // amber
  '#8b4fba', // purple
  '#c94040', // red
  '#4a9e5c', // green
  '#b05090', // pink
  '#4e7ab5', // steel blue
  '#c8882a', // gold
  '#5a6ea8', // indigo
  '#3a9e9e', // cyan
  '#a05a30', // brown
];

const GENRE_BG = {
  'Daily Living':        '#cfe0f5',
  'Animals':             '#cff0d8',
  'Caregiver Education': '#fce0c8',
  'Exercise & Meditation':'#e4d6f5',
  'Faith':               '#fdefc8',
  'Fun & Games':         '#ffd6e0',
  'Holidays':            '#d6f0fa',
  'Interests':           '#e8f5d0',
  'Nature':              '#c8f0e0',
  'Quizzes':             '#fce8d0',
  'Travel':              '#d0e8f8',
};

// ─────────────────────────────────── REAL ZINNIA VIDEO DATA
// Thumbnails from Zinnia's public CDN (vhx.imgix.net)

const ZINNIA_VIDEOS = [
  // ── Daily Living ──
  {
    id:'z01', title:'Good Morning',
    duration:'5:13', genre:'Daily Living',
    thumb:'https://vhx.imgix.net/zinniatv1/assets/20aeb1e5-f36d-4a88-93f5-c738493d9949?auto=format%2Ccompress&fit=crop&h=360&q=70&w=640',
    desc:'Wake up slowly, watching people go through their morning routines.'
  },
  {
    id:'z02', title:'Drink Water',
    duration:'8:27', genre:'Daily Living',
    thumb:'https://vhx.imgix.net/zinniatv1/assets/a43eb938-98a3-4499-9260-443992bea252.jpeg?auto=format%2Ccompress&fit=crop&h=360&q=70&w=640',
    desc:'The best cue to stay hydrated is watching others do it.'
  },
  {
    id:'z03', title:'Bedtime Wind Down',
    duration:'10:00', genre:'Daily Living',
    thumb:'https://vhx.imgix.net/zinniatv1/assets/b2270a05-6c38-4223-8961-15b084e15534?auto=format%2Ccompress&fit=crop&h=360&q=70&w=640',
    desc:'A soothing end to the day — wind down, get washed up, prepare for sleep.'
  },
  {
    id:'z04', title:'Coffee',
    duration:'9:59', genre:'Daily Living',
    thumb:'https://vhx.imgix.net/zinniatv1/assets/209f5a2f-f728-4a06-a3ea-b2466dc78dc9.jpeg?auto=format%2Ccompress&fit=crop&h=360&q=70&w=640',
    desc:'From bean to barista to belly — a celebration of the world\'s favorite morning ritual.'
  },
  // ── Animals ──
  {
    id:'z05', title:'People and Pets',
    duration:'9:59', genre:'Animals',
    thumb:'https://vhx.imgix.net/zinniatv1/assets/f7174d07-2d65-4cc2-adc5-6b20aac1cc01?auto=format%2Ccompress&fit=crop&h=360&q=70&w=640',
    desc:'People interacting with dogs, cats, horses, bunnies — even a lizard!'
  },
  {
    id:'z06', title:'Baby Animals',
    duration:'10:14', genre:'Animals',
    thumb:'https://vhx.imgix.net/zinniatv1/assets/db40b8c9-ec28-453a-8589-6cabf113fed5?auto=format%2Ccompress&fit=crop&h=360&q=70&w=640',
    desc:'Adorable baby animals exploring the world for the first time.'
  },
  {
    id:'z07', title:'African Safari',
    duration:'10:00', genre:'Animals',
    thumb:'https://vhx.imgix.net/zinniatv1/assets/62450d11-dc78-40fd-aed2-76cbeebe50d3?auto=format%2Ccompress&fit=crop&h=360&q=70&w=640',
    desc:'Get close to thriving wildlife — a treat for animal lovers!'
  },
  {
    id:'z08', title:'Undersea Creatures',
    duration:'10:27', genre:'Animals',
    thumb:'https://vhx.imgix.net/zinniatv1/assets/c143e815-aee2-46da-a46c-e8727661a3ba?auto=format%2Ccompress&fit=crop&h=360&q=70&w=640',
    desc:'Visit coral reefs and seabeds — manta rays, seahorses and more.'
  },
  // ── Nature ──
  {
    id:'z09', title:'Spring Flowers',
    duration:'17:23', genre:'Nature',
    thumb:'https://vhx.imgix.net/zinniatv1/assets/6166cae7-1b63-4fda-a0a1-1fa72b826463?auto=format%2Ccompress&fit=crop&h=360&q=70&w=640',
    desc:'Tulips, pansies, daffodils and more stunning spring varieties.'
  },
  {
    id:'z10', title:'Mountains',
    duration:'9:58', genre:'Nature',
    thumb:'https://vhx.imgix.net/zinniatv1/assets/5bade8c6-6e42-4903-b9fa-1eb33d4497d5.jpeg?auto=format%2Ccompress&fit=crop&h=360&q=70&w=640',
    desc:'Sweeping mountain vistas from around the world.'
  },
  {
    id:'z11', title:'Life of the Butterfly',
    duration:'12:00', genre:'Nature',
    thumb:'https://vhx.imgix.net/zinniatv1/assets/1de8c4e3-9263-4eb0-bdb8-afc15caba7c9.png?auto=format%2Ccompress&fit=crop&h=360&q=70&w=640',
    desc:'The miraculous journey from caterpillar to butterfly.'
  },
  // ── Travel ──
  {
    id:'z12', title:'Hawaiian Breeze',
    duration:'21:39', genre:'Travel',
    thumb:'https://vhx.imgix.net/zinniatv1/assets/1982a963-2518-42fd-9870-27d1e28a1edf?auto=format%2Ccompress&fit=crop&h=360&q=70&w=640',
    desc:'Soak up the vibe of the Hawaiian Islands — wildlife, beaches and island culture.'
  },
  {
    id:'z13', title:'Outdoor Recreation',
    duration:'10:00', genre:'Travel',
    thumb:'https://vhx.imgix.net/zinniatv1/assets/561ebf77-a4fd-4887-851b-dbf90a4ee40c?auto=format%2Ccompress&fit=crop&h=360&q=70&w=640',
    desc:'Hiking, camping, fishing, boating and roasting dinner on an open fire.'
  },
  // ── Interests ──
  {
    id:'z14', title:'Sewing',
    duration:'10:01', genre:'Interests',
    thumb:'https://vhx.imgix.net/zinniatv1/assets/b2270a05-6c38-4223-8961-15b084e15534?auto=format%2Ccompress&fit=crop&h=360&q=70&w=640',
    desc:'Watch people sew all kinds of projects, from dresses to dress suits.'
  },
  {
    id:'z15', title:'Baking',
    duration:'11:30', genre:'Interests',
    thumb:'https://vhx.imgix.net/zinniatv1/assets/209f5a2f-f728-4a06-a3ea-b2466dc78dc9.jpeg?auto=format%2Ccompress&fit=crop&h=360&q=70&w=640',
    desc:'The joy of beloved baking activities — measuring, mixing, and the warm smell of the oven.'
  },
  // ── Faith ──
  {
    id:'z16', title:'Faith and Gratitude',
    duration:'3:21', genre:'Faith',
    thumb:'https://vhx.imgix.net/zinniatv1/assets/79e11f84-f814-4bac-b39e-5185f99bf7a5?auto=format%2Ccompress&fit=crop&h=360&q=70&w=640',
    desc:'Share in the joy of people feeling spiritual faith and gratitude.'
  },
  // ── Fun & Games ──
  {
    id:'z17', title:'Just Fun',
    duration:'10:00', genre:'Fun & Games',
    thumb:'https://vhx.imgix.net/zinniatv1/assets/561ebf77-a4fd-4887-851b-dbf90a4ee40c?auto=format%2Ccompress&fit=crop&h=360&q=70&w=640',
    desc:'Daily laughter — people and animals being silly and having fun.'
  },
  // ── Quizzes ──
  {
    id:'z18', title:'US Presidents Quiz',
    duration:'16:49', genre:'Quizzes',
    thumb:'https://vhx.imgix.net/zinniatv1/assets/86e5af0d-9055-4941-847f-4d33e0b75115?auto=format%2Ccompress&fit=crop&h=360&q=70&w=640',
    desc:'How many presidents can you name? A fun, gentle challenge.'
  },
  // ── Caregiver Education ──
  {
    id:'z19', title:'Welcome to Zinnia',
    duration:'1:54', genre:'Caregiver Education',
    thumb:'https://vhx.imgix.net/zinniatv1/assets/1de8c4e3-9263-4eb0-bdb8-afc15caba7c9.png?auto=format%2Ccompress&fit=crop&h=360&q=70&w=640',
    desc:'An introduction to Zinnia — better programming for people living with dementia.'
  },
  // ── Exercise & Meditation ──
  {
    id:'z20', title:'Gentle Morning Stretch',
    duration:'12:00', genre:'Exercise & Meditation',
    thumb:'https://vhx.imgix.net/zinniatv1/assets/20aeb1e5-f36d-4a88-93f5-c738493d9949?auto=format%2Ccompress&fit=crop&h=360&q=70&w=640',
    desc:'Easy, seated stretches to start the day feeling good.'
  },
];

// ─────────────────────────────────── STATE

const state = {
  videos:           ZINNIA_VIDEOS,
  filteredVideos:   [...ZINNIA_VIDEOS],
  selectedVideoIds: new Set(),
  playlists:    JSON.parse(localStorage.getItem('zinnia_playlists') || '[]'),
  activePlaylistId: null,
  currentGenre: 'All',
  // Single source of truth for BOTH queue view and calendar view
  // Each item: { plId, day: '' | '0'–'6', time: 'HH:MM' | '' }
  playQueue:    JSON.parse(localStorage.getItem('zinnia_queue_v4') || '[]'),
  currentWeekStart: getWeekStart(new Date()),
  editingPlaylistId: null,
  editVideos:   [],
  queue:        [], // flat video list for player
  currentPlayerIdx: 0,
  isPlaying:    false,
  progressTimer: null,
  progressPct:  0,
  timePickerIdx: null,
};

// ─────────────────────────────────── BOOT

document.addEventListener('DOMContentLoaded', () => {
  migrateOldQueue();
  renderVideoGrid();
  renderPlaylists();
  renderBrowsePage();
  renderQueueSchedule();
  renderSchedule();
});

function migrateOldQueue() {
  // Migrate from v3 key if present
  const old = localStorage.getItem('zinnia_queue_v3');
  if (old && !localStorage.getItem('zinnia_queue_v4')) {
    localStorage.setItem('zinnia_queue_v4', old);
    state.playQueue = JSON.parse(old);
  }
}

// ─────────────────────────────────── PAGE NAVIGATION

function showPage(name) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById('page-' + name)?.classList.add('active');
  document.querySelectorAll('.nav-links a').forEach(a => {
    a.classList.remove('active');
    if (a.dataset.page === name) a.classList.add('active');
  });
  // Always refresh both schedule views from shared state
  if (name === 'schedule')       { renderSchedule(); renderQueueSchedule(); }
  if (name === 'queue-schedule') { renderQueueSchedule(); renderDayCols(); }
  if (name === 'player')         { renderPlayerPage(); }
  if (name === 'browse')         { renderBrowsePage(); }
  if (name === 'playlists')      { renderPlaylists(); renderVideoGrid(); }
}

// ─────────────────────────────────── VIDEO GRID

function renderVideoGrid() {
  const grid = document.getElementById('videoGrid');
  grid.innerHTML = '';
  if (state.filteredVideos.length === 0) {
    const d = document.createElement('div');
    d.className = 'empty-card';
    d.innerHTML = '<p style="color:var(--muted)">No videos match your filter.</p>';
    grid.appendChild(d);
    return;
  }
  state.filteredVideos.forEach(v => grid.appendChild(createVideoCard(v)));
}

function createVideoCard(video) {
  const sel = state.selectedVideoIds.has(video.id);
  const card = document.createElement('div');
  card.className = 'video-card' + (sel ? ' selected' : '');
  card.onclick = () => toggleVideoSelect(video);
  card.innerHTML = `
    <div class="video-thumb">
      <img src="${esc(video.thumb)}" alt="${esc(video.title)}" loading="lazy"
           onerror="this.style.display='none'" />
      <div class="thumb-overlay">
        <div class="thumb-play">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="#072843"><polygon points="5 3 19 12 5 21 5 3"/></svg>
        </div>
        ${sel ? `<div class="selected-check"><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg></div>` : ''}
      </div>
    </div>
    <div class="video-meta">
      <h4>${esc(video.title)}</h4>
      <p class="duration">${video.duration}</p>
      <span class="genre-tag">${esc(video.genre)}</span>
    </div>`;
  return card;
}

function toggleVideoSelect(video) {
  if (state.selectedVideoIds.has(video.id)) state.selectedVideoIds.delete(video.id);
  else state.selectedVideoIds.add(video.id);
  updateSelectedUI();
  renderVideoGrid();
}

function removeFromSelection(id) {
  state.selectedVideoIds.delete(id);
  updateSelectedUI();
  renderVideoGrid();
}

function updateSelectedUI() {
  const count = state.selectedVideoIds.size;
  document.getElementById('selectedBadge').style.display = count ? 'inline-flex' : 'none';
  document.getElementById('selectedCount').textContent = count;
  const list = document.getElementById('selectedVideosList');
  const msg  = document.getElementById('noSelectionMsg');
  list.innerHTML = '';
  const selected = state.videos.filter(v => state.selectedVideoIds.has(v.id));
  msg.style.display = selected.length ? 'none' : '';
  selected.forEach(v => {
    const d = document.createElement('div');
    d.className = 'sel-vid-item';
    d.innerHTML = `
      <img src="${esc(v.thumb)}" alt="" onerror="this.style.display='none'" />
      <span style="flex:1;line-height:1.3">${esc(v.title)}</span>
      <button class="remove-btn" onclick="event.stopPropagation();removeFromSelection('${v.id}')">
        <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        Remove
      </button>`;
    list.appendChild(d);
  });
}

// ─────────────────────────────────── GENRE FILTER

function selectGenre(btn, genre) {
  document.querySelectorAll('#genrePills .pill').forEach(p => p.classList.remove('active'));
  btn.classList.add('active');
  state.currentGenre = genre;
  filterVideos();
}

function filterVideos() {
  const q = (document.getElementById('videoSearch')?.value || '').toLowerCase();
  state.filteredVideos = state.videos.filter(v => {
    const genreOk = state.currentGenre === 'All' || v.genre === state.currentGenre;
    const textOk  = !q || v.title.toLowerCase().includes(q) || v.genre.toLowerCase().includes(q);
    return genreOk && textOk;
  });
  renderVideoGrid();
}

// ─────────────────────────────────── PLAYLISTS

function openSaveModal() {
  document.getElementById('playlistNameInput').value = '';
  document.getElementById('saveModal').classList.add('open');
  setTimeout(() => document.getElementById('playlistNameInput').focus(), 40);
}
function closeSaveModal() { document.getElementById('saveModal').classList.remove('open'); }

function savePlaylist() {
  const name = document.getElementById('playlistNameInput').value.trim();
  if (!name) { showToast('Please enter a playlist name'); return; }
  if (!state.selectedVideoIds.size) { showToast('Select at least one video first'); return; }
  const videos = state.videos.filter(v => state.selectedVideoIds.has(v.id));
  const color  = PL_COLORS[state.playlists.length % PL_COLORS.length];
  const pl = { id: 'pl_' + Date.now(), name, videos, color, createdAt: new Date().toISOString() };
  state.playlists.push(pl);
  persistPlaylists();
  renderPlaylists();
  closeSaveModal();
  state.selectedVideoIds.clear();
  updateSelectedUI();
  renderVideoGrid();
  showToast(`"${name}" saved — ${videos.length} video${videos.length !== 1 ? 's' : ''}`);
}

function persistPlaylists() {
  localStorage.setItem('zinnia_playlists', JSON.stringify(state.playlists));
}

function renderPlaylists() {
  const list = document.getElementById('playlistList');
  list.innerHTML = '';
  if (!state.playlists.length) {
    list.innerHTML = '<p class="empty-msg" style="padding:6px 0">No playlists yet. Select videos above and save.</p>';
    return;
  }
  state.playlists.forEach(pl => {
    const qItem = state.playQueue.find(i => i.plId === pl.id);
    const isScheduled = qItem && qItem.time;
    const item = document.createElement('div');
    item.className = 'playlist-item';
    item.style.background = pl.color;
    item.onclick = () => loadPlaylistIntoSelection(pl.id);
    item.innerHTML = `
      <div style="flex:1;min-width:0">
        <div class="pl-name">${esc(pl.name)}</div>
        <div class="pl-meta">${pl.videos.length} video${pl.videos.length !== 1 ? 's' : ''}
          ${isScheduled ? `<span class="pl-scheduled-badge" style="margin-left:5px">
            <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            ${qItem.day === '' ? 'Every Day' : DAYS[parseInt(qItem.day)].slice(0,3)} ${formatTime12(qItem.time)}
          </span>` : ''}
        </div>
      </div>
      <div class="pl-actions">
        <button class="pl-btn" onclick="event.stopPropagation();openEditModal('${pl.id}')">
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
          Edit
        </button>
        <button class="pl-btn" onclick="event.stopPropagation();deletePlaylist('${pl.id}')">
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/></svg>
          Delete
        </button>
      </div>`;
    list.appendChild(item);
  });
}

function loadPlaylistIntoSelection(id) {
  const pl = state.playlists.find(p => p.id === id);
  if (!pl) return;
  state.selectedVideoIds = new Set(pl.videos.map(v => v.id));
  updateSelectedUI();
  renderVideoGrid();
  showToast(`"${pl.name}" loaded into selection`);
}

function deletePlaylist(id) {
  const pl = state.playlists.find(p => p.id === id);
  if (!pl || !confirm(`Delete "${pl.name}"?`)) return;
  state.playlists  = state.playlists.filter(p => p.id !== id);
  state.playQueue  = state.playQueue.filter(i => i.plId !== id);
  persistPlaylists();
  saveQueue();
  renderPlaylists();
  renderQueueSchedule();
  renderDayCols();
  renderSchedulePlaylists();
  showToast('Playlist deleted');
}

// ─────────────────────────────────── EDIT MODAL

let editDragSrcIdx = null;

function openEditModal(id) {
  const pl = state.playlists.find(p => p.id === id);
  if (!pl) return;
  state.editingPlaylistId = id;
  state.editVideos = pl.videos.map(v => ({ ...v }));
  document.getElementById('editModalDot').style.background = pl.color;
  document.getElementById('editPlaylistName').value = pl.name;
  renderEditList();
  renderEditAvailable();
  document.getElementById('editModal').classList.add('open');
}
function closeEditModal() {
  document.getElementById('editModal').classList.remove('open');
  state.editingPlaylistId = null;
  state.editVideos = [];
}

function renderEditList() {
  const el = document.getElementById('editPlaylistVideos');
  el.innerHTML = '';
  const count = state.editVideos.length;
  document.getElementById('editVideoCount').textContent = `${count} video${count !== 1 ? 's' : ''}`;
  if (!count) { el.innerHTML = '<p class="empty-msg">No videos yet.</p>'; return; }
  state.editVideos.forEach((v, idx) => {
    const row = document.createElement('div');
    row.className = 'ev-item';
    row.draggable = true;
    row.dataset.idx = idx;
    row.innerHTML = `
      <span class="ev-handle" title="Drag to reorder">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="9" y1="6" x2="15" y2="6"/><line x1="9" y1="12" x2="15" y2="12"/><line x1="9" y1="18" x2="15" y2="18"/></svg>
      </span>
      <img src="${esc(v.thumb)}" alt="" onerror="this.style.display='none'" />
      <span class="ev-title">${esc(v.title)}</span>
      <span class="ev-dur">${v.duration}</span>
      <button class="ev-remove" onclick="removeFromEditList(${idx})">
        <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        Remove
      </button>`;
    row.addEventListener('dragstart', e => { editDragSrcIdx = idx; row.classList.add('dragging-ev'); e.dataTransfer.effectAllowed='move'; });
    row.addEventListener('dragend',   () => { row.classList.remove('dragging-ev'); editDragSrcIdx = null; });
    row.addEventListener('dragover',  e => { e.preventDefault(); row.classList.add('drag-over-ev'); });
    row.addEventListener('dragleave', () => row.classList.remove('drag-over-ev'));
    row.addEventListener('drop', e => {
      e.preventDefault(); row.classList.remove('drag-over-ev');
      if (editDragSrcIdx !== null && editDragSrcIdx !== idx) {
        const moved = state.editVideos.splice(editDragSrcIdx, 1)[0];
        state.editVideos.splice(idx, 0, moved);
        renderEditList();
      }
    });
    el.appendChild(row);
  });
}

function removeFromEditList(idx) { state.editVideos.splice(idx,1); renderEditList(); renderEditAvailable(); }

function renderEditAvailable() {
  const el = document.getElementById('editAvailableVideos');
  const q  = (document.getElementById('editSearch')?.value || '').toLowerCase();
  el.innerHTML = '';
  const inIds = new Set(state.editVideos.map(v => v.id));
  const filtered = state.videos.filter(v => !q || v.title.toLowerCase().includes(q));
  if (!filtered.length) { el.innerHTML = '<p class="empty-msg">No videos found.</p>'; return; }
  filtered.forEach(v => {
    const already = inIds.has(v.id);
    const row = document.createElement('div');
    row.className = 'ev-add-item' + (already ? ' already-in' : '');
    row.innerHTML = `
      <img src="${esc(v.thumb)}" alt="" onerror="this.style.display='none'" />
      <span class="ev-title">${esc(v.title)}</span>
      <span class="ev-dur">${v.duration}</span>
      <button class="ev-add-btn" ${already ? 'disabled' : ''} onclick="addToEditList('${v.id}')">
        ${already
          ? `<svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg> Added`
          : `<svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg> Add`}
      </button>`;
    el.appendChild(row);
  });
}

function addToEditList(videoId) {
  if (state.editVideos.find(v => v.id === videoId)) { showToast('Already in playlist'); return; }
  const v = state.videos.find(v => v.id === videoId);
  if (v) { state.editVideos.push({ ...v }); renderEditList(); renderEditAvailable(); }
}
function filterEditVideos() { renderEditAvailable(); }

function saveEditedPlaylist() {
  const pl = state.playlists.find(p => p.id === state.editingPlaylistId);
  if (!pl) return;
  pl.name   = document.getElementById('editPlaylistName').value.trim() || pl.name;
  pl.videos = state.editVideos;
  persistPlaylists();
  renderPlaylists();
  renderSchedulePlaylists();
  renderQueueSchedule();
  closeEditModal();
  showToast(`"${pl.name}" updated`);
}

// ─────────────────────────────────── QUEUE SCHEDULE (PRIMARY VIEW)

let qsDragFromPlId   = null;
let qsDragFromQueueIdx = null;

function renderQueueSchedule() {
  renderQsAvailable();
  renderQsQueue();
  renderQsSummary();
}

function renderQsAvailable() {
  const el   = document.getElementById('qsAvailable');
  const noEl = document.getElementById('qsNoPlaylists');
  if (!el) return;
  el.innerHTML = '';
  if (!state.playlists.length) { if (noEl) noEl.style.display = ''; return; }
  if (noEl) noEl.style.display = 'none';

  state.playlists.forEach(pl => {
    const inQueue = state.playQueue.some(i => i.plId === pl.id);
    const chip = document.createElement('div');
    chip.className = 'qs-chip' + (inQueue ? ' already-queued' : '');
    chip.style.background = pl.color;
    chip.draggable = !inQueue;
    chip.title = inQueue ? 'Already in queue' : 'Drag or click + Add';

    // Show scheduled time if set
    const qItem = state.playQueue.find(i => i.plId === pl.id);
    const schedLabel = (qItem && qItem.time)
      ? `<span style="font-size:0.68rem;opacity:0.9;margin-top:2px;display:block">
           <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="vertical-align:-1px"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
           ${qItem.day === '' ? 'Every Day' : DAYS[parseInt(qItem.day)].slice(0,3)} · ${formatTime12(qItem.time)}
         </span>` : '';

    chip.innerHTML = `
      <svg class="qs-chip-drag" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.75)" stroke-width="2">
        <line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/>
      </svg>
      <div style="flex:1;min-width:0;overflow:hidden">
        <div style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${esc(pl.name)}</div>
        <div style="font-size:0.7rem;font-weight:400;opacity:0.85;margin-top:1px">${pl.videos.length} video${pl.videos.length !== 1 ? 's' : ''}${inQueue ? ' · in queue' : ''}</div>
        ${schedLabel}
      </div>
      <button class="qs-chip-add" ${inQueue ? 'disabled' : ''} onclick="event.stopPropagation();addToQueue('${pl.id}')">
        ${inQueue
          ? `<svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg> Added`
          : `<svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg> Add`}
      </button>`;

    if (!inQueue) {
      chip.addEventListener('dragstart', e => {
        qsDragFromPlId = pl.id; qsDragFromQueueIdx = null;
        chip.classList.add('dragging');
        e.dataTransfer.setData('qsPlId', pl.id);
      });
      chip.addEventListener('dragend', () => { chip.classList.remove('dragging'); qsDragFromPlId = null; });
    }
    el.appendChild(chip);
  });
}

function addToQueue(plId) {
  if (state.playQueue.some(i => i.plId === plId)) { showToast('Already in queue'); return; }
  state.playQueue.push({ plId, day: '', time: '' });
  saveQueue();
  renderQueueSchedule();
  const pl = state.playlists.find(p => p.id === plId);
  showToast(`"${pl?.name}" added to queue`);
}

function renderQsQueue() {
  const list     = document.getElementById('qsQueueList');
  const emptyEl  = document.getElementById('qsEmptyMsg');
  const clearBtn = document.getElementById('clearQueueBtn');
  list.innerHTML = '';
  if (clearBtn) clearBtn.style.display = state.playQueue.length ? 'inline-flex' : 'none';

  if (!state.playQueue.length) {
    if (emptyEl) { list.appendChild(emptyEl); emptyEl.style.display = ''; }
    setupQsDropzone(list);
    return;
  }
  if (emptyEl) emptyEl.style.display = 'none';
  setupQsDropzone(list);

  state.playQueue.forEach((item, idx) => {
    const pl = state.playlists.find(p => p.id === item.plId);
    if (!pl) return;
    const row = document.createElement('div');
    row.className = 'qs-queue-item';
    row.style.background = pl.color;
    row.draggable = true;
    row.dataset.idx = idx;

    let timeBadge = '';
    if (item.day !== '' || item.time) {
      const parts = [
        item.day === '' && item.time ? 'Every Day' : (item.day !== '' ? DAYS[parseInt(item.day)].slice(0,3) : ''),
        item.time ? formatTime12(item.time) : '',
      ].filter(Boolean).join(' · ');
      timeBadge = `<span class="qs-item-time-badge">
        <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
        ${esc(parts)}
      </span>`;
    }

    row.innerHTML = `
      <span class="drag-handle" title="Drag to reorder">⠿</span>
      <div class="qs-item-info">
        <div class="qs-item-name">${esc(pl.name)}</div>
        <div class="qs-item-meta">
          <span>${pl.videos.length} video${pl.videos.length !== 1 ? 's' : ''}</span>
          ${timeBadge}
        </div>
      </div>
      <div class="qs-item-actions">
        <button class="qs-item-btn" onclick="event.stopPropagation();openTimePicker(${idx})" title="Set day & time">
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          Time
        </button>
        <button class="qs-item-btn remove" onclick="event.stopPropagation();removeFromQueue(${idx})" title="Remove">
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          Remove
        </button>
      </div>`;

    row.addEventListener('dragstart', e => {
      qsDragFromQueueIdx = idx; qsDragFromPlId = null;
      row.classList.add('dragging');
      e.dataTransfer.setData('qsQueueIdx', idx);
    });
    row.addEventListener('dragend', () => { row.classList.remove('dragging'); qsDragFromQueueIdx = null; });
    row.addEventListener('dragover', e => {
      e.preventDefault();
      document.querySelectorAll('.qs-queue-item').forEach(r => r.style.borderTop = '');
      row.style.borderTop = '3px solid rgba(255,255,255,0.75)';
    });
    row.addEventListener('dragleave', () => row.style.borderTop = '');
    row.addEventListener('drop', e => {
      e.preventDefault();
      row.style.borderTop = '';
      const fromPlId = e.dataTransfer.getData('qsPlId');
      const fromIdx  = e.dataTransfer.getData('qsQueueIdx');
      if (fromPlId) {
        if (!state.playQueue.some(i => i.plId === fromPlId)) {
          state.playQueue.splice(idx, 0, { plId: fromPlId, day: '', time: '' });
          saveQueue(); renderQueueSchedule();
        }
      } else if (fromIdx !== '') {
        const fi = parseInt(fromIdx);
        if (!isNaN(fi) && fi !== idx) {
          const moved = state.playQueue.splice(fi, 1)[0];
          state.playQueue.splice(idx, 0, moved);
          saveQueue(); renderQsQueue(); renderQsSummary();
        }
      }
    });
    list.appendChild(row);
  });
}

function setupQsDropzone(list) {
  list.addEventListener('dragover', e => { e.preventDefault(); list.classList.add('drag-over'); });
  list.addEventListener('dragleave', e => { if (!list.contains(e.relatedTarget)) list.classList.remove('drag-over'); });
  list.addEventListener('drop', e => {
    e.preventDefault(); list.classList.remove('drag-over');
    const plId = e.dataTransfer.getData('qsPlId');
    if (plId && !state.playQueue.some(i => i.plId === plId)) {
      state.playQueue.push({ plId, day: '', time: '' });
      saveQueue(); renderQueueSchedule();
    }
  });
}

function removeFromQueue(idx) {
  state.playQueue.splice(idx, 1);
  saveQueue();
  renderQueueSchedule();
  renderDayCols();
  renderSchedulePlaylists();
}

function clearQueue() {
  if (!state.playQueue.length || !confirm('Clear all items from the queue?')) return;
  state.playQueue = [];
  saveQueue();
  renderQueueSchedule();
  renderDayCols();
  renderSchedulePlaylists();
  showToast('Queue cleared');
}

function saveQueue() {
  localStorage.setItem('zinnia_queue_v4', JSON.stringify(state.playQueue));
}

function renderQsSummary() {
  const el = document.getElementById('qsSummary');
  if (!state.playQueue.length) { el.innerHTML = '<p class="empty-msg">Your queue summary will appear here.</p>'; return; }
  const pls   = state.playQueue.map(i => state.playlists.find(p => p.id === i.plId)).filter(Boolean);
  const total = pls.reduce((n, pl) => n + pl.videos.length, 0);
  const totalSecs = pls.reduce((s, pl) => s + playlistTotalSeconds(pl), 0);
  const withTime = state.playQueue.filter(i => i.time || i.day !== '').length;

  el.innerHTML = `
    <div class="summary-stats">
      <div class="summary-stat"><div class="summary-num">${state.playQueue.length}</div><div class="summary-label">Playlists</div></div>
      <div class="summary-stat"><div class="summary-num">${total}</div><div class="summary-label">Videos</div></div>
      <div class="summary-stat"><div class="summary-num" style="font-size:1.1rem">${formatDuration(totalSecs)}</div><div class="summary-label">Total Time</div></div>
    </div>
    ${withTime ? `<p style="font-size:0.74rem;color:var(--muted);margin-bottom:10px">${withTime} item${withTime > 1 ? 's' : ''} with scheduled time</p>` : ''}
    ${state.playQueue.map((item, i) => {
      const pl = state.playlists.find(p => p.id === item.plId);
      if (!pl) return '';
      const timeStr = [
        item.day === '' && item.time ? 'Every Day' : (item.day !== '' ? DAYS[parseInt(item.day)].slice(0,3) : ''),
        item.time ? formatTime12(item.time) : '',
      ].filter(Boolean).join(' · ');
      const plSecs = playlistTotalSeconds(pl);
      return `<div class="summary-pl-row">
        <span style="width:18px;font-size:0.69rem;color:var(--muted);font-weight:700;flex-shrink:0">${i+1}</span>
        <span style="width:10px;height:10px;border-radius:50%;background:${pl.color};flex-shrink:0;display:inline-block"></span>
        <span style="flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${esc(pl.name)}</span>
        <span style="font-size:0.69rem;color:var(--muted);white-space:nowrap;flex-shrink:0;margin-left:4px">${formatDuration(plSecs)}</span>
        ${timeStr ? `<span style="font-size:0.69rem;color:var(--muted);white-space:nowrap;flex-shrink:0">${esc(timeStr)}</span>` : ''}
      </div>`;
    }).join('')}`;
}

// ─────────────────────────────────── TIME PICKER

function openTimePicker(idx) {
  state.timePickerIdx = idx;
  const item = state.playQueue[idx];
  const pl   = state.playlists.find(p => p.id === item.plId);
  document.getElementById('timePickerPlName').textContent = pl?.name || '';
  document.getElementById('timePickerDay').value  = item.day ?? '';
  document.getElementById('timePickerTime').value = item.time ?? '';
  document.getElementById('timePickerModal').classList.add('open');
}
function closeTimePicker() { document.getElementById('timePickerModal').classList.remove('open'); state.timePickerIdx = null; }

function applyQueueItemTime() {
  if (state.timePickerIdx === null) return;
  const idx  = state.timePickerIdx;
  const day  = document.getElementById('timePickerDay').value;
  const time = document.getElementById('timePickerTime').value;
  const plId = state.playQueue[idx].plId;

  if (day === '') {
    // "Every Day" — apply this time to every day slot for this playlist.
    // Remove any per-day duplicates first, then set the single every-day entry.
    state.playQueue = state.playQueue.filter(i => i.plId !== plId || i === state.playQueue[idx]);
    const entry = state.playQueue.find(i => i.plId === plId);
    if (entry) { entry.day = ''; entry.time = time; }
  } else {
    state.playQueue[idx].day  = day;
    state.playQueue[idx].time = time;
  }

  saveQueue();
  closeTimePicker();
  renderQsQueue(); renderQsSummary(); renderQsAvailable();
  renderDayCols();
  renderSchedulePlaylists();
  renderPlaylists();
  if (day || time) {
    const label = [day !== '' ? DAYS[parseInt(day)] : 'Every Day', time ? formatTime12(time) : ''].filter(Boolean).join(' at ');
    showToast(`Scheduled: ${label} — visible in Calendar view`);
  }
}

function clearQueueItemTime() {
  if (state.timePickerIdx === null) return;
  state.playQueue[state.timePickerIdx].day  = '';
  state.playQueue[state.timePickerIdx].time = '';
  saveQueue();
  closeTimePicker();
  renderQsQueue(); renderQsSummary(); renderQsAvailable();
  renderDayCols();
  renderSchedulePlaylists();
  renderPlaylists();
  showToast('Start time removed');
}

// ─────────────────────────────────── CALENDAR VIEW

function getWeekStart(d) {
  const day = new Date(d);
  day.setDate(day.getDate() - day.getDay());
  day.setHours(0,0,0,0);
  return day;
}
function changeWeek(dir) {
  state.currentWeekStart = new Date(state.currentWeekStart);
  state.currentWeekStart.setDate(state.currentWeekStart.getDate() + dir * 7);
  renderSchedule();
}

function renderSchedule() {
  renderWeekHeader();
  renderTimeCol();
  renderDayCols();
  renderSchedulePlaylists();
  const mid = new Date(state.currentWeekStart);
  mid.setDate(mid.getDate() + 3);
  const el = document.getElementById('scheduleMonthTitle');
  if (el) el.textContent = mid.toLocaleDateString('en-US', { month:'long', year:'numeric' });
}

function renderWeekHeader() {
  const el = document.getElementById('weekHeader');
  if (!el) return;
  const today = new Date(); today.setHours(0,0,0,0);
  el.innerHTML = '<div></div>';
  for (let i = 0; i < 7; i++) {
    const d = new Date(state.currentWeekStart);
    d.setDate(d.getDate() + i);
    const isToday = d.getTime() === today.getTime();
    const div = document.createElement('div');
    div.className = 'day-head' + (isToday ? ' today' : '');
    div.innerHTML = `${['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][d.getDay()]}<span class="day-num">${d.getDate()}</span>`;
    el.appendChild(div);
  }
}

function renderTimeCol() {
  const el = document.getElementById('timeCol');
  if (!el) return;
  el.innerHTML = '';
  for (let h = 6; h < 22; h++) {
    for (let m = 0; m < 60; m += 30) {
      const slot = document.createElement('div');
      slot.className = 'time-slot';
      if (m === 0) {
        const hh = h > 12 ? h - 12 : (h === 0 ? 12 : h);
        slot.textContent = `${hh}${h < 12 ? 'am' : 'pm'}`;
      }
      el.appendChild(slot);
    }
  }
}

// Calendar reads DIRECTLY from state.playQueue
// "Every Day" items (day === '') appear on ALL days of the week
function queueItemsForDOW(dow) {
  return state.playQueue
    .map((item, idx) => ({ item, idx }))
    .filter(({ item }) => item.time && (
      item.day === '' || (item.day !== null && parseInt(item.day) === dow)
    ));
}

function timeToSlot(timeStr) {
  const [hStr, mStr] = timeStr.split(':');
  const h = parseInt(hStr), rawM = parseInt(mStr);
  const m = rawM < 15 ? 0 : rawM < 45 ? 30 : 0;
  return { h: rawM >= 45 ? h + 1 : h, m };
}

function renderDayCols() {
  const el = document.getElementById('dayCols');
  if (!el) return;
  el.innerHTML = '';
  for (let i = 0; i < 7; i++) {
    const d = new Date(state.currentWeekStart);
    d.setDate(d.getDate() + i);
    el.appendChild(buildDayCol(d));
  }
}

function buildDayCol(date) {
  const col = document.createElement('div');
  col.className = 'day-col';
  const dow = date.getDay();

  // Build slot → queue items map for this day-of-week
  const slotMap = {};
  queueItemsForDOW(dow).forEach(({ item, idx }) => {
    const { h, m } = timeToSlot(item.time);
    const key = `${h}_${m}`;
    if (!slotMap[key]) slotMap[key] = [];
    slotMap[key].push({ item, idx });
  });

  for (let h = 6; h < 22; h++) {
    for (let m = 0; m < 60; m += 30) {
      const cell = document.createElement('div');
      cell.className = 'day-cell';

      cell.addEventListener('dragover', e => { e.preventDefault(); cell.classList.add('drag-over'); });
      cell.addEventListener('dragleave', () => cell.classList.remove('drag-over'));
      cell.addEventListener('drop', e => {
        e.preventDefault(); cell.classList.remove('drag-over');
        const plId    = e.dataTransfer.getData('playlistId') || e.dataTransfer.getData('qsPlId');
        const moveIdx = e.dataTransfer.getData('calMoveIdx');
        const timeVal = `${pad(h)}:${pad(m)}`;

        if (plId) {
          const pl = state.playlists.find(p => p.id === plId);
          const durationMins = pl ? Math.ceil(playlistTotalSeconds(pl) / 60) : 0;
          const existing = state.playQueue.findIndex(i => i.plId === plId);
          if (existing >= 0) {
            state.playQueue[existing].day  = String(dow);
            state.playQueue[existing].time = timeVal;
            state.playQueue[existing].durationMins = durationMins;
          } else {
            state.playQueue.push({ plId, day: String(dow), time: timeVal, durationMins });
          }
          saveQueue(); renderDayCols(); renderQueueSchedule(); renderSchedulePlaylists(); renderPlaylists();
          showToast(`"${pl?.name}" → ${DAYS[dow]} ${formatTime12(timeVal)} (${formatDuration(playlistTotalSeconds(pl))})`);
        } else if (moveIdx !== '') {
          const idx = parseInt(moveIdx);
          if (!isNaN(idx) && state.playQueue[idx]) {
            state.playQueue[idx].day  = String(dow);
            state.playQueue[idx].time = timeVal;
            // Recalc duration in case it wasn't set before
            const pl = state.playlists.find(p => p.id === state.playQueue[idx].plId);
            if (pl) state.playQueue[idx].durationMins = Math.ceil(playlistTotalSeconds(pl) / 60);
            saveQueue(); renderDayCols(); renderQueueSchedule(); renderSchedulePlaylists(); renderPlaylists();
          }
        }
      });

      // Render events from playQueue
      const key = `${h}_${m}`;
      if (slotMap[key]) {
        slotMap[key].forEach(({ item, idx }) => {
          const pl = state.playlists.find(p => p.id === item.plId);
          const block = document.createElement('div');
          block.className = 'event-block';
          block.style.background = pl?.color || '#3a7dc9';
          block.draggable = true;
          block.title = `${pl?.name} — ${item.day === '' ? 'Every Day' : DAYS[dow]} ${formatTime12(item.time)}`;

          // Calculate block height from durationMins (38px per 30 min)
          const dMins = item.durationMins || (pl ? Math.ceil(playlistTotalSeconds(pl) / 60) : 30);
          const slotHeight = 38; // px per 30-min slot
          const blockH = Math.max(slotHeight - 4, Math.round((dMins / 30) * slotHeight) - 4);
          block.style.height = `${blockH}px`;
          block.style.top    = '2px';
          block.style.bottom = 'auto';
          block.style.zIndex = '2';

          const durLabel = dMins >= 60
            ? `${Math.floor(dMins/60)}h${dMins%60 ? ' '+dMins%60+'m' : ''}`
            : `${dMins}m`;

          block.innerHTML = `
            <span style="overflow:hidden;white-space:nowrap;text-overflow:ellipsis;flex:1;display:flex;flex-direction:column;gap:1px">
              <span>${esc(pl?.name || 'Playlist')}</span>
              ${dMins > 30 ? `<span style="font-size:0.58rem;opacity:0.8">${durLabel}</span>` : ''}
            </span>
            <button class="event-remove" onclick="event.stopPropagation();removeFromQueueByIdx(${idx})" title="Remove from calendar">✕</button>`;
          block.addEventListener('dragstart', e => { e.dataTransfer.setData('calMoveIdx', idx); block.classList.add('dragging'); });
          block.addEventListener('dragend',   () => block.classList.remove('dragging'));
          cell.appendChild(block);
        });
      }
      col.appendChild(cell);
    }
  }
  return col;
}

// Clicking ✕ on a calendar block clears the time but keeps it in the queue
function removeFromQueueByIdx(idx) {
  if (!state.playQueue[idx]) return;
  state.playQueue[idx].day  = '';
  state.playQueue[idx].time = '';
  saveQueue();
  renderDayCols(); renderQueueSchedule(); renderSchedulePlaylists(); renderPlaylists();
  showToast('Removed from calendar — still in queue');
}

// Schedule sidebar chips (greyed out when already scheduled on calendar)
function renderSchedulePlaylists() {
  const el    = document.getElementById('schedulePlaylists');
  const empty = document.getElementById('scheduleNoPlaylists');
  if (!el) return;
  el.innerHTML = '';
  if (!state.playlists.length) { if (empty) empty.style.display = ''; return; }
  if (empty) empty.style.display = 'none';

  state.playlists.forEach(pl => {
    const qItem = state.playQueue.find(i => i.plId === pl.id);
    const scheduled = qItem && qItem.time;
    const chip = document.createElement('div');
    chip.className = 'schedule-playlist-chip' + (scheduled ? ' already-scheduled' : '');
    chip.style.background = pl.color;
    chip.draggable = true;
    const dayLabel = qItem && qItem.day === '' ? 'Every Day' : (qItem && qItem.day !== null && qItem.day !== undefined && qItem.day !== '' ? DAYS[parseInt(qItem.day)] : '');

    chip.title = scheduled
      ? `Currently: ${dayLabel} ${formatTime12(qItem.time)} — drag to reschedule`
      : 'Drag onto calendar to schedule';

    chip.innerHTML = `
      <div>
        <div>${esc(pl.name)}</div>
        <div class="chip-meta">
          ${pl.videos.length} video${pl.videos.length !== 1 ? 's' : ''}
          ${scheduled ? ` · ${dayLabel.slice(0,9)} ${formatTime12(qItem.time)}` : ''}
        </div>
      </div>
      ${scheduled
        ? `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.8)" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>`
        : `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.65)" stroke-width="2"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/></svg>`}`;

    chip.addEventListener('dragstart', e => { e.dataTransfer.setData('playlistId', pl.id); chip.classList.add('dragging'); });
    chip.addEventListener('dragend',   () => chip.classList.remove('dragging'));
    el.appendChild(chip);
  });
}

// ─────────────────────────────────── PLAYER

function renderPlayerPage() {
  let queueVideos = [];
  state.playQueue.forEach(item => {
    const pl = state.playlists.find(p => p.id === item.plId);
    if (pl) queueVideos.push(...pl.videos);
  });
  if (!queueVideos.length) {
    const selected = state.videos.filter(v => state.selectedVideoIds.has(v.id));
    queueVideos = selected.length ? selected : state.videos.slice(0, 8);
  }
  state.queue = queueVideos;
  state.currentPlayerIdx = 0;

  const queueEl = document.getElementById('queueList');
  queueEl.innerHTML = '';
  queueVideos.forEach((v, idx) => {
    const item = document.createElement('div');
    item.className = 'queue-item' + (idx === 0 ? ' active' : '');
    item.onclick = () => playVideoAtIdx(idx);
    item.innerHTML = `
      <img src="${esc(v.thumb)}" alt="" onerror="this.style.display='none'" />
      <span style="line-height:1.3">${esc(v.title)}</span>`;
    queueEl.appendChild(item);
  });

  if (queueVideos.length) loadPlayerVideo(queueVideos[0]);
}

function loadPlayerVideo(video) {
  document.getElementById('playerVideoTitle').textContent    = video.title;
  document.getElementById('playerVideoDuration').textContent = video.duration;
  document.getElementById('progressFill').style.width = '0%';
  document.getElementById('timeDisplay').textContent  = '0:00';
  state.progressPct = 0;
  clearInterval(state.progressTimer);
  state.isPlaying = false;
  const icon = document.getElementById('playPauseIcon');
  if (icon) icon.innerHTML = '<polygon points="5 3 19 12 5 21 5 3"/>';

  const embed = document.getElementById('playerEmbed');
  // Show thumbnail as preview
  embed.innerHTML = `
    <img src="${esc(video.thumb)}" alt="${esc(video.title)}"
         style="width:100%;height:100%;object-fit:cover;position:absolute;inset:0;opacity:0.7" />
    <div style="position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px">
      <button onclick="togglePlay()" style="width:64px;height:64px;border-radius:50%;background:rgba(255,255,255,0.92);border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:transform .15s" onmouseover="this.style.transform='scale(1.06)'" onmouseout="this.style.transform='scale(1)'">
        <svg width="26" height="26" viewBox="0 0 24 24" fill="#072843"><polygon points="5 3 19 12 5 21 5 3"/></svg>
      </button>
      <p style="color:white;font-size:0.82rem;font-weight:500;text-shadow:0 1px 4px rgba(0,0,0,0.5)">${esc(video.title)}</p>
    </div>`;
}

function playVideoAtIdx(idx) {
  if (!state.queue?.length || idx >= state.queue.length) return;
  state.currentPlayerIdx = idx;
  document.querySelectorAll('.queue-item').forEach((el, i) => el.classList.toggle('active', i === idx));
  loadPlayerVideo(state.queue[idx]);
}
function prevVideo() { playVideoAtIdx(Math.max(0, state.currentPlayerIdx - 1)); }
function nextVideo() { playVideoAtIdx(Math.min((state.queue?.length || 1) - 1, state.currentPlayerIdx + 1)); }

function togglePlay() {
  state.isPlaying = !state.isPlaying;
  const icon = document.getElementById('playPauseIcon');
  if (state.isPlaying) {
    icon.innerHTML = '<rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/>';
    runProgress();
  } else {
    icon.innerHTML = '<polygon points="5 3 19 12 5 21 5 3"/>';
    clearInterval(state.progressTimer);
  }
}

function runProgress() {
  clearInterval(state.progressTimer);
  state.progressTimer = setInterval(() => {
    state.progressPct = Math.min(state.progressPct + 0.08, 100);
    document.getElementById('progressFill').style.width = state.progressPct + '%';
    // Fake time display from duration
    const video = state.queue?.[state.currentPlayerIdx];
    if (video) {
      const parts = video.duration.split(':').map(Number);
      const totalSecs = parts.length === 3 ? parts[0]*3600 + parts[1]*60 + parts[2] : parts[0]*60 + parts[1];
      const elapsed = Math.floor(totalSecs * state.progressPct / 100);
      document.getElementById('timeDisplay').textContent = formatDuration(elapsed);
    }
    if (state.progressPct >= 100) { clearInterval(state.progressTimer); state.isPlaying = false; nextVideo(); }
  }, 200);
}

function seekProgress(e) {
  const bar = e.currentTarget;
  const pct = (e.offsetX / bar.offsetWidth) * 100;
  state.progressPct = pct;
  document.getElementById('progressFill').style.width = pct + '%';
}

// ─────────────────────────────────── BROWSE

function renderBrowsePage() {
  const el = document.getElementById('browseGenres');
  if (!el) return;
  el.innerHTML = '';
  GENRES.forEach(g => {
    const card = document.createElement('div');
    card.className = 'browse-genre-card';
    card.style.background = GENRE_BG[g] || '#e0eaf5';
    card.innerHTML = `<span>${esc(g)}</span>`;
    card.onclick = () => { showPage('playlists'); selectGenreByName(g); };
    el.appendChild(card);
  });
}

function selectGenreByName(genre) {
  document.querySelectorAll('#genrePills .pill').forEach(p => {
    if (p.textContent.trim() === genre) { selectGenre(p, genre); }
  });
}

// ─────────────────────────────────── UTILITIES

function formatTime12(timeStr) {
  if (!timeStr) return '';
  const [hStr, mStr] = timeStr.split(':');
  const h = parseInt(hStr), m = parseInt(mStr);
  const ampm = h < 12 ? 'AM' : 'PM';
  return `${h === 0 ? 12 : h > 12 ? h - 12 : h}:${pad(m)} ${ampm}`;
}

function formatDuration(secs) {
  const h = Math.floor(secs / 3600);
  const m = Math.floor((secs % 3600) / 60);
  const s = secs % 60;
  if (h > 0) return `${h}:${pad(m)}:${pad(s)}`;
  return `${m}:${pad(s)}`;
}

function durationToSeconds(durStr) {
  if (!durStr) return 0;
  const parts = String(durStr).split(':').map(Number);
  if (parts.length === 3) return parts[0]*3600 + parts[1]*60 + parts[2];
  if (parts.length === 2) return parts[0]*60 + parts[1];
  return 0;
}

function playlistTotalSeconds(pl) {
  if (!pl) return 0;
  return pl.videos.reduce((s, v) => s + durationToSeconds(v.duration), 0);
}

function pad(n) { return String(n).padStart(2,'0'); }

function esc(str) {
  return String(str||'')
    .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

function showToast(msg) {
  document.querySelector('.toast')?.remove();
  const t = document.createElement('div');
  t.className = 'toast'; t.textContent = msg;
  document.body.appendChild(t);
  setTimeout(() => t.remove(), 3000);
}

// ─────────────────────────────────── KEYBOARD / MODAL CLOSE

document.addEventListener('keydown', e => {
  if (e.key !== 'Escape') return;
  closeSaveModal(); closeEditModal(); closeTimePicker();
});
['saveModal','editModal','timePickerModal'].forEach(id => {
  document.getElementById(id)?.addEventListener('click', function(e) {
    if (e.target !== this) return;
    if (id === 'saveModal')       closeSaveModal();
    if (id === 'editModal')       closeEditModal();
    if (id === 'timePickerModal') closeTimePicker();
  });
});