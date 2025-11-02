// ========================================
// 🎄 EFECTOS NAVIDEÑOS - NIEVE BLANCA ❄️
// ========================================

console.log('🎄 Cargando efectos navideños...');

class ChristmasEffects {
    constructor() {
        this.snowEnabled = true; // Siempre activo
        this.christmasThemeEnabled = false;
        this.snowContainer = null;
        this.init();
    }

    init() {
        // Crear contenedor de efectos
        this.createSnowContainer();
        
        // Generar efectos navideños (nieve y bolas)
        this.createWinterEffects();
        
        // Aplicar tema navideño automáticamente
        this.enableChristmasTheme();
        
        console.log('❄️ Efectos navideños inicializados - Nieve blanca permanentemente activa');
    }

    createSnowContainer() {
        this.snowContainer = document.createElement('div');
        this.snowContainer.className = 'snowfall-container';
        this.snowContainer.id = 'snowfall-container';
        document.body.appendChild(this.snowContainer);
    }

    createWinterEffects() {
        // Limpiar efectos existentes
        if (this.snowContainer) {
            this.snowContainer.innerHTML = '';
        }

        // Crear 30 copos de nieve blanca
        for (let i = 0; i < 30; i++) {
            const snowflake = document.createElement('div');
            snowflake.className = 'snowflake';
            
            // Variedad de símbolos de nieve
            const snowSymbols = ['❄', '❅', '❆', '✻', '✼', '❈', '❉', '❊'];
            snowflake.textContent = snowSymbols[Math.floor(Math.random() * snowSymbols.length)];
            
            // Propiedades aleatorias
            snowflake.style.left = Math.random() * 100 + '%';
            snowflake.style.animationDuration = (Math.random() * 10 + 5) + 's';
            snowflake.style.animationDelay = Math.random() * 5 + 's';
            snowflake.style.fontSize = (Math.random() * 0.8 + 0.5) + 'em';
            snowflake.style.opacity = Math.random() * 0.6 + 0.4;
            
            this.snowContainer.appendChild(snowflake);
        }
    }



    enableChristmasTheme() {
        document.body.classList.add('christmas-theme');
        this.christmasThemeEnabled = true;
        
        // Agregar decoraciones navideñas a elementos específicos
        setTimeout(() => {
            this.addChristmasDecorations();
        }, 1000);
    }

    addChristmasDecorations() {
        // Agregar decoraciones a títulos principales
        const titles = document.querySelectorAll('h1, h2, .title, .demo-title');
        titles.forEach((title, index) => {
            if (index < 3) { // Solo a los primeros 3 títulos
                title.classList.add('christmas-decoration');
            }
        });

        // Agregar brillo navideño a botones importantes
        const importantButtons = document.querySelectorAll('.play-pause-btn, .demo-button');
        importantButtons.forEach(button => {
            button.style.background = 'linear-gradient(45deg, #c41e3a, #228b22)';
            button.style.boxShadow = '0 4px 15px rgba(196, 30, 58, 0.3)';
        });
    }

    // Método para agregar mensaje navideño personalizado
    addChristmasMessage() {
        const message = document.createElement('div');
        message.style.cssText = `
            position: fixed;
            bottom: 120px;
            left: 50%;
            transform: translateX(-50%);
            z-index: 1001;
            background: rgba(196, 30, 58, 0.9);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 215, 0, 0.5);
            border-radius: 25px;
            padding: 15px 25px;
            color: white;
            font-size: 0.9em;
            font-weight: 600;
            text-align: center;
            box-shadow: 0 8px 32px rgba(196, 30, 58, 0.4);
            animation: christmasGlow 2s ease-in-out infinite alternate;
            max-width: 90vw;
            text-shadow: 0 1px 3px rgba(0,0,0,0.5);
        `;
        message.innerHTML = '🎅 ¡Feliz Navidad! 🎄 Disfruta tu música navideña con nieve blanca permanente ❄️';
        
        // Agregar animación CSS
        const style = document.createElement('style');
        style.textContent = `
            @keyframes christmasGlow {
                0% { box-shadow: 0 8px 32px rgba(196, 30, 58, 0.4); }
                100% { box-shadow: 0 12px 40px rgba(255, 215, 0, 0.6); }
            }
        `;
        document.head.appendChild(style);
        
        document.body.appendChild(message);
        
        // Auto-ocultar después de 8 segundos
        setTimeout(() => {
            message.style.transition = 'all 1s ease';
            message.style.opacity = '0';
            message.style.transform = 'translateX(-50%) translateY(50px)';
            setTimeout(() => message.remove(), 1000);
        }, 8000);
        
        // En móviles, ajustar posición
        if (window.innerWidth <= 768) {
            message.style.bottom = '140px';
            message.style.fontSize = '0.8em';
            message.style.padding = '12px 20px';
        }
    }

    // Método para actualizar metadata con toque navideño
    updateMetadataWithChristmas(originalTitle, originalArtist) {
        if (!this.christmasThemeEnabled) return { originalTitle, originalArtist };
        
        // Agregar emojis navideños ocasionalmente
        const christmasEmojis = ['🎄', '❄️', '🎅', '🎁', '⭐', '🔔', '🎵'];
        const shouldAddEmoji = Math.random() < 0.3; // 30% de probabilidad
        
        if (shouldAddEmoji) {
            const emoji = christmasEmojis[Math.floor(Math.random() * christmasEmojis.length)];
            return {
                title: `${emoji} ${originalTitle}`,
                artist: originalArtist
            };
        }
        
        return { title: originalTitle, artist: originalArtist };
    }

    // Intensificar efectos durante la reproducción
    intensifyEffects() {
        if (this.snowContainer) {
            this.snowContainer.style.animationPlayState = 'running';
            
            // Agregar más copos de nieve temporalmente
            for (let i = 0; i < 10; i++) {
                const snowflake = document.createElement('div');
                snowflake.className = 'snowflake';
                snowflake.textContent = '❄';
                snowflake.style.left = Math.random() * 100 + '%';
                snowflake.style.animationDuration = (Math.random() * 3 + 2) + 's';
                snowflake.style.fontSize = (Math.random() * 0.5 + 0.3) + 'em';
                snowflake.style.opacity = Math.random() * 0.8 + 0.2;
                this.snowContainer.appendChild(snowflake);
            }
        }
    }

    // Normalizar efectos cuando se pausa
    normalizeEffects() {
        if (this.snowContainer) {
            // Remover efectos extra después de un tiempo
            setTimeout(() => {
                const allEffects = this.snowContainer.querySelectorAll('.snowflake');
                if (allEffects.length > 30) { // 30 copos base
                    for (let i = 30; i < allEffects.length; i++) {
                        allEffects[i].remove();
                    }
                }
            }, 3000);
        }
    }
}

// ========================================
// 🎄 INICIALIZACIÓN AUTOMÁTICA
// ========================================

// Inicializar efectos navideños cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    console.log('🎄 DOM listo, inicializando efectos navideños...');
    
    // Crear instancia global de efectos navideños
    window.christmasEffects = new ChristmasEffects();
    
    // Mostrar mensaje de bienvenida navideño
    setTimeout(() => {
        window.christmasEffects.addChristmasMessage();
    }, 2000);
    
    // Escuchar eventos de reproducción para intensificar efectos
    document.addEventListener('play', function() {
        if (window.christmasEffects) {
            window.christmasEffects.intensifyEffects();
        }
    }, true);
    
    document.addEventListener('pause', function() {
        if (window.christmasEffects) {
            window.christmasEffects.normalizeEffects();
        }
    }, true);
});

// Si el DOM ya está cargado (script cargado después)
if (document.readyState === 'loading') {
    // Esperando a que termine de cargar
} else {
    // DOM ya cargado
    console.log('🎄 DOM ya cargado, inicializando efectos navideños...');
    window.christmasEffects = new ChristmasEffects();
    setTimeout(() => {
        window.christmasEffects.addChristmasMessage();
    }, 1000);
}

console.log('❄️ Script de efectos navideños cargado completamente');