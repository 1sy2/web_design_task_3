// Обработчик пользовательского ввода
class InputHandler {
    constructor() {
        this.keys = {
            left: false,
            right: false,
            up: false,
            pause: false,
            restart: false,
            debug: false
        };
        
        this.init();
    }
    
    init() {
        // Обработка нажатий клавиш
        window.addEventListener('keydown', (e) => {
            this.handleKeyDown(e);
        });
        
        window.addEventListener('keyup', (e) => {
            this.handleKeyUp(e);
        });
        
        // Предотвращаем прокрутку при нажатии пробела
        window.addEventListener('keydown', (e) => {
            if (e.key === ' ' || e.key === 'Spacebar') {
                if (e.target === document.body) {
                    e.preventDefault();
                }
            }
        });
    }
    
    handleKeyDown(e) {
        const key = e.key.toLowerCase();
        
        switch(key) {
            case 'a':
            case 'ф': // русская A
            case 'arrowleft':
                this.keys.left = true;
                break;
            case 'd':
            case 'в': // русская D
            case 'arrowright':
                this.keys.right = true;
                break;
            case 'w':
            case 'ц': // русская W
            case ' ':
            case 'spacebar':
            case 'arrowup':
                this.keys.up = true;
                break;
            case 'p':
            case 'з': // русская P
                this.keys.pause = true;
                break;
            case 'r':
            case 'к': // русская R
                this.keys.restart = true;
                break;
            case '`':
            case 'f1':
                this.keys.debug = !this.keys.debug;
                break;
        }
        
        // Также можно использовать e.code для дополнительной надежности
        // Для тестирования раскомментируйте:
        // console.log('Key pressed:', key, 'Code:', e.code);
    }
    
    handleKeyUp(e) {
        const key = e.key.toLowerCase();
        
        switch(key) {
            case 'a':
            case 'ф': // русская A
            case 'arrowleft':
                this.keys.left = false;
                break;
            case 'd':
            case 'в': // русская D
            case 'arrowright':
                this.keys.right = false;
                break;
            case 'w':
            case 'ц': // русская W
            case ' ':
            case 'spacebar':
            case 'arrowup':
                this.keys.up = false;
                break;
            case 'p':
            case 'з': // русская P
                this.keys.pause = false;
                break;
            case 'r':
            case 'к': // русская R
                this.keys.restart = false;
                break;
        }
    }
}