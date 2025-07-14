        class DominoGame {
            constructor() {
                this.pieces = [];
                this.playerHand = [];
                this.dealerHand = [];
                this.playedPieces = [];
                this.stockPile = [];
                this.currentPlayer = 'player';
                this.gameOver = false;
                this.leftEnd = null;
                this.rightEnd = null;
                this.hintMode = false;
                this.consecutivePasses = 0;
                
                this.initializeElements();
                this.setupEventListeners();
            }

            initializeElements() {
                this.playerArea = document.getElementById('player-area');
                this.dealerArea = document.getElementById('dealer-area');
                this.playArea = document.getElementById('play-area');
                this.dominoChain = document.getElementById('domino-chain');
                this.gameMessage = document.getElementById('game-message');
                this.newGameBtn = document.getElementById('new-game-btn');
                this.passBtn = document.getElementById('pass-btn');
                this.drawBtn = document.getElementById('draw-btn');
                this.hintBtn = document.getElementById('hint-btn');
                this.dealerCountEl = document.getElementById('dealer-count');
                this.remainingPiecesEl = document.getElementById('remaining-pieces');
                this.playerScoreEl = document.getElementById('player-score');
                this.dealerScoreEl = document.getElementById('dealer-score');
                this.playedCountEl = document.getElementById('played-count');
                this.turnIndicatorEl = document.getElementById('turn-indicator');
                this.possibleMovesEl = document.getElementById('possible-moves');
            }

            setupEventListeners() {
                this.newGameBtn.addEventListener('click', () => this.newGame());
                this.passBtn.addEventListener('click', () => this.passMove());
                this.drawBtn.addEventListener('click', () => this.drawPiece());
                this.hintBtn.addEventListener('click', () => this.toggleHint());
            }

            createDominoSet() {
                this.pieces = [];
                for (let i = 0; i <= 6; i++) {
                    for (let j = i; j <= 6; j++) {
                        this.pieces.push([i, j]);
                    }
                }
                this.shuffleArray(this.pieces);
            }

            shuffleArray(array) {
                for (let i = array.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [array[i], array[j]] = [array[j], array[i]];
                }
            }

            newGame() {
                this.gameOver = false;
                this.playedPieces = [];
                this.hintMode = false;
                this.consecutivePasses = 0;
                this.createDominoSet();
                
                this.playerHand = this.pieces.splice(0, 7);
                this.dealerHand = this.pieces.splice(0, 7);
                this.stockPile = [...this.pieces];
                
                this.currentPlayer = 'player';
                this.leftEnd = null;
                this.rightEnd = null;
                
                this.updateDisplay();
                this.updateMessage('Sua vez! Clique em uma peça para jogar.');
                this.updateButtonStates();
            }

            createDominoElement(piece, isDealer = false, isPlayed = false, orientation = 'vertical') {
                const domino = document.createElement('div');
                domino.className = `domino ${isPlayed ? 'played' : ''} ${isDealer ? 'dealer-domino' : ''}`;
                
                if (isPlayed && orientation === 'horizontal') {
                    domino.classList.add('horizontal');
                }
                
                // Adicionar classe para peças jogáveis durante o modo dica
                if (!isDealer && !isPlayed && this.hintMode && this.canPlayPiece(piece)) {
                    domino.classList.add('playable');
                }
                
                domino.innerHTML = `
                    <div class="domino-half">${this.createDots(piece[0])}</div>
                    <div class="domino-half">${this.createDots(piece[1])}</div>
                `;
                
                if (!isDealer && !isPlayed) {
                    domino.addEventListener('click', () => this.playPiece(piece));
                }
                
                return domino;
            }

            createDots(number) {
                const patterns = {
                    0: '',
                    1: '<div class="dot" style="top: 50%; left: 50%; transform: translate(-50%, -50%);"></div>',
                    2: '<div class="dot" style="top: 25%; left: 25%; transform: translate(-50%, -50%);"></div><div class="dot" style="top: 75%; left: 75%; transform: translate(-50%, -50%);"></div>',
                    3: '<div class="dot" style="top: 25%; left: 25%; transform: translate(-50%, -50%);"></div><div class="dot" style="top: 50%; left: 50%; transform: translate(-50%, -50%);"></div><div class="dot" style="top: 75%; left: 75%; transform: translate(-50%, -50%);"></div>',
                    4: '<div class="dot" style="top: 25%; left: 25%; transform: translate(-50%, -50%);"></div><div class="dot" style="top: 25%; left: 75%; transform: translate(-50%, -50%);"></div><div class="dot" style="top: 75%; left: 25%; transform: translate(-50%, -50%);"></div><div class="dot" style="top: 75%; left: 75%; transform: translate(-50%, -50%);"></div>',
                    5: '<div class="dot" style="top: 25%; left: 25%; transform: translate(-50%, -50%);"></div><div class="dot" style="top: 25%; left: 75%; transform: translate(-50%, -50%);"></div><div class="dot" style="top: 50%; left: 50%; transform: translate(-50%, -50%);"></div><div class="dot" style="top: 75%; left: 25%; transform: translate(-50%, -50%);"></div><div class="dot" style="top: 75%; left: 75%; transform: translate(-50%, -50%);"></div>',
                    6: '<div class="dot" style="top: 25%; left: 25%; transform: translate(-50%, -50%);"></div><div class="dot" style="top: 25%; left: 75%; transform: translate(-50%, -50%);"></div><div class="dot" style="top: 50%; left: 25%; transform: translate(-50%, -50%);"></div><div class="dot" style="top: 50%; left: 75%; transform: translate(-50%, -50%);"></div><div class="dot" style="top: 75%; left: 25%; transform: translate(-50%, -50%);"></div><div class="dot" style="top: 75%; left: 75%; transform: translate(-50%, -50%);"></div>'
                };
                return patterns[number] || '';
            }

            playPiece(piece) {
                if (this.gameOver || this.currentPlayer !== 'player') return;
                
                if (this.canPlayPiece(piece)) {
                    this.addPieceToChain(piece);
                    this.playerHand = this.playerHand.filter(p => p !== piece);
                    this.consecutivePasses = 0;
                    this.hintMode = false;
                    this.updateDisplay();
                    
                    if (this.playerHand.length === 0) {
                        this.endGame('Você ganhou!');
                        return;
                    }
                    
                    this.currentPlayer = 'dealer';
                    this.updateMessage('Vez do dealer...');
                    this.updateButtonStates();
                    
                    setTimeout(() => this.dealerMove(), 1000);
                } else {
                    this.updateMessage('Peça inválida! Escolha uma peça que combine com as pontas: ' + this.leftEnd + ' ou ' + this.rightEnd);
                }
            }

            canPlayPiece(piece) {
                if (this.playedPieces.length === 0) return true;
                
                const [a, b] = piece;
                return a === this.leftEnd || a === this.rightEnd || 
                       b === this.leftEnd || b === this.rightEnd;
            }

            getPlayablePieces(hand) {
                return hand.filter(piece => this.canPlayPiece(piece));
            }

            addPieceToChain(piece) {
                const [a, b] = piece;
                
                if (this.playedPieces.length === 0) {
                    this.playedPieces.push({
                        piece: piece,
                        position: 'center',
                        orientation: a === b ? 'horizontal' : 'vertical'
                    });
                    this.leftEnd = a;
                    this.rightEnd = b;
                } else {
                    let position, orientation, newLeftEnd = this.leftEnd, newRightEnd = this.rightEnd;
                    
                    if (a === this.leftEnd || b === this.leftEnd) {
                        position = 'left';
                        if (a === this.leftEnd) {
                            newLeftEnd = b;
                        } else {
                            newLeftEnd = a;
                        }
                        orientation = a === b ? 'horizontal' : 'vertical';
                    } else if (a === this.rightEnd || b === this.rightEnd) {
                        position = 'right';
                        if (a === this.rightEnd) {
                            newRightEnd = b;
                        } else {
                            newRightEnd = a;
                        }
                        orientation = a === b ? 'horizontal' : 'vertical';
                    }
                    
                    if (a === b) {
                        orientation = 'horizontal';
                    }
                    
                    if (position === 'left') {
                        this.playedPieces.unshift({
                            piece: piece,
                            position: position,
                            orientation: orientation
                        });
                    } else {
                        this.playedPieces.push({
                            piece: piece,
                            position: position,
                            orientation: orientation
                        });
                    }
                    
                    this.leftEnd = newLeftEnd;
                    this.rightEnd = newRightEnd;
                }
            }

            dealerMove() {
                if (this.gameOver) return;
                
                const playablePieces = this.getPlayablePieces(this.dealerHand);
                
                if (playablePieces.length > 0) {
                    const randomPiece = playablePieces[Math.floor(Math.random() * playablePieces.length)];
                    this.addPieceToChain(randomPiece);
                    this.dealerHand = this.dealerHand.filter(p => p !== randomPiece);
                    this.consecutivePasses = 0;
                    
                    this.updateDisplay();
                    this.updateMessage(`Dealer jogou [${randomPiece[0]}|${randomPiece[1]}]. Sua vez!`);
                    
                    if (this.dealerHand.length === 0) {
                        this.endGame('Dealer ganhou!');
                        return;
                    }
                    
                    this.currentPlayer = 'player';
                    this.updateButtonStates();
                } else {
                    if (this.stockPile.length > 0) {
                        const newPiece = this.stockPile.pop();
                        this.dealerHand.push(newPiece);
                        this.updateDisplay();
                        this.updateMessage('Dealer comprou uma peça...');
                        setTimeout(() => this.dealerMove(), 1000);
                    } else {
                        this.consecutivePasses++;
                        this.updateMessage('Dealer passou a vez. Sua vez!');
                        this.currentPlayer = 'player';
                        this.updateButtonStates();
                        
                        if (this.consecutivePasses >= 2) {
                            this.checkGameEnd();
                        }
                    }
                }
            }

            passMove() {
                if (this.gameOver || this.currentPlayer !== 'player') return;
                
                const playablePieces = this.getPlayablePieces(this.playerHand);
                
                if (playablePieces.length > 0 && this.stockPile.length > 0) {
                    this.updateMessage('Você ainda tem peças para jogar ou pode comprar do monte!');
                    return;
                }
                
                this.consecutivePasses++;
                this.currentPlayer = 'dealer';
                this.updateMessage('Você passou a vez. Vez do dealer...');
                this.updateButtonStates();
                
                if (this.consecutivePasses >= 2) {
                    this.checkGameEnd();
                } else {
                    setTimeout(() => this.dealerMove(), 1000);
                }
            }

            drawPiece() {
                if (this.gameOver || this.currentPlayer !== 'player' || this.stockPile.length === 0) return;
                
                const newPiece = this.stockPile.pop();
                this.playerHand.push(newPiece);
                this.updateDisplay();
                this.updateMessage('Você comprou uma peça! Agora você pode jogar ou passar a vez.');
                this.updateButtonStates();
            }

            toggleHint() {
                this.hintMode = !this.hintMode;
                this.updateDisplay();
                
                if (this.hintMode) {
                    const playablePieces = this.getPlayablePieces(this.playerHand);
                    this.updateMessage(`Dica ativada! Você tem ${playablePieces.length} peça(s) jogável(is) destacada(s) em verde.`);
                    this.hintBtn.textContent = 'Ocultar Dica';
                } else {
                    this.updateMessage('Dica desativada.');
                    this.hintBtn.textContent = 'Dica';
                }
            }

            checkGameEnd() {
                const playerTotal = this.playerHand.reduce((sum, piece) => sum + piece[0] + piece[1], 0);
                const dealerTotal = this.dealerHand.reduce((sum, piece) => sum + piece[0] + piece[1], 0);
                
                if (playerTotal < dealerTotal) {
                    this.endGame('Você ganhou por menor pontuação!');
                } else if (dealerTotal < playerTotal) {
                    this.endGame('Dealer ganhou por menor pontuação!');
                } else {
                    this.endGame('Empate!');
                }
            }

            updateButtonStates() {
                const isPlayerTurn = this.currentPlayer === 'player' && !this.gameOver;
                const hasStock = this.stockPile.length > 0;
                const playablePieces = this.getPlayablePieces(this.playerHand);
                const canPlay = playablePieces.length > 0;
                
                this.newGameBtn.disabled = false;
                this.passBtn.disabled = !isPlayerTurn;
                this.drawBtn.disabled = !isPlayerTurn || !hasStock;
                this.hintBtn.disabled = !isPlayerTurn;
                
                // Atualizar texto do botão de compra
                if (hasStock) {
                    this.drawBtn.textContent = `Comprar Peça (${this.stockPile.length})`;
                } else {
                    this.drawBtn.textContent = 'Monte Vazio';
                }
                
                // Atualizar texto do botão de passar
                if (canPlay && hasStock) {
                    this.passBtn.textContent = 'Não Posso Passar';
                    this.passBtn.disabled = true;
                } else {
                    this.passBtn.textContent = 'Passar Vez';
                    this.passBtn.disabled = !isPlayerTurn;
                }
            }

            updateDisplay() {
                // Atualizar área do jogador
                this.playerArea.innerHTML = '';
                this.playerHand.forEach(piece => {
                    const domino = this.createDominoElement(piece);
                    domino.classList.add('domino-animate');
                    this.playerArea.appendChild(domino);
                });
                
                // Atualizar área do dealer
                this.dealerCountEl.textContent = this.dealerHand.length;
                
                // Atualizar peças jogadas
                this.dominoChain.innerHTML = '';
                if (this.playedPieces.length === 0) {
                    this.dominoChain.innerHTML = '<div class="message">Mesa vazia - Jogue a primeira peça!</div>';
                } else {
                    this.playedPieces.forEach(pieceData => {
                        const domino = this.createDominoElement(pieceData.piece, false, true, pieceData.orientation);
                        this.dominoChain.appendChild(domino);
                    });
                    
                    const endsMessage = document.createElement('div');
                    endsMessage.className = 'message';
                    endsMessage.style.fontSize = '1em';
                    endsMessage.style.marginTop = '10px';
                    endsMessage.textContent = `Pontas disponíveis: ${this.leftEnd} e ${this.rightEnd}`;
                    this.dominoChain.appendChild(endsMessage);
                }
                
                // Atualizar contadores
                this.remainingPiecesEl.textContent = this.stockPile.length;
                this.playerScoreEl.textContent = this.playerHand.length;
                this.dealerScoreEl.textContent = this.dealerHand.length;
                this.playedCountEl.textContent = this.playedPieces.length;
                this.turnIndicatorEl.textContent = this.currentPlayer === 'player' ? 'SUA VEZ' : 'Dealer';
                this.possibleMovesEl.textContent = this.getPlayablePieces(this.playerHand).length;
                
                this.updateButtonStates();
            }

            updateMessage(message) {
                this.gameMessage.textContent = message;
            }

            endGame(message) {
                this.gameOver = true;
                this.hintMode = false;
                this.updateButtonStates();
                
                // Criar overlay
                const overlay = document.createElement('div');
                overlay.className = 'overlay';
                document.body.appendChild(overlay);
                
                // Criar mensagem de vitória
                const winnerMessage = document.createElement('div');
                winnerMessage.className = 'winner-message';
                winnerMessage.innerHTML = `
                    <h2>🎉 ${message} 🎉</h2>
                    <p>Clique em "Novo Jogo" para jogar novamente!</p>
                `;
                document.body.appendChild(winnerMessage);
                
                // Remover após 5 segundos
                setTimeout(() => {
                    if (overlay && overlay.parentNode) {
                        overlay.parentNode.removeChild(overlay);
                    }
                    if (winnerMessage && winnerMessage.parentNode) {
                        winnerMessage.parentNode.removeChild(winnerMessage);
                    }
                }, 5000);
            }
        }

        // Inicializar o jogo
        const game = new DominoGame();

