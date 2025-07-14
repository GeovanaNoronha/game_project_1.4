        let gameState = {
            cards: [],
            flippedCards: [],
            player1Score: 0,
            player2Score: 0,
            currentPlayer: 1,
            canFlip: true,
            isMultiplayer: false,
            isHost: false,
            roomCode: null,
            connection: null,
            gameStarted: false
        };

        const emojis = ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮', '🐷', '🐸', '🐵', '🐔'];

        // Funções de conexão
        function createRoom() {
            gameState.roomCode = generateRoomCode();
            gameState.isHost = true;
            gameState.isMultiplayer = true;
            
            document.getElementById('roomCode').style.display = 'block';
            document.getElementById('joinForm').style.display = 'none';
            document.getElementById('codeDisplay').textContent = gameState.roomCode;
            
            updateConnectionStatus('Aguardando oponente...');
            
            // Simulação
            setTimeout(() => {
                if (confirm('Simular conexão do oponente?')) {
                    simulateConnection();
                }
            }, 2000);
        }

        function joinRoom() {
            document.getElementById('joinForm').style.display = 'block';
            document.getElementById('roomCode').style.display = 'none';
        }

        function connectToRoom() {
            const code = document.getElementById('roomCodeInput').value.trim().toUpperCase();
            if (code.length === 6) {
                gameState.roomCode = code;
                gameState.isHost = false;
                gameState.isMultiplayer = true;
                
                updateConnectionStatus('Conectando...');
                
                // Simulação d conexão
                setTimeout(() => {
                    simulateConnection();
                }, 1000);
            } else {
                alert('Por favor, digite um código válido de 6 caracteres.');
            }
        }

        function playSolo() {
            gameState.isMultiplayer = false;
            gameState.isHost = true;
            startGame();
        }

        function simulateConnection() {
            updateConnectionStatus('Conectado!');
            startGame();
        }

        function generateRoomCode() {
            const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
            let result = '';
            for (let i = 0; i < 6; i++) {
                result += chars.charAt(Math.floor(Math.random() * chars.length));
            }
            return result;
        }

        function copyCode() {
            navigator.clipboard.writeText(gameState.roomCode).then(() => {
                alert('Código copiado para a área de transferência!');
            });
        }

        function updateConnectionStatus(message) {
            const statusElement = document.getElementById('connectionStatus');
            if (message === 'Conectado!') {
                statusElement.innerHTML = '<span class="status-connected">🟢 ' + message + '</span>';
            } else if (message.includes('Aguardando')) {
                statusElement.innerHTML = '<span class="status-waiting">🟡 ' + message + '</span>';
            } else {
                statusElement.innerHTML = '<span class="status-disconnected">🔴 ' + message + '</span>';
            }
        }

        function startGame() {
            document.getElementById('connectionPanel').style.display = 'none';
            document.getElementById('gameArea').classList.add('active');
            
            if (!gameState.isMultiplayer) {
                document.getElementById('player2Info').style.display = 'none';
                document.getElementById('turnIndicator').style.display = 'none';
            }
            
            initGame();
        }

        function initGame() {
            // Seleciona 8 emojis aleatórios e duplica para criar pares
            const selectedEmojis = emojis.sort(() => Math.random() - 0.5).slice(0, 8);
            const gameEmojis = [...selectedEmojis, ...selectedEmojis];
            
            // Embaralha as cartas
            gameState.cards = gameEmojis.sort(() => Math.random() - 0.5);
            
            // Reset do estado do jogo
            gameState.flippedCards = [];
            gameState.player1Score = 0;
            gameState.player2Score = 0;
            gameState.currentPlayer = 1;
            gameState.canFlip = true;
            gameState.gameStarted = true;
            
            // Atualiza interface
            updateScore();
            updateTurnIndicator();
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
            if (!gameState.canFlip || !gameState.gameStarted) return;
            
            const card = document.querySelector(`[data-index="${index}"]`);
            if (card.classList.contains('flipped') || card.classList.contains('matched')) return;
            
            // Vira a carta
            card.classList.add('flipped');
            gameState.flippedCards.push(index);
            
            // simulação de envi movimento para o oponente
            if (gameState.isMultiplayer) {
                sendMove(index);
            }
            
            // Se duas cartas foram viradas
            if (gameState.flippedCards.length === 2) {
                gameState.canFlip = false;
                
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
                
                // aq adiciona a pontuação do jogador atual
                if (gameState.currentPlayer === 1) {
                    gameState.player1Score++;
                } else {
                    gameState.player2Score++;
                }
                
                // aq verifica se o jogo terminou
                if (gameState.player1Score + gameState.player2Score === 8) {
                    endGame();
                }
                
                // Jogador continua na vez quando acerta
            } else {
                // Não é par - adiciona animação de erro
                firstCard.classList.add('shake');
                secondCard.classList.add('shake');
                
                setTimeout(() => {
                    firstCard.classList.remove('flipped', 'shake');
                    secondCard.classList.remove('flipped', 'shake');
                }, 500);
                
                // Troca de jogador apenas no multiplayer
                if (gameState.isMultiplayer) {
                    gameState.currentPlayer = gameState.currentPlayer === 1 ? 2 : 1;
                }
            }
            
            // Reset para próxima jogada
            gameState.flippedCards = [];
            gameState.canFlip = true;
            updateScore();
            updateTurnIndicator();
        }

        function sendMove(index) {
            // Em uma implementação real, teria q enviar o movimento via WebRTC/WebSocket ?????
            // Simimulação de movimento do oponente
            console.log('Movimento enviado:', index);
        }

        function updateScore() {
            document.getElementById('player1Score').textContent = gameState.player1Score;
            document.getElementById('player2Score').textContent = gameState.player2Score;
            
            // A1 atualiza os indicadores visuais do jogador ativo
            const player1Info = document.getElementById('player1Info');
            const player2Info = document.getElementById('player2Info');
            
            if (gameState.isMultiplayer) {
                player1Info.classList.toggle('player-active', gameState.currentPlayer === 1);
                player2Info.classList.toggle('player-active', gameState.currentPlayer === 2);
            }
        }

        function updateTurnIndicator() {
            if (!gameState.isMultiplayer) return;
            
            const indicator = document.getElementById('turnIndicator');
            if (gameState.currentPlayer === 1) {
                indicator.textContent = '🎯 Sua vez de jogar!';
                indicator.style.color = 'gold';
            } else {
                indicator.textContent = '⏳ Vez do oponente...';
                indicator.style.color = 'lightblue';
            }
        }

        function endGame() {
            let message;
            if (gameState.isMultiplayer) {
                if (gameState.player1Score > gameState.player2Score) {
                    message = '🎉 Você venceu! 🎉';
                } else if (gameState.player2Score > gameState.player1Score) {
                    message = '😅 Oponente venceu! 😅';
                } else {
                    message = '🤝 Empate! 🤝';
                }
            } else {
                message = `🎉 Parabéns! Você encontrou todos os pares! 🎉`;
            }
            
            document.getElementById('victoryMessage').textContent = message;
            showVictoryMessage();
            gameState.gameStarted = false;
        }

        function showVictoryMessage() {
            document.getElementById('victoryMessage').classList.add('show');
        }

        function hideVictoryMessage() {
            document.getElementById('victoryMessage').classList.remove('show');
        }

        function resetGame() {
            if (gameState.isMultiplayer) {
                if (confirm('Reiniciar o jogo? Ambos os jogadores perderão o progresso atual.')) {
                    initGame();
                }
            } else {
                initGame();
            }
        }

        // Isso aq se inicia quando a página carrega
        window.addEventListener('load', () => {
            updateConnectionStatus('Desconectado');
        });
