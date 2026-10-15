/* =========================================================
   PATAS DE CASA — script.js
   Funcionalidades em JavaScript:
   1. Menu hambúrguer (celular e tablet)
   2. Botão "voltar ao topo" que aparece ao rolar a página
   3. Busca de cães pelo nome
   4. Contador de resultados, aviso "nenhum cão" e botão "Limpar filtros"
   5. Validação do formulário "Divulgue um cão" (contador de letras e erro)
   6. WhatsApp configurado em um lugar só (mensagem de cada cão montada pelo nome)
   7. Números animados na faixa de estatísticas
   8. Ano do rodapé automático
   9. Botão de tema claro/escuro (a escolha fica salva no navegador)

   Como o código está organizado: cada funcionalidade é uma função
   (iniciarMenu, iniciarBusca...) chamada no final do arquivo. Cada função
   confere se os elementos existem antes de usá-los. Assim, se um id sumir
   do HTML, só aquela funcionalidade para, e o resto do site continua.
   ========================================================= */

// Avisa o CSS que o JavaScript está funcionando (o <html> ganha a classe "js").
// O CSS só esconde o menu e o botão de topo quando existe JavaScript para mostrá-los.
document.documentElement.classList.add("js");

/* ---------- Configuração e funções de apoio ---------- */

// Número do WhatsApp no formato internacional: 55 (Brasil) + DDD + número.
// É o ÚNICO lugar onde o número precisa ser trocado.
const WHATSAPP = "5514996895439";

// Quantidade mínima de caracteres do formulário "Divulgue um cão".
const MINIMO_CARACTERES = 20;

// Monta um link do WhatsApp com a mensagem já escrita.
// encodeURIComponent troca espaços e acentos por códigos que cabem em uma URL.
function linkWhats(mensagem) {
  return "https://wa.me/" + WHATSAPP + "?text=" + encodeURIComponent(mensagem);
}

// Devolve o nome do cão de um card.
// O <h3> é "Leandro <small>2 anos</small>": o primeiro pedaço (childNodes[0]) é só o nome.
function pegarNome(card) {
  return card.querySelector("h3").childNodes[0].textContent.trim();
}

// Deixa o texto em minúsculas e sem acento, para a busca achar "algodao" e "Algodão".
// normalize("NFD") separa a letra do acento; o replace apaga só os acentos.
function semAcento(texto) {
  return texto.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

/* ---------- 1. Menu hambúrguer ---------- */

function iniciarMenu() {
  const botao = document.querySelector(".menu-toggle");
  const menu = document.getElementById("menu");
  if (!botao || !menu) return;

  // abrir = true abre o menu; abrir = false fecha.
  function abrirFecharMenu(abrir) {
    menu.classList.toggle("open", abrir);
    botao.setAttribute("aria-expanded", abrir ? "true" : "false");
    botao.setAttribute("aria-label", abrir ? "Fechar menu" : "Abrir menu");
    botao.textContent = abrir ? "✕" : "☰";
  }

  botao.addEventListener("click", function () {
    abrirFecharMenu(!menu.classList.contains("open"));
  });

  menu.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", function () { abrirFecharMenu(false); });
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") abrirFecharMenu(false);
  });

  document.addEventListener("click", function (e) {
    if (!e.target.closest(".nav")) abrirFecharMenu(false);
  });

  window.addEventListener("resize", function () {
    if (window.innerWidth > 1100) abrirFecharMenu(false);
  });
}

function iniciarBotaoTopo() {
  const botao = document.querySelector(".topo");
  if (!botao) return;

  function atualizarBotao() {
    botao.classList.toggle("visivel", window.scrollY > 400);
  }

  window.addEventListener("scroll", atualizarBotao);
  atualizarBotao();
}

function iniciarBusca() {
  const campoBusca = document.getElementById("busca-nome");
  const contagem = document.getElementById("contagem");
  const semResultado = document.getElementById("sem-resultado");
  const botaoLimpar = document.getElementById("limpar-filtros");
  const cartoes = document.querySelectorAll(".dog-card");
  const radios = document.querySelectorAll(".filtros input");
  if (!campoBusca || !contagem || !semResultado || !botaoLimpar) return;

  function atualizarResultado() {
    const termo = semAcento(campoBusca.value.trim());

    cartoes.forEach(function (card) {
      const nome = semAcento(pegarNome(card));
      card.classList.toggle("sem-busca", termo !== "" && nome.indexOf(termo) === -1);
    });

    let total = 0;
    cartoes.forEach(function (card) {
      if (getComputedStyle(card).display !== "none") total++;
    });

    contagem.textContent = total + (total === 1 ? " cão encontrado" : " cães encontrados");
    semResultado.hidden = total > 0;

    const filtroLigado = termo !== "" ||
      !document.getElementById("p-todos").checked ||
      !document.getElementById("i-todas").checked;
    botaoLimpar.hidden = !filtroLigado;
  }

  campoBusca.addEventListener("input", atualizarResultado);
  radios.forEach(function (radio) {
    radio.addEventListener("change", atualizarResultado);
  });

  botaoLimpar.addEventListener("click", function () {
    campoBusca.value = "";
    document.getElementById("p-todos").checked = true;
    document.getElementById("i-todas").checked = true;
    atualizarResultado();
    campoBusca.focus();
  });

  atualizarResultado();
}

function iniciarFormulario() {
  const form = document.getElementById("form-divulgue");
  const campo = document.getElementById("msg");
  const contador = document.getElementById("msg-contador");
  const erro = document.getElementById("msg-erro");
  const sucesso = document.getElementById("msg-sucesso");
  if (!form || !campo || !contador || !erro || !sucesso) return;

  form.noValidate = true;

  function limparErro() {
    erro.textContent = "";
    campo.classList.remove("invalido");
    campo.setAttribute("aria-invalid", "false");
  }

  campo.addEventListener("input", function () {
    const tamanho = campo.value.trim().length;
    contador.textContent = tamanho;
    sucesso.hidden = true;
    if (tamanho >= MINIMO_CARACTERES) limparErro();
  });

  form.addEventListener("submit", function (e) {
    const tamanho = campo.value.trim().length;

    if (tamanho < MINIMO_CARACTERES) {
      e.preventDefault();
      erro.textContent = "Escreva pelo menos " + MINIMO_CARACTERES + " caracteres (faltam " + (MINIMO_CARACTERES - tamanho) + ").";
      campo.classList.add("invalido");
      campo.setAttribute("aria-invalid", "true");
      campo.focus();
      return;
    }

    limparErro();
    sucesso.hidden = false;
    setTimeout(function () {
      form.reset();
      contador.textContent = "0";
    }, 300);
  });
}

function iniciarWhatsApp() {
  const mensagemGeral = "Olá! Vim pelo site Patas de Casa e gostaria de mais informações sobre adoção.";

  document.querySelectorAll('a[href^="https://wa.me/"]').forEach(function (link) {
    const card = link.closest(".dog-card");

    if (card) {
      const nome = pegarNome(card);
      const femea = card.querySelector(".tag").textContent.indexOf("Fêmea") !== -1;
      const artigo = femea ? "a" : "o";
      const pronome = femea ? "adotá-la" : "adotá-lo";
      link.href = linkWhats("Olá! Vi " + artigo + " " + nome + " no site Patas de Casa e tenho interesse em " + pronome + ". Podemos conversar?");
    } else {
      link.href = linkWhats(mensagemGeral);
    }
  });

  const form = document.getElementById("form-divulgue");
  if (form) form.action = "https://wa.me/" + WHATSAPP;
}

function iniciarNumeros() {
  const numeros = document.querySelectorAll(".stats strong");

  const menosMovimento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (menosMovimento || !("IntersectionObserver" in window)) return;

  function animar(elemento) {
    const alvo = parseInt(elemento.dataset.alvo, 10);
    const duracao = 1200;
    const inicio = performance.now();

    function passo(agora) {
      const progresso = Math.min((agora - inicio) / duracao, 1);
      elemento.textContent = Math.round(alvo * progresso);
      if (progresso < 1) requestAnimationFrame(passo);
    }
    requestAnimationFrame(passo);
  }

  const observador = new IntersectionObserver(function (entradas) {
    entradas.forEach(function (entrada) {
      if (entrada.isIntersecting) {
        animar(entrada.target);
        observador.unobserve(entrada.target);
      }
    });
  }, { threshold: 0.6 });

  numeros.forEach(function (elemento) {
    elemento.dataset.alvo = elemento.textContent;
    elemento.textContent = "0";
    observador.observe(elemento);
  });
}

function iniciarAno() {
  const ano = document.getElementById("ano");
  if (ano) ano.textContent = new Date().getFullYear();
}

function iniciarTema() {
  const botao = document.querySelector(".tema-toggle");
  if (!botao) return;

  const raiz = document.documentElement;
  const sistemaEscuro = window.matchMedia("(prefers-color-scheme: dark)");

  function temaSalvo() {
    try {
      return localStorage.getItem("tema");
    } catch {
      return null;
    }
  }

  function aplicar(tema) {
    raiz.setAttribute("data-tema", tema);
    botao.textContent = tema === "escuro" ? "☀️" : "🌙";
    botao.setAttribute("aria-label", tema === "escuro" ? "Ativar tema claro" : "Ativar tema escuro");
  }

  aplicar(temaSalvo() || (sistemaEscuro.matches ? "escuro" : "claro"));

  botao.addEventListener("click", function () {
    const novo = raiz.getAttribute("data-tema") === "escuro" ? "claro" : "escuro";
    aplicar(novo);
    try {
      localStorage.setItem("tema", novo);
    } catch {}
  });

  sistemaEscuro.addEventListener("change", function () {
    if (!temaSalvo()) aplicar(sistemaEscuro.matches ? "escuro" : "claro");
  });
}

iniciarWhatsApp();
iniciarMenu();
iniciarBotaoTopo();
iniciarBusca();
iniciarFormulario();
iniciarNumeros();
iniciarAno();
iniciarTema();