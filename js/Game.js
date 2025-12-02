// Основной класс игры
class Game {
    constructor(canvas, ctx, inputHandler, ui) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.inputHandler = inputHandler;
        this.ui = ui;
        
        // Игровые состояния
        this.isRunning = false;
        this.isPaused = false;
        this.gameOver = false;
        this.levelComplete = false;
        
        // Игровые объекты
        this.player = null;
        this.platforms = [];
        this.coins = [];
        this.enemies = [];
        this.goal = null;
        
        // Игровые параметры
        this.score = 0;
        this.coinsCollected = 0;
        this.totalCoins = 0;
        this.lives = 3;
        this.level = 1;
        this.maxLevels = levels.length;
        
        // Физика
        this.gravity = 0.5;
        
        // Анимация
        this.lastTime = 0;
        this.animationId = null;
    }
    
    init() {
        console.log('Инициализация игры...');
        // Загружаем первый уровень
        this.loadLevel(this.level);
        this.ui.updateGameStats(this);
        
        // Запускаем игровой цикл
        this.gameLoop();
        
        // Автоматически запускаем игру
        this.start();
    }
    
    loadLevel(levelNum) {
        console.log('Загрузка уровня', levelNum);
        // Очищаем предыдущие объекты
        this.platforms = [];
        this.coins = [];
        this.enemies = [];
        
        // Загружаем уровень
        const levelData = levels[levelNum - 1];
        if (!levelData) {
            console.error('Уровень', levelNum, 'не найден!');
            return;
        }
        
        // Создаем платформы
        levelData.platforms.forEach(platformData => {
            this.platforms.push(new Platform(
                platformData.x,
                platformData.y,
                platformData.width,
                platformData.height,
                platformData.type || 'normal'
            ));
        });
        
        // Создаем монеты
        levelData.coins.forEach(coinData => {
            this.coins.push({
                x: coinData.x,
                y: coinData.y,
                width: 20,
                height: 20,
                collected: false,
                animation: 0
            });
        });
        
        this.totalCoins = this.coins.length;
        
        // Создаем врагов с исправленной логикой движения
        levelData.enemies.forEach(enemyData => {
            this.enemies.push({
                x: enemyData.x,
                y: enemyData.y,
                width: 35,
                height: 35,
                speed: enemyData.speed || 1.5,
                direction: Math.random() > 0.5 ? 1 : -1,
                originalX: enemyData.x,
                moveRange: enemyData.moveRange || 80,
                moveTimer: 0
            });
        });
        
        // Создаем цель (финиш)
        this.goal = {
            x: levelData.goal.x,
            y: levelData.goal.y,
            width: 40,
            height: 60
        };
        
        // Создаем игрока
        const playerStart = levelData.playerStart;
        this.player = new Player(
            playerStart.x,
            playerStart.y,
            30,
            50,
            this.gravity
        );
        
        // Сбрасываем счетчики уровня
        this.coinsCollected = 0;
        
        console.log('Уровень загружен: платформ -', this.platforms.length, 
                   'монет -', this.totalCoins, 'врагов -', this.enemies.length);
    }
    
    start() {
        if (!this.isRunning) {
            this.isRunning = true;
            this.isPaused = false;
            console.log('Игра запущена');
            this.ui.updateGameStats(this);
        }
    }
    
    togglePause() {
        if (this.isRunning) {
            this.isPaused = !this.isPaused;
            console.log('Игра', this.isPaused ? 'на паузе' : 'продолжена');
            this.ui.updateGameStats(this);
        }
    }
    
    restart() {
        this.score = 0;
        this.coinsCollected = 0;
        this.lives = 3;
        this.level = 1;
        this.gameOver = false;
        this.levelComplete = false;
        this.isRunning = true;
        this.isPaused = false;
        this.loadLevel(this.level);
        this.ui.updateGameStats(this);
        console.log('Игра перезапущена');
    }
    
    update(deltaTime) {
        // Обработка глобальных клавиш (P и R)
        if (this.inputHandler.keys.pause) {
            this.togglePause();
            this.inputHandler.keys.pause = false; // Сбрасываем флаг
        }
        
        if (this.inputHandler.keys.restart) {
            this.restart();
            this.inputHandler.keys.restart = false; // Сбрасываем флаг
        }
        
        if (!this.isRunning || this.isPaused || this.gameOver || this.levelComplete) {
            return;
        }
        
        // Обновление игрока
        this.player.update(this.inputHandler, deltaTime);
        
        // Обновление врагов (исправленная логика)
        this.updateEnemies(deltaTime);
        
        // Обновление анимации монет
        this.updateCoins(deltaTime);
        
        // Проверка коллизий
        this.checkCollisions();
        
        // Проверка на выход за пределы карты
        this.checkBoundaries();
        
        // Проверка завершения уровня
        this.checkLevelCompletion();
        
        // Обновление UI
        this.ui.updateGameStats(this);
    }
    
    updateEnemies(deltaTime) {
        const delta = deltaTime / 16;
        
        this.enemies.forEach(enemy => {
            // Обновляем таймер для случайных изменений направления
            enemy.moveTimer += delta;
            if (enemy.moveTimer > 60) { // Каждые ~60 кадров
                if (Math.random() < 0.01) { // 1% шанс изменить направление
                    enemy.direction *= -1;
                }
                enemy.moveTimer = 0;
            }
            
            // Движение врага вперед-назад
            enemy.x += enemy.speed * enemy.direction * delta;
            
            // Проверка границ движения
            if (enemy.x > enemy.originalX + enemy.moveRange) {
                enemy.direction = -1;
                enemy.x = enemy.originalX + enemy.moveRange; // Не даем выйти за границы
            } else if (enemy.x < enemy.originalX - enemy.moveRange) {
                enemy.direction = 1;
                enemy.x = enemy.originalX - enemy.moveRange; // Не даем выйти за границы
            }
        });
    }
    
    updateCoins(deltaTime) {
        // Анимация вращения монет
        this.coins.forEach(coin => {
            if (!coin.collected) {
                coin.animation += deltaTime * 0.01;
            }
        });
    }
    
    checkCollisions() {
        // Коллизии игрока с платформами
        this.platforms.forEach(platform => {
            if (Collision.check(this.player, platform)) {
                Collision.resolve(this.player, platform);
            }
        });
        
        // Коллизии игрока с монетами
        this.coins.forEach((coin) => {
            if (!coin.collected && Collision.check(this.player, coin)) {
                coin.collected = true;
                this.coinsCollected++;
                this.score += 100;
                console.log('Монета собрана! Всего:', this.coinsCollected);
            }
        });
        
        // Коллизии игрока с врагами
        this.enemies.forEach(enemy => {
            if (Collision.check(this.player, enemy)) {
                this.lives--;
                this.player.respawn();
                console.log('Столкновение с врагом! Жизней осталось:', this.lives);
                
                if (this.lives <= 0) {
                    this.gameOver = true;
                    this.isRunning = false;
                    setTimeout(() => {
                        alert(`Игра окончена! Ваш счет: ${this.score}\nНажмите "Рестарт" для новой игры.`);
                    }, 100);
                }
            }
        });
        
        // Коллизия с целью
        if (this.goal && Collision.check(this.player, this.goal)) {
            this.levelComplete = true;
            this.isRunning = false;
            
            // Бонус за сбор всех монет
            if (this.coinsCollected === this.totalCoins) {
                this.score += 500;
            }
            
            // Бонус за оставшиеся жизни
            this.score += this.lives * 200;
            
            setTimeout(() => {
                if (this.level < this.maxLevels) {
                    if (confirm(`Уровень ${this.level} пройден!\nСчет: ${this.score}\nСобрано монет: ${this.coinsCollected}/${this.totalCoins}\n\nПерейти на следующий уровень?`)) {
                        this.nextLevel();
                    }
                } else {
                    alert(`Поздравляем! Вы прошли все уровни!\nИтоговый счет: ${this.score}\nНажмите "Рестарт" для новой игры.`);
                    this.gameOver = true;
                }
            }, 100);
        }
    }
    
    nextLevel() {
        if (this.level < this.maxLevels) {
            this.level++;
            this.loadLevel(this.level);
            this.levelComplete = false;
            this.isRunning = true;
            this.ui.updateGameStats(this);
            console.log('Переход на уровень', this.level);
        }
    }
    
    checkBoundaries() {
        // Проверка падения игрока
        if (this.player.y > this.canvas.height) {
            this.lives--;
            this.player.respawn();
            console.log('Игрок упал! Жизней осталось:', this.lives);
            
            if (this.lives <= 0) {
                this.gameOver = true;
                this.isRunning = false;
                setTimeout(() => {
                    alert(`Игра окончена! Ваш счет: ${this.score}\nНажмите "Рестарт" для новой игры.`);
                }, 100);
            }
        }
        
        // Границы экрана по горизонтали
        if (this.player.x < 0) {
            this.player.x = 0;
            this.player.velocityX = 0;
        } else if (this.player.x > this.canvas.width - this.player.width) {
            this.player.x = this.canvas.width - this.player.width;
            this.player.velocityX = 0;
        }
    }
    
    checkLevelCompletion() {
        // Уровень завершается при достижении цели
        // Логика уже реализована в checkCollisions
    }
    
    render() {
    // Очистка canvas
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Рисуем фон
    this.drawBackground();
    
    // Рисуем платформы
    this.platforms.forEach(platform => {
        platform.draw(this.ctx);
    });
    
    // Рисуем монеты
    this.drawCoins();
    
    // Рисуем врагов
    this.drawEnemies();
    
    // Рисуем цель
    this.drawGoal();
    
    // Рисуем игрока
    this.player.draw(this.ctx);
    
    // Рисуем информацию о паузе
    if (this.isPaused) {
        this.drawPauseScreen();
    }
    
    // Рисуем информацию о завершении игры
    if (this.gameOver) {
        this.drawGameOverScreen();
    }
    
    // Убираем отладочную информацию, оставляем только уровень и монеты в углу
    this.drawGameStats();
    }
    
    drawBackground() {
        const ctx = this.ctx;
        // Градиентный фон
        const gradient = ctx.createLinearGradient(0, 0, 0, this.canvas.height);
        gradient.addColorStop(0, '#0d1b2a');
        gradient.addColorStop(1, '#1b263b');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Звезды на фоне
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        for (let i = 0; i < 50; i++) {
            const x = Math.random() * this.canvas.width;
            const y = Math.random() * this.canvas.height;
            const radius = Math.random() * 1.5;
            ctx.beginPath();
            ctx.arc(x, y, radius, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    
    drawCoins() {
        const ctx = this.ctx;
        this.coins.forEach(coin => {
            if (!coin.collected) {
                // Анимация вращения и подпрыгивания монеты
                const bounce = Math.sin(coin.animation) * 3;
                
                ctx.save();
                ctx.translate(coin.x + coin.width / 2, coin.y + coin.height / 2 + bounce);
                ctx.rotate(coin.animation);
                
                // Рисуем монету
                ctx.fillStyle = '#f1c40f';
                ctx.beginPath();
                ctx.ellipse(0, 0, coin.width / 2, coin.height / 2, 0, 0, Math.PI * 2);
                ctx.fill();
                
                // Внутренняя часть монеты
                ctx.fillStyle = '#f39c12';
                ctx.beginPath();
                ctx.ellipse(0, 0, coin.width / 3, coin.height / 3, 0, 0, Math.PI * 2);
                ctx.fill();
                
                // Блик на монете
                ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
                ctx.beginPath();
                ctx.ellipse(-3, -3, 3, 3, 0, 0, Math.PI * 2);
                ctx.fill();
                
                ctx.restore();
            }
        });
    }
    
    drawEnemies() {
        const ctx = this.ctx;
        this.enemies.forEach(enemy => {
            // Анимация дыхания врага
            const breath = Math.sin(Date.now() / 500) * 1.5;
            
            // Тело врага
            ctx.fillStyle = '#e74c3c';
            ctx.fillRect(enemy.x, enemy.y + breath, enemy.width, enemy.height);
            
            // Глаза врага
            ctx.fillStyle = 'white';
            ctx.fillRect(enemy.x + 8, enemy.y + 8 + breath, 8, 8);
            ctx.fillRect(enemy.x + 19, enemy.y + 8 + breath, 8, 8);
            
            // Зрачки (следуют за игроком)
            ctx.fillStyle = 'black';
            const lookDir = this.player.x > enemy.x ? 1 : -1;
            ctx.fillRect(enemy.x + 10 + lookDir * 2, enemy.y + 10 + breath, 4, 4);
            ctx.fillRect(enemy.x + 21 + lookDir * 2, enemy.y + 10 + breath, 4, 4);
            
            // Рот
            ctx.fillStyle = 'black';
            ctx.fillRect(enemy.x + 12, enemy.y + 25 + breath, 10, 3);
            
            // Тень под врагом
            ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
            ctx.fillRect(enemy.x - 5, enemy.y + enemy.height + breath, enemy.width + 10, 5);
        });
    }
    
    drawGoal() {
        if (!this.goal) return;
        const ctx = this.ctx;
        
        // Анимация флага
        const flagWave = Math.sin(Date.now() / 300) * 3;
        
        // Флагшток
        ctx.fillStyle = '#7d3c00';
        ctx.fillRect(this.goal.x - 2, this.goal.y - 10, 4, this.goal.height + 20);
        
        // Основание
        ctx.fillStyle = '#5d2c00';
        ctx.fillRect(this.goal.x - 10, this.goal.y + this.goal.height - 5, 20, 10);
        
        // Флажок
        ctx.fillStyle = '#2ecc71';
        ctx.beginPath();
        ctx.moveTo(this.goal.x + 2, this.goal.y + 10);
        ctx.lineTo(this.goal.x + 30 + flagWave, this.goal.y + 20);
        ctx.lineTo(this.goal.x + 2, this.goal.y + 30);
        ctx.closePath();
        ctx.fill();
        
        // Анимация сияния вокруг цели
        const pulse = Math.sin(Date.now() / 800) * 5 + 10;
        ctx.strokeStyle = 'rgba(46, 204, 113, 0.5)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(this.goal.x + 15, this.goal.y + this.goal.height / 2, pulse, 0, Math.PI * 2);
        ctx.stroke();
    }
    
    drawPauseScreen() {
        const ctx = this.ctx;
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        ctx.fillStyle = 'white';
        ctx.font = 'bold 48px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('ПАУЗА', this.canvas.width / 2, this.canvas.height / 2 - 30);
        
        ctx.font = '20px Arial';
        ctx.fillText('Нажмите P для продолжения', this.canvas.width / 2, this.canvas.height / 2 + 30);
        ctx.fillText('или нажмите кнопку "Продолжить"', this.canvas.width / 2, this.canvas.height / 2 + 60);
    }
    
    drawGameOverScreen() {
        const ctx = this.ctx;
        ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        ctx.fillStyle = 'white';
        ctx.font = 'bold 48px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('ИГРА ОКОНЧЕНА', this.canvas.width / 2, this.canvas.height / 2 - 50);
        
        ctx.font = '24px Arial';
        ctx.fillText(`Финальный счет: ${this.score}`, this.canvas.width / 2, this.canvas.height / 2);
        ctx.fillText(`Уровней пройдено: ${this.level - 1}`, this.canvas.width / 2, this.canvas.height / 2 + 40);
        
        ctx.font = '20px Arial';
        ctx.fillText('Нажмите R или кнопку "Рестарт" для новой игры', this.canvas.width / 2, this.canvas.height / 2 + 90);
    }
    
    drawDebugInfo() {
    // Оставляем только уровень и монеты в углу экрана
    const ctx = this.ctx;
    
    // Прозрачный фон для информации
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect(10, 10, 150, 60);
    
    ctx.fillStyle = 'white';
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'left';
    
    // Только номер уровня и монеты
    ctx.fillText(`Уровень: ${this.level}`, 20, 30);
    ctx.fillText(`Монеты: ${this.coinsCollected}/${this.totalCoins}`, 20, 55);
    
    // Если все монеты собраны, показываем сообщение
    if (this.coinsCollected === this.totalCoins && this.totalCoins > 0) {
        ctx.fillStyle = '#f1c40f';
        ctx.font = 'bold 14px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Все монеты собраны! +500 бонус', this.canvas.width / 2, 25);
        ctx.textAlign = 'left';
    }
}

drawGameStats() {
    // Минимальная информация в углу экрана
    const ctx = this.ctx;
    
    // Тень для лучшей читаемости
    ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
    ctx.fillRect(10, 10, 120, 40);
    
    // Белый текст
    ctx.fillStyle = 'white';
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'left';
    
    // Только самая важная информация
    ctx.fillText(`Ур. ${this.level}`, 20, 30);
    ctx.fillText(`💰 ${this.coinsCollected}/${this.totalCoins}`, 20, 50);
}
    
    gameLoop(currentTime = 0) {
        // Вычисляем разницу во времени
        const deltaTime = currentTime - this.lastTime || 0;
        this.lastTime = currentTime;
        
        // Обновление и отрисовка игры
        this.update(deltaTime);
        this.render();
        
        // Запускаем следующий кадр
        this.animationId = requestAnimationFrame((time) => this.gameLoop(time));
    }
}