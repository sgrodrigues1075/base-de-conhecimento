// Seleciona onde os cards aparecem
let cardContainer = document.querySelector(".card-container");

// Seleciona o input de busca
let campoBusca = document.querySelector("header input");

// Guarda os dados do JSON na memória
let dados = [];


// Seleciona o seletor de tema
let seletorTema = document.querySelector("#select-tema");

/**
 * Aplica o tema conforme o valor escolhido:
 * - "claro": adiciona a classe .light-theme no body
 * - "escuro": remove a classe .light-theme do body
 */
function aplicarTema(tema) {
  if (tema === "claro") {
    document.body.classList.add("light-theme");
  } else {
    document.body.classList.remove("light-theme");
  }
}

// Quando o usuário muda o select de tema, aplicamos o tema escolhido
seletorTema.addEventListener("change", function () {
  aplicarTema(this.value); // "claro" ou "escuro"
});


/**
 * Função chamada ao clicar no botão ou ao apertar ENTER.
 * Carrega os dados (se ainda não carregados), filtra e exibe.
 */
async function iniciarBusca() {

  // 1. Carrega dados do JSON APENAS uma vez
  if (dados.length === 0) {
    try {
      let resposta = await fetch("data.json");
      dados = await resposta.json();
    } catch (error) {
      console.error("Falha ao buscar dados:", error);
      return;
    }
  }

  // 2. Texto digitado no campo
  const termoBusca = campoBusca.value.trim().toLowerCase();

  // 3. Filtro completo (nome, descrição e tags)
  let dadosFiltrados;

  if (termoBusca === "") {
    dadosFiltrados = dados; // mostra tudo se nada foi digitado
  } else {
    dadosFiltrados = dados.filter((dado) => {

      // Verifica nome
      const nomeMatch = dado.nome.toLowerCase().includes(termoBusca);

      // Verifica descrição
      const descricaoMatch = dado.descricao.toLowerCase().includes(termoBusca);

      // Verifica TAGS (some + includes)
      const tagsMatch = dado.tags.some(tag =>
        tag.toLowerCase().includes(termoBusca)
      );

      return nomeMatch || descricaoMatch || tagsMatch;
    });
  }

  // 4. Envia para o renderizador
  renderizarCards(dadosFiltrados);
}

/**
 * Monta os cards no HTML
 */
function renderizarCards(lista) {
  cardContainer.innerHTML = "";

  if (lista.length === 0) {
    const msg = document.createElement("p");
    msg.textContent = "Nenhuma tecnologia encontrada.";
    cardContainer.appendChild(msg);
    return;
  }

  for (let dado of lista) {

    // Junta o array de tags em um texto
    const tagsTexto = dado.tags.join(" • ");

    const article = document.createElement("article");
    article.classList.add("card");

    article.innerHTML = `
      <h2>${dado.nome}</h2>
      <p>${dado.data_criacao}</p>
      <p>${dado.descricao}</p>
      <p><strong>Tags:</strong> ${tagsTexto}</p>
      <a href="${dado.link}" target="_blank">Saiba mais</a>
    `;

    cardContainer.appendChild(article);
  }
}

/* ===========================================================
      NOVO: BUSCAR AO PRESSIONAR ENTER
   =========================================================== */
campoBusca.addEventListener("keyup", function(event) {
  if (event.key === "Enter") {
    iniciarBusca(); // chama a busca
  }
});

// Atualiza automaticamente o ano no footer
document.getElementById("anoAtual").textContent = new Date().getFullYear();
