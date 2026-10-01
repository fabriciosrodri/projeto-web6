# Patas de Casa — Site de adoção responsável de cães

Trabalho de Web Design. Instituição e cães fictícios.

## Como abrir
Dê dois cliques em `index.html`. Precisa de internet só para carregar as fontes do Google Fonts.

## Estrutura dos arquivos
- `index.html` — todas as páginas do site (cada uma é uma `<section data-page>`)
- `css/style.css` — estilos, organizados em 17 blocos comentados
- `js/script.js` — dados dos 16 cães, navegação, filtros, perfil e formulário
- `img/` — fotos dos cães

## Funcionalidades
- Navegação por âncoras (`#inicio`, `#caes`, `#cao-thor`...) sem recarregar a página
- Galeria com filtros por porte, idade (filhote, adulto, idoso) e sexo
- Perfil de cada cão com história, ficha e "carteirinha de saúde"
- Botão "Quero adotar [nome]" que abre o WhatsApp do administrador com a mensagem pronta
- Formulário "Divulgue um cão" com validação; ao enviar, monta a mensagem e abre o WhatsApp do administrador. O anúncio passa por análise antes de ir para o site
- Menu fixo que vira hambúrguer no celular e botão flutuante do WhatsApp
- Tema claro e escuro automático, conforme o sistema do usuário

## Decisões de design
**Paleta.** Verde-floresta escuro (#1d3329) para textos transmite confiança e natureza. O damasco (#e8903a) é a cor de ação, usada só em botões e destaques, para guiar o olho até "adotar". O fundo é um branco levemente aquecido, mais acolhedor que o branco puro. Todas as combinações têm contraste acessível.

**Tipografia.** Bricolage Grotesque nos títulos, uma fonte com personalidade, arredondada e amigável, em peso forte. Figtree nos textos, limpa e muito legível em telas pequenas. A escala de tamanhos segue proporção de cerca de 1,25.

**Layout.** Coluna única com bastante respiro e largura máxima de 1160 px. A página inicial abre com um mosaico de fotos de cães brincando (a foto principal tem topo em arco, lembrando uma porta de casa, ligada ao nome do projeto). Os cards usam grade automática que vai de 1 a 4 colunas conforme a tela.

**Detalhes do assunto.** Cada cão tem uma "carteirinha de saúde" (V10, antirrábica, vermífugo, castração, microchip) e o guia traz uma tabela de custos mensais por porte, informações reais que um adotante procura.

**Acessibilidade.** Textos alternativos em todas as imagens, foco visível para navegação por teclado, link "pular para o conteúdo" e respeito à configuração de "reduzir movimento".

## Créditos
Fotos: acervo público do Dog API (dog.ceo), uso educacional.
