// Lista de palavras para o jogo
        const words = [
            'JAVASCRIPT', 'PROGRAMACAO', 'COMPUTADOR', 'TECNOLOGIA', 'DESENVOLVIMENTO',
            'APLICATIVO', 'INTERNET', 'SOFTWARE', 'HARDWARE', 'ALGORITMO',
            'BANCO', 'DADOS', 'SISTEMA', 'REDE', 'SERVIDOR',
            'CLIENTE', 'CODIGO', 'FUNCAO', 'VARIAVEL', 'OBJETO',
            'ARRAY', 'LOOP', 'CONDICAO', 'OPERADOR', 'SINTAXE',
            'DEPURACAO', 'TESTE', 'VERSAO', 'BACKUP', 'SEGURANCA',
            'CRIPTOGRAFIA', 'PROTOCOLO', 'INTERFACE', 'USUARIO', 'EXPERIENCIA',
            'DESIGN', 'LAYOUT', 'RESPONSIVO', 'MOBILE', 'TABLET',
            'NAVEGADOR', 'WEBSITE', 'PAGINA', 'ELEMENTO', 'ATRIBUTO',
            'ESTILO', 'CLASSE', 'IDENTIFICADOR', 'SELETOR', 'PROPRIEDADE'
        ];

        let currentWord = '';
        let guessedWord = [];
        let usedLetters = [];
        let wrongGuesses = 0;
        let maxWrongGuesses = 6;
        let gameOver = false;
        let totalAttempts = 0;
        let totalHits = 0;

        const hangmanParts = ['head', 'body', 'leftArm', 'rightArm', 'leftLeg', 'rightLeg'];

        function initGame() {
            currentWord = words[Math.floor(Math.random() * words.length)];
            guessedWord = new Array(currentWord.length).fill('_');
            usedLetters = [];
            wrongGuesses = 0;
            gameOver = false;
            totalAttempts = 0;
            totalHits = 0;
            
            updateDisplay();
            updateMessage('Digite uma letra e clique em "Tentar"');
            hideAllHangmanParts();
            updateStats();
            
            document.getElementById('letterInput').focus();
        }

        function updateDisplay() {
            const wordDisplay = document.getElementById('wordDisplay');
            wordDisplay.innerHTML = '';
            
            guessedWord.forEach((letter, index) => {
                const letterSpan = document.createElement('span');
                letterSpan.className = 'letter';
                letterSpan.textContent = letter;
                if (letter !== '_') {
                    letterSpan.classList.add('revealed');
                }
                wordDisplay.appendChild(letterSpan);
            });
            
            updateUsedLetters();
        }

        function updateUsedLetters() {
            const usedLettersDiv = document.getElementById('usedLetters');
            usedLettersDiv.innerHTML = '';
            
            usedLetters.forEach(letterObj => {
                const letterSpan = document.createElement('span');
                letterSpan.className = `used-letter ${letterObj.correct ? 'correct' : 'wrong'}`;
                letterSpan.textContent = letterObj.letter;
                usedLettersDiv.appendChild(letterSpan);
            });
        }

        function updateMessage(text, type = '') {
            const messageDiv = document.getElementById('message');
            messageDiv.textContent = text;
            messageDiv.className = `message ${type}`;
        }

        function updateStats() {
            document.getElementById('errorsCount').textContent = wrongGuesses;
            document.getElementById('attemptsCount').textContent = totalAttempts;
            document.getElementById('hitsCount').textContent = totalHits;
        }

        function guessLetter() {
            if (gameOver) return;

            const input = document.getElementById('letterInput');
            const letter = input.value.toUpperCase();
            
            if (!letter || letter.length !== 1) {
                updateMessage('Por favor, digite uma letra válida!');
                return;
            }

            if (!/[A-Z]/.test(letter)) {
                updateMessage('Por favor, digite apenas letras!');
                return;
            }

            if (usedLetters.some(used => used.letter === letter)) {
                updateMessage('Esta letra já foi usada!');
                return;
            }

            totalAttempts++;
            let isCorrect = false;

            if (currentWord.includes(letter)) {
                // Letra correta
                for (let i = 0; i < currentWord.length; i++) {
                    if (currentWord[i] === letter) {
                        guessedWord[i] = letter;
                        isCorrect = true;
                    }
                }
                totalHits++;
                usedLetters.push({ letter: letter, correct: true });
                updateMessage(`Boa! A letra "${letter}" está na palavra!`);
                
                // Verificar vitória
                if (!guessedWord.includes('_')) {
                    gameOver = true;
                    updateMessage(`🎉 Parabéns! Você venceu! A palavra era: ${currentWord}`, 'win');
                }
            } else {
                // Letra incorreta
                wrongGuesses++;
                usedLetters.push({ letter: letter, correct: false });
                showHangmanPart(wrongGuesses - 1);
                updateMessage(`Ops! A letra "${letter}" não está na palavra.`);
                
                // Verificar derrota
                if (wrongGuesses >= maxWrongGuesses) {
                    gameOver = true;
                    updateMessage(`😢 Você perdeu! A palavra era: ${currentWord}`, 'lose');
                }
            }

            updateDisplay();
            updateStats();
            input.value = '';
            input.focus();
        }

        function showHangmanPart(partIndex) {
            if (partIndex < hangmanParts.length) {
                const part = document.getElementById(hangmanParts[partIndex]);
                part.classList.add('show');
            }
        }

        function hideAllHangmanParts() {
            hangmanParts.forEach(partId => {
                const part = document.getElementById(partId);
                part.classList.remove('show');
            });
        }

        function newGame() {
            initGame();
        }

        // Event listeners
        document.getElementById('letterInput').addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                guessLetter();
            }
        });

        document.getElementById('letterInput').addEventListener('input', function(e) {
            e.target.value = e.target.value.toUpperCase();
        });

        // Iniciar o jogo
        initGame();
