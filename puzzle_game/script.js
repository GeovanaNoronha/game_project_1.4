        let gameState = {
            cards: [],
            flippedCards: [],
            matchedPairs: 0,
            attempts: 0,
            canFlip: true
        };

        // Emojis para o jogo (sem direitos autorais)
        const emojis = ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮', '🐷', '🐸', '🐵', '🐔'];

        function initGame() {
            // Seleciona 8 emojis aleatórios e duplica para criar pares
            const selectedEmojis = emojis.sort(() => Math.random() - 0.5).slice(0, 8);
            const gameEmojis = [...selectedEmojis, ...selectedEmojis];
            
            // Embaralha as cartas
            gameState.cards = gameEmojis.sort(() => Math.random() - 0.5);
            
            // Reset do estado do jogo
            gameState.flippedCards = [];
            gameState.matchedPairs = 0;
            gameState.attempts = 0;
            gameState.canFlip = true;
            
            // Atualiza interface
            updateScore();
            createBoard();
            hideVictoryMessage();
        }

        function createBoard() {
            const board = document.getElementById('gameBoard');
            board.innerHTML = '';
            
            gameState.cards.forEach((emoji, index) => {
                const card = document.createElement('div');
                card.className = 'card';
                card.dataset.index = index;
                card.dataset.emoji = emoji;
                
                card.innerHTML = `
                    <div class="card-face card-back">?</div>
                    <div class="card-face card-front">${emoji}</div>
                `;
                
                card.addEventListener('click', () => flipCard(index));
                board.appendChild(card);
            });
        }

        function flipCard(index) {
            if (!gameState.canFlip) return;
            
            const card = document.querySelector(`[data-index="${index}"]`);
            if (card.classList.contains('flipped') || card.classList.contains('matched')) return;
            
            // Vira a carta
            card.classList.add('flipped');
            gameState.flippedCards.push(index);
            
            // Se duas cartas foram viradas
            if (gameState.flippedCards.length === 2) {
                gameState.canFlip = false;
                gameState.attempts++;
                updateScore();
                
                setTimeout(() => {
                    checkMatch();
                }, 1000);
            }
        }

        function checkMatch() {
            const [firstIndex, secondIndex] = gameState.flippedCards;
            const firstCard = document.querySelector(`[data-index="${firstIndex}"]`);
            const secondCard = document.querySelector(`[data-index="${secondIndex}"]`);
            
            if (gameState.cards[firstIndex] === gameState.cards[secondIndex]) {
                // Par encontrado
                firstCard.classList.add('matched');
                secondCard.classList.add('matched');
                gameState.matchedPairs++;
                
                // Verifica se o jogo terminou
                if (gameState.matchedPairs === 8) {
                    showVictoryMessage();
                }
            } else {
                // Não é par - adiciona animação de erro
                firstCard.classList.add('shake');
                secondCard.classList.add('shake');
                
                setTimeout(() => {
                    firstCard.classList.remove('flipped', 'shake');
                    secondCard.classList.remove('flipped', 'shake');
                }, 500);
            }
            
            // Reset para próxima jogada
            gameState.flippedCards = [];
            gameState.canFlip = true;
            updateScore();
        }

        function updateScore() {
            document.getElementById('attempts').textContent = gameState.attempts;
            document.getElementById('matches').textContent = gameState.matchedPairs;
        }

        function showVictoryMessage() {
            document.getElementById('victoryMessage').classList.add('show');
        }

        function hideVictoryMessage() {
            document.getElementById('victoryMessage').classList.remove('show');
        }

        function resetGame() {
            initGame();
        }

        // Inicia o jogo quando a página carrega
        window.addEventListener('load', initGame);
    