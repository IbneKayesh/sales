# VideoVault

A local video library manager with a web-based player. Supports local folders, individual files, YouTube embeds, RTSP streams, HTTP streams, and generic web links.

## Quick Start

```bash
node index.js
```

Open http://localhost:3000 in your browser.

---

## Project Structure

```
├── index.js              # Server entry point & routing
├── config.json           # Source configuration
├── lib/
│   ├── config.js         # Constants, config loader, file watcher
│   ├── scanner.js        # Recursive directory scanner
│   ├── video.js          # Video file serving (range requests)
│   ├── proxy.js          # CORS proxy for external links
│   ├── api.js            # /api/config and /api/library handlers
│   └── static.js         # Static file serving
├── scripts/
│   ├── dom.js            # DOM element references
│   ├── state.js          # Global state variables
│   ├── storage.js        # localStorage wrappers
│   ├── utils.js          # Formatting & utility functions
│   ├── toast.js          # Toast notifications
│   ├── youtube.js        # YouTube URL helpers
│   ├── thumbnail.js      # Thumbnail generation
│   ├── gallery.js        # Gallery rendering
│   ├── player.js         # Video player controls
│   ├── keyboard.js       # Keyboard & touch controls
│   ├── input.js          # File/folder/drag-drop input
│   ├── gallery-ui.js     # Gallery UI interactions
│   └── init.js           # App bootstrap
├── index.html
├── style.css
└── readme.md
```

---

## Configuration (config.json)

```json
{
  "folders": ["C:/Users/Me/Videos", "D:/Movies"],
  "files": ["C:/Users/Me/Downloads/clip.mp4"],
  "youtubes": ["https://www.youtube.com/watch?v=VIDEO_ID"],
  "rtsp": ["rtsp://admin:pass@192.168.1.50:554/stream"],
  "http": ["http://example.com/stream.m3u8"],
  "links": ["https://example.com/video.mp4"]
}
```

| Key | Type | Description |
|-----|------|-------------|
| folders | string[] | Local directories to scan recursively for video files |
| files | string[] | Individual local video file paths |
| youtubes | string[] | YouTube watch URLs (played via embed iframe) |
| rtsp | string[] | RTSP stream URLs (e.g. IP cameras) |
| http | string[] | HTTP video stream URLs |
| links | string[] | Generic web video links (proxied to avoid CORS) |

**Supported video formats:** MP4, WebM, OGG, OGV, MOV, AVI, MKV, M4V, FLV, WMV

> config.json is watched for changes -- edits take effect on the next page load without restarting the server.

---

## API Endpoints

Base URL: http://localhost:3000

### GET /api/config

Returns the raw contents of config.json.

**Response:**
```json
{
  "folders": ["C:/Users/Me/Videos"],
  "files": [],
  "youtubes": ["https://www.youtube.com/watch?v=abc123"],
  "rtsp": [],
  "http": [],
  "links": []
}
```

---

### GET /api/library

Scans all configured sources and returns a grouped library of videos.

**Response:**
```json
{
  "Videos": {
    "path": "C:/Users/Me/Videos",
    "videos": [
      {
        "name": "clip.mp4",
        "path": "/video?path=clip.mp4&folder=Videos",
        "size": 1048576,
        "lastModified": 1700000000000
      }
    ]
  },
  "Files": {
    "path": "Configured Files",
    "videos": [
      {
        "name": "intro.mp4",
        "path": "/file?path=C%3A%2FUsers%2FMe%2Fintro.mp4",
        "size": 2097152,
        "lastModified": 1700000000000
      }
    ]
  },
  "YouTube": {
    "path": "YouTube Videos",
    "videos": [
      {
        "name": "YouTube: abc123",
        "path": "https://www.youtube.com/watch?v=abc123",
        "size": 0,
        "lastModified": 1700000000000,
        "isLink": true,
        "isYouTube": true
      }
    ]
  },
  "RTSP": {
    "path": "RTSP Streams",
    "videos": [
      {
        "name": "RTSP: 192.168.1.50",
        "path": "rtsp://admin:pass@192.168.1.50:554/stream",
        "size": 0,
        "lastModified": 1700000000000,
        "isLink": true,
        "isRTSP": true
      }
    ]
  },
  "HTTP": {
    "path": "HTTP Streams",
    "videos": [
      {
        "name": "stream.m3u8",
        "path": "http://example.com/stream.m3u8",
        "size": 0,
        "lastModified": 1700000000000,
        "isLink": true,
        "isHTTP": true
      }
    ]
  },
  "Links": {
    "path": "Web Links",
    "videos": [
      {
        "name": "video.mp4",
        "path": "https://example.com/video.mp4",
        "size": 0,
        "lastModified": 1700000000000,
        "isLink": true
      }
    ]
  }
}
```

Each group key is the folder/section name shown in the gallery. Groups with zero videos are omitted.

**Video entry fields:**

| Field | Type | Description |
|-------|------|-------------|
| name | string | Display name (filename or generated from URL) |
| path | string | Internal path to stream the video (relative URL) |
| size | number | File size in bytes (0 for links) |
| lastModified | number | Last modified timestamp (ms) |
| isLink | boolean | true for external links (YouTube, RTSP, HTTP, generic) |
| isYouTube | boolean | true for YouTube URLs |
| isRTSP | boolean | true for RTSP stream URLs |
| isHTTP | boolean | true for HTTP stream URLs |

---

### GET /video?path={name}&folder={folder}

Streams a video file from a configured folder. Supports HTTP range requests for seeking.

**Parameters:**

| Param | Type | Description |
|-------|------|-------------|
| path | string | Filename (e.g. clip.mp4) |
| folder | string | Folder name as returned by /api/library |

**Response:** Video stream with Content-Type: video/* and Accept-Ranges: bytes.

**Status codes:**

| Code | Meaning |
|------|---------|
| 200 | Full video stream |
| 206 | Partial content (range request) |
| 400 | Missing parameters |
| 403 | File extension not in allowed list |
| 404 | Folder or file not found |

---

### GET /file?path={fullPath}

Streams an individual file by its absolute path.

**Parameters:**

| Param | Type | Description |
|-------|------|-------------|
| path | string | Absolute file path (URL-encoded) |

**Response:** Video stream with range request support.

**Status codes:**

| Code | Meaning |
|------|---------|
| 200 / 206 | Video stream |
| 400 | Missing path parameter |
| 403 | File extension not in allowed list |
| 500 | Server error |

---

### GET /proxy?url={targetUrl}

Proxies requests to external URLs to avoid CORS restrictions. Used for web links, HTTP streams, etc.

**Parameters:**

| Param | Type | Description |
|-------|------|-------------|
| url | string | Target URL to proxy (URL-encoded) |

**Response:** Proxied response from the target server with CORS headers added.

**Status codes:**

| Code | Meaning |
|------|---------|
| 200 | Proxied response |
| 400 | Missing url parameter |
| 403 | Non-HTTP/HTTPS protocol |
| 500 | Proxy error |
| 502 | Upstream server error |

---

### GET /{file}

Serves static files from the project root (HTML, CSS, JS, etc.).

**Examples:**
- GET / -> index.html
- GET /style.css -> style.css
- GET /scripts/dom.js -> scripts/dom.js

**Status codes:**

| Code | Meaning |
|------|---------|
| 200 | File served |
| 403 | Path traversal attempt |
| 404 | File not found |

---

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| Space | Play / Pause |
| Left Arrow | Rewind 10s |
| Right Arrow | Forward 10s |
| Shift + Left Arrow | Previous video |
| Shift + Right Arrow | Next video |
| Up Arrow | Volume up |
| Down Arrow | Volume down |
| M | Mute / Unmute |
| F | Fullscreen |
| L | Toggle loop |
| Esc | Close player / Exit fullscreen |

---

## Mobile Touch Controls

- **Tap center** -- Play / Pause
- **Tap left third** -- Rewind 10s
- **Tap right third** -- Forward 10s
- **Horizontal swipe** -- Seek
- **Vertical swipe (right half)** -- Volume

---

## RTSP Example

```json
{
  "rtsp": [
    "rtsp://admin:YOUR_PASSWORD@192.168.1.50:554/cam/realmonitor?channel=1&subtype=0",
    "rtsp://admin:YOUR_PASSWORD@192.168.1.50:554/cam/realmonitor?channel=1&subtype=1"
  ]
}
```

Test with VLC first:
```
rtsp://ad
