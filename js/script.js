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
// documentElement é o elemento <html>; classList.add acrescenta uma classe a ele.
document.documentElement.classList.add("js");

/* ---------- Configuração e funções de apoio ---------- */

// Número do WhatsApp no formato internacional: 55 (Brasil) + DDD + número.
// É o ÚNICO lugar onde o número precisa ser trocado.
// "const" cria uma variável que não pode ser reatribuída depois.
const WHATSAPP = "5514996895439";

// Quantidade mínima de caracteres do formulário "Divulgue um cão".
const MINIMO_CARACTERES = 20;

// Monta um link do WhatsApp com a mensagem já escrita.
// encodeURIComponent troca espaços e acentos por códigos que cabem em uma URL.
// O "?text=" é o pedaço do endereço que o WhatsApp usa para preencher a mensagem.
function linkWhats(mensagem) {
  return "https://wa.me/" + WHATSAPP + "?text=" + encodeURIComponent(mensagem);
}

// Devolve o nome do cão de um card.
// O <h3> é "Leandro <small>2 anos</small>": o primeiro pedaço (childNodes[0]) é só o nome.
// trim() tira espaços sobrando no começo e no fim do texto.
function pegarNome(card) {
  return card.querySelector("h3").childNodes[0].textContent.trim();
}

// Devolve a raça do cão de um card (texto do item com a classe "raca", dentro da ficha).
// Se o card não tiver ficha, devolve texto vazio e a busca continua funcionando só pelo nome.
function pegarRaca(card) {
  const item = card.querySelector(".raca");
  return item ? item.textContent.trim() : "";
}

// Deixa o texto em minúsculas e sem acento, para a busca achar "algodao" e "Algodão".
// normalize("NFD") separa a letra do acento; o replace apaga só os acentos.
// A expressão /[\u0300-\u036f]/g encontra todos os símbolos de acento (o "g" vale para o texto inteiro).
function semAcento(texto) {
  return texto.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

/* ---------- 1. Menu hambúrguer ---------- */

function iniciarMenu() {
  // Pega o botão ☰ e o menu na página.
  const botao = document.querySelector(".menu-toggle");
  const menu = document.getElementById("menu");
  // Se algum dos dois não existir, sai da função sem fazer nada (evita erro).
  if (!botao || !menu) return;

  // abrir = true abre o menu; abrir = false fecha.
  function abrirFecharMenu(abrir) {
    menu.classList.toggle("open", abrir);                         // o CSS mostra o menu com a classe "open"
    botao.setAttribute("aria-expanded", abrir ? "true" : "false"); // avisa leitores de tela
    botao.setAttribute("aria-label", abrir ? "Fechar menu" : "Abrir menu"); // texto lido pelo leitor de tela
    botao.textContent = abrir ? "✕" : "☰";                         // troca o desenho do botão
  }

  // Clique no botão: se estava aberto, fecha; se estava fechado, abre.
  botao.addEventListener("click", function () {
    abrirFecharMenu(!menu.classList.contains("open"));
  });

  // Clicar em um link do menu fecha o menu (a página rola até a seção).
  menu.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", function () { abrirFecharMenu(false); });
  });

  // Tecla Esc fecha o menu.
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") abrirFecharMenu(false);
  });

  // Clicar fora do cabeçalho fecha o menu.
  // closest(".nav") procura o ".nav" no elemento clicado ou em quem o contém.
  document.addEventListener("click", function (e) {
    if (!e.target.closest(".nav")) abrirFecharMenu(false);
  });

  // Se a tela ficar grande (girar o celular, por exemplo), fecha o menu.
  window.addEventListener("resize", function () {
    if (window.innerWidth > 1100) abrirFecharMenu(false);
  });
}

/* ---------- 2. Botão "voltar ao topo" ---------- */

function iniciarBotaoTopo() {
  // Pega o botão; se ele não existir no HTML, sai da função.
  const botao = document.querySelector(".topo");
  if (!botao) return;

  // scrollY = quantos pixels a página já rolou. Passou de 400: mostra o botão.
  // toggle("visivel", condição) liga a classe se a condição for verdadeira e desliga se for falsa.
  function atualizarBotao() {
    botao.classList.toggle("visivel", window.scrollY > 400);
  }

  // A cada rolagem da página, confere se o botão deve aparecer.
  window.addEventListener("scroll", atualizarBotao);
  atualizarBotao(); // confere logo ao abrir a página (ela pode abrir já rolada)
}

/* ---------- 3 e 4. Busca, contador de resultados e limpar filtros ---------- */

function iniciarBusca() {
  // Pega todos os elementos que a busca usa.
  const campoBusca = document.getElementById("busca-nome");      // caixa de texto da busca
  const contagem = document.getElementById("contagem");          // texto "X cães encontrados"
  const semResultado = document.getElementById("sem-resultado"); // aviso "nenhum cão"
  const botaoLimpar = document.getElementById("limpar-filtros"); // botão "Limpar filtros"
  const cartoes = document.querySelectorAll(".dog-card");        // todos os cards de cães
  const radios = document.querySelectorAll(".filtros input");    // botões de porte e idade
  // Se faltar qualquer elemento essencial, a busca não liga.
  if (!campoBusca || !contagem || !semResultado || !botaoLimpar) return;

  // Roda sempre que a pessoa digita ou troca um filtro.
  function atualizarResultado() {
    // Texto digitado, sem espaços nas pontas, em minúsculas e sem acento.
    const termo = semAcento(campoBusca.value.trim());

    // 1) Busca: o card sem o termo no nome E na raça ganha a classe "sem-busca" (o CSS o esconde).
    // indexOf devolve -1 quando o termo não aparece dentro do texto.
    cartoes.forEach(function (card) {
      const nome = semAcento(pegarNome(card));
      const raca = semAcento(pegarRaca(card));
      const achou = nome.indexOf(termo) !== -1 || raca.indexOf(termo) !== -1;
      card.classList.toggle("sem-busca", termo !== "" && !achou);
    });

    // 2) Contagem: conta os cards que continuam aparecendo.
    // Isso considera a busca E os filtros de porte e idade (que são feitos em CSS).
    // getComputedStyle lê o estilo que o navegador realmente aplicou no card.
    let total = 0;
    cartoes.forEach(function (card) {
      if (getComputedStyle(card).display !== "none") total++;
    });

    // Escreve o texto no singular ou no plural, conforme o total.
    contagem.textContent = total + (total === 1 ? " cão encontrado" : " cães encontrados");
    semResultado.hidden = total > 0; // só mostra o aviso quando não sobrou nenhum cão

    // 3) O botão "Limpar filtros" só aparece se há alguma busca ou filtro ligado.
    // "p-todos" e "i-todas" são as opções "Todos" de porte e de idade.
    const filtroLigado = termo !== "" ||
      !document.getElementById("p-todos").checked ||
      !document.getElementById("i-todas").checked;
    botaoLimpar.hidden = !filtroLigado;
  }

  // "input" dispara a cada letra digitada; "change" dispara quando um filtro é escolhido.
  campoBusca.addEventListener("input", atualizarResultado);
  radios.forEach(function (radio) {
    radio.addEventListener("change", atualizarResultado);
  });

  // Limpar filtros: apaga a busca e volta os filtros para "Todos".
  botaoLimpar.addEventListener("click", function () {
    campoBusca.value = "";                                  // esvazia a caixa de busca
    document.getElementById("p-todos").checked = true;      // porte volta para "Todos"
    document.getElementById("i-todas").checked = true;      // idade volta para "Todas"
    atualizarResultado();                                   // atualiza a lista e a contagem
    campoBusca.focus();                                     // devolve o cursor para a busca
  });

  atualizarResultado(); // mostra a contagem inicial
}

/* ---------- 5. Validação do formulário "Divulgue um cão" ---------- */

function iniciarFormulario() {
  // Pega o formulário e as partes dele que o código vai mexer.
  const form = document.getElementById("form-divulgue");
  const campo = document.getElementById("msg");               // caixa de texto da mensagem
  const contador = document.getElementById("msg-contador");   // número de letras digitadas
  const erro = document.getElementById("msg-erro");           // local do aviso de erro
  const sucesso = document.getElementById("msg-sucesso");     // local da mensagem de sucesso
  if (!form || !campo || !contador || !erro || !sucesso) return;

  // Desliga o aviso padrão do navegador: agora quem valida e avisa é o JavaScript.
  // (Sem JavaScript, o required e o minlength do HTML continuam funcionando.)
  form.noValidate = true;

  // Apaga o aviso de erro e tira o visual de campo inválido.
  function limparErro() {
    erro.textContent = "";
    campo.classList.remove("invalido");
    campo.setAttribute("aria-invalid", "false"); // avisa leitores de tela que o campo está certo
  }

  // A cada letra digitada: atualiza o contador e tira o erro quando o texto fica bom.
  campo.addEventListener("input", function () {
    const tamanho = campo.value.trim().length; // quantidade de caracteres, sem espaços nas pontas
    contador.textContent = tamanho;
    sucesso.hidden = true; // se a pessoa voltou a digitar, esconde a mensagem de sucesso
    if (tamanho >= MINIMO_CARACTERES) limparErro();
  });

  // Ao enviar: confere o tamanho do texto.
  form.addEventListener("submit", function (e) {
    const tamanho = campo.value.trim().length;

    // Texto curto demais: bloqueia o envio e mostra o erro.
    if (tamanho < MINIMO_CARACTERES) {
      e.preventDefault(); // cancela o envio
      erro.textContent = "Escreva pelo menos " + MINIMO_CARACTERES + " caracteres (faltam " + (MINIMO_CARACTERES - tamanho) + ").";
      campo.classList.add("invalido");              // o CSS destaca o campo com problema
      campo.setAttribute("aria-invalid", "true");   // avisa leitores de tela do erro
      campo.focus();                                // leva o cursor de volta ao campo
      return;                                       // para aqui: não executa o resto
    }

    // Texto válido: o envio segue normalmente (abre o WhatsApp em outra aba).
    // Mostramos a confirmação e limpamos o formulário um instante depois.
    limparErro();
    sucesso.hidden = false;
    // setTimeout espera 300 ms antes de limpar, para o envio acontecer primeiro.
    setTimeout(function () {
      form.reset();               // esvazia todos os campos
      contador.textContent = "0"; // zera o contador de letras
    }, 300);
  });
}

/* ---------- 6. WhatsApp configurado em um lugar só ---------- */

function iniciarWhatsApp() {
  // Mensagem usada nos links que não são de um cão específico (contato e botão flutuante).
  const mensagemGeral = "Olá! Vim pelo site Patas de Casa e gostaria de mais informações sobre adoção.";

  // Percorre TODOS os links que começam com https://wa.me/ e troca o endereço deles.
  document.querySelectorAll('a[href^="https://wa.me/"]').forEach(function (link) {
    const card = link.closest(".dog-card"); // o link está dentro de um card de cão?

    if (card) {
      // Botão "Quero adotar": a mensagem usa o nome que aparece no card.
      const nome = pegarNome(card);
      // Descobre se é fêmea pelo texto da etiqueta (.tag), para escolher "a/o" e "adotá-la/adotá-lo".
      const femea = card.querySelector(".tag").textContent.indexOf("Fêmea") !== -1;
      const artigo = femea ? "a" : "o";
      const pronome = femea ? "adotá-la" : "adotá-lo";
      link.href = linkWhats("Olá! Vi " + artigo + " " + nome + " no site Patas de Casa e tenho interesse em " + pronome + ". Podemos conversar?");
    } else {
      // Contato e botão flutuante: mensagem geral.
      link.href = linkWhats(mensagemGeral);
    }
  });

  // O formulário também usa o mesmo número.
  const form = document.getElementById("form-divulgue");
  if (form) form.action = "https://wa.me/" + WHATSAPP;
}

/* ---------- 7. Números animados ---------- */

function iniciarNumeros() {
  // Pega os números da faixa de estatísticas (os <strong> dentro de ".stats").
  const numeros = document.querySelectorAll(".stats strong");

  // Respeita quem pediu menos movimento no sistema e navegadores sem IntersectionObserver:
  // nesses casos os números ficam parados no valor final.
  const menosMovimento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (menosMovimento || !("IntersectionObserver" in window)) return;

  // Anima de 0 até o valor alvo em 1,2 segundo.
  function animar(elemento) {
    const alvo = parseInt(elemento.dataset.alvo, 10); // lê o valor final guardado em data-alvo
    const duracao = 1200;                             // duração da animação em milissegundos
    const inicio = performance.now();                 // instante em que a animação começou

    // "passo" é chamado a cada quadro da animação; "agora" é o instante atual.
    function passo(agora) {
      const progresso = Math.min((agora - inicio) / duracao, 1); // vai de 0 até 1
      elemento.textContent = Math.round(alvo * progresso);       // número arredondado na tela
      if (progresso < 1) requestAnimationFrame(passo); // pede o próximo quadro
    }
    requestAnimationFrame(passo); // começa a animação
  }

  // IntersectionObserver avisa quando um elemento aparece na tela.
  const observador = new IntersectionObserver(function (entradas) {
    entradas.forEach(function (entrada) {
      if (entrada.isIntersecting) {              // o número entrou na área visível
        animar(entrada.target);                  // começa a contagem
        observador.unobserve(entrada.target); // anima só uma vez
      }
    });
  }, { threshold: 0.6 }); // 60% do número precisa estar visível

  // Prepara cada número: guarda o valor final, zera na tela e passa a observar.
  numeros.forEach(function (elemento) {
    elemento.dataset.alvo = elemento.textContent; // guarda o valor final no HTML (data-alvo)
    elemento.textContent = "0";                    // começa em zero
    observador.observe(elemento);                  // espera o número aparecer na tela
  });
}

/* ---------- 8. Ano do rodapé ---------- */

function iniciarAno() {
  const ano = document.getElementById("ano"); // local do ano no rodapé
  // new Date().getFullYear() devolve o ano atual (por exemplo, 2026).
  if (ano) ano.textContent = new Date().getFullYear();
}

/* ---------- 9. Tema claro/escuro ---------- */

function iniciarTema() {
  const botao = document.querySelector(".tema-toggle");
  if (!botao) return;

  const raiz = document.documentElement; // o elemento <html>
  // matchMedia pergunta ao navegador se o sistema está no modo escuro.
  const sistemaEscuro = window.matchMedia("(prefers-color-scheme: dark)");

  // Lê a escolha guardada no navegador (ou null, se a pessoa nunca escolheu).
  function temaSalvo() {
    try {
      return localStorage.getItem("tema");
    } catch {
      return null; // alguns navegadores bloqueiam o localStorage (aba privada, por exemplo)
    }
  }

  // Aplica um tema: o CSS reage ao atributo data-tema, e o botão mostra o ícone do tema oposto
  // (no escuro mostra o sol, para voltar ao claro; no claro mostra a lua).
  function aplicar(tema) {
    raiz.setAttribute("data-tema", tema);                      // o CSS troca as cores por este atributo
    botao.textContent = tema === "escuro" ? "☀️" : "🌙";       // ícone do botão
    botao.setAttribute("aria-label", tema === "escuro" ? "Ativar tema claro" : "Ativar tema escuro"); // texto para leitores de tela
  }

  // Ao abrir a página: usa a escolha salva; sem escolha, usa o tema do sistema.
  aplicar(temaSalvo() || (sistemaEscuro.matches ? "escuro" : "claro"));

  // Clique: troca o tema e guarda a escolha.
  botao.addEventListener("click", function () {
    // Se está escuro vira claro; se está claro vira escuro.
    const novo = raiz.getAttribute("data-tema") === "escuro" ? "claro" : "escuro";
    aplicar(novo);
    try {
      localStorage.setItem("tema", novo); // continua salvo depois de fechar a página
    } catch {
      // Sem localStorage o tema muda, mas não fica salvo.
    }
  });

  // Se o sistema trocar de tema e a pessoa nunca escolheu, acompanha o sistema.
  sistemaEscuro.addEventListener("change", function () {
    if (!temaSalvo()) aplicar(sistemaEscuro.matches ? "escuro" : "claro");
  });
}

/* ---------- Inicialização: liga todas as funcionalidades ---------- */

// Cada chamada abaixo liga uma funcionalidade. A ordem importa pouco,
// mas o WhatsApp vem primeiro para os links já estarem prontos quando a página aparecer.
iniciarWhatsApp();
iniciarMenu();
iniciarBotaoTopo();
iniciarBusca();
iniciarFormulario();
iniciarNumeros();
iniciarAno();
iniciarTema();