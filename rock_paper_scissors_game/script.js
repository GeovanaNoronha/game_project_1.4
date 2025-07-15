        let playerScore = 0;
        let computerScore = 0;
        let currentLanguage = 'pt';

        const translations = {
            pt: {
                title: 'Pedra, Papel e Tesoura',
                player: 'Jogador',
                computer: 'Computador',
                yourChoice: 'Sua Escolha',
                computerChoice: 'Computador',
                reset: 'Resetar Jogo',
                instructions: 'Clique em uma das opções acima para jogar!',
                langButton: 'English',
                flag: '🇺🇸',
                win: 'Você ganhou!',
                lose: 'Você perdeu!',
                draw: 'Empate!',
                choices: {
                    rock: 'Pedra',
                    paper: 'Papel',
                    scissors: 'Tesoura'
                }
            },
            en: {
                title: 'Rock, Paper, Scissors',
                player: 'Player',
                computer: 'Computer',
                yourChoice: 'Your Choice',
                computerChoice: 'Computer',
                reset: 'Reset Game',
                instructions: 'Click on one of the options above to play!',
                langButton: 'Português',
                flag: '🇧🇷',
                win: 'You win!',
                lose: 'You lose!',
                draw: 'It\'s a draw!',
                choices: {
                    rock: 'Rock',
                    paper: 'Paper',
                    scissors: 'Scissors'
                }
            }
        };

        const choiceEmojis = {
            rock: '🗿',
            paper: '📄',
            scissors: '✂️'
        };

        function toggleLanguage() {
            currentLanguage = currentLanguage === 'pt' ? 'en' : 'pt';
            updateLanguage();
        }

        function updateLanguage() {
            const lang = translations[currentLanguage];
            
            document.getElementById('title').textContent = lang.title;
            document.getElementById('playerLabel').textContent = lang.player;
            document.getElementById('computerLabel').textContent = lang.computer;
            document.getElementById('yourChoiceLabel').textContent = lang.yourChoice;
            document.getElementById('computerChoiceLabel').textContent = lang.computerChoice;
            document.getElementById('resetText').textContent = lang.reset;
            document.getElementById('instructions').textContent = lang.instructions;
            document.getElementById('langText').textContent = lang.langButton;
            document.getElementById('flagIcon').textContent = lang.flag;
        }

        function playGame(playerChoice) {
            const choices = ['rock', 'paper', 'scissors'];
            const computerChoice = choices[Math.floor(Math.random() * choices.length)];
            
            // Mostrar as escolhas
            document.getElementById('choicesDisplay').style.display = 'flex';
            document.getElementById('playerChoice').textContent = choiceEmojis[playerChoice];
            document.getElementById('computerChoice').textContent = choiceEmojis[computerChoice];
            
            // Determinar o vencedor
            const result = getWinner(playerChoice, computerChoice);
            displayResult(result);
        }

        function getWinner(player, computer) {
            if (player === computer) {
                return 'draw';
            }
            
            if (
                (player === 'rock' && computer === 'scissors') ||
                (player === 'paper' && computer === 'rock') ||
                (player === 'scissors' && computer === 'paper')
            ) {
                playerScore++;
                document.getElementById('playerScore').textContent = playerScore;
                return 'win';
            } else {
                computerScore++;
                document.getElementById('computerScore').textContent = computerScore;
                return 'lose';
            }
        }

        function displayResult(result) {
            const resultElement = document.getElementById('result');
            const lang = translations[currentLanguage];
            
            resultElement.className = `result ${result}`;
            
            switch (result) {
                case 'win':
                    resultElement.textContent = lang.win;
                    break;
                case 'lose':
                    resultElement.textContent = lang.lose;
                    break;
                case 'draw':
                    resultElement.textContent = lang.draw;
                    break;
            }
        }

        function resetGame() {
            playerScore = 0;
            computerScore = 0;
            document.getElementById('playerScore').textContent = playerScore;
            document.getElementById('computerScore').textContent = computerScore;
            document.getElementById('choicesDisplay').style.display = 'none';
            document.getElementById('result').textContent = '';
            document.getElementById('result').className = 'result';
        }

        // Inicializar o jogo
        updateLanguage();