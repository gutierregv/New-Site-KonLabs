(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const SYM = '<svg viewBox="10 0 70 100" aria-hidden="true"><use href="#foco"/></svg>';

  /* CTA: registra o clique no Pixel */
  $$('[data-cta]').forEach(a => a.addEventListener('click', () => { try { window.fbq && fbq('track', 'Lead'); } catch (e) {} }));

  /* nav */
  const nav = $('#nav'), hero = $('.hero');
  let lastY = scrollY;
  const onScroll = () => {
    const y = scrollY, past = y > hero.offsetHeight - 90;
    nav.classList.toggle('solid', past);
    nav.classList.toggle('hide', past && y > lastY && y > 400 && !nav.classList.contains('open'));
    lastY = y;
  };
  addEventListener('scroll', onScroll, { passive: true }); onScroll();
  $('#menu').addEventListener('click', () => { const o = nav.classList.toggle('open'); $('#menu').setAttribute('aria-expanded', o); });
  $$('.links a').forEach(a => a.addEventListener('click', () => { nav.classList.remove('open'); $('#menu').setAttribute('aria-expanded', false); }));

  /* revelação */
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: .12 });
  $$('.reveal').forEach((el, i) => { el.style.transitionDelay = (i % 4) * 60 + 'ms'; io.observe(el); });

  /* integrações */
  const INT = [
    ['WhatsApp', 'si-whatsapp.svg', 1], ['HubSpot', 'si-hubspot.svg', 1], ['Salesforce', 'si-salesforce.svg', 1], ['Databricks', 'si-databricks.svg', 1],
    ['RD Station', 'RD'], ['Pipedrive', 'PD'], ['SAP', 'si-sap.svg'], ['TOTVS', 'TO'],
    ['Omie', 'OM'], ['Bling', 'BL'], ['VTEX', 'si-vtex.svg'], ['Shopify', 'si-shopify.svg'],
    ['Mercado Pago', 'si-mercadopago.svg'], ['Stripe', 'si-stripe.svg'], ['AWS', 'si-amazonwebservices.svg'], ['BigQuery', 'si-googlebigquery.svg'],
    ['PostgreSQL', 'si-postgresql.svg'], ['Google Sheets', 'si-googlesheets.svg'], ['Power BI', 'BI'], ['Metabase', 'si-metabase.svg'],
    ['Google Analytics', 'si-googleanalytics.svg'], ['Meta Ads', 'si-meta.svg'], ['Google Ads', 'si-googleads.svg'], ['Claude', 'si-anthropic.svg']
  ];
  $('#ints').innerHTML = INT.map(([n, f, big]) => `<li class="${big ? 'big' : ''}">${f.endsWith('.svg') ? `<img src="assets/int/${f}" alt="" loading="lazy">` : `<span class="mk">${f}</span>`}<span>${n}</span></li>`).join('') + '<li class="more">e mais de 30 outras, entre bases de empresas, bibliotecas de anúncios e modelos de IA</li>';

  /* fluxo: linhas entre os cartões e etapas do núcleo */
  const flow = $('#flow'), svg = $('#flowLines'), NS = 'http://www.w3.org/2000/svg';
  let paths = [], pulses = [], flowOn = false;
  function drawFlow() {
    svg.innerHTML = ''; paths = []; pulses = [];
    if (getComputedStyle(svg).display === 'none') return;
    const fr = flow.getBoundingClientRect(), r = id => { const b = $(id).getBoundingClientRect(); return { l: b.left - fr.left, r: b.right - fr.left, y: b.top - fr.top + b.height / 2 }; };
    const s = r('#fSrc'), c = r('#fCore'), o = r('#fOut'), t = r('#fTeam');
    const mk = (x0, y0, x1, y1) => { const p = document.createElementNS(NS, 'path'); const mx = (x0 + x1) / 2; p.setAttribute('d', `M${x0},${y0} C${mx},${y0} ${mx},${y1} ${x1},${y1}`); svg.append(p); paths.push(p);
      const q = document.createElementNS(NS, 'rect'); q.setAttribute('width', 7); q.setAttribute('height', 7); q.setAttribute('x', -40); q.setAttribute('y', -40); svg.append(q); pulses.push(q); };
    mk(s.r, s.y, c.l, c.y); mk(c.r, c.y, o.l, o.y); mk(c.r, c.y, t.l, t.y);
  }
  const steps = $$('#coreSteps li');
  function flowTick(ms) {
    const T = ms / 1000;
    steps.forEach((li, i) => li.classList.toggle('on', Math.floor(T / 1.4) % steps.length === i));
    paths.forEach((p, i) => { const L = p.getTotalLength(); const k = ((T * .45) + i * .33) % 1; const pt = p.getPointAtLength(L * k); pulses[i].setAttribute('x', pt.x - 3.5); pulses[i].setAttribute('y', pt.y - 3.5); });
    if (flowOn && !reduce) requestAnimationFrame(flowTick);
  }
  drawFlow(); addEventListener('resize', drawFlow);
  if (document.fonts) document.fonts.ready.then(drawFlow);
  new IntersectionObserver(([e]) => { const was = flowOn; flowOn = e.isIntersecting; if (flowOn && !was) { setTimeout(drawFlow, 950); requestAnimationFrame(flowTick); } }).observe(flow);
  if (reduce) steps.forEach(li => li.classList.add('on'));

  /* conversa: três exemplos em sequência */
  const SCENES = [
    { who: 'Diretoria do Grupo Raiz', ask: 'As vendas caíram em setembro. O que aconteceu e o que fazemos?', src: ['CRM', 'ERP', 'Meta Ads', 'Analytics'],
      ans: 'A queda veio do topo do funil. Recomendamos três frentes, um painel de funil com meta por etapa, uma cadência para os leads parados e uma lista de 50 contas com o perfil do seu melhor cliente.' },
    { who: 'Financeiro do Grupo Raiz', ask: 'Junte nossas planilhas, o CRM e o ERP em uma base só.', src: ['Planilhas', 'CRM', 'ERP'],
      ans: 'Pronto. As três fontes agora alimentam a mesma base, tratada e conferida, com 12 mil cadastros duplicados removidos.' },
    { who: 'Comercial do Grupo Raiz', ask: 'Quais leads o time deve ligar primeiro hoje?', src: ['CRM', 'WhatsApp', 'Site'],
      ans: 'Lemos os 412 leads da semana. Estes estão prontos para comprar.', list: [['Empório Natural', 92], ['Rede Bem Viver', 88], ['Vida Leve', 81], ['Mercado Sul', 77]] }
  ];
  const DUR = 10.5, body = $('#chatBody'), bars = $$('#chatBars i');
  let scene = -1, t0 = 0, acc = 0, last = 0, paused = false, chatOn = false, nodes = null;
  function build(i) {
    const s = SCENES[i]; $('#chatWho').textContent = s.who;
    body.innerHTML = `<div class="msg">${s.ask}</div><div class="check">Cruzando as fontes<div class="chips">${s.src.map(x => `<span>${x}</span>`).join('')}</div></div>
      <div class="msg kon"><span class="who">${SYM}Kon</span>${s.ans}${s.list ? `<ol>${s.list.map(([n, v]) => `<li><span>${n}</span><b>${v}</b></li>`).join('')}</ol>` : ''}<span class="ex">Exemplo</span></div>`;
    nodes = { ask: body.children[0], chk: body.children[1], chips: $$('.chips span', body), ans: body.children[2] };
  }
  function chatTick(ms) {
    const dt = last ? (ms - last) / 1000 : 0; last = ms;
    if (!paused) acc += dt;
    const i = Math.floor(acc / DUR) % SCENES.length, u = acc % DUR;
    if (i !== scene) { scene = i; build(i); }
    nodes.ask.classList.toggle('in', u > .3);
    nodes.chk.classList.toggle('in', u > 1.2);
    nodes.chips.forEach((c, j) => c.classList.toggle('on', u > 1.6 + j * .45));
    nodes.ans.classList.toggle('in', u > 1.9 + nodes.chips.length * .45);
    bars.forEach((b, j) => b.style.width = (j < i ? 100 : j > i ? 0 : u / DUR * 100) + '%');
    if (chatOn) requestAnimationFrame(chatTick);
  }
  const pauseBtn = $('#chatPause');
  pauseBtn.addEventListener('click', () => { paused = !paused; pauseBtn.classList.toggle('paused', paused); pauseBtn.setAttribute('aria-label', paused ? 'Retomar animação' : 'Pausar animação'); });
  if (reduce) { paused = true; acc = DUR - .01; pauseBtn.classList.add('paused'); }
  new IntersectionObserver(([e]) => { const was = chatOn; chatOn = e.isIntersecting; if (chatOn && !was) { last = 0; requestAnimationFrame(chatTick); } }, { threshold: .2 }).observe($('#chat'));

  /* método: linha avança com a rolagem */
  const method = $('#method'), mItems = $$('#method li');
  function methodScroll() {
    const r = method.getBoundingClientRect(), vh = innerHeight;
    const p = Math.min(1, Math.max(0, (vh * .78 - r.top) / (r.height + vh * .2)));
    method.style.setProperty('--p', p);
    mItems.forEach((li, i) => li.classList.toggle('on', p >= i / (mItems.length - 1) - .02));
  }
  addEventListener('scroll', methodScroll, { passive: true }); methodScroll();

  /* fechamento: o feixe nasce do ponto do símbolo */
  const cta = $('#diagnostico'), sym = $('#ctaSym'), beam = $('#ctaBeam');
  function placeCta() {
    const w = cta.clientWidth, h = cta.clientHeight, mob = w < 720;
    const s = mob ? 1.9 : Math.min(3.6, Math.max(2.4, w / 420));
    const left = mob ? 20 : w * .56, top = mob ? 40 : h / 2 - 50 * s;
    sym.style.setProperty('--s', s + 'px'); sym.style.left = left + 'px'; sym.style.top = top + 'px';
    const px = left + 68 * s, py = top + 50 * s;
    const need = (w - px) / .58 / .75 * 1.02, bh = mob ? need : Math.max(h * 1.35, need), bw = bh * .75;
    beam.style.height = bh + 'px'; beam.style.width = bw + 'px'; beam.style.left = (px - bw * .0467) + 'px'; beam.style.top = (py - bh / 2) + 'px';
    cta.style.paddingTop = mob ? (py + bh * .45 + 24) + 'px' : '';
  }
  placeCta(); addEventListener('resize', placeCta);
  new IntersectionObserver(([e]) => { if (e.isIntersecting) cta.classList.add('in'); }, { threshold: .3 }).observe(cta);
})();
