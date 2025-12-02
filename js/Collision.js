// Система обработки коллизий
class Collision {
    static check(rect1, rect2) {
        return (
            rect1.x < rect2.x + rect2.width &&
            rect1.x + rect1.width > rect2.x &&
            rect1.y < rect2.y + rect2.height &&
            rect1.y + rect1.height > rect2.y
        );
    }
    
    static resolve(player, platform) {
        // Определяем сторону коллизии
        const playerBottom = player.y + player.height;
        const playerRight = player.x + player.width;
        const platformBottom = platform.y + platform.height;
        const platformRight = platform.x + platform.width;
        
        // Вычисляем перекрытия
        const bottomOverlap = Math.abs(playerBottom - platform.y);
        const topOverlap = Math.abs(player.y - platformBottom);
        const leftOverlap = Math.abs(playerRight - platform.x);
        const rightOverlap = Math.abs(player.x - platformRight);
        
        // Находим наименьшее перекрытие
        const minOverlap = Math.min(bottomOverlap, topOverlap, leftOverlap, rightOverlap);
        
        // Разрешаем коллизию в зависимости от стороны
        if (minOverlap === bottomOverlap) {
            // Коллизия сверху (игрок приземлился на платформу)
            player.y = platform.y - player.height;
            player.velocityY = 0;
            player.onGround = true;
            
            // Эффекты в зависимости от типа платформы
            if (platform.type === 'bounce') {
                player.velocityY = -15; // Отскок
            } else if (platform.type === 'danger') {
                player.velocityY = -5; // Небольшой отскок от опасной платформы
            }
        } else if (minOverlap === topOverlap) {
            // Коллизия снизу (игрок ударился головой)
            player.y = platformBottom;
            player.velocityY = 0;
        } else if (minOverlap === leftOverlap) {
            // Коллизия слева
            player.x = platform.x - player.width;
            player.velocityX = 0;
        } else if (minOverlap === rightOverlap) {
            // Коллизия справа
            player.x = platformRight;
            player.velocityX = 0;
        }
    }
}