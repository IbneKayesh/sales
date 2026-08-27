/* ============================================
   VideoVault — State
   ============================================ */

let allVideos      = [];
let currentIndex   = -1;
let objectURLs     = {};
let controlsTimer  = null;
let hideTimer      = null;
let isSeeking      = false;
let videoIdCounter = 0;

// Gallery rendering state
let renderedIds   = [];
let cardElements  = {};

// UI state
let showFavoritesOnly = false;
let isCompact         = false;

// Touch state
let touchStartX     = 0;
let touchStartY     = 0;
let touchStartTime  = 0;
let touchOverlay    = null;
let touchHandled    = false;
