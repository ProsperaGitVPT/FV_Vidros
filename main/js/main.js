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
