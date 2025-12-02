// Класс платформы
class Platform {
    constructor(x, y, width, height, type = 'normal') {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.type = type;
    }
    
    draw(ctx) {
        // Цвет платформы в зависимости от типа
        let color;
        switch(this.type) {
            case 'danger':
                color = '#e74c3c';
                break;
            case 'bounce':
                color = '#9b59b6';
                break;
            case 'moving':
                color = '#f39c12';
                break;
            default:
                color = '#2ecc71';
        }
        
        // Рисуем платформу
        ctx.fillStyle = color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        
        // Текстура платформы
        ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
        for (let i = 0; i < this.width; i += 20) {
            ctx.fillRect(this.x + i, this.y, 10, this.height);
        }
        
        // Обводка
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.lineWidth = 2;
        ctx.strokeRect(this.x, this.y, this.width, this.height);
    }
}