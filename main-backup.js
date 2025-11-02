const audio = document.getElementById('audio-player');

// Variables para Web Audio API
let audioContext;
let analyser;
let dataArray;
let source;
let isAudioContextSetup = false;
const songTitle = document.getElementById('song-title');
const artistName = document.getElementById('artist-name');
const albumCover = document.getElementById('album-cover');
const equalizerContainer = document.querySelector('.equalizer-container');

// Elementos del mini reproductor
const miniSongTitle = document.getElementById('mini-song-title');
const miniArtistName = document.getElementById('mini-artist-name');
const miniAlbumCover = document.getElementById('mini-album-cover');
const miniPlayButton = document.getElementById('mini-play-button');
const miniVolumeSlider = document.getElementById('mini-volume-slider');
const liveIndicator = document.querySelector('.live-indicator');
const miniEqualizerContainer = document.querySelector('.mini-equalizer-container');

let songStartTime = 0;
let songDuration = 0;
let isPlaying = false;
let currentSongIndex = 0;
let playlist = [];
let reconnectAttempts = 0;
let maxReconnectAttempts = 5;
let reconnectDelay = 3000; // 3 segundos

function togglePlayStop() {
  console.log('Toggle play/stop - Estado actual:', isPlaying);
  
  if (isPlaying) {
    console.log('Pausando audio...');
    audio.pause();
  } else {
    console.log('Reproduciendo audio...');
    
    audio.play().then(() => {
      console.log('Audio reproduciéndose exitosamente');
      
      // Configurar Audio Context solo después de que el audio funcione
      if (!isAudioContextSetup) {
        setupAudioContext();
      }
      
      // Reanudar Audio Context si está suspendido
      if (audioContext && audioContext.state === 'suspended') {
        audioContext.resume();
      }
    }).catch(error => {
      console.log('Error al reproducir:', error);
      attemptReconnect();
    });
  }
}

// Control de volumen solo desde el mini reproductor
miniVolumeSlider.addEventListener('input', function() {
  audio.volume = this.value;
});

function updateMetadata(title, artist, coverUrl = 'portada.jpg') {
  // Actualizar reproductor principal
  songTitle.textContent = title;
  artistName.textContent = artist;
  albumCover.src = coverUrl;
  
  // Actualizar mini reproductor
  miniSongTitle.textContent = title;
  miniArtistName.textContent = artist;
  miniAlbumCover.src = coverUrl;
}

function fetchAlbumCover(artist, title) {
  fetchItunesData(artist, title).then(data => {
    if (data.artworkUrl100) {
      const albumCoverUrl = data.artworkUrl100.replace('100x100', '600x600');
      updateMetadata(title, artist, albumCoverUrl);
      songDuration = data.trackTimeMillis ? data.trackTimeMillis / 1000 : 0;
    } else {
      updateMetadata(title, artist, 'portada.jpg');
      songDuration = 0;
    }
  });
}

function playSong(song) {
  updateMetadata(song.title, song.artist);
  fetchAlbumCover(song.artist, song.title);
  songStartTime = Date.now();
}

function startMetadataUpdates() {
  const eventSource = new EventSource('https://api.zeno.fm/mounts/metadata/subscribe/yg7bvksbfwzuv');

  eventSource.onmessage = function(event) {
    const data = JSON.parse(event.data);
    if (data.streamTitle) {
      const parts = data.streamTitle.split(' - ');
      if (parts.length >= 2) {
        const artist = parts.pop();
        const title = parts.join(' - ');
        
        const newSong = { artist, title };
        if (!playlist.some(song => song.artist === artist && song.title === title)) {
          playlist.push(newSong);
        }
        
        currentSongIndex = playlist.findIndex(song => song.artist === artist && song.title === title);
        
        updateMetadata(title, artist);
        fetchAlbumCover(artist, title);
        songStartTime = Date.now();
      } else {
        updateMetadata(data.streamTitle, 'Artista desconocido', 'portada.jpg');
        songDuration = 0;
      }
    }
  };

  eventSource.onerror = function(error) {
    console.error('Error en la conexión EventSource:', error);
    eventSource.close();
    setTimeout(startMetadataUpdates, 5000);
  };
}

function fetchItunesData(artist, title) {
  const itunesApiUrl = `https://itunes.apple.com/search?term=${encodeURIComponent(artist + ' ' + title)}&entity=song&limit=1`;
  return fetch(itunesApiUrl)
    .then(response => response.json())
    .then(data => {
      if (data.results && data.results.length > 0) {
        return data.results[0];
      }
      return {};
    })
    .catch(error => {
      console.error('Error fetching iTunes data:', error);
      return {};
    });
}

// Función para toggle de tema
function toggleTheme() {
  const body = document.body;
  const themeToggle = document.getElementById('theme-toggle');
  const sunIcon = themeToggle.querySelector('.sun-icon');
  const moonIcon = themeToggle.querySelector('.moon-icon');
  
  body.classList.toggle('dark-theme');
  
  if (body.classList.contains('dark-theme')) {
    // Cambiar a modo oscuro
    sunIcon.style.display = 'none';
    moonIcon.style.display = 'block';
    localStorage.setItem('theme', 'dark');
  } else {
    // Cambiar a modo claro
    sunIcon.style.display = 'block';
    moonIcon.style.display = 'none';
    localStorage.setItem('theme', 'light');
  }
}

// Cargar tema guardado o usar modo claro por defecto
function loadTheme() {
  const savedTheme = localStorage.getItem('theme');
  const body = document.body;
  const themeToggle = document.getElementById('theme-toggle');
  const sunIcon = themeToggle.querySelector('.sun-icon');
  const moonIcon = themeToggle.querySelector('.moon-icon');
  
  if (savedTheme === 'dark') {
    body.classList.add('dark-theme');
    sunIcon.style.display = 'none';
    moonIcon.style.display = 'block';
  } else {
    // Modo claro por defecto
    body.classList.remove('dark-theme');
    sunIcon.style.display = 'block';
    moonIcon.style.display = 'none';
  }
}

// Funciones para Web Audio API
function setupAudioContext() {
  if (isAudioContextSetup) return;
  
  try {
    console.log('Configurando Audio Context...');
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    analyser = audioContext.createAnalyser();
    
    // IMPORTANTE: Solo crear el source una vez
    if (!source) {
      source = audioContext.createMediaElementSource(audio);
      source.connect(analyser);
      // CRÍTICO: Conectar al destino para que se escuche el audio
      analyser.connect(audioContext.destination);
    }
    
    analyser.fftSize = 256;
    analyser.smoothingTimeConstant = 0.8;
    const bufferLength = analyser.frequencyBinCount;
    dataArray = new Uint8Array(bufferLength);
    
    isAudioContextSetup = true;
    console.log('Audio context configurado correctamente. Buffer length:', bufferLength);
  } catch (error) {
    console.error('Error al configurar Web Audio API:', error);
    isAudioContextSetup = false;
  }
}

function updateVisualizer() {
  if (!analyser || !dataArray || !isPlaying) {
    return;
  }
  
  analyser.getByteFrequencyData(dataArray);
  
  const bars = document.querySelectorAll('.mini-equalizer-bar');
  if (bars.length === 0) {
    console.log('No se encontraron barras del visualizador');
    return;
  }
  
  const step = Math.floor(dataArray.length / bars.length);
  
  bars.forEach((bar, index) => {
    const dataIndex = index * step;
    const value = dataArray[dataIndex];
    const height = (value / 255) * 80 + 10; // 10-90% del contenedor
    
    // Aplicar altura basada en frecuencia real
    bar.style.height = `${height}%`;
    bar.style.animation = 'none'; // Desactivar animación CSS cuando usamos datos reales
  });
  
  if (isPlaying) {
    requestAnimationFrame(updateVisualizer);
  }
}

// Función para activar/desactivar animación fallback
function toggleFallbackAnimation(enable) {
  const bars = document.querySelectorAll('.mini-equalizer-bar');
  console.log(`toggleFallbackAnimation(${enable}) - Barras encontradas: ${bars.length}`);
  
  if (bars.length === 0) {
    console.error('No se encontraron barras del visualizador!');
    // Intentar con el visualizador principal también
    const mainBars = document.querySelectorAll('.equalizer-bar');
    console.log(`Barras principales encontradas: ${mainBars.length}`);
    return;
  }
  
  bars.forEach((bar, index) => {
    if (enable) {
      const duration = 0.8 + (index % 5) * 0.3;
      const delay = (index * 0.05);
      bar.style.animation = `fallbackEqualize ${duration}s ease-in-out infinite`;
      bar.style.animationDelay = `${delay}s`;
      bar.style.height = ''; // Limpiar altura fija
      console.log(`Barra ${index}: animación ${duration}s, delay ${delay}s`);
    } else {
      bar.style.animation = 'none';
      bar.style.height = '10%'; // Altura mínima visible
    }
  });
}

// Función para verificar si el audio está realmente reproduciendo
function checkAudioPlayback() {
  console.log('Estado del audio:');
  console.log('- Paused:', audio.paused);
  console.log('- Current Time:', audio.currentTime);
  console.log('- Ready State:', audio.readyState);
  console.log('- Source:', audio.src);
  console.log('- Audio Context State:', audioContext ? audioContext.state : 'No creado');
}

// Funciones para manejo de autoplay y reconexión
function updatePlayingState(playing) {
  console.log('updatePlayingState llamada con:', playing);
  isPlaying = playing;
  
  if (playing) {
    console.log('=== INICIANDO REPRODUCCIÓN ===');
    
    // Actualizar botón del mini reproductor
    miniPlayButton.innerHTML = `
      <svg class="mini-pause-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" width="25" height="25">
        <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
      </svg>
    `;
    miniPlayButton.classList.add('playing');
    
    // Activar visualizadores
    equalizerContainer.classList.remove('paused');
    miniEqualizerContainer.classList.remove('paused');
    
    // Activar animación CSS como fallback confiable
    console.log('Activando animación CSS...');
    toggleFallbackAnimation(true);
    
    // Configurar Web Audio API solo en primera interacción
    if (!isAudioContextSetup) {
      setupAudioContext();
    }
    
    // Reanudar AudioContext si existe y está suspendido
    if (audioContext && audioContext.state === 'suspended') {
      audioContext.resume().then(() => {
        console.log('AudioContext reanudado');
      });
    }
    
    // Iniciar visualizador con datos reales si está disponible
    if (isAudioContextSetup && audioContext && audioContext.state === 'running') {
      console.log('Iniciando visualizador con datos reales...');
      updateVisualizer();
    }
    
    // Mostrar indicador EN VIVO
    liveIndicator.style.display = 'flex';
    
  } else {
    console.log('=== PAUSANDO REPRODUCCIÓN ===');
    
    // Actualizar botón del mini reproductor
    miniPlayButton.innerHTML = `
      <svg class="mini-play-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" width="25" height="25">
        <path d="M8 5v14l11-7z"/>
      </svg>
    `;
    miniPlayButton.classList.remove('playing');
    
    // Pausar visualizadores
    equalizerContainer.classList.add('paused');
    miniEqualizerContainer.classList.add('paused');
    
    // Detener animación
    toggleFallbackAnimation(false);
    
    // Ocultar indicador EN VIVO
    liveIndicator.style.display = 'none';
  }
}

function attemptReconnect() {
  if (reconnectAttempts < maxReconnectAttempts) {
    reconnectAttempts++;
    console.log(`Intentando reconexión ${reconnectAttempts}/${maxReconnectAttempts}...`);
    
    setTimeout(() => {
      audio.load();
      audio.play().then(() => {
        console.log('Reconexión exitosa');
        reconnectAttempts = 0;
        updatePlayingState(true);
      }).catch(error => {
        console.log('Error en reconexión:', error);
        attemptReconnect();
      });
    }, reconnectDelay);
  } else {
    console.log('Máximo de intentos de reconexión alcanzado');
    updatePlayingState(false);
  }
}

// Event listener para el botón de play del mini reproductor
miniPlayButton.addEventListener('click', togglePlayStop);

// Event listeners para el audio
audio.addEventListener('play', () => {
  console.log('🎵 Evento PLAY detectado');
  updatePlayingState(true);
  reconnectAttempts = 0;
});

audio.addEventListener('pause', () => {
  console.log('⏸️ Evento PAUSE detectado');
  updatePlayingState(false);
});

audio.addEventListener('error', (e) => {
  console.error('❌ Error de audio:', e);
  updatePlayingState(false);
  attemptReconnect();
});

audio.addEventListener('stalled', () => {
  console.log('⚠️ Audio bloqueado, intentando reconectar...');
  attemptReconnect();
});

audio.addEventListener('loadstart', () => {
  console.log('📥 Iniciando carga de audio...');
});

audio.addEventListener('canplay', () => {
  console.log('✅ Audio listo para reproducir');
});

audio.addEventListener('waiting', () => {
  console.log('⏳ Audio esperando datos...');
});

audio.addEventListener('playing', () => {
  console.log('▶️ Audio realmente reproduciendo');
});

// Intentar autoplay al cargar la página
function startAutoplay() {
  console.log('=== INICIANDO AUTOPLAY ===');
  
  // Intentar reproducir
  audio.play().then(() => {
    console.log('=== AUTOPLAY EXITOSO ===');
    updatePlayingState(true);
  }).catch(error => {
    console.log('Autoplay bloqueado:', error.message);
    updatePlayingState(false);
  });
}

// Inicializar el estado inicial
equalizerContainer.classList.add('paused');
miniEqualizerContainer.classList.add('paused');
liveIndicator.style.display = 'none';

// Verificar que los elementos del visualizador existan
function checkVisualizerElements() {
  console.log('=== DIAGNÓSTICO DEL VISUALIZADOR ===');
  
  // Verificar elementos del mini visualizador
  const bars = document.querySelectorAll('.mini-equalizer-bar');
  const container = document.querySelector('.mini-equalizer-container');
  console.log(`Mini visualizador - Barras encontradas: ${bars.length}`);
  console.log(`Mini visualizador - Contenedor encontrado: ${container ? 'Sí' : 'No'}`);
  
  // Verificar elementos del visualizador principal
  const mainBars = document.querySelectorAll('.equalizer-bar');
  const mainContainer = document.querySelector('.equalizer-container');
  console.log(`Visualizador principal - Barras encontradas: ${mainBars.length}`);
  console.log(`Visualizador principal - Contenedor encontrado: ${mainContainer ? 'Sí' : 'No'}`);
  
  // Verificar audio
  const audioElement = document.getElementById('audio-player');
  console.log(`Audio element encontrado: ${audioElement ? 'Sí' : 'No'}`);
  if (audioElement) {
    console.log(`Audio src: ${audioElement.src}`);
    console.log(`Audio ready state: ${audioElement.readyState}`);
  }
  
  if (bars.length === 0) {
    console.error('❌ No se encontraron barras del mini visualizador');
    return false;
  }
  
  // Test inmediato de animación
  console.log('🧪 Probando animación CSS...');
  toggleFallbackAnimation(true);
  
  setTimeout(() => {
    console.log('✅ Test de animación completado');
    toggleFallbackAnimation(false);
  }, 3000);
  
  return true;
}

// Inicialización completa
function initializePlayer() {
  console.log('Inicializando reproductor...');
  
  // Verificar elementos
  checkVisualizerElements();
  
  // Cargar tema
  loadTheme();
  
  // Iniciar metadata
  startMetadataUpdates();
  
  // Intentar autoplay después de un pequeño delay
  setTimeout(() => {
    console.log('Iniciando autoplay...');
    startAutoplay();
  }, 1000);
}

// Inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializePlayer);
} else {
  initializePlayer();
}