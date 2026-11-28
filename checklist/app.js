/* =========================================================
   FV Vidros — Check-list de entrada de veículos
   Tudo fica salvo no próprio aparelho (IndexedDB), funciona offline.
   ========================================================= */
'use strict';

const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];

/* ---------------- Dados fixos do formulário ---------------- */
const EMPRESA = { nome: 'F. V. Vidros Automotivos e Acessórios LTDA', cnpj: '31.911.270/0001-88' };

const ITENS = [
  ['antena', 'Antena'], ['documentos', 'Documentos'],
  ['calotas', 'Calotas'], ['manual', 'Manual'],
  ['tapetes', 'Tapetes'], ['chaveRoda', 'Chave de roda'],
  ['radio', 'Rádio'], ['macaco', 'Macaco'],
  ['extintor', 'Extintor'], ['triangulo', 'Triângulo'],
];
const N_EXTRAS = 5; // linhas em branco do formulário de papel

const PNEUS = [['DD', 'Diant. direito'], ['DE', 'Diant. esquerdo'], ['TD', 'Tras. direito'], ['TE', 'Tras. esquerdo'], ['EST', 'Estepe']];
const COMBUSTIVEL = [['1', '100%'], ['3/4', '75%'], ['1/2', '50%'], ['1/4', '25%'], ['0', '0%']];

const SERVICOS = ['Para-Brisa', 'Vigia', 'Vidro de Porta', 'Rep. Para-Brisa', 'Borracha', 'Máq. de Vidro', 'Mão de Obra',
  'Palheta', 'Chassi', 'Farol', 'Lanterna', 'Retrov', 'Rem. e Inst.', 'Película', 'Acessórios', 'Polimento'];

const TIPOS_AVARIA = { A: 'Amassado', R: 'Riscado', Q: 'Quebrado', T: 'Trincado', F: 'Faltando' };
const PAGAMENTOS = { pix: 'PIX', dinheiro: 'Dinheiro', debito: 'Débito', credito: 'Crédito' };

const MONTADORAS = ['Fiat', 'Volkswagen', 'Chevrolet', 'Ford', 'Toyota', 'Honda', 'Hyundai', 'Renault', 'Nissan', 'Jeep',
  'Peugeot', 'Citroën', 'Mitsubishi', 'Kia', 'BYD', 'Caoa Chery', 'BMW', 'Mercedes-Benz', 'Audi', 'Volvo', 'Land Rover', 'RAM', 'Suzuki', 'JAC', 'GWM'];

/* ---------------- Desenhos do veículo (SVG) ---------------- */
const VISTAS = {
  frente: { nome: 'Frente', vb: '0 0 220 150', svg: `
    <path class="corpo" d="M30 98 Q30 72 50 64 L70 30 Q75 22 90 22 L130 22 Q145 22 150 30 L170 64 Q190 72 190 98 L190 118 L30 118 Z"/>
    <path class="vidro" d="M76 34 Q80 28 92 28 L128 28 Q140 28 144 34 L158 60 L62 60 Z"/>
    <path class="det" d="M62 60 L50 56 L48 64 L60 64 M158 60 L170 56 L172 64 L160 64"/>
    <ellipse class="luz" cx="54" cy="80" rx="15" ry="7"/><ellipse class="luz" cx="166" cy="80" rx="15" ry="7"/>
    <rect class="det" x="84" y="74" width="52" height="16" rx="4"/>
    <rect class="det" x="36" y="98" width="148" height="13" rx="5"/>
    <rect class="det" x="94" y="100" width="32" height="9" rx="1"/>
    <rect class="roda" x="38" y="118" width="26" height="18" rx="4"/><rect class="roda" x="156" y="118" width="26" height="18" rx="4"/>` },
  traseira: { nome: 'Traseira', vb: '0 0 220 150', svg: `
    <path class="corpo" d="M30 98 Q30 72 48 64 L68 30 Q73 22 88 22 L132 22 Q147 22 152 30 L172 64 Q190 72 190 98 L190 118 L30 118 Z"/>
    <path class="vidro" d="M78 34 Q82 28 94 28 L126 28 Q138 28 142 34 L152 58 L68 58 Z"/>
    <rect class="luz" x="36" y="70" width="34" height="14" rx="4"/><rect class="luz" x="150" y="70" width="34" height="14" rx="4"/>
    <rect class="det" x="90" y="76" width="40" height="12" rx="2"/>
    <path class="det" d="M70 66 L150 66"/>
    <rect class="det" x="36" y="98" width="148" height="13" rx="5"/>
    <rect class="roda" x="38" y="118" width="26" height="18" rx="4"/><rect class="roda" x="156" y="118" width="26" height="18" rx="4"/>` },
  esquerda: { nome: 'Lateral esquerda', vb: '0 0 360 150', largo: true, svg: ladoSvg() },
  teto: { nome: 'Teto / capô', vb: '0 0 360 150', largo: true, svg: `
    <path class="corpo" d="M28 75 Q28 28 82 24 L290 24 Q338 28 338 75 Q338 122 290 126 L82 126 Q28 122 28 75Z"/>
    <path class="vidro" d="M108 34 L148 42 L148 108 L108 116 Q98 75 108 34Z"/>
    <rect class="det" x="152" y="42" width="106" height="66" rx="8"/>
    <path class="vidro" d="M262 42 L292 36 Q300 75 292 114 L262 108Z"/>
    <path class="det" d="M40 50 Q60 75 40 100 M100 40 L60 34 M100 110 L60 116"/>
    <path class="det" d="M118 30 L112 18 L124 24 M118 120 L112 132 L124 126"/>` },
  direita: { nome: 'Lateral direita', vb: '0 0 360 150', largo: true, svg: `<g transform="translate(360 0) scale(-1 1)">${ladoSvg()}</g>` },
};
function ladoSvg() {
  return `
    <path class="corpo" d="M18 102 Q18 82 40 78 L96 70 Q122 40 152 34 L232 34 Q262 36 287 68 L330 76 Q346 80 346 102 L346 114 L18 114 Z"/>
    <path class="vidro" d="M110 70 Q130 46 154 42 L186 42 L186 70 Z"/>
    <path class="vidro" d="M194 42 L230 42 Q254 44 274 70 L194 70 Z"/>
    <path class="det" d="M190 40 L190 112 M110 72 L110 112 M276 72 L276 108"/>
    <path class="det" d="M150 82 L166 82 M232 82 L248 82"/>
    <path class="luz" d="M22 86 L38 82 L38 94 L20 96Z"/><path class="luz" d="M342 86 L330 82 L330 96 L344 96Z"/>
    <path class="det" d="M100 66 L92 60 L102 58"/>
    <circle class="roda" cx="78" cy="114" r="22"/><circle cx="78" cy="114" r="9" fill="#cfd8dc"/>
    <circle class="roda" cx="286" cy="114" r="22"/><circle cx="286" cy="114" r="9" fill="#cfd8dc"/>`;
}

/* ---------------- Banco de dados (IndexedDB) ---------------- */
const DB = {
  db: null,
  abrir() {
    return new Promise((ok, erro) => {
      const r = indexedDB.open('fv-checklist', 1);
      r.onupgradeneeded = () => {
        const s = r.result.createObjectStore('checklists', { keyPath: 'id' });
        s.createIndex('criadoEm', 'criadoEm');
      };
      r.onsuccess = () => { this.db = r.result; ok(); };
      r.onerror = () => erro(r.error);
    });
  },
  tx(modo, fn) {
    return new Promise((ok, erro) => {
      const t = this.db.transaction('checklists', modo);
      const req = fn(t.objectStore('checklists'));
      t.oncomplete = () => ok(req && req.result);
      t.onerror = () => erro(t.error);
    });
  },
  todos() { return this.tx('readonly', s => s.getAll()); },
  pegar(id) { return this.tx('readonly', s => s.get(id)); },
  salvar(o) { return this.tx('readwrite', s => s.put(o)); },
  excluir(id) { return this.tx('readwrite', s => s.delete(id)); },
};

/* ---------------- Configurações ---------------- */
const CFG_PADRAO = { proxCodigo: 1, proxVenda: 1, vendedores: [], tecnicos: [], pix: [] };
const cfg = () => ({ ...CFG_PADRAO, ...JSON.parse(localStorage.getItem('fv-cfg') || '{}') });
const salvarCfg = c => localStorage.setItem('fv-cfg', JSON.stringify(c));

/* ---------------- Utilidades ---------------- */
const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
const hojeISO = () => { const d = new Date(); d.setMinutes(d.getMinutes() - d.getTimezoneOffset()); return d.toISOString().slice(0, 10); };
const horaAgora = () => new Date().toTimeString().slice(0, 5);
const dataBR = iso => iso ? iso.split('-').reverse().join('/') : '';
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const soDig = s => String(s || '').replace(/\D/g, '');
const valorNum = s => Number(soDig(s)) / 100 || 0;
const moeda = n => n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

function getP(o, p) { return p.split('.').reduce((a, k) => (a == null ? undefined : a[k]), o); }
function setP(o, p, v) {
  const ks = p.split('.'); let a = o;
  ks.slice(0, -1).forEach(k => { if (typeof a[k] !== 'object' || a[k] === null) a[k] = {}; a = a[k]; });
  a[ks[ks.length - 1]] = v;
}

function toast(msg, erro = false) {
  const t = $('#toast');
  t.textContent = msg; t.classList.toggle('erro', erro); t.classList.add('on');
  clearTimeout(t._t); t._t = setTimeout(() => t.classList.remove('on'), 2600);
}

/* máscaras */
const MASCARAS = {
  tel(v) { v = soDig(v).slice(0, 11); if (v.length <= 2) return v; if (v.length <= 6) return `(${v.slice(0, 2)}) ${v.slice(2)}`; if (v.length <= 10) return `(${v.slice(0, 2)}) ${v.slice(2, 6)}-${v.slice(6)}`; return `(${v.slice(0, 2)}) ${v.slice(2, 7)}-${v.slice(7)}`; },
  doc(v) {
    v = soDig(v).slice(0, 14);
    if (v.length <= 11) return v.replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    return v.replace(/^(\d{2})(\d)/, '$1.$2').replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3').replace(/\.(\d{3})(\d)/, '.$1/$2').replace(/(\d{4})(\d)/, '$1-$2');
  },
  cep(v) { v = soDig(v).slice(0, 8); return v.length > 5 ? v.slice(0, 5) + '-' + v.slice(5) : v; },
  placa(v) { v = v.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 7); return v.length > 3 ? v.slice(0, 3) + '-' + v.slice(3) : v; },
  km(v) { v = soDig(v).slice(0, 7); return v ? Number(v).toLocaleString('pt-BR') : ''; },
  moeda(v) { v = soDig(v).slice(0, 10); return v ? (Number(v) / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2 }) : ''; },
};

/* ---------------- Roteador ---------------- */
const app = $('#app');
let limparTela = null;

async function rota() {
  if (limparTela) { limparTela(); limparTela = null; }
  const [, tela, id] = location.hash.split('/');
  const voltar = $('#btnVoltar');
  voltar.hidden = !tela;
  window.scrollTo(0, 0);
  try {
    if (!tela) return telaLista();
    if (tela === 'novo') return telaForm(null, id);
    if (tela === 'editar') return telaForm(id);
    if (tela === 'ver') return telaVer(id);
    if (tela === 'config') return telaConfig();
    location.hash = '#/';
  } catch (e) { console.error(e); toast('Erro: ' + e.message, true); }
}
function montar(tplId, titulo) {
  app.innerHTML = '';
  app.appendChild($(tplId).content.cloneNode(true));
  $('#tituloTela').textContent = titulo;
}
$('#btnVoltar').addEventListener('click', () => {
  if (location.hash.startsWith('#/editar') || location.hash.startsWith('#/novo')) {
    if (window._sujo && !confirm('Sair sem salvar as alterações?')) return;
  }
  history.length > 1 ? history.back() : (location.hash = '#/');
});

/* =========================================================
   TELA: LISTA
   ========================================================= */
async function telaLista() {
  montar('#tpl-lista', 'Check-list');
  const todos = (await DB.todos()).sort((a, b) => b.criadoEm - a.criadoEm);
  const hoje = hojeISO(), mes = hoje.slice(0, 7);

  $('#stHoje').textContent = todos.filter(c => c.data === hoje).length;
  $('#stAbertos').textContent = todos.filter(c => c.status !== 'finalizado').length;
  const doMes = todos.filter(c => (c.data || '').startsWith(mes));
  $('#stMes').textContent = doMes.length;
  $('#stValor').textContent = moeda(doMes.reduce((s, c) => s + valorNum(c.valor), 0));

  let filtro = 'todos';
  const desenhar = () => {
    const q = $('#busca').value.trim().toLowerCase();
    const qd = soDig(q);
    const lista = todos.filter(c => {
      if (filtro === 'aberto' && c.status === 'finalizado') return false;
      if (filtro === 'finalizado' && c.status !== 'finalizado') return false;
      if (!q) return true;
      const txt = [c.codigo, c.cliente?.nome, c.veiculo?.placa, c.veiculo?.modelo, c.veiculo?.montadora, c.numVenda].join(' ').toLowerCase();
      return txt.includes(q) || txt.replace(/-/g, '').includes(q.replace(/-/g, '')) || (qd.length >= 4 && soDig(c.cliente?.tel + c.cliente?.doc).includes(qd));
    });
    $('#vazio').hidden = lista.length > 0;
    $('#vazio').innerHTML = todos.length ? 'Nenhum resultado para a busca.' : 'Nenhum check-list ainda.<br>Toque em <b>Novo check-list</b> para começar.';
    $('#lista').innerHTML = lista.map(c => {
      const fin = c.status === 'finalizado';
      return `<li><a class="item ${fin ? '' : 'item--aberto'}" href="#/${fin ? 'ver' : 'editar'}/${c.id}">
        <span class="item__placa">${esc(c.veiculo?.placa || '———')}</span>
        <span class="item__info"><b>${esc(c.cliente?.nome || 'Sem nome')}</b>
          <small>${esc([c.veiculo?.montadora, c.veiculo?.modelo, c.veiculo?.ano].filter(Boolean).join(' · '))}</small>
          <span class="badge ${fin ? 'badge--ok' : ''}">${fin ? 'Finalizado' : 'Em andamento'}</span></span>
        <span class="item__lado">Cód. ${esc(c.codigo)}<br>${dataBR(c.data)}<b>${c.valor ? 'R$ ' + esc(c.valor) : ''}</b></span>
      </a></li>`;
    }).join('');
  };
  $('#busca').addEventListener('input', desenhar);
  $('#filtros').addEventListener('click', e => {
    const b = e.target.closest('.chip'); if (!b) return;
    $$('.chip', $('#filtros')).forEach(x => x.classList.toggle('ativo', x === b));
    filtro = b.dataset.f; desenhar();
  });
  desenhar();
}

/* =========================================================
   TELA: FORMULÁRIO
   ========================================================= */
async function telaForm(id, baseId) {
  let reg;
  const c = cfg();
  if (id) {
    reg = await DB.pegar(id);
    if (!reg) { toast('Check-list não encontrado', true); location.hash = '#/'; return; }
  } else {
    reg = { id: uid(), novo: true, codigo: String(c.proxCodigo), data: hojeISO(), numVenda: String(c.proxVenda), horaEntrada: horaAgora(), avaria: { marcas: [] }, fotos: [] };
    if (baseId) { // novo check-list aproveitando cliente/veículo
      const b = await DB.pegar(baseId);
      if (b) { reg.cliente = { ...b.cliente }; reg.veiculo = { ...b.veiculo }; }
    }
  }
  montar('#tpl-form', id ? `Editar · Cód. ${reg.codigo}` : 'Novo check-list');
  const form = $('#form');
  window._sujo = false;

  /* --- gerar partes dinâmicas --- */
  $('#itens').innerHTML = ITENS.map(([k, n]) => itemHtml(`itens.${k}`, `<span>${n}</span>`)).join('') +
    Array.from({ length: N_EXTRAS }, (_, i) => itemHtml(`extras.${i}.estado`, `<input data-k="extras.${i}.nome" placeholder="Outro item...">`)).join('');
  $('#pneus').innerHTML = PNEUS.map(([k, n]) => `<div class="pn"><b>${k} <small>· ${n}</small></b><div class="seg">
    ${['bom', 'regular', 'ruim'].map(v => `<label><input type="radio" name="pneus.${k}" value="${v}" data-k="pneus.${k}"><span>${v[0].toUpperCase() + v.slice(1)}</span></label>`).join('')}</div></div>`).join('');
  $('#comb').innerHTML = COMBUSTIVEL.map(([v, p]) => `<label><input type="radio" name="combustivel" value="${v}" data-k="combustivel"><span><i style="--n:${p}"></i>${v}</span></label>`).join('');
  $('#servicos').innerHTML = SERVICOS.map(s => `<label class="sv"><input type="checkbox" value="${s}" data-k="servicos" data-multi><span>${s}</span></label>`).join('');
  $('#carros').innerHTML = Object.entries(VISTAS).map(([k, v]) =>
    `<div class="carro ${v.largo ? 'carro--largo' : ''}"><svg viewBox="${v.vb}" data-vista="${k}">${v.svg}<g class="marcas"></g></svg><small>${v.nome}</small></div>`).join('');

  $('#dlMontadoras').innerHTML = MONTADORAS.map(m => `<option value="${m}">`).join('');
  $('#dlVendedores').innerHTML = c.vendedores.map(m => `<option value="${esc(m)}">`).join('');
  $('#dlTecnicos').innerHTML = c.tecnicos.map(m => `<option value="${esc(m)}">`).join('');
  const pixInput = $('[data-k="pagamento.pixConta"]');
  if (c.pix.length) { pixInput.setAttribute('list', 'dlPix'); form.insertAdjacentHTML('beforeend', `<datalist id="dlPix">${c.pix.map(p => `<option value="${esc(p)}">`).join('')}</datalist>`); }
  // clientes anteriores para autocompletar
  const anteriores = await DB.todos();
  const clientes = new Map();
  anteriores.forEach(r => { if (r.cliente?.nome) clientes.set(r.cliente.nome, r); });
  $('#dlClientes').innerHTML = [...clientes.keys()].map(n => `<option value="${esc(n)}">`).join('');

  /* --- preencher valores --- */
  preencher(form, reg);
  let marcas = [...(reg.avaria?.marcas || [])];
  let fotos = [...(reg.fotos || [])];
  desenharMarcas(); desenharFotos(); atualizarCond();

  /* --- assinaturas --- */
  const pads = $$('canvas[data-sig]').map(cv => criarAssinatura(cv, reg[cv.dataset.sig], () => (window._sujo = true)));
  const onResize = () => pads.forEach(p => p.ajustar());
  window.addEventListener('resize', onResize);
  limparTela = () => window.removeEventListener('resize', onResize);
  $$('[data-limpar]').forEach(b => b.addEventListener('click', () => pads.find(p => p.chave === b.dataset.limpar).limpar()));

  /* --- eventos --- */
  form.addEventListener('input', e => {
    window._sujo = true;
    const m = e.target.dataset.mask;
    if (m) { e.target.value = MASCARAS[m](e.target.value); e.target.classList.remove('erro'); }
    if (e.target.required) e.target.classList.remove('erro');
  });
  form.addEventListener('change', atualizarCond);
  // atalhos das seções (sem mudar a rota)
  $('#passos').addEventListener('click', e => {
    const a = e.target.closest('a'); if (!a) return;
    e.preventDefault(); $(a.getAttribute('href')).scrollIntoView({ behavior: 'smooth' });
  });

  // autocompletar cliente já atendido
  $('[data-k="cliente.nome"]').addEventListener('change', e => {
    const r = clientes.get(e.target.value);
    if (!r || $('[data-k="cliente.tel"]').value) return;
    ['doc', 'tel', 'endereco', 'bairro', 'cep'].forEach(k => { $(`[data-k="cliente.${k}"]`).value = r.cliente[k] || ''; });
    ['montadora', 'modelo', 'ano', 'placa'].forEach(k => { $(`[data-k="veiculo.${k}"]`).value = r.veiculo?.[k] || ''; });
    toast('Dados do cliente preenchidos');
  });

  // busca de CEP (ViaCEP) quando há internet
  $('#cep').addEventListener('blur', async e => {
    const cep = soDig(e.target.value);
    if (cep.length !== 8 || !navigator.onLine) return;
    try {
      const r = await fetch(`https://viacep.com.br/ws/${cep}/json/`).then(r => r.json());
      if (r.erro) return toast('CEP não encontrado', true);
      if (!$('#endereco').value) $('#endereco').value = [r.logradouro, r.localidade + '/' + r.uf].filter(Boolean).join(' - ');
      if (!$('#bairro').value) $('#bairro').value = r.bairro || '';
    } catch { /* sem internet: ignora */ }
  });

  $$('[data-agora]').forEach(b => b.addEventListener('click', () => { $(`[data-k="${b.dataset.agora}"]`).value = horaAgora(); window._sujo = true; }));
  $('#marcarTodos').addEventListener('click', () => { ITENS.forEach(([k]) => { $(`input[name="itens.${k}"][value="ok"]`).checked = true; }); window._sujo = true; });

  // avarias
  let tipo = 'A';
  $('#tiposAvaria').addEventListener('click', e => {
    const b = e.target.closest('.tipo'); if (!b) return;
    tipo = b.dataset.t; $$('.tipo').forEach(x => x.classList.toggle('ativo', x === b));
  });
  $('#carros').addEventListener('click', e => {
    const svg = e.target.closest('svg[data-vista]'); if (!svg) return;
    const mk = e.target.closest('.marca');
    if (mk) { marcas.splice(Number(mk.dataset.i), 1); }
    else {
      const pt = svg.createSVGPoint(); pt.x = e.clientX; pt.y = e.clientY;
      const p = pt.matrixTransform(svg.getScreenCTM().inverse());
      marcas.push({ v: svg.dataset.vista, x: Math.round(p.x), y: Math.round(p.y), t: tipo });
    }
    window._sujo = true; desenharMarcas();
  });
  $('#limparMarcas').addEventListener('click', () => { if (marcas.length && confirm('Remover todas as marcas de avaria?')) { marcas = []; desenharMarcas(); } });

  // fotos
  $('#inFotos').addEventListener('change', async e => {
    for (const f of e.target.files) { try { fotos.push(await reduzirImagem(f)); } catch { toast('Não foi possível ler uma foto', true); } }
    e.target.value = ''; window._sujo = true; desenharFotos();
  });
  $('#fotos').addEventListener('click', e => {
    const b = e.target.closest('button[data-i]'); if (!b) return;
    fotos.splice(Number(b.dataset.i), 1); window._sujo = true; desenharFotos();
  });

  // salvar
  const salvar = async finalizar => {
    const dados = coletar(form);
    if (finalizar) {
      const faltando = $$('[required]', form).filter(i => !i.value.trim());
      faltando.forEach(i => i.classList.add('erro'));
      if (faltando.length) {
        faltando[0].scrollIntoView({ behavior: 'smooth', block: 'center' }); faltando[0].focus({ preventScroll: true });
        return toast('Preencha os campos obrigatórios (*)', true);
      }
      if (!pads.find(p => p.chave === 'assinaturaCliente').temDesenho()) {
        if (!confirm('O cliente ainda não assinou. Finalizar mesmo assim?')) { $('#s-assin').scrollIntoView({ behavior: 'smooth' }); return; }
      }
    }
    const final = {
      ...reg, ...dados,
      avaria: { ...dados.avaria, marcas }, fotos,
      assinaturaCliente: pads[0].valor(), assinaturaLoja: pads[1].valor(),
      status: finalizar ? 'finalizado' : (reg.status === 'finalizado' ? 'finalizado' : 'aberto'),
      atualizadoEm: Date.now(), criadoEm: reg.criadoEm || Date.now(),
    };
    if (finalizar && !final.horaSaida) final.horaSaida = horaAgora();
    const eraNovo = final.novo; delete final.novo;
    await DB.salvar(final);
    if (eraNovo) { // avança a numeração
      const cc = cfg();
      cc.proxCodigo = Math.max(cc.proxCodigo, (parseInt(final.codigo) || 0) + 1);
      if (final.numVenda) cc.proxVenda = Math.max(cc.proxVenda, (parseInt(final.numVenda) || 0) + 1);
      // guarda nomes da equipe para autocompletar
      [['vendedores', final.vendedor], ['vendedores', final.vistoriador], ['tecnicos', final.tecnico]].forEach(([l, n]) => { if (n && !cc[l].includes(n)) cc[l].push(n); });
      salvarCfg(cc);
    }
    reg = final; window._sujo = false;
    toast(finalizar ? 'Check-list finalizado!' : 'Salvo');
    location.replace(finalizar ? `#/ver/${final.id}` : `#/editar/${final.id}`);
  };
  $('#btnRascunho').addEventListener('click', () => salvar(false));
  form.addEventListener('submit', e => { e.preventDefault(); salvar(true); });

  /* --- funções internas --- */
  function desenharMarcas() {
    $$('svg[data-vista]').forEach(svg => {
      svg.querySelector('.marcas').innerHTML = marcas.map((m, i) => m.v !== svg.dataset.vista ? '' :
        `<g class="marca" data-i="${i}"><circle cx="${m.x}" cy="${m.y}" r="9"/><text x="${m.x}" y="${m.y}">${m.t}</text></g>`).join('');
    });
  }
  function desenharFotos() {
    $('#fotos').innerHTML = fotos.map((f, i) => `<div class="foto"><img src="${f}" alt="Foto ${i + 1}"><button type="button" data-i="${i}" aria-label="Remover">×</button></div>`).join('');
  }
  function atualizarCond() {
    $$('.cond', form).forEach(el => {
      const [k, v] = el.dataset.show.split('=');
      const sel = form.querySelector(`input[name="${k}"]:checked`);
      el.classList.toggle('mostrar', !!sel && sel.value === v);
    });
  }
}

function itemHtml(k, nome) {
  return `<div class="it"><span class="it__nome">${nome}</span><div class="tri">
    <label title="Existente"><input type="radio" name="${k}" value="ok" data-k="${k}"><span>✓</span></label>
    <label title="Inexistente"><input type="radio" name="${k}" value="x" data-k="${k}"><span>X</span></label>
    <label title="Avariado"><input type="radio" name="${k}" value="a" data-k="${k}"><span>A</span></label></div></div>`;
}

/* lê todos os campos [data-k] do formulário em um objeto */
function coletar(form) {
  const o = {};
  $$('[data-k]', form).forEach(el => {
    const k = el.dataset.k;
    if (el.type === 'radio') { if (el.checked) setP(o, k, el.value); else if (getP(o, k) === undefined) setP(o, k, ''); }
    else if (el.type === 'checkbox' && el.hasAttribute('data-multi')) { const a = getP(o, k) || []; if (el.checked) a.push(el.value); setP(o, k, a); }
    else if (el.type === 'checkbox') setP(o, k, el.checked);
    else setP(o, k, el.value.trim());
  });
  if (o.extras) o.extras = Object.keys(o.extras).sort().map(i => o.extras[i]);
  return o;
}
function preencher(form, reg) {
  $$('[data-k]', form).forEach(el => {
    const v = getP(reg, el.dataset.k);
    if (el.type === 'radio') el.checked = v === el.value;
    else if (el.type === 'checkbox' && el.hasAttribute('data-multi')) el.checked = Array.isArray(v) && v.includes(el.value);
    else if (el.type === 'checkbox') el.checked = !!v;
    else if (v != null) el.value = v;
  });
}

/* reduz a foto para economizar espaço no aparelho */
function reduzirImagem(file, max = 1280) {
  return new Promise((ok, erro) => {
    const img = new Image();
    img.onload = () => {
      const s = Math.min(1, max / Math.max(img.width, img.height));
      const cv = document.createElement('canvas');
      cv.width = Math.round(img.width * s); cv.height = Math.round(img.height * s);
      cv.getContext('2d').drawImage(img, 0, 0, cv.width, cv.height);
      URL.revokeObjectURL(img.src);
      ok(cv.toDataURL('image/jpeg', 0.72));
    };
    img.onerror = erro;
    img.src = URL.createObjectURL(file);
  });
}

/* área de assinatura com o dedo / caneta / mouse */
function criarAssinatura(cv, inicial, aoMudar) {
  const ctx = cv.getContext('2d');
  let desenhando = false, sujo = !!inicial, atual = inicial || '';
  const ajustar = () => {
    const r = cv.getBoundingClientRect(), dpr = window.devicePixelRatio || 1;
    if (!r.width) return;
    const img = sujo ? atual || cv.toDataURL() : '';
    cv.width = r.width * dpr; cv.height = r.height * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.lineWidth = 2.4; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.strokeStyle = '#0a2a5c';
    if (img) { const i = new Image(); i.onload = () => ctx.drawImage(i, 0, 0, r.width, r.height); i.src = img; }
  };
  const pos = e => { const r = cv.getBoundingClientRect(); return [e.clientX - r.left, e.clientY - r.top]; };
  cv.addEventListener('pointerdown', e => { desenhando = true; cv.setPointerCapture(e.pointerId); const [x, y] = pos(e); ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + .1, y + .1); ctx.stroke(); });
  cv.addEventListener('pointermove', e => { if (!desenhando) return; const [x, y] = pos(e); ctx.lineTo(x, y); ctx.stroke(); });
  const fim = () => { if (!desenhando) return; desenhando = false; sujo = true; atual = cv.toDataURL('image/png'); aoMudar(); };
  cv.addEventListener('pointerup', fim); cv.addEventListener('pointercancel', fim);
  requestAnimationFrame(ajustar);
  return {
    chave: cv.dataset.sig, ajustar,
    limpar() { ctx.clearRect(0, 0, cv.width, cv.height); sujo = false; atual = ''; aoMudar(); },
    temDesenho: () => sujo,
    valor: () => (sujo ? atual : ''),
  };
}

/* =========================================================
   TELA: VISUALIZAR / IMPRIMIR
   ========================================================= */
async function telaVer(id) {
  const r = await DB.pegar(id);
  if (!r) { toast('Check-list não encontrado', true); location.hash = '#/'; return; }
  montar('#tpl-ver', `Cód. ${r.codigo} · ${r.veiculo?.placa || ''}`);
  const html = folhaHtml(r);
  $('#folha').innerHTML = html;
  $('#vEditar').href = `#/editar/${r.id}`;
  $('#vPdf').addEventListener('click', () => imprimir(html, r));
  $('#vWhats').addEventListener('click', () => {
    const tel = soDig(r.cliente?.tel);
    const url = `https://wa.me/${tel ? '55' + tel : ''}?text=${encodeURIComponent(textoWhats(r))}`;
    window.open(url, '_blank');
  });
  $('#vDuplicar').addEventListener('click', () => { location.hash = `#/novo/${r.id}`; });
  $('#vExcluir').addEventListener('click', async () => {
    if (!confirm(`Excluir o check-list Cód. ${r.codigo} de ${r.cliente?.nome || ''}? Essa ação não pode ser desfeita.`)) return;
    await DB.excluir(r.id); toast('Check-list excluído'); location.replace('#/');
  });
}

function imprimir(html, r) {
  $('#impressao').innerHTML = html;
  const tituloOrig = document.title;
  document.title = `Checklist ${r.codigo} - ${r.veiculo?.placa || ''} - ${r.cliente?.nome || ''}`;
  const imgs = $$('#impressao img');
  Promise.all(imgs.map(i => i.complete ? 1 : new Promise(ok => { i.onload = i.onerror = ok; }))).then(() => {
    window.print();
    setTimeout(() => { document.title = tituloOrig; $('#impressao').innerHTML = ''; }, 500);
  });
}

function folhaHtml(r) {
  const g = p => esc(getP(r, p) || '');
  const c = (rot, v) => `<div class="f-c"><b>${rot}</b><span>${v}</span></div>`;
  const op = (marcado, txt) => `<span class="op"><span class="mk">${marcado ? '✓' : ''}</span>${txt}</span>`;
  const mk = v => `<span class="mk mk--${v || ''}">${v === 'ok' ? '✓' : v === 'x' ? 'X' : v === 'a' ? 'A' : ''}</span>`;
  const marcas = r.avaria?.marcas || [];
  const usados = [...new Set(marcas.map(m => m.t))];

  const carros = Object.entries(VISTAS).map(([k, v]) => `<div class="carro"><svg viewBox="${v.vb}">${v.svg}
    ${marcas.filter(m => m.v === k).map(m => `<g class="marca"><circle cx="${m.x}" cy="${m.y}" r="9"/><text x="${m.x}" y="${m.y}">${m.t}</text></g>`).join('')}</svg><small>${v.nome}</small></div>`).join('');

  const itens = ITENS.map(([k, n]) => `<div>${mk(r.itens?.[k])}${n}</div>`).join('') +
    (r.extras || []).filter(e => e && (e.nome || e.estado)).map(e => `<div>${mk(e.estado)}${esc(e.nome || '—')}</div>`).join('');
  const pneus = PNEUS.map(([k]) => `<div><b style="display:inline-block;width:30px">${k}</b>${['bom', 'regular', 'ruim'].map(v => op(r.pneus?.[k] === v, v[0].toUpperCase() + v.slice(1))).join('')}</div>`).join('');
  const comb = COMBUSTIVEL.map(([v]) => `<div>${op(r.combustivel === v, v)}</div>`).join('');
  const sv = SERVICOS.map(s => op((r.servicos || []).includes(s), s)).join('');
  const pg = r.pagamento || {};
  const assin = (src, rot) => `<div>${src ? `<img src="${src}" alt="">` : '<div class="ph"></div>'}<div class="lin">${rot}</div></div>`;

  return `<div class="folha">
    <div class="f-cab"><img src="img/logo-fv-vidros.png" alt="FV Vidros"><h1>CHECK-LIST</h1>
      <div class="f-data"><b>Data:</b> ${dataBR(r.data)}<br><b>Cód.:</b> ${g('codigo')}</div></div>
    <div class="f-box f-emp"><b>Razão Social da Empresa:</b> ${EMPRESA.nome} &nbsp; <b>CNPJ:</b> ${EMPRESA.cnpj}</div>

    <div class="f-box"><div class="f-tit">DADOS CLIENTE</div>
      <div class="f-lin">${c('Cód.:', g('codigo'))}${c('Cliente:', g('cliente.nome'))}</div>
      <div class="f-lin">${c('CPF/CNPJ:', g('cliente.doc'))}${c('Tel.:', g('cliente.tel'))}</div>
      <div class="f-lin">${c('Endereço:', g('cliente.endereco'))}${c('Bairro:', g('cliente.bairro'))}${c('CEP:', g('cliente.cep'))}</div>
      <div class="f-lin">${c('Montadora:', g('veiculo.montadora'))}${c('Veículo:', g('veiculo.modelo'))}${c('Ano:', g('veiculo.ano'))}${c('Placa:', g('veiculo.placa'))}</div>
    </div>

    <div class="f-box"><div class="f-tit">AVARIA — CHECK LIST ENTRADA DE VEÍCULOS</div>
      <div class="f-lin">${op(r.avaria?.sujo, 'Veículo sujo/molhado, prejudicando a avaliação')}${op(r.avaria?.guincho, 'Veículo entregue por guincho')}</div>
      <div class="f-carros">${carros}</div>
      ${usados.length ? `<div class="f-leg"><b>Legenda:</b> ${usados.map(t => `${t} = ${TIPOS_AVARIA[t]}`).join(' · ')}</div>` : ''}
      <div class="f-3col">
        <div class="f-sub"><h4>✓ Existente / X Inexistente / A Avariado</h4><div class="f-it">${itens}</div></div>
        <div class="f-sub"><h4>Estado dos Pneus</h4>${pneus}</div>
        <div class="f-sub"><h4>Combustível</h4>${comb}</div>
      </div>
      <div class="f-assin">${assin(r.assinaturaCliente, 'Assinatura Cliente ou Condutor')}${assin(r.assinaturaLoja, 'Assinatura Loja')}</div>
      <div class="f-lin">${c('Observações:', g('obs'))}</div>
      <div class="f-lin">${c('Há pertences no interior do veículo? Quais?', g('pertences'))}</div>
    </div>

    <div class="f-box"><div class="f-tit">PROBLEMAS / AVARIAS</div>
      <div class="f-lin"><b>Existe alguma luz acesa indicativa de falha no painel?</b> ${op(r.luzPainel?.v === 'sim', 'Sim')}${op(r.luzPainel?.v === 'nao', 'Não')}${c('Qual?', g('luzPainel.qual'))}</div>
      <div class="f-lin"><b>Feito teste do funcionamento do sensor de chuva?</b> ${op(r.sensorChuva?.v === 'sim', 'Sim')}${op(r.sensorChuva?.v === 'nao', 'Não')}${c('Obs.:', g('sensorChuva.obs'))}</div>
      <div class="f-lin">${c('KM da entrada do veículo:', g('kmEntrada'))}${c('KM da saída do veículo:', g('kmSaida'))}</div>
      <div class="f-sv">${sv}</div>
      <div class="f-lin">${c('Obs.:', g('servicosObs'))}</div>
    </div>

    <div class="f-box"><div class="f-tit">VENDA E GARANTIA</div>
      <div class="f-lin">${c('Vendedor(a):', g('vendedor'))}${c('Nº da Venda:', g('numVenda'))}${c('Valor:', r.valor ? 'R$ ' + g('valor') : '')}</div>
      <div class="f-lin"><b>Forma de Pagamento:</b> ${op(pg.forma === 'pix', 'PIX Conta: ' + esc(pg.forma === 'pix' ? pg.pixConta || '' : ''))}${op(pg.forma === 'dinheiro', 'Dinheiro')}${op(pg.forma === 'debito', 'Débito')}${op(pg.forma === 'credito', 'Crédito: ' + esc(pg.forma === 'credito' ? pg.credito || '' : ''))}</div>
      <div class="f-lin"><b>Garantia de Serviço:</b> ${op(r.garantia?.tem === 'sim', 'Sim')}${op(r.garantia?.tem === 'nao', 'Não')} — ${['12 meses', '06 meses', '90 dias', '30 dias'].map(p => op(r.garantia?.tem === 'sim' && r.garantia?.prazo === p, p)).join('')}</div>
      <div class="f-lin">${c('Peça Instalada:', g('peca'))}${c('Vistoriador(a):', g('vistoriador'))}${c('Técnico de instalação:', g('tecnico'))}</div>
      <div class="f-lin"><b>Retorno de Garantia —</b> ${op(r.retorno === 'seguro', 'Seguro')}${op(r.retorno === 'particular', 'Particular')}${c('Horário entrada:', g('horaEntrada'))}${c('Horário saída:', g('horaSaida'))}</div>
    </div>
    ${(r.fotos || []).length ? `<div class="f-box f-quebra"><div class="f-tit">FOTOS DO VEÍCULO — Cód. ${g('codigo')} · ${g('veiculo.placa')}</div><div class="f-fotos">${r.fotos.map(f => `<img src="${f}" alt="">`).join('')}</div></div>` : ''}
    <p class="f-rod">Documento gerado pelo FV Check-list em ${new Date(r.atualizadoEm || Date.now()).toLocaleString('pt-BR')}</p>
  </div>`;
}

function textoWhats(r) {
  const l = [`*FV Vidros Automotivos e Acessórios*`, `Check-list Cód. ${r.codigo} — ${dataBR(r.data)}`, '',
    `Cliente: ${r.cliente?.nome || ''}`, `Veículo: ${[r.veiculo?.montadora, r.veiculo?.modelo, r.veiculo?.ano].filter(Boolean).join(' ')} — Placa ${r.veiculo?.placa || ''}`];
  if (r.servicos?.length) l.push(`Serviço: ${r.servicos.join(', ')}`);
  if (r.peca) l.push(`Peça instalada: ${r.peca}`);
  if (r.valor) l.push(`Valor: R$ ${r.valor}${r.pagamento?.forma ? ' (' + PAGAMENTOS[r.pagamento.forma] + ')' : ''}`);
  if (r.garantia?.tem === 'sim') l.push(`Garantia: ${r.garantia.prazo || 'Sim'}`);
  if (r.obs) l.push(`Observações: ${r.obs}`);
  l.push('', 'Obrigado pela preferência!');
  return l.join('\n');
}

/* =========================================================
   TELA: CONFIGURAÇÕES
   ========================================================= */
let eventoInstalar = null;
window.addEventListener('beforeinstallprompt', e => { e.preventDefault(); eventoInstalar = e; const c = $('#cardInstalar'); if (c) c.hidden = false; });

function telaConfig() {
  montar('#tpl-config', 'Configurações');
  const c = cfg();
  $('#cfgCodigo').value = c.proxCodigo; $('#cfgVenda').value = c.proxVenda;
  $('#cfgVendedores').value = c.vendedores.join(', ');
  $('#cfgTecnicos').value = c.tecnicos.join(', ');
  $('#cfgPix').value = c.pix.join(', ');
  const lista = s => s.split(',').map(x => x.trim()).filter(Boolean);
  $('#cfgSalvar').addEventListener('click', () => {
    salvarCfg({ ...c, proxCodigo: parseInt($('#cfgCodigo').value) || 1, proxVenda: parseInt($('#cfgVenda').value) || 1,
      vendedores: lista($('#cfgVendedores').value), tecnicos: lista($('#cfgTecnicos').value), pix: lista($('#cfgPix').value) });
    toast('Configurações salvas');
  });

  const baixar = (nome, conteudo, tipo) => {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([conteudo], { type: tipo }));
    a.download = nome; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 2000);
  };
  $('#cfgExportar').addEventListener('click', async () => {
    const dados = { app: 'fv-checklist', versao: 1, exportadoEm: new Date().toISOString(), cfg: cfg(), checklists: await DB.todos() };
    baixar(`backup-checklist-fv-${hojeISO()}.json`, JSON.stringify(dados), 'application/json');
  });
  $('#cfgImportar').addEventListener('change', async e => {
    const f = e.target.files[0]; if (!f) return;
    try {
      const d = JSON.parse(await f.text());
      if (d.app !== 'fv-checklist' || !Array.isArray(d.checklists)) throw new Error('arquivo inválido');
      if (!confirm(`Importar ${d.checklists.length} check-lists? Registros com o mesmo ID serão substituídos.`)) return;
      for (const r of d.checklists) await DB.salvar(r);
      if (d.cfg) { const atual = cfg(); salvarCfg({ ...d.cfg, proxCodigo: Math.max(atual.proxCodigo, d.cfg.proxCodigo || 1), proxVenda: Math.max(atual.proxVenda, d.cfg.proxVenda || 1) }); }
      toast('Backup importado'); telaConfig();
    } catch (err) { toast('Não foi possível importar: ' + err.message, true); }
    e.target.value = '';
  });
  $('#cfgCsv').addEventListener('click', async () => {
    const cols = [['Cód', 'codigo'], ['Data', r => dataBR(r.data)], ['Status', 'status'], ['Cliente', 'cliente.nome'], ['CPF/CNPJ', 'cliente.doc'], ['Telefone', 'cliente.tel'],
      ['Endereço', 'cliente.endereco'], ['Bairro', 'cliente.bairro'], ['CEP', 'cliente.cep'], ['Montadora', 'veiculo.montadora'], ['Veículo', 'veiculo.modelo'], ['Ano', 'veiculo.ano'],
      ['Placa', 'veiculo.placa'], ['Serviços', r => (r.servicos || []).join(' / ')], ['Peça', 'peca'], ['Nº Venda', 'numVenda'], ['Valor', 'valor'],
      ['Pagamento', r => PAGAMENTOS[r.pagamento?.forma] || ''], ['Garantia', r => r.garantia?.tem === 'sim' ? r.garantia.prazo || 'Sim' : r.garantia?.tem === 'nao' ? 'Não' : ''],
      ['Vendedor', 'vendedor'], ['Vistoriador', 'vistoriador'], ['Técnico', 'tecnico'], ['Entrada', 'horaEntrada'], ['Saída', 'horaSaida'],
      ['KM entrada', 'kmEntrada'], ['KM saída', 'kmSaida'], ['Observações', 'obs']];
    const todos = (await DB.todos()).sort((a, b) => a.criadoEm - b.criadoEm);
    const cel = v => `"${String(v ?? '').replace(/"/g, '""')}"`;
    const linhas = [cols.map(c => cel(c[0])).join(';'), ...todos.map(r => cols.map(([, p]) => cel(typeof p === 'function' ? p(r) : getP(r, p))).join(';'))];
    baixar(`checklists-fv-${hojeISO()}.csv`, '﻿' + linhas.join('\r\n'), 'text/csv;charset=utf-8');
  });
  if (eventoInstalar) $('#cardInstalar').hidden = false;
  $('#btnInstalar').addEventListener('click', async () => { if (!eventoInstalar) return; eventoInstalar.prompt(); await eventoInstalar.userChoice; eventoInstalar = null; $('#cardInstalar').hidden = true; });
}

/* ---------------- Início ---------------- */
window.addEventListener('beforeunload', e => { if (window._sujo) { e.preventDefault(); e.returnValue = ''; } });
window.addEventListener('hashchange', rota);
DB.abrir().then(rota).catch(e => { app.innerHTML = `<p class="vazio">Não foi possível abrir o banco de dados do aparelho.<br>${esc(e.message)}</p>`; });

if ('serviceWorker' in navigator && location.protocol !== 'file:') {
  navigator.serviceWorker.register('sw.js').catch(() => {});
}
