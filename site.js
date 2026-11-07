const $ = selector => document.querySelector(selector);
const INK = '#2a1f14';
const releaseDate = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' });

function fit(canvas, cssW, cssH) {
  const k = window.devicePixelRatio || 1;
  canvas.width = Math.round(cssW * k);
  canvas.height = Math.round(cssH * k);
  canvas.style.width = cssW + 'px';
  canvas.style.height = cssH + 'px';
  return { ctx: canvas.getContext('2d'), k, w: canvas.width, h: canvas.height };
}

function draw() {
  const narrow = innerWidth < 1100;
  const root = document.documentElement.style;
  const pageW = document.documentElement.clientWidth;
  const beyond = Math.round(narrow ? 40 : Math.min(300, Math.max(44, pageW * 0.2)));
  root.setProperty('--beyond', beyond + 'px');
  const heroW = pageW - beyond;
  const heroH = narrow ? Math.round(Math.min(heroW * 1.08, innerHeight * 0.62)) : Math.max(640, innerHeight);
  const { ctx, k, w: W, h: H } = fit($('#mark'), heroW, heroH);
  const pitch = Math.round((narrow ? 5 : 9) * k);
  const ya = Math.round(H * 0.46 / pitch) * pitch;
  const T = Math.round(Math.min(H, W) * 0.17);
  const yEnd = ya + Math.round((H - ya) * (narrow ? 0.9 : 0.72));
  const full = pitch * 0.74;
  ctx.fillStyle = INK;
  for (let y = 0; y < ya; y += pitch) {
    const xr = W - (ya - y);
    ctx.fillRect(xr - T, y, T, full);
  }
  for (let y = ya; y < yEnd; y += pitch) {
    const t = (y - ya) / (yEnd - ya);
    const xr = W - (y - ya);
    ctx.fillRect(xr - T * 0.94, y, T * 0.94, Math.max(k * 0.6, full * Math.pow(1 - t, 1.5)));
  }
  drawMoth(narrow);
  if (!narrow) {
    root.setProperty('--leadw', Math.max(260, Math.min(420, (W - ya - T) / k - 48 - 32)) + 'px');
    root.setProperty('--figx', (W - (yEnd - ya)) / k - T / k * 0.3 + 'px');
    root.setProperty('--figy', yEnd / k + 12 + 'px');
  }
}

function drawMoth(narrow) {
  const s = narrow ? 0.25 : 0.34;
  const cssW = Math.round(2 * (112 * s + 4));
  const cssH = Math.round(150 * s);
  document.documentElement.style.setProperty('--mw', cssW + 'px');
  const { ctx, k, w, h } = fit($('#moth'), cssW, cssH);
  const ox = w / 2;
  const oy = 64 * s * k;
  const gap = 3 * k;
  const u = s * k;
  const wing = dir => {
    const X = x => ox + dir * (gap + x * u);
    const Y = y => oy + y * u;
    const fore = new Path2D();
    fore.moveTo(X(0), Y(-18));
    fore.quadraticCurveTo(X(54), Y(-50), X(104), Y(-48));
    fore.quadraticCurveTo(X(102), Y(-20), X(56), Y(16));
    fore.lineTo(X(0), Y(6));
    fore.closePath();
    const hind = new Path2D();
    hind.moveTo(X(0), Y(9));
    hind.lineTo(X(56), Y(20));
    hind.quadraticCurveTo(X(70), Y(62), X(38), Y(80));
    hind.quadraticCurveTo(X(16), Y(78), X(0), Y(50));
    hind.closePath();
    const feeler = new Path2D();
    feeler.moveTo(X(0), Y(-26));
    feeler.quadraticCurveTo(X(10), Y(-46), X(28), Y(-58));
    return { fore, hind, feeler, spot: [X(38), Y(48)] };
  };
  const pitch = Math.max(2, Math.round((narrow ? 2.5 : 3) * k));
  const thick = Math.max(1, Math.round(1.5 * k));
  const ring = Math.round(8 * u);
  ctx.fillStyle = ctx.strokeStyle = INK;
  ctx.lineWidth = Math.max(1, Math.round(0.8 * k));

  const left = wing(-1);
  [left.fore, left.hind].forEach(shape => {
    ctx.save();
    ctx.clip(shape);
    for (let y = 0; y < h; y += pitch) ctx.fillRect(0, y, ox, thick);
    ctx.restore();
    ctx.stroke(shape);
  });
  ctx.save();
  ctx.globalCompositeOperation = 'destination-out';
  ctx.beginPath();
  ctx.arc(left.spot[0], left.spot[1], ring, 0, 7);
  ctx.fill();
  ctx.restore();
  ctx.beginPath();
  ctx.arc(left.spot[0], left.spot[1], ring, 0, 7);
  ctx.stroke();
  ctx.stroke(left.feeler);

  const right = wing(1);
  ctx.stroke(right.fore);
  ctx.stroke(right.hind);
  ctx.stroke(right.feeler);
  ctx.beginPath();
  ctx.arc(right.spot[0], right.spot[1], ring, 0, 7);
  ctx.stroke();
}

async function showReleases() {
  const response = await fetch('/packages/releases.json');
  if (!response.ok) return;
  for (const { name, tag, published } of await response.json()) {
    const cell = $(`[data-release="${name}"]`);
    if (cell) cell.textContent = `${tag}, ${releaseDate.format(new Date(published))}`;
  }
}

function showWeight() {
  const entries = [...performance.getEntriesByType('navigation'), ...performance.getEntriesByType('resource')];
  const kb = Math.round(entries.reduce((sum, entry) => sum + entry.decodedBodySize, 0) / 1024);
  const thirdParty = entries.filter(entry => new URL(entry.name).origin !== location.origin).length;
  const cookies = document.cookie ? document.cookie.split(';').length : 0;
  $('#weight').textContent = `this page: ${entries.length} files, ${kb} KB, ${thirdParty} third-party, ${cookies} cookies`;
}

document.querySelectorAll('button[data-copy]').forEach(button => {
  button.hidden = false;
  button.addEventListener('click', async () => {
    await navigator.clipboard.writeText(button.dataset.copy);
    button.textContent = 'copied';
    setTimeout(() => (button.textContent = 'copy'), 1200);
  });
});

let resizing;
addEventListener('resize', () => {
  clearTimeout(resizing);
  resizing = setTimeout(draw, 120);
});
addEventListener('load', () => showReleases().catch(() => {}).finally(showWeight));
document.fonts.ready.then(draw);
