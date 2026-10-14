const dialog = document.querySelector('#letter-dialog');
const opener = document.querySelector('#open-letter');
const palettes = {
  cream: ['#f2e7d7','#d5b9a2','#c5a78f','#fff7e9','claras'],
  rose: ['#d88e9c','#a74b66','#b97486','#e8acb6','rosadas'],
  lilac: ['#a99ac7','#756395','#9080af','#c6bbdc','lilas'],
  peach: ['#e8ac86','#c27f61','#cf9273','#f5c5a4','durazno']
};
opener.addEventListener('click', () => { dialog.showModal(); document.body.classList.add('modal-open'); });
document.querySelector('.close-dialog').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', e => { if (e.target === dialog) { const r = dialog.getBoundingClientRect(); if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) dialog.close(); } });
dialog.addEventListener('close', () => { document.body.classList.remove('modal-open'); opener.focus(); });
document.querySelectorAll('.swatch').forEach(button => button.addEventListener('click', () => {
  document.querySelectorAll('.swatch').forEach(b => b.setAttribute('aria-pressed', String(b === button)));
  const palette = palettes[button.dataset.color];
  ['--flower','--flower-core','--flower-edge','--flower-light'].forEach((name, i) => document.documentElement.style.setProperty(name, palette[i]));
  document.querySelector('#bouquet-title').textContent = `Un ramo ilustrado de rosas y gerberas ${palette[4]}`;
}));
const messages = ['va, otras poquitas ♡', 'estas sí te van a durar jajaja', 'y todavía hay más ✿'];
let flowerCount = 0;
document.querySelector('#more-flowers').addEventListener('click', () => {
  document.querySelector('#flower-status').textContent = messages[flowerCount++ % messages.length];
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const layer = document.querySelector('.petal-layer');
  layer.replaceChildren();
  const color = getComputedStyle(document.documentElement).getPropertyValue('--flower');
  for (let i = 0; i < 32; i++) {
    const petal = document.createElement('span'); petal.className = 'petal'; petal.textContent = i % 3 ? '✿' : '♡';
    petal.style.cssText = `--left:${Math.random()*100}%;--duration:${3+Math.random()*3}s;--size:${14+Math.random()*20}px;--drift:${Math.random()*180-90}px;--petal-color:${color};animation-delay:${Math.random()*.7}s`;
    petal.addEventListener('animationend', () => petal.remove(), {once:true}); layer.append(petal);
  }
});
