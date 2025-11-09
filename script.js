// Uses your global `data` (from data.js). Falls back if missing.
const FALLBACK = [
    { name: "Joel Embiid", team: "Philadelphia 76ers (PHI)", points: 33, rebounds: 10.8, assists: 5.7 },
    { name: "Jalen Brunson", team: "New York Knicks (NYK)", points: 32.4, rebounds: 3.3, assists: 7.5 },
    { name: "Shai Gilgeous-Alexander", team: "Oklahoma City Thunder (OKC)", points: 30.2, rebounds: 7.2, assists: 6.4 },
    { name: "Tyrese Maxey", team: "Philadelphia 76ers (PHI)", points: 29.1, rebounds: 5.2, assists: 6.8 },
    { name: "Donovan Mitchell", team: "Cleveland Cavaliers (CLE)", points: 29.6, rebounds: 5.4, assists: 4.7 }
];

const RAW = Array.isArray(window.data) ? window.data : FALLBACK;

// ---- DOM ----
const $rows = document.getElementById("player-rows");
const $search = document.getElementById("search");
const $team   = document.getElementById("team-filter");
const $table  = document.getElementById("player-stats");
const $toggle = document.getElementById("dark-toggle");
const $count  = document.getElementById("count");

// ---- State ----
const state = {
    query: "",
    team: "all",
    sortKey: null,      // "name" | "team" | "points" | "rebounds" | "assists"
    sortDir: "asc"
};

// ---- Helpers ----
const uniqueTeams = list => [...new Set(list.map(p => p.team))].sort((a,b)=>a.localeCompare(b));

function cmp(a,b,key,dir){
    const va = a[key], vb = b[key];
    const num = typeof va === "number" && typeof vb === "number";
    let c = num ? (va - vb) : String(va).localeCompare(String(vb));
    return dir === "asc" ? c : -c;
}

function filteredSorted(){
    const q = state.query.trim().toLowerCase();
    let list = RAW.filter(p => {
        const qok = !q || p.name.toLowerCase().includes(q) || p.team.toLowerCase().includes(q);
        const tok = state.team === "all" || p.team === state.team;
        return qok && tok;
    });
    if (state.sortKey) list = list.slice().sort((a,b)=>cmp(a,b,state.sortKey,state.sortDir));
    return list;
}

function renderTable(list){
    $rows.innerHTML = "";
    const frag = document.createDocumentFragment();
    list.forEach(p => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
      <td>${p.name}</td>
      <td>${p.team}</td>
      <td>${p.points}</td>
      <td>${p.rebounds}</td>
      <td>${p.assists}</td>
    `;
        frag.appendChild(tr);
    });
    $rows.appendChild(frag);
    if ($count) $count.textContent = `${list.length} player${list.length===1?"":"s"}`;
}

function apply(){ renderTable(filteredSorted()); }

// ---- Populate team filter to match photo UX ----
function populateTeams(){
    uniqueTeams(RAW).forEach(team => {
        const opt = document.createElement("option");
        opt.value = team; opt.textContent = team;
        $team.appendChild(opt);
    });
}

// ---- Events ----
// search input
$search.addEventListener("input", e => { state.query = e.target.value; apply(); });

// team filter
$team.addEventListener("change", e => { state.team = e.target.value; apply(); });

// dark mode pill (click): toggle a `.dark` class on <html> for stable theming
$toggle.addEventListener("click", () => {
    const root = document.documentElement;
    root.classList.toggle("dark");
});

// sorting via event delegation on thead (click)
$table.querySelector("thead").addEventListener("click", e => {
    const th = e.target.closest("th");
    if (!th) return;
    const key = th.dataset.key;
    if (!key) return;

    if (state.sortKey === key) state.sortDir = state.sortDir === "asc" ? "desc" : "asc";
    else { state.sortKey = key; state.sortDir = "asc"; }

    // update sort indicators to look like the photo
    $table.querySelectorAll("thead th").forEach(h => h.removeAttribute("data-sort"));
    th.setAttribute("data-sort", state.sortDir);

    apply();
});

// ---- Boot ----
populateTeams();
apply();
