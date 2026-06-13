// ===== Utilidades =====
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
const clamp = (v, min, max) => Math.max(min, Math.min(v, max));

// ===== Mock "banco de dados" de notícias =====
const noticias = [
  {
    id: 1,
    titulo: 'Sensores IoT de temperatura e umidade chegam às pequenas propriedades',
    categoria: 'sensoriamento',
    tags: ['IoT', 'monitoramento'],
    data: '2026-06-08',
    destaque: true,
    icone: '📡',
    resumo: 'Dispositivos conectados monitoram câmaras frias e silos em tempo real, enviando alertas via 4G/LoRa.',
    detalhe: 'Os sensores registram dados a cada minuto e disparam alertas automáticos quando a temperatura ou umidade saem da faixa ideal, permitindo correções rápidas antes que o produto seja perdido.'
  },
  {
    id: 2,
    titulo: 'Embalagens ativas com sachês antimicrobianos prolongam vida de prateleira',
    categoria: 'embalagem',
    tags: ['embalagem', 'qualidade'],
    data: '2026-06-07',
    destaque: true,
    icone: '📦',
    resumo: 'Sachês liberam compostos naturais que inibem fungos e bactérias dentro da embalagem.',
    detalhe: 'A tecnologia tem se mostrado eficaz em frutas e hortaliças, retardando o aparecimento de mofo e aumentando o tempo de comercialização sem uso de conservantes químicos adicionais.'
  },
  {
    id: 3,
    titulo: 'Atmosfera controlada reduz amadurecimento acelerado de frutas sensíveis',
    categoria: 'armazenamento',
    tags: ['O2/CO2', 'frutas'],
    data: '2026-06-05',
    destaque: true,
    icone: '🍇',
    resumo: 'Câmaras com controle de gases diminuem a respiração de uvas, maçãs e bananas, evitando perdas.',
    detalhe: 'Ao ajustar os níveis de oxigênio e dióxido de carbono no ambiente de armazenamento, é possível retardar significativamente o processo de maturação, mantendo a qualidade por mais tempo.'
  },
  {
    id: 4,
    titulo: 'Cadeia do frio integrada evita perdas térmicas do campo ao varejo',
    categoria: 'logistica',
    tags: ['frio', 'transporte'],
    data: '2026-06-03',
    destaque: false,
    icone: '🚛',
    resumo: 'Pré-resfriamento, transporte refrigerado e docas isoladas garantem temperatura constante.',
    detalhe: 'A interrupção da cadeia do frio em qualquer ponto é uma das principais causas de perdas pós-colheita. Soluções integradas de logística refrigerada têm reduzido drasticamente esse problema.'
  },
  {
    id: 5,
    titulo: 'Rastreabilidade por blockchain dá mais confiança ao consumidor',
    categoria: 'digital',
    tags: ['rastreabilidade', 'confiança'],
    data: '2026-06-01',
    destaque: false,
    icone: '🔗',
    resumo: 'Cada lote recebe um ID único, com eventos da cadeia registrados e consultáveis via QR Code.',
    detalhe: 'O registro imutável de eventos facilita recalls rápidos, comprova boas práticas e abre portas para mercados internacionais mais exigentes em relação à origem dos alimentos.'
  },
  {
    id: 6,
    titulo: 'Visão computacional classifica frutas e reduz retrabalho nas centrais',
    categoria: 'digital',
    tags: ['IA', 'classificação'],
    data: '2026-05-29',
    destaque: false,
    icone: '🤖',
    resumo: 'Câmeras com inteligência artificial detectam danos, manchas e calibre automaticamente.',
    detalhe: 'O sistema analisa centenas de itens por minuto, separando produtos por qualidade com mais consistência do que a triagem manual, reduzindo desperdício por classificação incorreta.'
  },
  {
    id: 7,
    titulo: 'Secagem solar assistida diminui perdas de grãos por umidade',
    categoria: 'armazenamento',
    tags: ['grãos', 'energia'],
    data: '2026-05-26',
    destaque: false,
    icone: '☀️',
    resumo: 'Coletores solares e ventilação forçada aceleram a secagem com baixo custo energético.',
    detalhe: 'Reduzir a umidade dos grãos rapidamente após a colheita evita o surgimento de fungos e pragas durante o armazenamento, um dos principais vilões das perdas em silos.'
  },
  {
    id: 8,
    titulo: 'Analytics preditivo ajuda produtores a antecipar riscos climáticos',
    categoria: 'digital',
    tags: ['dados', 'previsão'],
    data: '2026-05-22',
    destaque: false,
    icone: '📊',
    resumo: 'Modelos combinam dados climáticos e logísticos para prever pontos críticos de perda.',
    detalhe: 'Com base em históricos de qualidade, clima e rotas de transporte, os modelos sugerem ações preventivas, como antecipar colheitas ou ajustar rotas de distribuição.'
  }
];

// ===== Tema (Dark Mode com localStorage) =====
function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme === 'light' ? 'light' : 'dark');
  const btn = $('#themeToggle');
  const isLight = theme === 'light';
  btn.textContent = isLight ? '🌞' : '🌙';
  btn.setAttribute('aria-pressed', String(isLight));
}

function initTheme() {
  const saved = localStorage.getItem('theme') || 'dark';
  applyTheme(saved);
  $('#themeToggle').addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
    const next = current === 'light' ? 'dark' : 'light';
    localStorage.setItem('theme', next);
    applyTheme(next);
  });
}

// ===== Menu Hambúrguer =====
function initMenu() {
  const btn = $('#hamburger');
  const nav = $('#mainNav');

  btn.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');
    btn.setAttribute('aria-expanded', String(isOpen));
    btn.setAttribute('aria-label', isOpen ? 'Fechar menu' : 'Abrir menu');
  });

  // Fecha o menu ao clicar em um link (mobile)
  $$('#mainNav a').forEach(a => {
    a.addEventListener('click', () => {
      nav.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
      btn.setAttribute('aria-label', 'Abrir menu');
    });
  });
}

// ===== Renderização dos Destaques =====
function renderDestaques() {
  const grid = $('#destaquesGrid');
  const itens = noticias.filter(n => n.destaque);
  grid.innerHTML = itens.map(n => `
    <article class="destaque-card" data-id="${n.id}">
      <div class="destaque-thumb">${n.icone}</div>
      <div class="destaque-body">
        <span class="badge">${n.categoria}</span>
        <h3>${n.titulo}</h3>
        <p>${n.resumo}</p>
      </div>
    </article>
  `).join('');

  $$('.destaque-card', grid).forEach(card => {
    card.addEventListener('click', () => abrirModal(Number(card.dataset.id)));
  });
}

// ===== Renderização do Feed (com filtro e busca) =====
function renderFeed() {
  const cardsEl = $('#cards');
  const cat = $('#filtroCategoria').value;
  const q = $('#busca').value.trim().toLowerCase();

  const itens = noticias
    .filter(n => {
      const inCat = cat === 'todas' || n.categoria === cat;
      const texto = [n.titulo, n.resumo, n.detalhe, ...(n.tags || [])].join(' ').toLowerCase();
      const inText = texto.includes(q);
      return inCat && inText;
    })
    .sort((a, b) => new Date(b.data) - new Date(a.data));

  if (!itens.length) {
    cardsEl.innerHTML = `<p class="note">Nenhuma notícia encontrada para os filtros aplicados.</p>`;
    return;
  }

  cardsEl.innerHTML = itens.map(n => `
    <article class="card" data-id="${n.id}">
      <div class="meta">
        <span class="badge">${n.categoria}</span>
        ${n.tags.slice(0, 2).map(t => `<span class="tag">${t}</span>`).join('')}
      </div>
      <h3>${n.icone} ${n.titulo}</h3>
      <p>${n.resumo}</p>
      <span class="card-date">${formatarData(n.data)}</span>
    </article>
  `).join('');

  $$('.card', cardsEl).forEach(card => {
    card.addEventListener('click', () => abrirModal(Number(card.dataset.id)));
  });
}

function formatarData(iso) {
  const d = new Date(iso + 'T00:00:00');
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });
}

// ===== Modal de notícia =====
function abrirModal(id) {
  const noticia = noticias.find(n => n.id === id);
  if (!noticia) return;

  $('#modalBadge').textContent = noticia.categoria;
  $('#modalTitle').textContent = `${noticia.icone} ${noticia.titulo}`;
  $('#modalText').textContent = noticia.resumo;
  $('#modalDetail').textContent = noticia.detalhe;

  $('#modal').classList.add('show');
}

function initModal() {
  const modal = $('#modal');
  $('#closeModal').addEventListener('click', () => modal.classList.remove('show'));
  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.classList.remove('show');
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') modal.classList.remove('show');
  });
}

// ===== Gráfico em canvas (sem libs) =====
function drawChart() {
  const canvas = $('#perdasChart');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const data = [
    { etapa: 'Colheita', valor: 10 },
    { etapa: 'Armazenagem', valor: 25 },
    { etapa: 'Transporte', valor: 18 },
    { etapa: 'Distribuição', valor: 12 },
    { etapa: 'Varejo', valor: 8 }
  ];

  const W = canvas.width, H = canvas.height;
  ctx.clearRect(0, 0, W, H);

  const g = ctx.createLinearGradient(0, 0, 0, H);
  g.addColorStop(0, 'rgba(91,140,255,0.2)');
  g.addColorStop(1, 'rgba(33,212,180,0.1)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, H);

  const pad = 36;
  const bw = (W - pad * 2) / data.length;
  const maxV = Math.max(...data.map(d => d.valor), 1);

  ctx.strokeStyle = 'rgba(255,255,255,0.2)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(pad, H - pad);
  ctx.lineTo(W - pad, H - pad);
  ctx.moveTo(pad, pad);
  ctx.lineTo(pad, H - pad);
  ctx.stroke();

  data.forEach((d, i) => {
    const h = ((H - pad * 2) * d.valor) / maxV;
    const x = pad + i * bw + bw * 0.15;
    const y = H - pad - h;
    const w = bw * 0.7;

    const grad = ctx.createLinearGradient(0, y, 0, y + h);
    grad.addColorStop(0, '#5b8cff');
    grad.addColorStop(1, '#21d4b4');
    ctx.fillStyle = grad;
    ctx.fillRect(x, y, w, h);

    ctx.fillStyle = '#aab3d0';
    ctx.font = '12px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(d.etapa, x + w / 2, H - pad + 14);

    ctx.fillStyle = '#fff';
    ctx.font = 'bold 12px Inter, sans-serif';
    ctx.fillText(d.valor + '%', x + w / 2, y - 6);
  });
}

// ===== Simulador de perdas =====
function initSimulador() {
  const loteKg = $('#loteKg');
  const perdaAtual = $('#perdaAtual');
  const efetividade = $('#efetividade');
  const outAtual = $('#perdaAtualOut');
  const outEfet = $('#efetividadeOut');
  const kgPerdaAtual = $('#kgPerdaAtual');
  const kgPerdaNova = $('#kgPerdaNova');
  const kgEconomia = $('#kgEconomia');

  function update() {
    const lote = clamp(Number(loteKg.value) || 0, 100, 1000000);
    const pAtual = clamp(Number(perdaAtual.value) || 0, 0, 100);
    const efet = clamp(Number(efetividade.value) || 0, 0, 100);

    outAtual.textContent = pAtual + '%';
    outEfet.textContent = efet + '%';

    const perdaKg = Math.round(lote * (pAtual / 100));
    const perdaNovaPerc = pAtual * (1 - efet / 100);
    const perdaNovaKg = Math.round(lote * (perdaNovaPerc / 100));
    const economia = perdaKg - perdaNovaKg;

    kgPerdaAtual.textContent = perdaKg.toLocaleString('pt-BR');
    kgPerdaNova.textContent = perdaNovaKg.toLocaleString('pt-BR');
    kgEconomia.textContent = economia.toLocaleString('pt-BR');
  }

  [loteKg, perdaAtual, efetividade].forEach(i => i.addEventListener('input', update));
  update();
}

// ===== Formulário de contato =====
function initForm() {
  const form = $('#contatoForm');
  const status = $('#formStatus');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(form));
    const ok = data.nome && data.email && data.assunto && data.mensagem && /\S+@\S+\.\S+/.test(data.email);

    if (!ok) {
      setStatus('Por favor, preencha todos os campos com um e-mail válido.', 'error');
      return;
    }

    setStatus('Enviando...', 'pending');
    setTimeout(() => {
      setStatus('Mensagem enviada! Obrigado pelo contato.', 'success');
      form.reset();
    }, 900);
  });

  function setStatus(msg, type) {
    status.textContent = msg;
    status.style.color = type === 'error' ? 'var(--danger)'
      : type === 'success' ? 'var(--accent)'
      : 'var(--muted)';
  }
}

// ===== Inicialização geral =====
document.addEventListener('DOMContentLoaded', () => {
  $('#year').textContent = new Date().getFullYear();

  initTheme();
  initMenu();
  initModal();

  renderDestaques();
  renderFeed();

  $('#filtroCategoria').addEventListener('change', renderFeed);
  $('#busca').addEventListener('input', renderFeed);

  drawChart();
  initSimulador();
  initForm();
});
