// Inicializa variáveis para controle do jogo
let index = 0; // Índice da pergunta atual
let score = 0; // Pontuação do jogador
let lastQuestionAnswered = false; // Indica se a última pergunta foi respondida
let timeLimit = 7000; // Limite de tempo para responder cada pergunta (7 segundos em milissegundos)

// Carrega elementos de áudio
const niceSound = new Audio('./assets/good.mp3'); // Som para respostas corretas
const badSound = new Audio('./assets/bad.mp3'); // Som para respostas incorretas

// Função para carregar a próxima pergunta
function loadQuestion() {
  // Obtém a pergunta atual
  const currentQuestion = question[index];
  const questionElement = document.getElementById('question');
  const optionsElement = document.getElementById('options');
  questionElement.textContent = currentQuestion.question; // Exibe a pergunta

  optionsElement.innerHTML = '';
  // Adiciona botões para as opções de resposta
  currentQuestion.options.forEach((option, i) => {
    const button = document.createElement('button');
    button.textContent = option.text;
    button.onclick = () => checkAnswer(option.correct, button);
    optionsElement.appendChild(button);
  });

  // Define um temporizador para passar para a próxima pergunta após o limite de tempo
  setTimeout(() => {
    if (!lastQuestionAnswered) {
      disableAllButtons(); // Desativa todos os botões de resposta
      index++;
      if (index < question.length) {
        loadQuestion(); // Carrega a próxima pergunta
      } else {
        lastQuestionAnswered = true;
        disableAllButtons();
        if (score >= 5) {
          playNiceSound();
        } else {
          playBadSound();
        }
        showScorePopup();
      }
    }
  }, timeLimit);
}

// Função para desativar todos os botões de resposta
function disableAllButtons() {
  const buttons = document.querySelectorAll('#options button');
  buttons.forEach((button) => {
    button.disabled = true;
  });
}

// Função para ativar todos os botões de resposta
function enableAllButtons() {
  const buttons = document.querySelectorAll('#options button');
  buttons.forEach((button) => {
    button.disabled = false;
  });
}

// Funções para reproduzir os sons de resposta
function playNiceSound() {
  niceSound.play();
}

function playBadSound() {
  badSound.play();
}

// Função para exibir um popup com a pontuação final
function showScorePopup() {
  alert(`Your Final Score: ${score}`);
}

// Função para verificar a resposta do jogador
function checkAnswer(isCorrect, button) {
  if (lastQuestionAnswered) {
    // Se a última pergunta já foi respondida, não faz nada
    return;
  }

  disableAllButtons(); // Desativa todos os botões

  // Atualiza a pontuação com base na resposta
  if (isCorrect) {
    score += 1;
  } else {
    score -= 1;
  }

  // Atualiza a exibição da pontuação
  document.getElementById('playerScore').textContent = `${score} /10`;

  index++;
  if (index < question.length) {
    loadQuestion(); // Carrega a próxima pergunta
  } else {
    lastQuestionAnswered = true;
    disableAllButtons();
    if (score >= 5) {
      playNiceSound();
    } else {
      playBadSound();
    }
    showScorePopup();
  }
}

// Carrega a primeira pergunta ao iniciar o jogo
loadQuestion();

// Função para reiniciar o jogo quando o botão "Recommencer" é clicado
function restartQuestions() {
  location.reload();
}

// Contagem regressiva para o término do Quiz
let timeRemaining = timeLimit / 100; // Converte milissegundos para segundos
const countdownElement = document.getElementById('countdown');

countdownElement.textContent = `Time Remaining: ${timeRemaining} seconds`; // Exibe o tempo inicial

const countdownInterval = setInterval(() => {
  timeRemaining--;

  if (timeRemaining < 0 || lastQuestionAnswered) {
    clearInterval(countdownInterval);
    countdownElement.textContent = ''; // Limpa a contagem regressiva quando o temporizador termina
    if (!lastQuestionAnswered) {
      disableAllButtons();
      index++;
      if (index < question.length) {
        loadQuestion(); // Carrega a próxima pergunta
      } else {
        lastQuestionAnswered = true;
        disableAllButtons();
        if (score >= 5) {
          playNiceSound();
        } else {
          playBadSound();
        }
        showScorePopup();
      }
    }
  } else {
    countdownElement.textContent = `Time Remaining: ${timeRemaining} seconds`;
  }
}, 1000); // Atualiza a contagem regressiva a cada segundo
