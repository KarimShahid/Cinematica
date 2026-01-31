const TMDB_API_KEY = "895208d10662cc6413ebec2532ca9038"; // <-- replace with your TMDB API key
const TMDB_BASE = "https://api.themoviedb.org/3";
const IMG_BASE = "https://image.tmdb.org/t/p/w500";

async function fetchJSON(path) {
  const res = await fetch(`${TMDB_BASE}${path}&api_key=${TMDB_API_KEY}`);
  if (!res.ok) throw new Error("Network error");
  return res.json();
}

async function loadNowPlaying() {
  try {
    const data = await fetchJSON(`/movie/now_playing?language=en-US&page=1`);
    const banner = document.getElementById("banner");
    banner.innerHTML = "";
    data.results.slice(0,8).forEach(item=>{
      const el = document.createElement("div");
      el.className = "banner-item";
      el.innerHTML = `
        <img src="${IMG_BASE + (item.backdrop_path||item.poster_path)}" alt="${item.title}" />
        <div class="meta">
          <strong>${item.title}</strong>
          <div style="font-size:0.8rem;opacity:0.9">${item.release_date || ""}</div>
        </div>
      `;
      el.addEventListener("click", ()=> window.open(`https://www.themoviedb.org/movie/${item.id}`, "_blank"));
      banner.appendChild(el);
    });
  } catch (e) {
    console.error(e);
  }
}

async function loadPopularMovies() {
  try {
    const data = await fetchJSON(`/movie/popular?language=en-US&page=1`);
    const grid = document.getElementById("popular-movies");
    grid.innerHTML = "";
    data.results.slice(0,20).forEach(item=>{
      const card = document.createElement("div");
      card.className = "poster";
      card.innerHTML = `
        <img src="${IMG_BASE + (item.poster_path||item.backdrop_path)}" alt="${item.title}" />
        <div class="title">${item.title}</div>
      `;
      card.addEventListener("click", ()=> window.open(`https://www.themoviedb.org/movie/${item.id}`, "_blank"));
      grid.appendChild(card);
    });
  } catch(e) { console.error(e) }
}

async function loadPopularTV() {
  try {
    const data = await fetchJSON(`/tv/popular?language=en-US&page=1`);
    const grid = document.getElementById("popular-tv");
    grid.innerHTML = "";
    data.results.slice(0,20).forEach(item=>{
      const card = document.createElement("div");
      card.className = "poster";
      card.innerHTML = `
        <img src="${IMG_BASE + (item.poster_path||item.backdrop_path)}" alt="${item.name}" />
        <div class="title">${item.name}</div>
      `;
      card.addEventListener("click", ()=> window.open(`https://www.themoviedb.org/tv/${item.id}`, "_blank"));
      grid.appendChild(card);
    });
  } catch(e) { console.error(e) }
}

document.addEventListener("DOMContentLoaded", ()=>{
  // Attempt to load content; if API key not set, show placeholders
  if (TMDB_API_KEY === "YOUR_TMDB_API_KEY") {
    const banner = document.getElementById("banner");
    banner.innerHTML = `<div style="padding:18px;color:#cbd5e1">Set your TMDB API key in <code>script.js</code> to load live content.</div>`;
    // show mock placeholders
    for (let i=0;i<8;i++){
      const p = document.createElement("div");
      p.className = "poster";
      p.innerHTML = `<div style="height:210px;background:linear-gradient(135deg,#0b1220,#071026);display:flex;align-items:center;justify-content:center;color:#6b7280">Poster</div><div class="title">Placeholder ${i+1}</div>`;
      document.getElementById("popular-movies").appendChild(p);
      const q = p.cloneNode(true);
      document.getElementById("popular-tv").appendChild(q);
    }
    return;
  }

  loadNowPlaying();
  loadPopularMovies();
  loadPopularTV();
});

