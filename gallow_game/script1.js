        // Translations
        const translations = {
            pt: {
                title: '🎯 Jogo da Forca',
                errors: 'Erros',
                attempts: 'Tentativas',
                hits: 'Acertos',
                usedLetters: 'Letras usadas:',
                tryBtn: 'Tentar',
                newGameBtn: '🎮 Novo Jogo',
                initialMessage: 'Digite uma letra e clique em "Tentar"',
                invalidLetter: 'Por favor, digite uma letra válida!',
                onlyLetters: 'Por favor, digite apenas letras!',
                letterUsed: 'Esta letra já foi usada!',
                correctLetter: 'Boa! A letra "{letter}" está na palavra!',
                wrongLetter: 'Ops! A letra "{letter}" não está na palavra.',
                winMessage: '🎉 Parabéns! Você venceu! A palavra era: {word}',
                loseMessage: '😢 Você perdeu! A palavra era: {word}',
                modalTitle: '🎉 Parabéns!',
                modalMessage: 'Você venceu! A palavra era: {word}',
                modalNewGame: 'Novo Jogo',
                modalClose: 'Fechar'
            },
            en: {
                title: '🎯 Hangman Game',
                errors: 'Errors',
                attempts: 'Attempts',
                hits: 'Hits',
                usedLetters: 'Used letters:',
                tryBtn: 'Try',
                newGameBtn: '🎮 New Game',
                initialMessage: 'Type a letter and click "Try"',
                invalidLetter: 'Please enter a valid letter!',
                onlyLetters: 'Please enter only letters!',
                letterUsed: 'This letter has already been used!',
                correctLetter: 'Good! The letter "{letter}" is in the word!',
                wrongLetter: 'Oops! The letter "{letter}" is not in the word.',
                winMessage: '🎉 Congratulations! You won! The word was: {word}',
                loseMessage: '😢 You lost! The word was: {word}',
                modalTitle: '🎉 Congratulations!',
                modalMessage: 'You won! The word was: {word}',
                modalNewGame: 'New Game',
                modalClose: 'Close'
            }
        };

        // Word lists
        const wordLists = {
            pt: [
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
            ],
            en: [
                'JAVASCRIPT', 'PROGRAMMING', 'COMPUTER', 'TECHNOLOGY', 'DEVELOPMENT',
                'APPLICATION', 'INTERNET', 'SOFTWARE', 'HARDWARE', 'ALGORITHM',
                'DATABASE', 'SYSTEM', 'NETWORK', 'SERVER', 'CLIENT',
                'CODE', 'FUNCTION', 'VARIABLE', 'OBJECT', 'ARRAY',
                'LOOP', 'CONDITION', 'OPERATOR', 'SYNTAX', 'DEBUGGING',
                'TESTING', 'VERSION', 'BACKUP', 'SECURITY', 'ENCRYPTION',
                'PROTOCOL', 'INTERFACE', 'USER', 'EXPERIENCE', 'DESIGN',
                'LAYOUT', 'RESPONSIVE', 'MOBILE', 'TABLET', 'BROWSER',
                'WEBSITE', 'PAGE', 'ELEMENT', 'ATTRIBUTE', 'STYLE',
                'CLASS', 'IDENTIFIER', 'SELECTOR', 'PROPERTY', 'FRAMEWORK'
            ]
        };

        let currentLanguage = 'pt';
        let currentWord = '';
        let guessedWord = [];
        let usedLetters = [];
        let wrongGuesses = 0;
        let maxWrongGuesses = 6;
        let gameOver = false;
        let totalAttempts = 0;
        let totalHits = 0;

        const hangmanParts = ['head', 'body', 'leftArm', 'rightArm', 'leftLeg', 'rightLeg'];

        function changeLanguage(lang) {
            currentLanguage = lang;
            
            // Update active button
            document.querySelectorAll('.language-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            event.target.classList.add('active');
            
            // Update UI text
            updateUIText();
            
            // Start new game with new language
            newGame();
        }

        function updateUIText() {
            const t = translations[currentLanguage];
            
            document.getElementById('gameTitle').textContent = t.title;
            document.getElementById('errorsLabel').textContent = t.errors;
            document.getElementById('attemptsLabel').textContent = t.attempts;
            document.getElementById('hitsLabel').textContent = t.hits;
            document.getElementById('usedLettersTitle').textContent = t.usedLetters;
            document.getElementById('guessBtn').textContent = t.tryBtn;
            document.getElementById('newGameBtn').textContent = t.newGameBtn;
            document.getElementById('modalTitle').textContent = t.modalTitle;
            document.getElementById('modalNewGameBtn').textContent = t.modalNewGame;
            document.getElementById('modalCloseBtn').textContent = t.modalClose;
        }

        function initGame() {
            const words = wordLists[currentLanguage];
            currentWord = words[Math.floor(Math.random() * words.length)];
            guessedWord = new Array(currentWord.length).fill('_');
            usedLetters = [];
            wrongGuesses = 0;
            gameOver = false;
            totalAttempts = 0;
            totalHits = 0;
            
            updateDisplay();
            updateMessage(translations[currentLanguage].initialMessage);
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
            const t = translations[currentLanguage];
            
            if (!letter || letter.length !== 1) {
                updateMessage(t.invalidLetter);
                return;
            }

            if (!/[A-Z]/.test(letter)) {
                updateMessage(t.onlyLetters);
                return;
            }

            if (usedLetters.some(used => used.letter === letter)) {
                updateMessage(t.letterUsed);
                return;
            }

            totalAttempts++;
            let isCorrect = false;

            if (currentWord.includes(letter)) {
                // Correct letter
                for (let i = 0; i < currentWord.length; i++) {
                    if (currentWord[i] === letter) {
                        guessedWord[i] = letter;
                        isCorrect = true;
                    }
                }
                totalHits++;
                usedLetters.push({ letter: letter, correct: true });
                updateMessage(t.correctLetter.replace('{letter}', letter));
                
                // Check victory
                if (!guessedWord.includes('_')) {
                    gameOver = true;
                    showVictoryModal();
                }
            } else {
                // Wrong letter
                wrongGuesses++;
                usedLetters.push({ letter: letter, correct: false });
                showHangmanPart(wrongGuesses - 1);
                updateMessage(t.wrongLetter.replace('{letter}', letter));
                
                // Check defeat
                if (wrongGuesses >= maxWrongGuesses) {
                    gameOver = true;
                    updateMessage(t.loseMessage.replace('{word}', currentWord), 'lose');
                }
            }

            updateDisplay();
            updateStats();
            input.value = '';
            input.focus();
        }

        function showVictoryModal() {
            const modal = document.getElementById('victoryModal');
            const modalMessage = document.getElementById('modalMessage');
            const modalWord = document.getElementById('modalWord');
            const t = translations[currentLanguage];
            
            modalMessage.innerHTML = t.modalMessage.replace('{word}', `<strong>${currentWord}</strong>`);
            modal.style.display = 'block';
            
            // Add celebration effect
            updateMessage(t.winMessage.replace('{word}', currentWord), 'win');
        }

        function closeModal() {
            document.getElementById('victoryModal').style.display = 'none';
        }

        function newGameFromModal() {
            closeModal();
            newGame();
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
            closeModal();
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

        // Close modal when clicking outside
        document.getElementById('victoryModal').addEventListener('click', function(e) {
            if (e.target === this) {
                closeModal();
            }
        });

        // Initialize the game
        updateUIText();
        initGame();