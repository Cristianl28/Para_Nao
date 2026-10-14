const dialog = document.querySelector('#letter-dialog');
const receiptButton = document.querySelector('#send-receipt');
const receiptStatus = document.querySelector('#receipt-status');
const receiptClose = document.querySelector('#close-without-receipt');
let receiptSent = false;
let receiptPending = false;
receiptClose.addEventListener('click', () => dialog.close());
receiptButton.addEventListener('click', async () => {
  if (receiptSent || receiptPending) return;
  receiptPending = true;
  receiptButton.disabled = true;
  receiptButton.textContent = 'Enviando…';
  receiptStatus.textContent = 'Enviando tu aviso a Cristian…';
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);
  try {
    const response = await fetch('https://formspree.io/f/mwlvrykn', {
      method: 'POST',
      headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
      body: JSON.stringify({
        _subject: 'Para Nao: alguien confirmó que leyó la carta',
        message: 'Una persona pulsó voluntariamente «Ya la leí, avisarte 💕» en https://cristianl28.github.io/Para_Nao/. Este aviso no verifica su identidad.'
      }),
      signal: controller.signal,
      credentials: 'omit',
      referrerPolicy: 'no-referrer'
    });
    if (!response.ok) throw new Error('Submission failed');
    receiptSent = true;
    receiptButton.textContent = 'Aviso enviado ♡';
    receiptStatus.textContent = 'Listo, tu aviso se envió. Gracias por leerla ♡';
    receiptClose.textContent = 'Cerrar carta';
  } catch {
    receiptButton.disabled = false;
    receiptButton.textContent = 'Reintentar aviso';
    receiptStatus.textContent = 'No pudimos confirmar el envío. Podés reintentar o cerrar la carta.';
  } finally {
    clearTimeout(timeout);
    receiptPending = false;
  }
});
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
