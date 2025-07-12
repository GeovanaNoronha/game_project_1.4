        // Translations
        const translations = {
            pt: {
                title: "Blackjack - Cartas de Truco",
                welcomeTitle: "Bem-vindo ao Blackjack!",
                welcomeText: "Jogue Blackjack com cartas de truco! Objetivo: chegar o mais próximo de 21 sem estourar.",
                betLabel: "Sua aposta:",
                currency: "fichas",
                startGame: "Iniciar Jogo",
                moneyLabel: "Dinheiro:",
                betDisplayLabel: "Aposta:",
                dealerTitle: "Dealer",
                playerTitle: "Jogador",
                scoreLabel: "Pontuação:",
                hitBtn: "Pedir Carta",
                standBtn: "Parar",
                doubleBtn: "Dobrar",
                newGameBtn: "Novo Jogo",
                resetMatchBtn: "Resetar Partida",
                roundLabel: "Rodada:",
                playerWinsLabel: "Vitórias do Jogador:",
                dealerWinsLabel: "Vitórias do Dealer:",
                resultTitle: "Resultado",
                closeModal: "Fechar",
                startNewRound: "Novo Jogo",
                countdownText: "Novo jogo em:",
                playerWins: "Você ganhou!",
                dealerWins: "Dealer ganhou!",
                tie: "Empate!",
                blackjack: "BLACKJACK! Você ganhou!",
                dealerBlackjack: "Dealer fez Blackjack!",
                playerBust: "Você estourou! Dealer ganhou!",
                dealerBust: "Dealer estourou! Você ganhou!",
                insufficientFunds: "Dinheiro insuficiente para esta aposta!"
            },
            en: {
                title: "Blackjack - Truco Cards",
                welcomeTitle: "Welcome to Blackjack!",
                welcomeText: "Play Blackjack with truco cards! Goal: get as close to 21 as possible without busting.",
                betLabel: "Your bet:",
                currency: "chips",
                startGame: "Start Game",
                moneyLabel: "Money:",
                betDisplayLabel: "Bet:",
                dealerTitle: "Dealer",
                playerTitle: "Player",
                scoreLabel: "Score:",
                hitBtn: "Hit",
                standBtn: "Stand",
                doubleBtn: "Double",
                newGameBtn: "New Game",
                resetMatchBtn: "Reset Match",
                roundLabel: "Round:",
                playerWinsLabel: "Player Wins:",
                dealerWinsLabel: "Dealer Wins:",
                resultTitle: "Result",
                closeModal: "Close",
                startNewRound: "New Game",
                countdownText: "New game in:",
                playerWins: "You won!",
                dealerWins: "Dealer won!",
                tie: "It's a tie!",
                blackjack: "BLACKJACK! You won!",
                dealerBlackjack: "Dealer got Blackjack!",
                playerBust: "You busted! Dealer won!",
                dealerBust: "Dealer busted! You won!",
                insufficientFunds: "Insufficient funds for this bet!"
            }
        };

        // Game state
        let currentLang = 'pt';
        let isDarkMode = false;
        let deck = [];
        let playerCards = [];
        let dealerCards = [];
        let playerScore = 0;
        let dealerScore = 0;
        let playerMoney = 1000;
        let currentBet = 10;
        let gameActive = false;
        let dealerHidden = true;
        let playerWins = 0;
        let dealerWins = 0;
        let currentRound = 1;

        // Card suits and values
        const suits = {
            spades: '♠',
            hearts: '♥',
            clubs: '♣',
            diamonds: '♦'
        };

        const suitColors = {
            spades: 'black',
            hearts: 'red',
            clubs: 'black',
            diamonds: 'red'
        };

        // Initialize game
        function initGame() {
            updateLanguage();
            createDeck();
            addEventListeners();
        }

        function addEventListeners() {
            document.getElementById('lang-btn').addEventListener('click', toggleLanguage);
            document.getElementById('theme-btn').addEventListener('click', toggleTheme);
            document.getElementById('start-game').addEventListener('click', startNewGame);
            document.getElementById('hit-btn').addEventListener('click', hit);
            document.getElementById('stand-btn').addEventListener('click', stand);
            document.getElementById('double-btn').addEventListener('click', double);
            document.getElementById('new-game-btn').addEventListener('click', showStartScreen);
            document.getElementById('reset-match-btn').addEventListener('click', resetMatch);
            document.getElementById('close-modal').addEventListener('click', closeModalOnly);
            document.getElementById('start-new-round').addEventListener('click', startNewRoundFromModal);
        }

        function toggleLanguage() {
            currentLang = currentLang === 'pt' ? 'en' : 'pt';
            document.getElementById('lang-btn').textContent = currentLang === 'pt' ? 'EN' : 'PT';
            updateLanguage();
        }

        function toggleTheme() {
            isDarkMode = !isDarkMode;
            document.body.classList.toggle('dark-mode', isDarkMode);
            document.getElementById('theme-btn').textContent = isDarkMode ? '☀️' : '🌙';
        }

        function updateLanguage() {
            const t = translations[currentLang];
            document.getElementById('main-title').textContent = t.title;
            document.getElementById('welcome-title').textContent = t.welcomeTitle;
            document.getElementById('welcome-text').textContent = t.welcomeText;
            document.getElementById('bet-label').textContent = t.betLabel;
            document.getElementById('currency').textContent = t.currency;
            document.getElementById('currency2').textContent = t.currency;
            document.getElementById('currency3').textContent = t.currency;
            document.getElementById('start-game').textContent = t.startGame;
            document.getElementById('money-label').textContent = t.moneyLabel;
            document.getElementById('bet-display-label').textContent = t.betDisplayLabel;
            document.getElementById('dealer-title').textContent = t.dealerTitle;
            document.getElementById('player-title').textContent = t.playerTitle;
            document.getElementById('dealer-score-label').textContent = t.scoreLabel;
            document.getElementById('player-score-label').textContent = t.scoreLabel;
            document.getElementById('hit-btn').textContent = t.hitBtn;
            document.getElementById('stand-btn').textContent = t.standBtn;
            document.getElementById('double-btn').textContent = t.doubleBtn;
            document.getElementById('new-game-btn').textContent = t.newGameBtn;
            document.getElementById('reset-match-btn').textContent = t.resetMatchBtn;
            document.getElementById('round-label').textContent = t.roundLabel;
            document.getElementById('player-wins-label').textContent = t.playerWinsLabel;
            document.getElementById('dealer-wins-label').textContent = t.dealerWinsLabel;
            document.getElementById('close-modal').textContent = t.closeModal;
            document.getElementById('start-new-round').textContent = t.startNewRound;
        }

        function createDeck() {
            deck = [];
            const suitNames = Object.keys(suits);
            
            for (let suit of suitNames) {
                for (let value = 1; value <= 13; value++) {
                    let cardValue = value;
                    let displayValue = value;
                    
                    if (value === 1) {
                        cardValue = 11; // Ace
                        displayValue = 'A';
                    } else if (value === 11) {
                        cardValue = 10; // Jack
                        displayValue = 'J';
                    } else if (value === 12) {
                        cardValue = 10; // Queen
                        displayValue = 'Q';
                    } else if (value === 13) {
                        cardValue = 10; // King
                        displayValue = 'K';
                    }
                    
                    deck.push({
                        suit: suit,
                        value: cardValue,
                        displayValue: displayValue,
                        isAce: value === 1
                    });
                }
            }
            shuffleDeck();
        }

        function shuffleDeck() {
            for (let i = deck.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [deck[i], deck[j]] = [deck[j], deck[i]];
            }
        }

        function startNewGame() {
            currentBet = parseInt(document.getElementById('bet-amount').value) || 10;
            
            if (currentBet > playerMoney) {
                alert(translations[currentLang].insufficientFunds);
                return;
            }

            playerCards = [];
            dealerCards = [];
            playerScore = 0;
            dealerScore = 0;
            gameActive = true;
            dealerHidden = true;

            document.getElementById('start-screen').style.display = 'none';
            document.getElementById('game-screen').style.display = 'block';
            document.getElementById('bet-display').textContent = currentBet;
            document.getElementById('current-round').textContent = currentRound;

            // Deal initial cards
            dealCard(playerCards);
            dealCard(dealerCards);
            dealCard(playerCards);
            dealCard(dealerCards);

            updateDisplay();
            checkForBlackjack();
        }

        function dealCard(hand) {
            if (deck.length === 0) createDeck();
            hand.push(deck.pop());
        }

        function calculateScore(hand) {
            let score = 0;
            let aces = 0;
            
            for (let card of hand) {
                if (card.isAce) {
                    aces++;
                    score += 11;
                } else {
                    score += card.value;
                }
            }
            
            while (score > 21 && aces > 0) {
                score -= 10;
                aces--;
            }
            
            return score;
        }

        function createCardElement(card, isHidden = false) {
            const cardDiv = document.createElement('div');
            cardDiv.className = 'card';
            
            if (isHidden) {
                cardDiv.innerHTML = `
                    <div class="card-face card-back"></div>
                `;
            } else {
                const suitSymbol = suits[card.suit];
                const suitColor = suitColors[card.suit];
                
                // Create suit symbols based on card value
                let suitElements = '';
                let numSuits = typeof card.displayValue === 'number' ? card.displayValue : 
                              card.displayValue === 'A' ? 1 : 10;
                
                for (let i = 0; i < numSuits; i++) {
                    suitElements += `<span class="suit ${suitColor}">${suitSymbol}</span>`;
                }
                
                cardDiv.innerHTML = `
                    <div class="card-face card-front">
                        <div class="card-number ${suitColor}">${card.displayValue}</div>
                        <div class="card-suits">${suitElements}</div>
                    </div>
                `;
            }
            
            return cardDiv;
        }

        function updateDisplay() {
            playerScore = calculateScore(playerCards);
            dealerScore = calculateScore(dealerCards);
            
            document.getElementById('player-score').textContent = playerScore;
            document.getElementById('dealer-score').textContent = dealerHidden ? '?' : dealerScore;
            document.getElementById('money').textContent = playerMoney;
            document.getElementById('player-wins').textContent = playerWins;
            document.getElementById('dealer-wins').textContent = dealerWins;
            
            // Update player cards
            const playerContainer = document.getElementById('player-cards');
            playerContainer.innerHTML = '';
            playerCards.forEach(card => {
                playerContainer.appendChild(createCardElement(card));
            });
            
            // Update dealer cards
            const dealerContainer = document.getElementById('dealer-cards');
            dealerContainer.innerHTML = '';
            dealerCards.forEach((card, index) => {
                const isHidden = dealerHidden && index === 1;
                dealerContainer.appendChild(createCardElement(card, isHidden));
            });
        }

        function hit() {
            if (!gameActive) return;
            
            dealCard(playerCards);
            updateDisplay();
            
            if (playerScore > 21) {
                endGame('bust');
            }
        }

        function stand() {
            if (!gameActive) return;
            
            dealerHidden = false;
            dealerTurn();
        }

        function double() {
            if (!gameActive || playerCards.length !== 2) return;
            if (currentBet * 2 > playerMoney) {
                alert(translations[currentLang].insufficientFunds);
                return;
            }
            
            currentBet *= 2;
            document.getElementById('bet-display').textContent = currentBet;
            
            dealCard(playerCards);
            updateDisplay();
            
            if (playerScore > 21) {
                endGame('bust');
            } else {
                dealerHidden = false;
                dealerTurn();
            }
        }

        function dealerTurn() {
            updateDisplay();
            
            function dealerHit() {
                if (dealerScore < 17) {
                    dealCard(dealerCards);
                    updateDisplay();
                    setTimeout(dealerHit, 1000);
                } else {
                    determineWinner();
                }
            }
            
            setTimeout(dealerHit, 1000);
        }

        function checkForBlackjack() {
            const playerBlackjack = playerScore === 21;
            const dealerBlackjack = calculateScore(dealerCards) === 21;
            
            if (playerBlackjack && dealerBlackjack) {
                dealerHidden = false;
                endGame('tie');
            } else if (playerBlackjack) {
                dealerHidden = false;
                endGame('blackjack');
            } else if (dealerBlackjack) {
                dealerHidden = false;
                endGame('dealer-blackjack');
            }
        }

        function determineWinner() {
            if (dealerScore > 21) {
                endGame('dealer-bust');
            } else if (playerScore > dealerScore) {
                endGame('player-wins');
            } else if (dealerScore > playerScore) {
                endGame('dealer-wins');
            } else {
                endGame('tie');
            }
        }

        function endGame(result) {
            gameActive = false;
            const t = translations[currentLang];
            let message = '';
            let winnings = 0;
            
            switch (result) {
                case 'blackjack':
                    message = t.blackjack;
                    winnings = Math.floor(currentBet * 1.5);
                    playerWins++;
                    break;
                case 'player-wins':
                    message = t.playerWins;
                    winnings = currentBet;
                    playerWins++;
                    break;
                case 'dealer-bust':
                    message = t.dealerBust;
                    winnings = currentBet;
                    playerWins++;
                    break;
                case 'tie':
                    message = t.tie;
                    winnings = 0;
                    break;
                case 'bust':
                    message = t.playerBust;
                    winnings = -currentBet;
                    dealerWins++;
                    break;
                case 'dealer-wins':
                    message = t.dealerWins;
                    winnings = -currentBet;
                    dealerWins++;
                    break;
                case 'dealer-blackjack':
                    message = t.dealerBlackjack;
                    winnings = -currentBet;
                    dealerWins++;
                    break;
            }
            
            playerMoney += winnings;
            currentRound++;
            updateDisplay();
            showResultModal(message);
        }

        function showResultModal(message) {
            document.getElementById('result-message').textContent = message;
            document.getElementById('result-modal').style.display = 'block';
            
            let countdown = 3;
            let countdownActive = true;
            const countdownElement = document.getElementById('countdown');
            const t = translations[currentLang];
            
            const timer = setInterval(() => {
                if (!countdownActive) {
                    clearInterval(timer);
                    return;
                }
                
                countdownElement.textContent = `${t.countdownText} ${countdown}`;
                countdown--;
                
                if (countdown < 0) {
                    clearInterval(timer);
                    if (countdownActive) {
                        closeModalAndStartNewGame();
                    }
                }
            }, 1000);
            
            // Store timer ID to clear it if user clicks button
            window.currentCountdownTimer = timer;
            window.countdownActive = countdownActive;
        }

        function closeModalOnly() {
            window.countdownActive = false;
            if (window.currentCountdownTimer) {
                clearInterval(window.currentCountdownTimer);
            }
            document.getElementById('result-modal').style.display = 'none';
        }

        function startNewRoundFromModal() {
            window.countdownActive = false;
            if (window.currentCountdownTimer) {
                clearInterval(window.currentCountdownTimer);
            }
            document.getElementById('result-modal').style.display = 'none';
            startNewGame();
        }

        function closeModalAndStartNewGame() {
            document.getElementById('result-modal').style.display = 'none';
            startNewGame();
        }

        function closeModal() {
            document.getElementById('result-modal').style.display = 'none';
            showStartScreen();
        }

        function resetMatch() {
            playerWins = 0;
            dealerWins = 0;
            currentRound = 1;
            playerMoney = 1000;
            updateDisplay();
            showStartScreen();
        }

        function showStartScreen() {
            document.getElementById('game-screen').style.display = 'none';
            document.getElementById('start-screen').style.display = 'block';
            
            if (playerMoney <= 0) {
                playerMoney = 1000;
                alert('Game Over! Your money has been reset to 1000 chips.');
            }
        }

        // Initialize the game when page loads
        initGame();
