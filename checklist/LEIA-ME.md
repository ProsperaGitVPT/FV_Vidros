# FV Vidros — Check-list digital

Versão digital do check-list de entrada de veículos, com todos os campos do formulário de papel.
Funciona no celular, tablet e computador, **sem internet** depois de aberto a primeira vez.

## O que tem
- Todos os campos do papel: dados do cliente e veículo, avarias, itens (✓ / X / A + 5 linhas livres),
  pneus, combustível, observações, pertences, luz no painel, sensor de chuva, KM, serviços,
  venda, pagamento, garantia, peça instalada, vistoriador, técnico, retorno de garantia e horários.
- Marcação de avarias tocando no desenho do carro (Amassado, Riscado, Quebrado, Trincado, Faltando).
- Assinatura do cliente e da loja com o dedo.
- Fotos do veículo pela câmera.
- Código e nº da venda automáticos; data e hora de entrada preenchidas sozinhas.
- Máscaras de CPF/CNPJ, telefone, CEP, placa, KM e valor; busca de endereço pelo CEP (com internet).
- Autocompletar cliente que já veio antes e nomes da equipe.
- Imprimir / salvar PDF no mesmo layout do papel; enviar resumo pelo WhatsApp.
- Lista com busca, filtros e resumo do dia/mês; backup (.json) e planilha (.csv).

## Endereço do app
https://prosperagitvpt.github.io/FV_Vidros/checklist/

## Como usar no computador
Os check-lists ficam salvos **no navegador do aparelho**. Para testar, rode um servidor local nesta pasta:

```
python -m http.server 8080
```

e abra http://localhost:8080

## Como instalar no celular (vira aplicativo)
1. Abra https://prosperagitvpt.github.io/FV_Vidros/checklist/ no Chrome do Android.
2. Menu ⋮ → **Instalar aplicativo** / **Adicionar à tela inicial**.
3. Pronto: abre em tela cheia com o ícone da FV e funciona offline.

## Gerar o arquivo .apk
Acesse https://www.pwabuilder.com, cole o endereço https://prosperagitvpt.github.io/FV_Vidros/checklist/ e escolha **Android → Generate**.
Ele entrega o .apk (para instalar direto) e o .aab (para a Play Store).

## Importante
- Cada aparelho guarda os próprios check-lists. Use **Configurações → Exportar backup** com frequência.
- Em **Configurações** defina o próximo código (ex.: 8242) e o próximo nº de venda para continuar a numeração do papel.
