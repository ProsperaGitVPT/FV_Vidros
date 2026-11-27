/* =========================================================
   Página de produtos: filtros + renderização dos cards
   ========================================================= */
const form = document.getElementById("formFiltros");
const lista = document.getElementById("listaProdutos");
const contador = document.getElementById("contador");

const NOMES_TIPO = {
  parabrisa: "Para-brisa", porta: "Vidro lateral", traseiro: "Vidro traseiro", teto: "Teto solar",
  retrovisor: "Retrovisor", palheta: "Palheta", acessorio: "Acessório",
};

// Lê filtros vindos da URL (ex.: produtos.html?tipo=parabrisa&marca=Fiat)
function aplicarParametrosDaURL() {
  const params = new URLSearchParams(location.search);
  for (const [chave, valor] of params) {
    const campo = form.elements[chave];
    if (!campo) continue;
    campo.value = valor;
    if (chave === "marca") campo.dispatchEvent(new Event("change")); // recarrega modelos
  }
}

function filtrar() {
  const f = Object.fromEntries(new FormData(form));
  const termo = (f.q || "").toLowerCase().trim();
  const ano = Number(f.ano);

  return PRODUTOS.filter((p) =>
    (!f.tipo   || p.tipo === f.tipo) &&
    (!f.marca  || p.marca === f.marca) &&
    (!f.modelo || p.modelo === f.modelo) &&
    (!ano      || (ano >= p.anoIni && ano <= p.anoFim)) &&
    (!termo    || `${p.nome} ${p.marca} ${p.modelo} ${p.fabricante}`.toLowerCase().includes(termo))
  );
}

function cardProduto(p) {
  const msg = `Olá! Tenho interesse no produto: ${p.nome} (cód. ${p.id}). Pode me passar o valor?`;
  return `
    <article class="produto">
      <div class="produto__img">${p.img ? `<img src="${p.img}" alt="${p.nome}" loading="lazy">` : "Sem foto"}</div>
      <div class="produto__info">
        <span class="produto__marca">${p.fabricante} · ${NOMES_TIPO[p.tipo]}</span>
        <h3>${p.nome}</h3>
        <span class="produto__compat">${p.marca} ${p.modelo} · ${p.anoIni}–${p.anoFim}</span>
      </div>
      <a class="btn btn--whats" href="${linkWhats(msg)}" target="_blank" rel="noopener">Consultar preço</a>
    </article>`;
}

function render() {
  const resultado = filtrar();
  contador.textContent = `${resultado.length} produto(s) encontrado(s)`;
  lista.innerHTML = resultado.length
    ? resultado.map(cardProduto).join("")
    : `<p class="vazio">Não achou sua peça? <a href="${linkWhats("Olá! Não achei minha peça no site.")}" target="_blank">Fale com a gente no WhatsApp</a>.</p>`;
}

form.addEventListener("input", render);
form.addEventListener("change", render);
form.addEventListener("reset", () => setTimeout(() => {
  selMarca.dispatchEvent(new Event("change"));
  history.replaceState(null, "", location.pathname);
  render();
}));

aplicarParametrosDaURL();
render();
