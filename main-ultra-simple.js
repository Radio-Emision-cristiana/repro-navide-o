// ========================================
// REPRODUCTOR ULTRA SIMPLE - SOLO LO ESENCIAL
// ========================================

console.log('🚀 Cargando reproductor ultra simple...');

const audio = document.getElementById('audio-player');
const miniPlayButton = document.getElementById('mini-play-button');
const miniVolumeSlider = document.getElementById('mini-volume-slider');
const miniEqualizerContainer = document.querySelector('.mini-equalizer-container');
const liveIndicator = document.querySelector('.live-indicator');

let isPlaying = false;

// ========================================
// FUNCIÓN PRINCIPAL: PLAY/PAUSE
// ========================================
function togglePlayStop() {
    console.log('🎵 Toggle play/stop - isPlaying:', isPlaying);
    
    if (isPlaying) {
        // PAUSAR
        console.log('⏸️ Pausando...');
        audio.pause();
    } else {
        // REPRODUCIR
        console.log('▶️ Reproduciendo...');
        audio.play()
            .then(() => {
                console.log('✅ Audio started successfully');
            })
            .catch(error => {
                console.error('❌ Audio error:', error);
            });
    }
}

// ========================================
// ANIMACIÓN SIMPLE DEL VISUALIZADOR
// ========================================
function activateVisualizer() {
    console.log('📊 Activando visualizador...');
    
    const bars = document.querySelectorAll('.mini-equalizer-bar');
    console.log('Barras encontradas:', bars.length);
    
    if (bars.length === 0) {
        console.error('❌ No se encontraron barras del visualizador');
        return;
    }
    
    // Activar animación CSS simple
    bars.forEach((bar, index) => {
        bar.style.animation = `fallbackEqualize ${0.8 + (index % 3) * 0.2}s ease-in-out infinite`;
        bar.style.animationDelay = `${(index * 0.03)}s`;
        bar.style.height = '';
    });
    
    console.log('✅ Visualizador activado');
}

function deactivateVisualizer() {
    console.log('📊 Desactivando visualizador...');
    
    const bars = document.querySelectorAll('.mini-equalizer-bar');
    
    bars.forEach(bar => {
        bar.style.animation = 'none';
        bar.style.height = '10%';
    });
    
    console.log('✅ Visualizador desactivado');
}

// ========================================
// ACTUALIZAR ESTADO VISUAL
// ========================================
function updateUI(playing) {
    console.log('🔄 Actualizando UI - playing:', playing);
    
    isPlaying = playing;
    
    if (playing) {
        // ESTADO: REPRODUCIENDO
        miniPlayButton.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" width="25" height="25">
                <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
            </svg>
        `;
        miniPlayButton.classList.add('playing');
        
        // Activar visualizador
        activateVisualizer();
        
        // Mostrar indicador EN VIVO
        if (liveIndicator) {
            liveIndicator.style.display = 'flex';
        }
        
        console.log('✅ UI actualizada - REPRODUCIENDO');
        
    } else {
        // ESTADO: PAUSADO
        miniPlayButton.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" width="25" height="25">
                <path d="M8 5v14l11-7z"/>
            </svg>
        `;
        miniPlayButton.classList.remove('playing');
        
        // Desactivar visualizador
        deactivateVisualizer();
        
        // Ocultar indicador EN VIVO
        if (liveIndicator) {
            liveIndicator.style.display = 'none';
        }
        
        console.log('✅ UI actualizada - PAUSADO');
    }
}

// ========================================
// EVENT LISTENERS
// ========================================

// Click en botón de play
if (miniPlayButton) {
    miniPlayButton.addEventListener('click', togglePlayStop);
    console.log('✅ Event listener del botón configurado');
} else {
    console.error('❌ No se encontró el botón de play');
}

// Control de volumen
if (miniVolumeSlider) {
    miniVolumeSlider.addEventListener('input', function() {
        audio.volume = this.value;
        console.log('🔊 Volumen:', this.value);
    });
    console.log('✅ Control de volumen configurado');
}

// Audio events
if (audio) {
    audio.addEventListener('play', () => {
        console.log('🎵 Audio PLAY event');
        updateUI(true);
    });
    
    audio.addEventListener('pause', () => {
        console.log('⏸️ Audio PAUSE event');
        updateUI(false);
    });
    
    audio.addEventListener('error', (e) => {
        console.error('❌ Audio ERROR:', e);
        updateUI(false);
    });
    
    audio.addEventListener('canplay', () => {
        console.log('✅ Audio CAN PLAY');
    });
    
    console.log('✅ Event listeners del audio configurados');
} else {
    console.error('❌ No se encontró el elemento de audio');
}

// ========================================
// INICIALIZACIÓN
// ========================================
function initPlayer() {
    console.log('🔧 Inicializando reproductor...');
    
    // Estado inicial
    updateUI(false);
    
    // Intentar autoplay después de un momento
    setTimeout(() => {
        console.log('🚀 Intentando autoplay...');
        
        if (audio) {
            audio.play()
                .then(() => {
                    console.log('✅ Autoplay exitoso');
                })
                .catch(error => {
                    console.log('⚠️ Autoplay bloqueado (normal):', error.message);
                });
        }
    }, 1000);
    
    console.log('✅ Reproductor inicializado');
}

// Cargar cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPlayer);
} else {
    initPlayer();
}

console.log('📝 Script ultra simple cargado completamente');
