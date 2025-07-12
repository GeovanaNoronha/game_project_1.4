
        // Função para quando um jogo é selecionado
        function playGame(gameType) {
            // Adicione aqui a lógica para iniciar o jogo selecionado
            alert(`Iniciando ${gameType}! 🎮\n\nAqui você pode redirecionar para a página específica do jogo.`);
            
            // Exemplo de como você pode redirecionar para diferentes jogos:
            // window.location.href = `games/${gameType}.html`;
        }


        // Função para adicionar jogo ao grid
        function addGameToGrid(name, icon, description) {
            const gamesGrid = document.querySelector('.games-grid');
            const addButton = document.querySelector('.add-game');
            
            const newGameCard = document.createElement('div');
            newGameCard.className = 'game-card';
            newGameCard.onclick = () => playGame(name.toLowerCase().replace(' ', ''));
            
            newGameCard.innerHTML = `
                <span class="game-icon">${icon}</span>
                <h3 class="game-title">${name}</h3>
                <p class="game-description">${description}</p>
            `;
            
            gamesGrid.insertBefore(newGameCard, addButton);
            
            // Adiciona animação ao novo card
            newGameCard.style.opacity = '0';
            newGameCard.style.transform = 'translateX(-100px) rotate(-10deg)';
            
            setTimeout(() => {
                newGameCard.style.transition = 'all 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
                newGameCard.style.opacity = '1';
                newGameCard.style.transform = 'translateX(0) rotate(0deg)';
            }, 100);
        }

        // Criar partículas flutuantes
        function createParticles() {
            const particlesContainer = document.getElementById('particles');
            const particleCount = 15;
            
            for (let i = 0; i < particleCount; i++) {
                const particle = document.createElement('div');
                particle.className = 'particle';
                
                // Tamanho aleatório
                const size = Math.random() * 6 + 2;
                particle.style.width = size + 'px';
                particle.style.height = size + 'px';
                
                // Posição aleatória
                particle.style.left = Math.random() * 100 + '%';
                particle.style.top = Math.random() * 100 + '%';
                
                // Delay de animação aleatório
                particle.style.animationDelay = Math.random() * 6 + 's';
                particle.style.animationDuration = (Math.random() * 4 + 4) + 's';
                
                particlesContainer.appendChild(particle);
            }
        }

        // Inicializar partículas quando a página carregar
        window.addEventListener('load', createParticles);

        // Adicionar efeito de hover em dispositivos touch
        if ('ontouchstart' in window) {
            document.querySelectorAll('.game-card').forEach(card => {
                card.addEventListener('touchstart', function() {
                    this.style.transform = 'translateY(-10px) scale(1.02)';
                });
                
                card.addEventListener('touchend', function() {
                    this.style.transform = '';
                });
            });
        }
    