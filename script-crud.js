const AdicionarTarefaBt = document.querySelector(`.app__button--add-task`);
const formAdicionarTarefa = document.querySelector(`.app__form-add-task`);
const formularioTexto = document.querySelector(`.app__form-textarea`);
const ulImportaForm = document.querySelector(`.app__section-task-list`);
const cancelarbt = document.querySelector(`.app__form-footer__button--cancel`);
const descricaoDaTarefa = document.querySelector(
  `.app__section-active-task-description`
);
//abaixo primeiro vai tentar ler e atribuir o primeiro valor, se não tenta o próximo;
let listaDeTarefas =
  JSON.parse(localStorage.getItem(`listaDeTarefasLocal`)) || []; //ARRAY

const removerConcluidasBt = document.querySelector(`#btn-remover-concluidas`);
const removerTodasBt = document.querySelector(`#btn-remover-todas`);

let radarUltimoItemSelecionado = null; // recebe o valor da lista selecionada. Da próxima vez se essa lista for selecionada de novo o item é desmarcado por padrão e o if  cancela o código de seleção, impedindo de ser selecionada de novo.
let listaDoUltimoItemSelecionado = null; 
let botaoDoUltimoItemSelecionado = null;

function salvaOuAtualizaListaDeTarefas() {
  localStorage.setItem(`listaDeTarefasLocal`, JSON.stringify(listaDeTarefas));
}

//tem que estar antes do formAdicionartarefa porque se o form adicionar tarefa for aberto e esse arquivo estiver depois dele... essa opção não terá sido lida ainda por estar depois do form adicionartarefa
AdicionarTarefaBt.addEventListener(`click`, () => {
  formAdicionarTarefa.classList.toggle(`hidden`);
});

//tem que estar antes do formAdicionartarefa porque se o form adicionar tarefa for aberto e esse arquivo estiver depois dele... essa opção não terá sido lida ainda por estar depois do form adicionartarefa
cancelarbt.addEventListener(`click`, () => {
  formularioTexto.value = ``;
  console.log(`ssdfsf`);
  formAdicionarTarefa.classList.add(`hidden`);
});
//tarefa que está dentro da listaDeTarefas Vai passar aqui

function criarElementoTarefa(tarefa) {
  const li = document.createElement("li");
  li.classList.add("app__section-task-list-item");

  const svg = document.createElement("svg");
  svg.innerHTML = `
    <svg class="app__section-task-icon-status" width="24" height="24" viewBox="0 0 24 24" fill="none"
    xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="12" fill="#FFF"></circle>
            <path d="M9 16.1719L19.5938 5.57812L21 6.98438L9 18.9844L3.42188 13.4062L4.82812 12L9 16.1719Z"
                fill="#01080E"></path>
        </svg>
    `;
  
  const paragrafo = document.createElement("p");
  paragrafo.classList.add(`app__section-task-list-item-description`);
  paragrafo.textContent = tarefa.descricao;

  const botao = document.createElement("button");
  botao.classList.add(`app_button-edit`);
  
  const imagemBotao = document.createElement("img");
  imagemBotao.setAttribute("src", "/imagens/edit.png");
  botao.append(imagemBotao);
  li.append(svg, paragrafo, botao);
  if(tarefa.completa) { 
    console.log(1)
    botao.onclick = () => {};
    li.onclick = () => {};
    li.classList.add(`app__section-task-list-item-complete`)
  }
else {
  botao.onclick = () => {
    const valorSubstituto = prompt(`digite a tarefa corrigida:`);
    if (valorSubstituto) {
      paragrafo.textContent = valorSubstituto;
      tarefa.descricao = valorSubstituto; //modifica o valor da tarefa de algum índice do array, depende do botão que você clicou.
      salvaOuAtualizaListaDeTarefas(); //estamos setando o array listaDeTarefas novo, modificada, no lugar da antiga dentro do localStorage
    }
  };

  li.onclick = () => {
    document
      .querySelectorAll(`.app__section-task-list-item-active`)
      .forEach((element) => {
        element.classList.remove(`app__section-task-list-item-active`);
      });

    if (tarefa === radarUltimoItemSelecionado) {
      descricaoDaTarefa.innerText = ``; //tiramos o item repetido de destaque
      radarUltimoItemSelecionado = null;//resetamos o radar do objeto
      listaDoUltimoItemSelecionado = null;//resetamos o radar da lista
      botaoDoUltimoItemSelecionado = null;//tira o radar do botão junto 
      return;
    }
    radarUltimoItemSelecionado = tarefa
    listaDoUltimoItemSelecionado = li; /*item clicado da vez*/;
    botaoDoUltimoItemSelecionado = botao;
    descricaoDaTarefa.innerText = tarefa.descricao;
    li.classList.add(`app__section-task-list-item-active`);
  };

}

  
  return li;
}

//Atribui ao botão de envio do formulário uma função que:
formAdicionarTarefa.addEventListener(`submit`, (evento) => {
  evento.preventDefault();
  const tarefa = {
    //1 captura valor do formulário e põe em uma referência
    descricao: formularioTexto.value,
  };
  
  const importarProHtml = criarElementoTarefa(tarefa); // essas duas | servem para colocar tarefas novas que não estão no localStorage
  ulImportaForm.append(importarProHtml); // linhas     | dentro documento html, na tag ul
  listaDeTarefas.push(tarefa); // 2 através do valor dessa referência coloca os valores numa lista de array
  salvaOuAtualizaListaDeTarefas(); // 3 e armazena a listaDeTarefas no localStorage
  formularioTexto.value = ``; //limpa a area de escrever quando enviamos o texto
  formAdicionarTarefa.classList.add(`hidden`);
});

//pra cada elemento da lista de tarefas ele criará um elemento html com base em sua informação e colocará o resultado no documento html
listaDeTarefas.forEach((element) => {
  const importarProHtml = criarElementoTarefa(element);
  ulImportaForm.append(importarProHtml);
});

document.addEventListener(`focoFinalizado`, () => {
  if (radarUltimoItemSelecionado && listaDoUltimoItemSelecionado){
  botaoDoUltimoItemSelecionado.onclick = () => { }
  listaDoUltimoItemSelecionado.onclick = () => { }
  listaDoUltimoItemSelecionado.classList.add(`app__section-task-list-item-complete`);
  listaDoUltimoItemSelecionado.classList.remove(`app__section-task-list-item-active`);
  radarUltimoItemSelecionado.completa = true //isso da para o objeto uma nova propriedade com a chave `completa`e o valor true
  salvaOuAtualizaListaDeTarefas(); // agora o objeto do array lista de tarefas em questão foi modificado e essa lista quem que ele está modificado substituiu a antiga
}
}); 

let removerTarefas = (isItTrue) => {
  let seletor = isItTrue ? `.app__section-task-list-item-complete`:`.app__section-task-list-item`;
  document.querySelectorAll(seletor)
  .forEach(element => {
    element.remove();   
  })
  listaDeTarefas = isItTrue ? listaDeTarefas.filter(element => !element.completa) : []
  salvaOuAtualizaListaDeTarefas();
}
removerConcluidasBt.onclick = () => removerTarefas(true); 

removerTodasBt.onclick = () => removerTarefas(false)