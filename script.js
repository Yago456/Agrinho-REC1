// Estado e utilidades
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

const state = {
  theme: localStorage.getItem('theme') || 'dark',
  tecnologias: [
    {
      titulo: 'Sensores IoT de Temperatura e Umidade',
      categoria: 'sensoriamento',
      tags: ['IoT', 'monitoramento', 'alertas'],
      impacto: 'Reduz perdas por superaquecimento e condensação com alertas em tempo real.',
      detalhe: 'Dispositivos registram dados por minuto e enviam para a nuvem via 4G/LoRa.'
    },
    {
      titulo: 'Embalagens Ativas (Sachet Antimicrobiano)',
      categoria: 'embalagem',
      tags: ['embalagem', 'vida de prateleira'],
      impacto: 'Inibe crescimento microbiano dentro da embalagem, prolongando a qualidade.',
      detalhe: 'Sachets liberam compostos naturais que reduzem fungos e bactérias.'
    },
    {
      titulo: 'Atmosfera Controlada / Modificada',
      categoria: 'armazenamento',
      tags: ['O2/CO2', 'respiração', 'frutas'],
      impacto: 'Diminui a taxa respiratória e o amadurecimento de produtos sensíveis.',
      detalhe: 'Controle de gases em câmaras frias para uvas, maçãs, bananas etc.'
    },
    {
      titulo: 'Refrigeração por Cadeia do Frio',
      categoria: 'logistica',
      tags: ['frio', 'transporte', 'câmara fria'],
      impacto: 'Mantém temperatura ideal do campo ao varejo, evitando perdas térmicas.',
      detalhe: 'Pré-resfriamento, transporte refrigerado e docas com isolamento.'
    },
    {
      titulo: 'Rastreabilidade por Blockchain',
      categoria: 'digital',
      tags: ['rastreabilidade', 'qualidade', 'confiança'],
      impacto: 'Registra eventos imutáveis da cadeia, facilitando recalls e premiando boas práticas.',
      detalhe: 'Cada lote recebe um ID; eventos são assinados e consultáveis por QR Code.'
    },
    {
      titulo: 'Visão Computacional para Classificação',
      categoria: 'digital',
      tags: ['IA', 'classificação', 'qualidade'],
      impacto: 'Classifica defeitos e calibres com alta consistência, reduzindo retrabalho.',
      detalhe: 'Câmeras + IA detectam danos mecânicos, manchas e calibres automaticamente.'
    },
    {
      titulo: 'Secagem Solar Assistida',
      categoria: 'armazenamento',
      tags: ['umidade', 'grãos', 'energia'],
      impacto: 'Reduz umidade de grãos com menor custo energético, evitando mofo e pragas.',
      detalhe: 'Coletores e ventilação forçada aceleram a secagem com controle de fluxo.'
    },
    {
      titulo: 'Embalagens Biodegradáveis Ventiladas',
      categoria: 'embalagem',
      tags: ['sustentabilidade', 'ventilação'],
      impacto: 'Melhora a circulação de ar e reduz danos por compressão.',
      detalhe: 'Estruturas reforçadas e respiros otimizados em polímeros biodegradáveis.'
    },
    {
      titulo: 'Analytics Preditivo',
      categoria: 'digital',
      tags: ['modelos', 'prever perdas'],
      impacto: 'Antecipação de riscos combinando clima, logística e histórico de qualidade.',
      detalhe: 'Modelos estimam pontos críticos e sugerem ações preventivas.'
    },
    {
      titulo: 'Biocontrole Pós-Colheita',
      categoria: 'armazenamento',
      tags: ['biológico', 'fungos'],
      impacto: 'Uso de microrganismos benéficos para reduzir podridões.',
      detalhe: 'Aplicações direcionadas diminuem fungicidas e mantêm qualidade.'
    }
  ]
};

// Tema
function applyTheme(t) {
  document.documentElement.setAttribute('data-theme', t === 'light' ? 'light' : 'dark');
  const btn = $('#themeToggle');
  const light = t === 'light';
  btn.textContent = light ? '🌞' : '🌙';
  btn.setAttribute('aria-pressed', String(light));
}
applyTheme(state.theme);
$('#themeToggle').addEventListener('click', () => {
  state.theme = state.theme === 'dark' ? 'light' : 'dark';
  localStorage.setItem('theme', state.theme);
  applyTheme(state.theme);
});

// Ano no rodapé
$('#year').textContent = new Date().getFullYear();

// Renderização de cards com filtro/busca
const cardsEl = $('#cards');
function renderCards() {
  const cat = $('#filtroCategoria').value;
  const q = $('#busca').value.trim().toLowerCase();
  cardsEl.innerHTML = '';

  const items = state.tecnologias.filter(t => {
    const inCat = cat === 'todas' || t.categoria === cat;
    const inText = [t.titulo, t.impacto, t.detalhe, ...(t.tags || [])].join(' ').toLowerCase().includes(q);
    return inCat && inText;
  });

  if (!items.length) {
    cardsEl.innerHTML = `<p class="note">Nenhum resultado para os filtros aplicados.</p>`;
    return;
  }

  for (const t of items) {
    const el = document.createElement('article');
    el.className = 'card';
    el.innerHTML = `
      <div class="meta">
        <span class="badge">${t.categoria}</span>
        ${t.tags?.slice(0,2).map(tag => `<span class="tag">${tag}</span>`).join('')}
      </div>
      <h3>${t.titulo}</h3>
      <p>${t.impacto}</p>
      <details>
        <summary>Saiba mais</summary>
        <p class="note">${t.detalhe}</p>
      </details>
    `;
    cardsEl.appendChild(el);
  }
}
$('#filtroCategoria').addEventListener('change', renderCards);
$('#busca').addEventListener('input', renderCards);
renderCards();

// Gráfico simples em canvas (sem libs)
const canvas = document.getElementById('perdasChart');
const ctx = canvas.getContext('2d');
let series = [
  { etapa: 'Colheita', valor: 10 },
  { etapa: 'Armazenagem', valor: 25 },
  { etapa: 'Transporte', valor: 18 },
  { etapa: 'Distribuição', valor: 12 },
  { etapa: 'Varejo', valor: 8 }
];

function drawChart(data) {
  const W = canvas.width, H = canvas.height;
  ctx.clearRect(0, 0, W, H);
  // Fundo gradiente
  const g = ctx.createLinearGradient(0, 0, 0, H);
  g.addColorStop(0, 'rgba(91,140,255,0.2)');
  g.addColorStop(1, 'rgba(33,212,180,0.1)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, H);

  const pad = 36;
  const bw = (W - pad * 2) / data.length;
  const maxV = Math.max(...data.map(d => d.valor), 1);
  // Eixos
  ctx.strokeStyle = 'rgba(255,255,255,0.2)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(pad, H - pad);
  ctx.lineTo(W - pad, H - pad);
  ctx.moveTo(pad, pad);
  ctx.lineTo(pad, H - pad);
  ctx.stroke();

  // Barras
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

    // Rótulos
    ctx.fillStyle = '#aab3d0';
    ctx.font = '12px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(d.etapa, x + w / 2, H - pad + 14);
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 12px Inter, sans-serif';
    ctx.fillText(d.valor + '%', x + w / 2, y - 6);
  });
}
drawChart(series);

// Modal educativo + interação de “pico” térmico
const modal = $('#modal');
$('#openModal').addEventListener('click', () => modal.classList.add('show'));
$('#closeModal').addEventListener('click', () => modal.classList.remove('show'));
modal.addEventListener('click', (e) => { if (e.target === modal) modal.classList.remove('show'); });

$('#simulateSpike').addEventListener('click', () => {
  // Simula alerta: aumenta perdas de Transporte temporariamente, depois aplica correção
  const backup = JSON.parse(JSON.stringify(series));
  const idx = series.findIndex(s => s.etapa === 'Transporte');
  if (idx >= 0) {
    series[idx].valor = Math.min(40, series[idx].valor + 12);
    drawChart(series);
    // Mensagem rápida
    flash('Alerta: pico de temperatura detectado no transporte! Ajustando refrigeração...');
    setTimeout(() => {
      series[idx].valor = Math.max(5, series[idx].valor - 16);
      drawChart(series);
      flash('Ação corretiva aplicada. Perdas projetadas reduzidas.');
    }, 1500);
    // Restaura média suave após demonstração
    setTimeout(() => {
      series = backup;
      drawChart(series);
    }, 3500);
  }
});

// Simulador de perdas
const loteKg = $('#loteKg');
const perdaAtual = $('#perdaAtual');
const efetividade = $('#efetividade');
const outAtual = $('#perdaAtualOut');
const outEfet = $('#efetividadeOut');
const kgPerdaAtual = $('#kgPerdaAtual');
const kgPerdaNova = $('#kgPerdaNova');
const kgEconomia = $('#kgEconomia');

function updateSim() {
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
function clamp(v, min, max) { return Math.max(min, Math.min(v, max)); }
[loteKg, perdaAtual, efetividade].forEach(i => i.addEventListener('input', updateSim));
updateSim();

// Formulário: validação simples e feedback
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
  status.style.color = type === 'error' ? 'var(--danger)' : type === 'success' ? 'var(--accent)' : 'var(--muted)';
}

// Notificações leves
function flash(msg) {
  const n = document.createElement('div');
  n.textContent = msg;
  n.style.position = 'fixed';
  n.style.left = '50%';
  n.style.top = '18px';
  n.style.transform = 'translateX(-50%)';
  n.style.background = 'var(--card)';
  n.style.border = '1px solid rgba(255,255,255,0.12)';
  n.style.padding = '10px 14px';
  n.style.borderRadius = '10px';
  n.style.color = 'var(--text)';
  n.style.boxShadow = 'var(--shadow)';
  n.style.zIndex = '100';
  document.body.appendChild(n);
  setTimeout(() => { n.remove(); }, 1800);
}
