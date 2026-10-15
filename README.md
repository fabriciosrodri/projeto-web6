# 🐾 Patas de Casa — Site de adoção responsável de cães

> Um site que aproxima cães que precisam de um lar de pessoas dispostas a adotar com consciência.

**Trabalho de Web Design.** A instituição, os cães e os contatos são fictícios.

---

## 📑 Índice

1. [Sobre o projeto](#-sobre-o-projeto)
2. [Tecnologias](#-tecnologias)
3. [Como abrir](#-como-abrir)
4. [Estrutura dos arquivos](#-estrutura-dos-arquivos)
5. [Funcionalidades](#-funcionalidades)
6. [Como o site funciona por dentro](#-como-o-site-funciona-por-dentro)
7. [Decisões de design](#-decisões-de-design)
8. [Acessibilidade](#-acessibilidade)
9. [Possíveis melhorias](#-possíveis-melhorias)
10. [Créditos](#-créditos)

---

## 🐶 Sobre o projeto

O **Patas de Casa** é um site de página única (SPA simples, sem frameworks)
que apresenta 16 cães disponíveis para adoção. A pessoa interessada pode
navegar pela galeria, filtrar por características, conhecer a história e a
saúde de cada cão e iniciar o contato pelo WhatsApp com a mensagem já pronta.

**Objetivo do trabalho:** praticar HTML, CSS e JavaScript puros, aplicando
boas práticas de design, organização de código e acessibilidade.

## 🛠 Tecnologias

| Tecnologia | Uso no projeto |
| --- | --- |
| HTML5 | Estrutura semântica de todas as páginas |
| CSS3 | Layout (Flexbox e Grid), variáveis, tema claro/escuro |
| JavaScript | Dados dos cães, navegação, filtros e formulário |
| Google Fonts | Fontes Bricolage Grotesque e Figtree |
| Dog API | Origem das fotos dos cães |

## 🚀 Como abrir

1. Baixe ou clone o repositório.
2. Dê dois cliques em `index.html`.
3. Pronto! O site abre no navegador.

> ⚠️ É preciso ter internet apenas para carregar as fontes do Google Fonts.
> Sem conexão, o site continua funcionando com fontes alternativas.

## 📁 Estrutura dos arquivos

```text
patas-de-casa/
├── index.html        # todas as páginas do site
├── css/
│   └── style.css     # estilos, em 17 blocos comentados
├── js/
│   └── script.js     # dados, navegação, filtros, perfil e formulário
├── img/              # fotos dos cães
└── README.md         # este arquivo
```

- **`index.html`**: cada página é uma `<section data-page>`; só uma fica visível por vez.
- **`css/style.css`**: dividido em 17 blocos comentados (variáveis, reset, tipografia, menu, cards, formulário, tema escuro etc.).
- **`js/script.js`**: guarda os dados dos 16 cães e controla o comportamento do site.
- **`img/`**: fotos usadas na galeria, nos perfis e na página inicial.

## ✨ Funcionalidades

- **Navegação por âncoras** (`#inicio`, `#caes`, `#cao-thor`...) sem recarregar a página.
- **Galeria com filtros** por porte, idade (filhote, adulto, idoso) e sexo.
- **Perfil de cada cão** com história, ficha e "carteirinha de saúde".
- **Botão "Quero adotar [nome]"** que abre o WhatsApp do administrador com a mensagem pronta.
- **Formulário "Divulgue um cão"** com validação. Ao enviar, monta a mensagem e abre o WhatsApp do administrador. O anúncio passa por análise antes de ir para o site.
- **Menu fixo** que vira hambúrguer no celular.
- **Botão flutuante do WhatsApp** sempre à mão.
- **Tema claro e escuro automático**, conforme a configuração do sistema.
- **Layout responsivo**, de celulares a telas grandes.

## ⚙️ Como o site funciona por dentro

1. **Dados:** os 16 cães ficam em uma lista (array de objetos) no `script.js`, com nome, porte, idade, sexo, história e saúde.
2. **Navegação:** o JavaScript lê a âncora da URL (o `#...`) e mostra a `<section data-page>` correspondente, escondendo as outras.
3. **Galeria:** os cards são gerados a partir da lista de cães. Os filtros apenas decidem quais cards aparecem.
4. **Perfil:** ao abrir `#cao-nome`, o script monta a página com os dados do cão escolhido.
5. **WhatsApp:** a mensagem é montada em texto, codificada e enviada em um link `wa.me`.

## 🎨 Decisões de design

### Paleta

| Cor | Código | Papel |
| --- | --- | --- |
| Verde-floresta escuro | `#1d3329` | Textos. Transmite confiança e natureza |
| Damasco | `#e8903a` | Cor de ação, só em botões e destaques |
| Branco aquecido | — | Fundo, mais acolhedor que o branco puro |

O damasco é usado com moderação para guiar o olho até o botão **"adotar"**.
Todas as combinações de cores têm contraste acessível.

### Tipografia

- **Bricolage Grotesque** nos títulos: fonte com personalidade, arredondada e amigável, em peso forte.
- **Figtree** nos textos: limpa e muito legível em telas pequenas.
- A escala de tamanhos segue uma proporção de cerca de **1,25**.

### Layout

- Coluna única, com bastante respiro e largura máxima de **1160 px**.
- A página inicial abre com um **mosaico de fotos** de cães brincando. A foto principal tem o topo em arco, lembrando uma porta de casa e ligando a imagem ao nome do projeto.
- Os cards usam **grade automática** que vai de 1 a 4 colunas conforme a tela.

### Detalhes do assunto

- Cada cão tem uma **carteirinha de saúde**: V10, antirrábica, vermífugo, castração e microchip.
- O guia traz uma **tabela de custos mensais por porte**, informação real que quem quer adotar procura.

## ♿ Acessibilidade

- Texto alternativo em todas as imagens.
- Foco visível para navegação por teclado.
- Link "pular para o conteúdo" no início da página.
- Respeito à configuração de "reduzir movimento" do sistema.
- Contraste de cores adequado em todas as combinações.

## 🔮 Possíveis melhorias

- Guardar os anúncios em um banco de dados, em vez de depender do WhatsApp.
- Adicionar busca por nome e ordenação da galeria.
- Permitir salvar cães favoritos no navegador (`localStorage`).
- Criar um painel para o administrador aprovar anúncios.
- Hospedar o site com GitHub Pages.

## 📸 Créditos

- **Fotos:** acervo público do [Dog API](https://dog.ceo/dog-api/), uso educacional.
- **Fontes:** [Google Fonts](https://fonts.google.com/).
- **Projeto:** desenvolvido como trabalho acadêmico de Web Design.