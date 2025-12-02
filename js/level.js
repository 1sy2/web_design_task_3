// Конфигурация уровней
const levels = [
    {
        name: "Первый уровень",
        playerStart: { x: 100, y: 400 },
        platforms: [
            { x: 0, y: 450, width: 150, height: 50 },
            { x: 200, y: 400, width: 100, height: 20 },
            { x: 350, y: 350, width: 100, height: 20 },
            { x: 500, y: 300, width: 100, height: 20 },
            { x: 650, y: 250, width: 150, height: 20 },
            { x: 300, y: 200, width: 100, height: 20, type: 'bounce' },
            { x: 450, y: 150, width: 100, height: 20 },
            { x: 600, y: 100, width: 200, height: 50 }
        ],
        coins: [
            { x: 250, y: 350 },
            { x: 400, y: 300 },
            { x: 550, y: 250 },
            { x: 325, y: 150 },
            { x: 475, y: 100 }
        ],
        enemies: [
            { x: 400, y: 320, speed: 2 }
        ],
        goal: { x: 700, y: 50 }
    },
    {
        name: "Второй уровень",
        playerStart: { x: 50, y: 400 },
        platforms: [
            { x: 0, y: 450, width: 100, height: 50 },
            { x: 150, y: 400, width: 80, height: 20 },
            { x: 280, y: 380, width: 80, height: 20 },
            { x: 400, y: 350, width: 80, height: 20 },
            { x: 520, y: 320, width: 80, height: 20 },
            { x: 300, y: 250, width: 100, height: 20, type: 'danger' },
            { x: 450, y: 200, width: 100, height: 20 },
            { x: 600, y: 150, width: 100, height: 20 },
            { x: 700, y: 100, width: 100, height: 50 }
        ],
        coins: [
            { x: 180, y: 350 },
            { x: 310, y: 330 },
            { x: 430, y: 300 },
            { x: 550, y: 270 },
            { x: 475, y: 150 }
        ],
        enemies: [
            { x: 200, y: 370, speed: 1.5 },
            { x: 500, y: 290, speed: 2 }
        ],
        goal: { x: 750, y: 50 }
    },
    {
        name: "Финальный уровень",
        playerStart: { x: 100, y: 400 },
        platforms: [
            { x: 0, y: 450, width: 120, height: 50 },
            { x: 170, y: 420, width: 80, height: 20 },
            { x: 300, y: 390, width: 80, height: 20, type: 'bounce' },
            { x: 430, y: 360, width: 80, height: 20 },
            { x: 560, y: 330, width: 80, height: 20 },
            { x: 200, y: 280, width: 100, height: 20, type: 'danger' },
            { x: 350, y: 230, width: 100, height: 20 },
            { x: 500, y: 180, width: 100, height: 20, type: 'bounce' },
            { x: 650, y: 130, width: 150, height: 50 }
        ],
        coins: [
            { x: 210, y: 370 },
            { x: 340, y: 340 },
            { x: 470, y: 310 },
            { x: 600, y: 280 },
            { x: 225, y: 230 },
            { x: 375, y: 180 },
            { x: 525, y: 130 }
        ],
        enemies: [
            { x: 250, y: 370, speed: 2 },
            { x: 400, y: 320, speed: 1.8 },
            { x: 550, y: 290, speed: 2.2 }
        ],
        goal: { x: 700, y: 80 }
    }
];

// Экспортируем для использования в других файлах
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { levels };
}