// Класс игрока
class Player {
    constructor(x, y, width, height, gravity) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.gravity = gravity;
        
        // Физические свойства
        this.velocityX = 0;
        this.velocityY = 0;
        this.maxSpeed = 6;
        this.jumpForce = -13;
        this.acceleration = 0.8;
        this.friction = 0.85;
        
        // Состояния игрока
        this.onGround = false;
        this.isJumping = false;
        this.direction = 1; // 1 - вправо, -1 - влево
        this.canDoubleJump = false;
        this.hasDoubleJumped = false;
        
        // Начальная позиция для респавна
        this.startX = x;
        this.startY = y;
        
        // Анимация
        this.walkAnimation = 0;
    }
    
    update(inputHandler, deltaTime) {
        // Нормализуем deltaTime для стабильной физики
        const delta = Math.min(deltaTime / 16, 2); // Ограничиваем максимальное значение
        
        // Применяем гравитацию
        this.velocityY += this.gravity * delta;
        
        // Обработка ввода для движения
        let targetSpeed = 0;
        
        if (inputHandler.keys.left) {
            targetSpeed = -this.maxSpeed;
            this.direction = -1;
            this.walkAnimation += delta * 0.2;
        } else if (inputHandler.keys.right) {
            targetSpeed = this.maxSpeed;
            this.direction = 1;
            this.walkAnimation += delta * 0.2;
        } else {
            // Замедление при отсутствии ввода
            targetSpeed = 0;
        }
        
        // Плавное изменение скорости
        this.velocityX += (targetSpeed - this.velocityX) * this.acceleration * delta;
        
        // Прыжок
        if (inputHandler.keys.up) {
            if (this.onGround) {
                this.velocityY = this.jumpForce;
                this.onGround = false;
                this.isJumping = true;
                this.canDoubleJump = true;
                this.hasDoubleJumped = false;
            } else if (this.canDoubleJump && !this.hasDoubleJumped) {
                this.velocityY = this.jumpForce * 0.8; // Немного слабее двойной прыжок
                this.hasDoubleJumped = true;
                this.canDoubleJump = false;
            }
        }
        
        // Сбрасываем возможность двойного прыжка при приземлении
        if (this.onGround) {
            this.canDoubleJump = true;
            this.hasDoubleJumped = false;
        }
        
        // Применяем трение только когда нет ввода
        if (targetSpeed === 0) {
            this.velocityX *= this.friction;
            
            // Останавливаем полностью при очень низкой скорости
            if (Math.abs(this.velocityX) < 0.1) {
                this.velocityX = 0;
            }
        }
        
        // Ограничение скорости по горизонтали
        if (Math.abs(this.velocityX) > this.maxSpeed) {
            this.velocityX = Math.sign(this.velocityX) * this.maxSpeed;
        }
        
        // Обновление позиции
        this.x += this.velocityX * delta;
        this.y += this.velocityY * delta;
        
        // Сброс состояния прыжка
        if (this.isJumping && this.velocityY >= 0) {
            this.isJumping = false;
        }
        
        // Сброс onGround (будет установлено при коллизии)
        this.onGround = false;
    }
    
    draw(ctx) {
        // Сохраняем контекст
        ctx.save();
        
        // Отражение игрока при движении влево
        if (this.direction === -1) {
            ctx.translate(this.x + this.width, this.y);
            ctx.scale(-1, 1);
        } else {
            ctx.translate(this.x, this.y);
        }
        
        // Тело игрока
        ctx.fillStyle = '#3498db';
        ctx.fillRect(0, 0, this.width, this.height);
        
        // Анимация ходьбы (покачивание)
        const walkOffset = Math.sin(this.walkAnimation) * 3;
        
        // Голова
        ctx.fillStyle = '#2980b9';
        ctx.fillRect(5, -10 + walkOffset, this.width - 10, 15);
        
        // Глаза
        ctx.fillStyle = 'white';
        let eyeY = -5 + walkOffset;
        if (this.isJumping) eyeY += Math.sin(Date.now() / 100) * 2;
        
        ctx.fillRect(10, eyeY, 5, 5);
        ctx.fillRect(this.width - 15, eyeY, 5, 5);
        
        // Зрачки
        ctx.fillStyle = 'black';
        ctx.fillRect(12, eyeY + 2, 2, 2);
        ctx.fillRect(this.width - 13, eyeY + 2, 2, 2);
        
        // Улыбка
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 1;
        ctx.beginPath();
        const smileY = 5 + walkOffset;
        ctx.arc(this.width / 2, smileY, 8, 0.2, Math.PI - 0.2);
        ctx.stroke();
        
        // Ноги при ходьбе
        if (!this.onGround && Math.abs(this.velocityX) > 1) {
            ctx.fillStyle = '#2980b9';
            const legOffset = Math.sin(this.walkAnimation * 2) * 5;
            ctx.fillRect(5, this.height, 8, 10 + legOffset);
            ctx.fillRect(this.width - 13, this.height, 8, 10 - legOffset);
        }
        
        // Восстанавливаем контекст
        ctx.restore();
    }
    
    respawn() {
        this.x = this.startX;
        this.y = this.startY;
        this.velocityX = 0;
        this.velocityY = 0;
        this.onGround = false;
        this.isJumping = false;
        this.canDoubleJump = true;
        this.hasDoubleJumped = false;
    }
}