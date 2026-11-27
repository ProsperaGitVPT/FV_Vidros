# Site FV Vidros Automotivos & Acessórios

Site estático em HTML, CSS e JavaScript puro, com o site da Autoglass como referência.

## Como rodar
Abra `index.html` no navegador. Para recarregar sozinho a cada alteração, use a extensão **Live Server** do VS Code.

## Estrutura
```
fv-vidros/
├── index.html        → Home: hero, busca por veículo, categorias, serviços, sobre, contato
├── produtos.html     → Catálogo com filtros (tipo, marca, modelo, ano, busca)
├── css/
│   ├── reset.css     → Zera os estilos padrão do navegador
│   └── style.css     → Estilos do site, separados por seções numeradas
├── js/
│   ├── dados.js      → CONFIG (WhatsApp) + lista de PRODUTOS  ← editar aqui
│   ├── main.js       → Menu mobile, links do WhatsApp, selects Marca→Modelo
│   └── catalogo.js   → Filtros e montagem dos cards de produto
└── img/              → Logo, fotos da loja e dos produtos
```

## Roteiro
- [ ] **Fase 0 – Conteúdo:** logo, cores, fotos, endereço, telefone, horário, WhatsApp e lista inicial de produtos
- [ ] **Fase 1 – Base:** preencher `CONFIG.whatsapp`, trocar os textos [entre colchetes], colocar o mapa do Google
- [ ] **Fase 2 – Identidade:** ajustar as variáveis de cor em `style.css`, adicionar logo e fotos
- [ ] **Fase 3 – Catálogo:** cadastrar os produtos reais em `dados.js`, com foto em `img/produtos/`
- [ ] **Fase 4 – Páginas extras:** página de serviços, página de produto, depoimentos e FAQ
- [ ] **Fase 5 – Publicação:** SEO (títulos, descrições, Open Graph), domínio próprio e hospedagem (Netlify, Vercel ou GitHub Pages)
- [ ] **Futuro:** carrinho e pagamento online (isso exige backend ou uma plataforma pronta)

## Convenções
- Nomes de classes no padrão BEM: `bloco__elemento--variacao`
- Cores e medidas sempre por variável (`var(--cor-primaria)`), nunca escritas direto no código
- Um commit por tarefa no Git, com mensagens descritivas

## Publicação no GitHub Pages
Este branch (`gh-pages`) tem o `index.html` na raiz do repositório, pronto para o GitHub Pages.

1. No GitHub, abra o repositório → **Settings** → **Pages**.
2. Em **Build and deployment**, escolha **Source: Deploy from a branch**.
3. Selecione o branch **gh-pages** e a pasta **/ (root)** → **Save**.
4. Em 1–2 minutos o site fica disponível em `https://<usuario>.github.io/FV_Vidros/`.

O arquivo `.nojekyll` faz o GitHub servir os arquivos como estão, sem processamento do Jekyll.
