// Основной файл для инициализации игры
function initGame() {
    console.log('Инициализация игры...');
    
    const canvas = document.getElementById('gameCanvas');
    if (!canvas) {
        console.error('Canvas не найден!');
        return;
    }
    
    const ctx = canvas.getContext('2d');
    if (!ctx) {
        console.error('Не удалось получить контекст canvas!');
        return;
    }
    
    console.log('Canvas найден, создаем игровые объекты...');
    
    // Создаем экземпляры игровых объектов
    const inputHandler = new InputHandler();
    const ui = new UI();
    const game = new Game(canvas, ctx, inputHandler, ui);
    
    console.log('Игровые объекты созданы');
    
    // Назначаем обработчики кнопок (только пауза и рестарт)
    const pauseBtn = document.getElementById('pauseBtn');
    const restartBtn = document.getElementById('restartBtn');
    
    if (pauseBtn) {
        pauseBtn.addEventListener('click', () => {
            console.log('Нажата кнопка Пауза');
            game.togglePause();
        });
    } else {
        console.error('Кнопка Пауза не найдена!');
    }
    
    if (restartBtn) {
        restartBtn.addEventListener('click', () => {
            console.log('Нажата кнопка Рестарт');
            game.restart();
        });
    } else {
        console.error('Кнопка Рестарт не найдена!');
    }
    
    // Запускаем игру автоматически
    game.init();
    console.log('Игра успешно инициализирована и запущена автоматически!');
}

// Запускаем игру когда DOM полностью загружен
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initGame);
} else {
    // DOM уже загружен
    initGame();
}