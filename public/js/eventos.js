const SHEET_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTMgdJnYOL44Iy5AqdfkHtegw4NU3X5fr0Q5BZwLOkHJafIYyGtU_YycpSsB2n83jgxp30g4d-eZjRK/pub?gid=0&single=true&output=csv';

const COLS = {
  titulo: 'Título',
  tipo: 'Tipo',
  fecha: 'Fecha',
  hora: 'Hora',
  lugar: 'Lugar',
  descripcion: 'Descripción',
  imagen: 'Imagen'
};

const $ = s => document.querySelector(s);

function parseCSV(text){
  const rows = [];
  let cur = '', row = [], inside = false;
  for (let i=0;i<text.length;i++){
    const c = text[i], n = text[i+1];
    if (c === '"' && inside && n === '"'){ cur += '"'; i++; continue; }
    if (c === '"'){ inside = !inside; continue; }
    if (c === ',' && !inside){ row.push(cur); cur=''; continue; }
    if ((c === '\n' || c === '\r') && !inside){
      if (cur !== '' || row.length){ row.push(cur); rows.push(row); row=[]; cur=''; }
      continue;
    }
    cur += c;
  }
  if (cur !== '' || row.length){ row.push(cur); rows.push(row); }
  return rows;
}

function csvToObjects(csv){
  const rows = parseCSV(csv).filter(r => r.length && r.some(c => String(c).trim() !== ''));
  if (!rows.length) return [];
  const headers = rows[0].map(h => String(h).trim());
  return rows.slice(1).map(r => {
    const o = {};
    headers.forEach((h,i)=> o[h] = (r[i]||'').toString().trim());
    return o;
  });
}

function parseDate(v){
  if (!v) return null;
  if (/^\d{4}-\d{2}-\d{2}$/.test(v)) return new Date(v + 'T00:00:00');
  const m = v.match(/^(\d{1,2})\/(\d{1,2})\/(\d{2,4})$/);
  if (m){
    const dd = m[1].padStart(2,'0'), mm = m[2].padStart(2,'0'), yyyy = (m[3].length===2?'20':'') + m[3];
    return new Date(`${yyyy}-${mm}-${dd}T00:00:00`);
  }
  const d = new Date(v);
  return isNaN(d) ? null : d;
}
const fmtDate = d => d ? d.toLocaleDateString(undefined, { year:'numeric', month:'short', day:'numeric' }) : '';

function driveToDirect(url){
  if (!url) return '';
  let m = url.match(/https?:\/\/drive\.google\.com\/file\/d\/([^/]+)\//i);
  if (m) return `https://drive.google.com/uc?export=view&id=${m[1]}`;
  m = url.match(/[?&]id=([^&]+)/i);
  if (m) return `https://drive.google.com/uc?export=view&id=${m[1]}`;
  if (/\/drive\/u\/\d+\/folders\//i.test(url) || /\/folders\//i.test(url)) return '';
  return url;
}

function cardHTML(ev){
  const tipoVal = (ev[COLS.tipo] || 'Evento').toLowerCase();
  const badgeClass = tipoVal.includes('sorteo') ? 'badge-sorteo'
                    : tipoVal.includes('torneo') ? 'badge-torneo'
                    : 'bg-secondary';

  const fecha = parseDate(ev[COLS.fecha]);
  const hora = ev[COLS.hora] ? ` · ${ev[COLS.hora]}` : '';
  const lugar = ev[COLS.lugar] ? `<div class="event-meta mt-1"><i class="bi bi-geo-alt"></i> ${ev[COLS.lugar]}</div>` : '';

  const imgRaw = ev[COLS.imagen] || '';
  const img = driveToDirect(imgRaw) || 'public/img/hero1.jpg';

  return `
    <div class="col-12 col-md-6 col-lg-4">
      <article class="event-card">
        <div class="event-card__media">
          <img class="event-card__img"
               src="${img}"
               alt="${ev[COLS.titulo] || 'Evento'}"
               width="1600" height="900"
               loading="lazy"
               onerror="this.onerror=null; this.src='public/img/hero1.jpg'; console.warn('Fallback imagen para:', '${imgRaw}');">
        </div>
        <div class="event-card__body">
          <div class="d-flex align-items-center justify-content-between mb-1">
            <span class="badge badge-evt ${badgeClass}">${ev[COLS.tipo] || 'Evento'}</span>
            <small class="text-muted"><i class="bi bi-calendar-event"></i> ${fmtDate(fecha)}${hora}</small>
          </div>
          <h3 class="event-card__title h5">${ev[COLS.titulo] || 'Sin título'}</h3>
          ${lugar}
          ${ev[COLS.descripcion] ? `<p class="mt-2 mb-0">${ev[COLS.descripcion]}</p>` : ''}
        </div>
      </article>
    </div>
  `;
}

async function loadEvents(){
  const grid = $('#eventos-grid');
  const empty = $('#eventos-empty');
  const err = $('#eventos-error');

  try{
    const bust = (SHEET_CSV_URL.includes('?') ? '&' : '?') + 'cb=' + Date.now();
    const res = await fetch(SHEET_CSV_URL + bust, { cache: 'no-cache' });
    if (!res.ok) throw new Error('No se pudo cargar el CSV publicado.');

    const text = await res.text();
    const rows = csvToObjects(text);

    const eventos = rows
      .map(r => ({ ...r, _date: parseDate(r[COLS.fecha]) }))
      .filter(r => r._date)
      .sort((a,b) => a._date - b._date);

    grid.innerHTML = eventos.map(cardHTML).join('');
    empty.classList.toggle('d-none', eventos.length > 0);
    err.classList.add('d-none');
  } catch(e){
    console.error(e);
    err.classList.remove('d-none');
    empty.classList.add('d-none');
  }
}

document.addEventListener('DOMContentLoaded', loadEvents);
