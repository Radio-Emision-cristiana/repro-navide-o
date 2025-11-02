// ========================================
// CONFIGURACIÓN DEL REPRODUCTOR DE RADIO
// ========================================

const RADIO_CONFIG = {
    // Configuración del Stream de Radio
    stream: {
        // URL del metadata de Zeno.fm - Cambia por tu stream
        metadataUrl: 'https://api.zeno.fm/mounts/metadata/subscribe/yg7bvksbfwzuv',
        
        // URL del audio stream (se configura automáticamente desde Zeno.fm)
        audioUrl: '', // Se obtiene automáticamente
        
        // Nombre de la radio
        radioName: 'Tu Radio FM',
        
        // Descripción por defecto cuando no hay canción
        defaultTitle: 'Radio En Vivo',
        defaultArtist: 'Música en Directo'
    },
    
    // Configuración de Carátulas
    artwork: {
        // Imagen por defecto
        defaultCover: 'portada.jpg',
        
        // Usar iTunes API para buscar carátulas automáticamente
        useItunesAPI: true,
        
        // Tamaño de carátula de iTunes (100, 600, 1000)
        itunesSize: '600x600'
    },
    
    // Configuración de Redes Sociales
    social: {
        facebook: {
            enabled: true,
            url: 'https://facebook.com/tu-radio',
            shareText: 'Escuchando música increíble en'
        },
        
        instagram: {
            enabled: true,
            url: 'https://instagram.com/tu-radio'
        },
        
        twitter: {
            enabled: true,
            url: 'https://twitter.com/tu-radio',
            shareText: 'Escuchando en vivo'
        },
        
        gmail: {
            enabled: true,
            subject: 'Te recomiendo esta radio',
            body: 'Hola! Te quería recomendar esta increíble radio online:'
        }
    },
    
    // Configuración de Audio
    audio: {
        // Volumen inicial (0.0 a 1.0)
        defaultVolume: 0.7,
        
        // Preload del audio
        preload: 'none',
        
        // Mostrar controles nativos del navegador
        showNativeControls: false
    },
    
    // Configuración Visual
    ui: {
        // Mostrar visualizador/ecualizador
        showVisualizer: true,
        
        // Mostrar indicador de "En Vivo"
        showLiveIndicator: true,
        
        // Actualizar título de la página con la canción actual
        updatePageTitle: true,
        
        // Mostrar mini reproductor
        showMiniPlayer: true,
        
        // Tema de color principal
        primaryColor: '#00ff99',
        
        // Efectos de glassmorphism
        glassEffects: true
    },
    
    // Configuración de Metadata
    metadata: {
        // Intervalo de actualización en milisegundos (0 = automático)
        updateInterval: 0,
        
        // Reintentar conexión si falla
        retryOnError: true,
        
        // Tiempo entre reintentos en milisegundos
        retryInterval: 5000,
        
        // Máximo número de reintentos
        maxRetries: 10
    },
    
    // Configuración de Debug
    debug: {
        // Mostrar logs en consola
        enableLogs: true,
        
        // Nivel de logging: 'info', 'warn', 'error'
        logLevel: 'info',
        
        // Mostrar información de red
        showNetworkInfo: false
    }
};

// ========================================
// INSTRUCCIONES DE PERSONALIZACIÓN
// ========================================

/*
CÓMO PERSONALIZAR TU REPRODUCTOR:

1. CAMBIAR LA RADIO:
   - Modifica 'stream.metadataUrl' con tu URL de metadata de Zeno.fm
   - Cambia 'stream.radioName' por el nombre de tu radio

2. PERSONALIZAR REDES SOCIALES:
   - Actualiza las URLs en la sección 'social'
   - Cambia los textos de compartir

3. MODIFICAR COLORES:
   - Cambia 'ui.primaryColor' por tu color preferido
   - Edita el archivo styles.css para cambios más profundos

4. CONFIGURAR CARÁTULAS:
   - Reemplaza 'portada.jpg' por tu imagen por defecto
   - Desactiva iTunes API si no quieres carátulas automáticas

5. AJUSTAR AUDIO:
   - Modifica 'audio.defaultVolume' para el volumen inicial
   - Activa/desactiva funcionalidades en 'ui'

ARCHIVOS PRINCIPALES A MODIFICAR:
- Este archivo (config.js) para configuración básica
- styles.css para cambios visuales profundos
- mision.html o main.js para funcionalidades avanzadas

NOTA: Después de modificar esta configuración, debes aplicar
los cambios en main.js reemplazando los valores hardcodeados.
*/

// Exportar configuración para uso en el reproductor
if (typeof module !== 'undefined' && module.exports) {
    module.exports = RADIO_CONFIG;
}