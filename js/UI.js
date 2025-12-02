// Класс для управления интерфейсом
class UI {
    constructor() {
        console.log('UI инициализирован');
    }
    
    updateGameStats(game) {
        const levelElement = document.getElementById('level');
        const scoreElement = document.getElementById('score');
        const livesElement = document.getElementById('lives');
        const coinsElement = document.getElementById('coins');
        
        if (levelElement) levelElement.textContent = game.level;
        if (scoreElement) scoreElement.textContent = game.score;
        if (livesElement) livesElement.textContent = game.lives;
        if (coinsElement) coinsElement.textContent = game.coinsCollected;
        
        // Обновляем текст кнопки паузы
        const pauseBtn = document.getElementById('pauseBtn');
        if (pauseBtn) {
            if (game.isPaused) {
                pauseBtn.innerHTML = '<i class="fas fa-play"></i> <span>Продолжить</span>';
            } else {
                pauseBtn.innerHTML = '<i class="fas fa-pause"></i> <span>Пауза</span>';
            }
        }
        
        // Обновляем текст кнопки старта
        const startBtn = document.getElementById('startBtn');
        if (startBtn) {
            if (game.isRunning && !game.isPaused) {
                startBtn.disabled = true;
                startBtn.innerHTML = '<i class="fas fa-play"></i> <span>Игра идет</span>';
            } else {
                startBtn.disabled = false;
                startBtn.innerHTML = '<i class="fas fa-play"></i> <span>Начать игру</span>';
            }
        }
    }
}