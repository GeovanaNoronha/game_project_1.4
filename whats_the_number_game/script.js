    // Configuração do jogo
        let targetNumber = Math.floor(Math.random() * 100) + 1;
        let attempts = 0;
        let gameOver = false;
        let gameHistory = [];
        let currentLanguage = 'pt';

        // Traduções
        const translations = {
            pt: {
                title: "Adivinhe o Número",
                subtitle: "Tente adivinhar o número entre 1 e 100!",
                attemptsLabel: "Tentativas",
                rangeLabel: "Intervalo", 
                statusLabel: "Status",
                statusPlaying: "Jogando",
                statusWon: "Venceu!",
                submitBtn: "Enviar",
                restartBtn: "Novo Jogo",
                historyTitle: "Histórico de Tentativas",
                noHistoryText: "Nenhuma tentativa ainda...",
                feedbackStart: "Faça sua primeira tentativa!",
                feedbackHigh: "Muito alto! Tente um número menor.",
                feedbackLow: "Muito baixo! Tente um número maior.",
                feedbackCorrect: "Parabéns! Você acertou em {attempts} tentativas!",
                feedbackInvalid: "Digite um número válido entre 1 e 100!",
                historyHigh: "Alto",
                historyLow: "Baixo",
                placeholder: "?",
                langButton: "🌐 EN"
            },
            en: {
                title: "Guess the Number",
                subtitle: "Try to guess the number between 1 and 100!",
                attemptsLabel: "Attempts",
                rangeLabel: "Range",
                statusLabel: "Status", 
                statusPlaying: "Playing",
                statusWon: "Won!",
                submitBtn: "Submit",
                restartBtn: "New Game",
                historyTitle: "Attempt History",
                noHistoryText: "No attempts yet...",
                feedbackStart: "Make your first guess!",
                feedbackHigh: "Too high! Try a smaller number.",
                feedbackLow: "Too low! Try a bigger number.",
                feedbackCorrect: "Congratulations! You got it in {attempts} attempts!",
                feedbackInvalid: "Enter a valid number between 1 and 100!",
                historyHigh: "High",
                historyLow: "Low",
                placeholder: "?",
                langButton: "🌐 PT"
            }
        };

        // Função para alternar idioma
        function toggleLanguage() {
            currentLanguage = currentLanguage === 'pt' ? 'en' : 'pt';
            updateLanguage();
        }

        // Função para atualizar textos na interface
        function updateLanguage() {
            const t = translations[currentLanguage];
            
            document.getElementById('title').textContent = t.title;
            document.getElementById('subtitle').textContent = t.subtitle;
            document.getElementById('attemptsLabel').textContent = t.attemptsLabel;
            document.getElementById('rangeLabel').textContent = t.rangeLabel;
            document.getElementById('statusLabel').textContent = t.statusLabel;
            document.getElementById('submitBtn').textContent = t.submitBtn;
            document.getElementById('restartBtn').textContent = t.restartBtn;
            document.getElementById('historyTitle').textContent = t.historyTitle;
            document.getElementById('guessInput').placeholder = t.placeholder;
            document.querySelector('.language-toggle').textContent = t.langButton;
            
            // Atualizar status
            const statusElement = document.getElementById('status');
            if (gameOver) {
                statusElement.textContent = t.statusWon;
            } else {
                statusElement.textContent = t.statusPlaying;
            }
            
            // Atualizar feedback atual
            updateFeedbackLanguage();
            
            // Atualizar histórico
            updateHistoryLanguage();
        }

        // Função para atualizar feedback baseado no idioma
        function updateFeedbackLanguage() {
            const t = translations[currentLanguage];
            const feedbackElement = document.getElementById('feedback');
            
            if (gameHistory.length === 0) {
                document.getElementById('feedbackText').textContent = t.feedbackStart;
                feedbackElement.className = 'feedback-start';
            } else {
                const lastAttempt = gameHistory[gameHistory.length - 1];
                if (lastAttempt.result === 'correct') {
                    document.getElementById('feedbackText').textContent = t.feedbackCorrect.replace('{attempts}', attempts);
                    feedbackElement.className = 'feedback-correct';
                } else if (lastAttempt.result === 'high') {
                    document.getElementById('feedbackText').textContent = t.feedbackHigh;
                    feedbackElement.className = 'feedback-high';
                } else if (lastAttempt.result === 'low') {
                    document.getElementById('feedbackText').textContent = t.feedbackLow;
                    feedbackElement.className = 'feedback-low';
                }
            }
        }

        // Função para atualizar histórico baseado no idioma
        function updateHistoryLanguage() {
            const t = translations[currentLanguage];
            const historyList = document.getElementById('historyList');
            
            if (gameHistory.length === 0) {
                historyList.innerHTML = `<div style="text-align: center; color: #718096; font-style: italic;">${t.noHistoryText}</div>`;
                return;
            }
            
            historyList.innerHTML = '';
            gameHistory.forEach(attempt => {
                const historyItem = document.createElement('div');
                historyItem.className = 'history-item';
                
                let feedbackText = '';
                let feedbackClass = '';
                
                if (attempt.result === 'high') {
                    feedbackText = t.historyHigh;
                    feedbackClass = 'high';
                } else if (attempt.result === 'low') {
                    feedbackText = t.historyLow;
                    feedbackClass = 'low';
                }
                
                historyItem.innerHTML = `
                    <span class="history-guess">${attempt.guess}</span>
                    ${attempt.result !== 'correct' ? `<span class="history-feedback ${feedbackClass}">${feedbackText}</span>` : ''}
                `;
                
                historyList.appendChild(historyItem);
            });
        }

        // Função principal do jogo
        function makeGuess() {
            if (gameOver) return;
            
            const guessInput = document.getElementById('guessInput');
            const guess = parseInt(guessInput.value);
            const t = translations[currentLanguage];
            
            // Validação
            if (isNaN(guess) || guess < 1 || guess > 100) {
                showFeedback(t.feedbackInvalid, 'feedback-start');
                return;
            }
            
            attempts++;
            document.getElementById('attempts').textContent = attempts;
            
            let result = '';
            let feedbackText = '';
            let feedbackClass = '';
            
            if (guess === targetNumber) {
                result = 'correct';
                feedbackText = t.feedbackCorrect.replace('{attempts}', attempts);
                feedbackClass = 'feedback-correct';
                gameOver = true;
                document.getElementById('status').textContent = t.statusWon;
                document.querySelector('.container').classList.add('celebration');
            } else if (guess > targetNumber) {
                result = 'high';
                feedbackText = t.feedbackHigh;
                feedbackClass = 'feedback-high';
            } else {
                result = 'low';
                feedbackText = t.feedbackLow;
                feedbackClass = 'feedback-low';
            }
            
            // Adicionar ao histórico
            gameHistory.push({
                guess: guess,
                result: result
            });
            
            // Atualizar interface
            showFeedback(feedbackText, feedbackClass);
            updateHistory();
            
            // Limpar input
            guessInput.value = '';
            
            // Focar no input se o jogo continuar
            if (!gameOver) {
                guessInput.focus();
            }
        }

        // Função para mostrar feedback
        function showFeedback(text, className) {
            const feedbackElement = document.getElementById('feedback');
            document.getElementById('feedbackText').textContent = text;
            feedbackElement.className = className;
            feedbackElement.classList.add('pulse');
            
            setTimeout(() => {
                feedbackElement.classList.remove('pulse');
            }, 500);
        }

        // Função para atualizar histórico
        function updateHistory() {
            updateHistoryLanguage();
            
            // Scroll para o final do histórico
            const historyList = document.getElementById('historyList');
            historyList.scrollTop = historyList.scrollHeight;
        }

        // Função para reiniciar o jogo
        function restartGame() {
            targetNumber = Math.floor(Math.random() * 100) + 1;
            attempts = 0;
            gameOver = false;
            gameHistory = [];
            
            const t = translations[currentLanguage];
            
            document.getElementById('attempts').textContent = '0';
            document.getElementById('status').textContent = t.statusPlaying;
            document.getElementById('guessInput').value = '';
            
            showFeedback(t.feedbackStart, 'feedback-start');
            updateHistory();
            
            document.querySelector('.container').classList.remove('celebration');
            document.getElementById('guessInput').focus();
        }

        // Event listeners
        document.getElementById('guessInput').addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                makeGuess();
            }
        });

        // Focar no input quando a página carregar
        document.getElementById('guessInput').focus();
    