  let sudokuBoard = [];
        let solutionBoard = [];
        let givenCells = [];
        let currentLanguage = 'pt';
        let darkMode = false;

        // Textos em português e inglês
        const texts = {
            pt: {
                title: '🧩 SUDOKU',
                difficulty: 'Dificuldade:',
                easy: 'Fácil',
                medium: 'Médio',
                hard: 'Difícil',
                newGame: 'Novo Jogo',
                check: 'Verificar',
                clear: 'Limpar',
                hint: 'Dica',
                langBtn: '🇺🇸 English',
                darkBtn: '🌙 Modo Escuro',
                lightBtn: '☀️ Modo Claro',
                statusDefault: 'Preencha os números de 1 a 9',
                statusGenerating: 'Gerando novo jogo...',
                statusVictory: '🎉 Parabéns! Você completou o Sudoku! 🎉',
                statusIncomplete: 'Puzzle incompleto. Continue preenchendo!',
                statusErrors: 'Há erros no puzzle. Verifique os números em vermelho.',
                statusCleared: 'Tabuleiro limpo!',
                statusHint: 'Dica adicionada!',
                statusNoHints: 'Não há células vazias para dicas!'
            },
            en: {
                title: '🧩 SUDOKU',
                difficulty: 'Difficulty:',
                easy: 'Easy',
                medium: 'Medium',
                hard: 'Hard',
                newGame: 'New Game',
                check: 'Check',
                clear: 'Clear',
                hint: 'Hint',
                langBtn: '🇧🇷 Português',
                darkBtn: '🌙 Dark Mode',
                lightBtn: '☀️ Light Mode',
                statusDefault: 'Fill in numbers from 1 to 9',
                statusGenerating: 'Generating new game...',
                statusVictory: '🎉 Congratulations! You completed the Sudoku! 🎉',
                statusIncomplete: 'Puzzle incomplete. Keep filling!',
                statusErrors: 'There are errors in the puzzle. Check the red numbers.',
                statusCleared: 'Board cleared!',
                statusHint: 'Hint added!',
                statusNoHints: 'No empty cells for hints!'
            }
        };

        // Função para alternar idioma
        function toggleLanguage() {
            currentLanguage = currentLanguage === 'pt' ? 'en' : 'pt';
            updateTexts();
        }

        // Função para alternar modo escuro
        function toggleDarkMode() {
            darkMode = !darkMode;
            document.body.classList.toggle('dark-mode', darkMode);
            updateTexts();
        }

        // Função para atualizar textos da interface
        function updateTexts() {
            const t = texts[currentLanguage];
            
            document.querySelector('h1').textContent = t.title;
            document.getElementById('difficultyLabel').textContent = t.difficulty;
            document.getElementById('easyOption').textContent = t.easy;
            document.getElementById('mediumOption').textContent = t.medium;
            document.getElementById('hardOption').textContent = t.hard;
            document.getElementById('newGameBtn').textContent = t.newGame;
            document.getElementById('checkBtn').textContent = t.check;
            document.getElementById('clearBtn').textContent = t.clear;
            document.getElementById('hintBtn').textContent = t.hint;
            document.getElementById('langBtn').textContent = t.langBtn;
            document.getElementById('darkBtn').textContent = darkMode ? t.lightBtn : t.darkBtn;
            
            const status = document.getElementById('status');
            if (status.textContent.includes('Preencha') || status.textContent.includes('Fill in')) {
                status.textContent = t.statusDefault;
            }
        }

        // Função para criar o grid visual
        function createGrid() {
            const grid = document.getElementById('sudokuGrid');
            grid.innerHTML = '';
            
            for (let i = 0; i < 81; i++) {
                const cell = document.createElement('div');
                cell.className = 'cell';
                cell.innerHTML = '<input type="text" maxlength="1" oninput="handleInput(this)" onkeydown="handleKeyDown(event, this)">';
                grid.appendChild(cell);
            }
        }

        // Função para gerar um Sudoku completo válido
        function generateCompleteSudoku() {
            const board = Array(9).fill().map(() => Array(9).fill(0));
            fillBoard(board);
            return board;
        }

        // Preenche o tabuleiro usando backtracking
        function fillBoard(board) {
            const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
            
            for (let row = 0; row < 9; row++) {
                for (let col = 0; col < 9; col++) {
                    if (board[row][col] === 0) {
                        shuffleArray(numbers);
                        for (let num of numbers) {
                            if (isValidMove(board, row, col, num)) {
                                board[row][col] = num;
                                if (fillBoard(board)) {
                                    return true;
                                }
                                board[row][col] = 0;
                            }
                        }
                        return false;
                    }
                }
            }
            return true;
        }

        // Embaralha um array
        function shuffleArray(array) {
            for (let i = array.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [array[i], array[j]] = [array[j], array[i]];
            }
        }

        // Verifica se um movimento é válido
        function isValidMove(board, row, col, num) {
            // Verifica linha
            for (let i = 0; i < 9; i++) {
                if (board[row][i] === num) return false;
            }

            // Verifica coluna
            for (let i = 0; i < 9; i++) {
                if (board[i][col] === num) return false;
            }

            // Verifica região 3x3
            const startRow = Math.floor(row / 3) * 3;
            const startCol = Math.floor(col / 3) * 3;
            for (let i = 0; i < 3; i++) {
                for (let j = 0; j < 3; j++) {
                    if (board[startRow + i][startCol + j] === num) return false;
                }
            }

            return true;
        }

        // Remove números do tabuleiro completo para criar o puzzle
        function createPuzzle(completeBoard, difficulty) {
            const board = completeBoard.map(row => [...row]);
            let cellsToRemove;

            switch (difficulty) {
                case 'easy': cellsToRemove = 35; break;
                case 'medium': cellsToRemove = 45; break;
                case 'hard': cellsToRemove = 55; break;
                default: cellsToRemove = 45;
            }

            const positions = [];
            for (let i = 0; i < 81; i++) {
                positions.push(i);
            }
            shuffleArray(positions);

            for (let i = 0; i < cellsToRemove; i++) {
                const pos = positions[i];
                const row = Math.floor(pos / 9);
                const col = pos % 9;
                board[row][col] = 0;
            }

            return board;
        }

        // Inicia um novo jogo
        function newGame() {
            const difficulty = document.getElementById('difficulty').value;
            document.getElementById('status').textContent = 'Gerando novo jogo...';
            
            setTimeout(() => {
                solutionBoard = generateCompleteSudoku();
                sudokuBoard = createPuzzle(solutionBoard, difficulty);
                givenCells = [];

                const cells = document.querySelectorAll('.cell');
                cells.forEach((cell, index) => {
                    const row = Math.floor(index / 9);
                    const col = index % 9;
                    const input = cell.querySelector('input');
                    
                    cell.className = 'cell';
                    
                    if (sudokuBoard[row][col] !== 0) {
                        input.value = sudokuBoard[row][col];
                        input.disabled = true;
                        cell.classList.add('given');
                        givenCells.push(index);
                    } else {
                        input.value = '';
                        input.disabled = false;
                    }
                });

                document.getElementById('status').textContent = 'Preencha os números de 1 a 9';
            }, 100);
        }

        // Manipula entrada de dados
        function handleInput(input) {
            const value = input.value;
            
            if (value && (isNaN(value) || value < 1 || value > 9)) {
                input.value = '';
                return;
            }

            if (value) {
                validateCell(input);
            } else {
                input.parentElement.className = 'cell';
            }
        }

        // Manipula teclas pressionadas
        function handleKeyDown(event, input) {
            if (event.key === 'Backspace' || event.key === 'Delete') {
                input.value = '';
                input.parentElement.className = 'cell';
            }
        }

        // Valida uma célula específica
        function validateCell(input) {
            const cells = document.querySelectorAll('.cell');
            const cellIndex = Array.from(cells).indexOf(input.parentElement);
            const row = Math.floor(cellIndex / 9);
            const col = cellIndex % 9;
            const value = parseInt(input.value);

            const currentBoard = getCurrentBoard();
            const tempBoard = currentBoard.map(row => [...row]);
            tempBoard[row][col] = 0; // Remove o valor atual para validação

            if (isValidMove(tempBoard, row, col, value)) {
                input.parentElement.classList.remove('invalid');
                input.parentElement.classList.add('valid');
            } else {
                input.parentElement.classList.remove('valid');
                input.parentElement.classList.add('valid');
                input.parentElement.classList.add('invalid');
            }
        }

        // Obtém o estado atual do tabuleiro
        function getCurrentBoard() {
            const board = Array(9).fill().map(() => Array(9).fill(0));
            const cells = document.querySelectorAll('.cell input');
            
            cells.forEach((input, index) => {
                const row = Math.floor(index / 9);
                const col = index % 9;
                const value = input.value;
                if (value && !isNaN(value)) {
                    board[row][col] = parseInt(value);
                }
            });

            return board;
        }

        // Verifica se a solução está correta
        function checkSolution() {
            const currentBoard = getCurrentBoard();
            let isComplete = true;
            let isValid = true;

            // Verifica se está completo
            for (let row = 0; row < 9; row++) {
                for (let col = 0; col < 9; col++) {
                    if (currentBoard[row][col] === 0) {
                        isComplete = false;
                        break;
                    }
                }
                if (!isComplete) break;
            }

            // Verifica se é válido
            if (isComplete) {
                for (let row = 0; row < 9; row++) {
                    for (let col = 0; col < 9; col++) {
                        const tempBoard = currentBoard.map(r => [...r]);
                        const value = tempBoard[row][col];
                        tempBoard[row][col] = 0;
                        
                        if (!isValidMove(tempBoard, row, col, value)) {
                            isValid = false;
                            break;
                        }
                    }
                    if (!isValid) break;
                }
            }

            const status = document.getElementById('status');
            if (isComplete && isValid) {
                status.innerHTML = '🎉 Parabéns! Você completou o Sudoku! 🎉';
                status.className = 'status victory';
            } else if (!isComplete) {
                status.textContent = 'Puzzle incompleto. Continue preenchendo!';
                status.className = 'status';
            } else {
                status.textContent = 'Há erros no puzzle. Verifique os números em vermelho.';
                status.className = 'status';
            }
        }

        // Limpa o tabuleiro (apenas células não dadas)
        function clearBoard() {
            const cells = document.querySelectorAll('.cell');
            cells.forEach((cell, index) => {
                if (!givenCells.includes(index)) {
                    const input = cell.querySelector('input');
                    input.value = '';
                    cell.className = 'cell';
                }
            });
            document.getElementById('status').textContent = 'Tabuleiro limpo!';
        }

        // Mostra uma dica
        function showHint() {
            const currentBoard = getCurrentBoard();
            const emptyCells = [];

            for (let i = 0; i < 81; i++) {
                if (!givenCells.includes(i)) {
                    const row = Math.floor(i / 9);
                    const col = i % 9;
                    if (currentBoard[row][col] === 0) {
                        emptyCells.push(i);
                    }
                }
            }

            if (emptyCells.length > 0) {
                const randomIndex = emptyCells[Math.floor(Math.random() * emptyCells.length)];
                const row = Math.floor(randomIndex / 9);
                const col = randomIndex % 9;
                const cells = document.querySelectorAll('.cell');
                const input = cells[randomIndex].querySelector('input');
                
                input.value = solutionBoard[row][col];
                validateCell(input);
                document.getElementById('status').textContent = 'Dica adicionada!';
            } else {
                document.getElementById('status').textContent = 'Não há células vazias para dicas!';
            }
        }

        // Inicializa o jogo
        createGrid();
        newGame();
