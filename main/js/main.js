/* =========================================================
   Comportamentos usados em TODAS as páginas
   ========================================================= */

// 1. Menu mobile
const btnMenu = document.querySelector(".menu-toggle");
const menu = document.querySelector(".menu");
btnMenu?.addEventListener("click", () => {
  const aberto = menu.classList.toggle("aberto");
  btnMenu.setAttribute("aria-expanded", aberto);
});

// 2. Links de WhatsApp: qualquer elemento com .js-whats e data-msg
function linkWhats(msg) {
  return `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(msg)}`;
}
document.querySelectorAll(".js-whats").forEach((el) => {
  el.href = linkWhats(el.dataset.msg || "Olá!");
  el.target = "_blank";
  el.rel = "noopener";
});

// 3. Ano no rodapé
const ano = document.getElementById("ano");
if (ano) ano.textContent = new Date().getFullYear();

// 4. Selects encadeados Marca -> Modelo (busca da home e filtros)
const selMarca = document.getElementById("selMarca");
const selModelo = document.getElementById("selModelo");

function preencher(select, valores, rotuloVazio) {
  select.innerHTML = `<option value="">${rotuloVazio}</option>` +
    valores.map((v) => `<option value="${v}">${v}</option>`).join("");
}

if (selMarca && selModelo) {
  const marcas = [...new Set(PRODUTOS.map((p) => p.marca))].sort();
  preencher(selMarca, marcas, "Todas");

  selMarca.addEventListener("change", () => {
    const modelos = [...new Set(
      PRODUTOS.filter((p) => !selMarca.value || p.marca === selMarca.value).map((p) => p.modelo)
    )].sort();
    preencher(selModelo, modelos, "Todos");
  });
  selMarca.dispatchEvent(new Event("change"));
}

// 5. Abas do painel de busca (Buscar pela Placa / Selecionar Veículo)
const abas = document.querySelectorAll("[data-aba]");
abas.forEach((aba) => aba.addEventListener("click", () => {
  abas.forEach((a) => {
    const ativa = a === aba;
    a.classList.toggle("ativa", ativa);
    a.setAttribute("aria-selected", ativa);
  });
  document.querySelectorAll("[data-painel]").forEach((p) => { p.hidden = p.dataset.painel !== aba.dataset.aba; });
}));

// 6. Busca pela placa: abre o WhatsApp com a placa digitada
const formPlaca = document.getElementById("formPlaca");
if (formPlaca) {
  const campo = formPlaca.elements.placa;
  campo.addEventListener("input", () => {
    campo.setCustomValidity("");
    campo.value = campo.value.toUpperCase().replace(/[^A-Z0-9-]/g, "");
  });
  formPlaca.addEventListener("submit", (e) => {
    e.preventDefault();
    const placa = campo.value.replace(/-/g, "");
    // Aceita placa antiga (ABC1234) e Mercosul (ABC1D23)
    if (!/^[A-Z]{3}[0-9][A-Z0-9][0-9]{2}$/.test(placa)) {
      campo.setCustomValidity("Digite uma placa válida. Ex.: ABC1D23");
      campo.reportValidity();
      return;
    }
    window.open(linkWhats(`Olá! Procuro peças para o veículo de placa ${placa}. Pode me ajudar?`), "_blank", "noopener");
  });
}
