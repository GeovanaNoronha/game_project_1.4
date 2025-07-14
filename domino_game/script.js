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
                this.dealerCountEl = document.getElementById('dealer-count');
                this.remainingPiecesEl = document.getElementById('remaining-pieces');
                this.playerScoreEl = document.getElementById('player-score');
                this.dealerScoreEl = document.getElementById('dealer-score');
            }

            setupEventListeners() {
                this.newGameBtn.addEventListener('click', () => this.newGame());
                this.passBtn.addEventListener('click', () => this.passMove());
                this.drawBtn.addEventListener('click', () => this.drawPiece());
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
                this.createDominoSet();
                
                this.playerHand = this.pieces.splice(0, 7);
                this.dealerHand = this.pieces.splice(0, 7);
                this.stockPile = [...this.pieces];
                
                this.currentPlayer = 'player';
                this.leftEnd = null;
                this.rightEnd = null;
                
                this.updateDisplay();
                this.updateMessage('Sua vez! Clique em uma peça para jogar.');
                
                this.newGameBtn.disabled = true;
                this.passBtn.disabled = false;
                this.drawBtn.disabled = false;
            }

            createDominoElement(piece, isDealer = false, isPlayed = false, orientation = 'vertical') {
                const domino = document.createElement('div');
                domino.className = `domino ${isPlayed ? 'played' : ''} ${isDealer ? 'dealer-domino' : ''}`;
                
                if (isPlayed && orientation === 'horizontal') {
                    domino.classList.add('horizontal');
                }
                
                // Para peças jogadas, ajustar a orientação baseada na lógica do dominó
                if (isPlayed) {
                    if (orientation === 'horizontal') {
                        domino.innerHTML = `
                            <div class="domino-half">${this.createDots(piece[0])}</div>
                            <div class="domino-half">${this.createDots(piece[1])}</div>
                        `;
                    } else {
                        domino.innerHTML = `
                            <div class="domino-half">${this.createDots(piece[0])}</div>
                            <div class="domino-half">${this.createDots(piece[1])}</div>
                        `;
                    }
                } else {
                    domino.innerHTML = `
                        <div class="domino-half">${this.createDots(piece[0])}</div>
                        <div class="domino-half">${this.createDots(piece[1])}</div>
                    `;
                }
                
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
                    this.updateDisplay();
                    
                    if (this.playerHand.length === 0) {
                        this.endGame('Você ganhou!');
                        return;
                    }
                    
                    this.currentPlayer = 'dealer';
                    this.updateMessage('Vez do dealer...');
                    
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

            addPieceToChain(piece) {
                const [a, b] = piece;
                
                if (this.playedPieces.length === 0) {
                    // Primeira peça
                    this.playedPieces.push({
                        piece: piece,
                        position: 'center',
                        orientation: a === b ? 'horizontal' : 'vertical'
                    });
                    this.leftEnd = a;
                    this.rightEnd = b;
                } else {
                    // Determinar onde a peça deve ser colocada
                    let position, orientation, newLeftEnd = this.leftEnd, newRightEnd = this.rightEnd;
                    
                    if (a === this.leftEnd || b === this.leftEnd) {
                        // Peça vai na ponta esquerda
                        position = 'left';
                        if (a === this.leftEnd) {
                            newLeftEnd = b;
                            orientation = a === b ? 'horizontal' : 'vertical';
                        } else {
                            newLeftEnd = a;
                            orientation = a === b ? 'horizontal' : 'vertical';
                        }
                    } else if (a === this.rightEnd || b === this.rightEnd) {
                        // Peça vai na ponta direita
                        position = 'right';
                        if (a === this.rightEnd) {
                            newRightEnd = b;
                            orientation = a === b ? 'horizontal' : 'vertical';
                        } else {
                            newRightEnd = a;
                            orientation = a === b ? 'horizontal' : 'vertical';
                        }
                    }
                    
                    // Se é uma carroça (mesma quantidade de pontos), posicionar ao lado
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
                
                const playablePieces = this.dealerHand.filter(piece => this.canPlayPiece(piece));
                
                if (playablePieces.length > 0) {
                    const randomPiece = playablePieces[Math.floor(Math.random() * playablePieces.length)];
                    this.addPieceToChain(randomPiece);
                    this.dealerHand = this.dealerHand.filter(p => p !== randomPiece);
                    
                    this.updateDisplay();
                    this.updateMessage(`Dealer jogou [${randomPiece[0]}|${randomPiece[1]}]. Sua vez!`);
                    
                    if (this.dealerHand.length === 0) {
                        this.endGame('Dealer ganhou!');
                        return;
                    }
                    
                    this.currentPlayer = 'player';
                } else {
                    if (this.stockPile.length > 0) {
                        const newPiece = this.stockPile.pop();
                        this.dealerHand.push(newPiece);
                        this.updateDisplay();
                        this.updateMessage('Dealer comprou uma peça...');
                        setTimeout(() => this.dealerMove(), 1000);
                    } else {
                        this.updateMessage('Dealer passou a vez. Sua vez!');
                        this.currentPlayer = 'player';
                    }
                }
            }

            passMove() {
                if (this.gameOver) return;
                
                if (this.currentPlayer === 'player') {
                    this.currentPlayer = 'dealer';
                    this.updateMessage('Você passou a vez. Vez do dealer...');
                    setTimeout(() => this.dealerMove(), 1000);
                }
            }

            drawPiece() {
                if (this.gameOver || this.currentPlayer !== 'player' || this.stockPile.length === 0) return;
                
                const newPiece = this.stockPile.pop();
                this.playerHand.push(newPiece);
                this.updateDisplay();
                this.updateMessage('Você comprou uma peça!');
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
                
                // Atualizar cadeia de peças jogadas
                this.dominoChain.innerHTML = '';
                if (this.playedPieces.length === 0) {
                    this.dominoChain.innerHTML = '<div class="message">Mesa vazia - Jogue a primeira peça!</div>';
                } else {
                    this.playedPieces.forEach(pieceData => {
                        const domino = this.createDominoElement(pieceData.piece, false, true, pieceData.orientation);
                        this.dominoChain.appendChild(domino);
                    });
                    
                    // Mostrar as pontas disponíveis
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
                
                // Atualizar botões
                this.drawBtn.disabled = this.stockPile.length === 0 || this.currentPlayer !== 'player';
                this.passBtn.disabled = this.currentPlayer !== 'player' || this.gameOver;
            }

            updateMessage(message) {
                this.gameMessage.textContent = message;
            }

            endGame(message) {
                this.gameOver = true;
                this.newGameBtn.disabled = false;
                this.passBtn.disabled = true;
                this.drawBtn.disabled = true;
                
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
                
                // Remover após 3 segundos
                setTimeout(() => {
                    if (overlay && overlay.parentNode) {
                        overlay.parentNode.removeChild(overlay);
                    }
                    if (winnerMessage && winnerMessage.parentNode) {
                        winnerMessage.parentNode.removeChild(winnerMessage);
                    }
                }, 3000);
            }
        }

        // Inicializar o jogo
        const game = new DominoGame();