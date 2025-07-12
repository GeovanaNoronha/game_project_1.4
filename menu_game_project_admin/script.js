
        
        // Array para armazenar os jogos
        let games = [
            {
                id: 1,
                name: "Quebra-Cabeça",
                icon: "🧩",
                description: "Desafie sua mente com puzzles incríveis",
                url: ""
            },
            {
                id: 2,
                name: "Jogo da Memória",
                icon: "🧠",
                description: "Teste sua capacidade de memorização",
                url: ""
            },
            {
                id: 3,
                name: "Corrida",
                icon: "🏎️",
                description: "Acelere e seja o primeiro na linha de chegada",
                url: ""
            },
            {
                id: 4,
                name: "Aventura",
                icon: "⚔️",
                description: "Explore mundos fantásticos e misteriosos",
                url: ""
            },
            {
                id: 5,
                name: "Arcade",
                icon: "👾",
                description: "Diversão retrô com jogos clássicos",
                url: ""
            }
        ];

        let currentEditingId = null;
        let nextId = 6;

        // Renderizar jogos na tela
        function renderGames() {
            const gamesGrid = document.getElementById('gamesGrid');
            gamesGrid.innerHTML = '';

            games.forEach(game => {
                const gameCard = document.createElement('div');
                gameCard.className = 'game-card';
                gameCard.innerHTML = `
                    <span class="game-icon">${game.icon}</span>
                    <h3 class="game-title">${game.name}</h3>
                    <p class="game-description">${game.description}</p>
                    <div class="game-actions">
                        <button class="action-btn play-btn" onclick="playGame(${game.id})">▶️ Jogar</button>
                        <button class="action-btn edit-btn" onclick="editGame(${game.id})">✏️ Editar</button>
                        <button class="action-btn delete-btn" onclick="deleteGame(${game.id})">🗑️ Excluir</button>
                    </div>
                `;
                gamesGrid.appendChild(gameCard);
            });
        }

        // Jogar um jogo
        function playGame(id) {
            const game = games.find(g => g.id === id);
            if (game.url && game.url.trim() !== '') {
                window.open(game.url, '_blank');
            } else {
                alert(`🎮 Iniciando ${game.name}!\n\nAdicione uma URL no jogo para redirecionamento automático.`);
            }
        }

        // Abrir modal para adicionar jogo
        function openAddModal() {
            currentEditingId = null;
            document.getElementById('modalTitle').textContent = 'Adicionar Novo Jogo';
            document.getElementById('gameForm').reset();
            document.getElementById('gameModal').style.display = 'block';
        }

        // Editar um jogo
        function editGame(id) {
            const game = games.find(g => g.id === id);
            if (game) {
                currentEditingId = id;
                document.getElementById('modalTitle').textContent = 'Editar Jogo';
                document.getElementById('gameName').value = game.name;
                document.getElementById('gameIcon').value = game.icon;
                document.getElementById('gameDescription').value = game.description;
                document.getElementById('gameUrl').value = game.url || '';
                document.getElementById('gameModal').style.display = 'block';
            }
        }

        // Excluir um jogo
        function deleteGame(id) {
            const game = games.find(g => g.id === id);
            if (game && confirm(`Tem certeza que deseja excluir "${game.name}"?`)) {
                games = games.filter(g => g.id !== id);
                renderGames();
                showNotification('Jogo excluído com sucesso!', 'success');
            }
        }

        // Fechar modal
        function closeModal() {
            document.getElementById('gameModal').style.display = 'none';
            currentEditingId = null;
        }

        // Salvar jogo (adicionar ou editar)
        document.getElementById('gameForm').addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = document.getElementById('gameName').value.trim();
            const icon = document.getElementById('gameIcon').value.trim();
            const description = document.getElementById('gameDescription').value.trim();
            const url = document.getElementById('gameUrl').value.trim();

            if (!name || !icon || !description) {
                alert('Por favor, preencha todos os campos obrigatórios!');
                return;
            }

            if (currentEditingId) {
                // Editando jogo existente
                const gameIndex = games.findIndex(g => g.id === currentEditingId);
                if (gameIndex !== -1) {
                    games[gameIndex] = {
                        ...games[gameIndex],
                        name,
                        icon,
                        description,
                        url
                    };
                    showNotification('Jogo atualizado com sucesso!', 'success');
                }
            } else {
                // Adicionando novo jogo
                const newGame = {
                    id: nextId++,
                    name,
                    icon,
                    description,
                    url
                };
                games.push(newGame);
                showNotification('Jogo adicionado com sucesso!', 'success');
            }

            renderGames();
            closeModal();
        });

        // Exportar jogos para JSON
        function exportGames() {
            const dataStr = JSON.stringify(games, null, 2);
            const dataBlob = new Blob([dataStr], {type: 'application/json'});
            const url = URL.createObjectURL(dataBlob);
            const link = document.createElement('a');
            link.href = url;
            link.download = 'jogos_menu.json';
            link.click();
            URL.revokeObjectURL(url);
            showNotification('Jogos exportados com sucesso!', 'success');
        }

        // Importar jogos de JSON
        function importGames() {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = '.json';
            input.onchange = function(event) {
                const file = event.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = function(e) {
                        try {
                            const importedGames = JSON.parse(e.target.result);
                            if (Array.isArray(importedGames)) {
                                games = importedGames;
                                nextId = Math.max(...games.map(g => g.id)) + 1;
                                renderGames();
                                showNotification('Jogos importados com sucesso!', 'success');
                            } else {
                                throw new Error('Formato inválido');
                            }
                        } catch (error) {
                            alert('Erro ao importar jogos. Verifique o formato do arquivo.');
                        }
                    };
                    reader.readAsText(file);
                }
            };
            input.click();
        }

        // Mostrar notificação
        function showNotification(message, type) {
            const notification = document.createElement('div');
            notification.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                padding: 15px 20px;
                background: ${type === 'success' ? '#4caf50' : '#f44336'};
                color: white;
                border-radius: 10px;
                z-index: 1001;
                animation: slideInRight 0.3s ease-out;
            `;
            notification.textContent = message;
            document.body.appendChild(notification);

            setTimeout(() => {
                notification.remove();
            }, 3000);
        }

        // Criar partículas flutuantes
        function createParticles() {
            const particlesContainer = document.getElementById('particles');
            const particleCount = 15;
            
            for (let i = 0; i < particleCount; i++) {
                const particle = document.createElement('div');
                particle.className = 'particle';
                
                const size = Math.random() * 6 + 2;
                particle.style.width = size + 'px';
                particle.style.height = size + 'px';
                particle.style.left = Math.random() * 100 + '%';
                particle.style.top = Math.random() * 100 + '%';
                particle.style.animationDelay = Math.random() * 6 + 's';
                particle.style.animationDuration = (Math.random() * 4 + 4) + 's';
                
                particlesContainer.appendChild(particle);
            }
        }

        // Fechar modal ao clicar fora dele
        window.onclick = function(event) {
            const modal = document.getElementById('gameModal');
            if (event.target === modal) {
                closeModal();
            }
        }

        // Inicializar aplicação
        window.addEventListener('load', function() {
            createParticles();
            renderGames();
        });

        // Adicionar estilo de animação para notificações
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideInRight {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
        `;
        document.head.appendChild(style);
    
    