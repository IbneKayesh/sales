import { useCallback, useEffect, useRef, useState } from 'react'
import {
  Download,
  FileAudio,
  Loader2,
  Pause,
  Play,
  RotateCcw,
  RotateCw,
  Trash2,
  Upload,
  Volume1,
  Volume2,
  VolumeX,
} from 'lucide-react'
import { cx } from '../lib/format.js'

function formatTime(seconds) {
  if (isNaN(seconds) || seconds == null || !isFinite(seconds)) return '00:00'
  const total = Math.floor(seconds)
  const hrs = Math.floor(total / 3600)
  const mins = Math.floor((total % 3600) / 60)
  const secs = total % 60
  if (hrs > 0) {
    return `${hrs}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
  }
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
}

const SPEEDS = [0.75, 1, 1.25, 1.5, 2]

export default function AudioPlayer({
  src,
  title = 'Audio recording',
  downloadUrl,
  onDelete,
  onReplace,
  compact = false,
  className = '',
}) {
  const audioRef = useRef(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [speed, setSpeed] = useState(1)
  const [volume, setVolume] = useState(1)
  const [isMuted, setIsMuted] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showSpeedMenu, setShowSpeedMenu] = useState(false)

  // Reset playback state when source URL changes
  useEffect(() => {
    setIsPlaying(false)
    setCurrentTime(0)
    setDuration(0)
    setIsLoading(true)
    setError(null)
    if (audioRef.current) {
      audioRef.current.load()
    }
  }, [src])

  useEffect(() => {
    const audio = audioRef.current
    return () => {
      if (audio) {
        audio.pause()
        audio.removeAttribute('src')
        audio.load()
      }
    }
  }, [])

  const togglePlay = useCallback(() => {
    const audio = audioRef.current
    if (!audio) return
    if (isPlaying) {
      audio.pause()
    } else {
      audio.play().catch(() => {
        setError('Playback failed. Please click play again.')
      })
    }
  }, [isPlaying])

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime)
    }
  }

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration)
      setIsLoading(false)
    }
  }

  const handleSeek = (e) => {
    const seekTime = Number(e.target.value)
    setCurrentTime(seekTime)
    if (audioRef.current) {
      audioRef.current.currentTime = seekTime
    }
  }

  const skip = (delta) => {
    if (!audioRef.current) return
    const nextTime = Math.min(Math.max(audioRef.current.currentTime + delta, 0), duration || 999999)
    audioRef.current.currentTime = nextTime
    setCurrentTime(nextTime)
  }

  const changeSpeed = (rate) => {
    setSpeed(rate)
    if (audioRef.current) {
      audioRef.current.playbackRate = rate
    }
    setShowSpeedMenu(false)
  }

  const handleVolumeChange = (e) => {
    const newVol = Number(e.target.value)
    setVolume(newVol)
    setIsMuted(newVol === 0)
    if (audioRef.current) {
      audioRef.current.volume = newVol
      audioRef.current.muted = newVol === 0
    }
  }

  const toggleMute = () => {
    if (!audioRef.current) return
    if (isMuted) {
      audioRef.current.muted = false
      setIsMuted(false)
      audioRef.current.volume = volume || 1
    } else {
      audioRef.current.muted = true
      setIsMuted(true)
    }
  }

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0

  return (
    <div
      className={cx(
        'rounded-xl border border-stone-200 bg-stone-50/80 p-3 sm:p-4 shadow-xs transition-colors',
        className,
      )}
    >
      <audio
        ref={audioRef}
        src={src}
        preload="metadata"
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onWaiting={() => setIsLoading(true)}
        onCanPlay={() => setIsLoading(false)}
        onEnded={() => setIsPlaying(false)}
        onError={() => {
          setIsLoading(false)
          setError('Failed to load audio.')
        }}
      />

      {/* Header bar: File title and secondary actions */}
      <div className="mb-3 flex items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2">
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-stone-200/80 text-stone-700">
            <FileAudio className="h-4 w-4" aria-hidden="true" />
          </div>
          <div className="min-w-0">
            <p className="truncate text-xs font-medium text-stone-800" title={title}>
              {title}
            </p>
            <p className="text-[11px] text-stone-400">
              {isLoading ? 'Loading audio…' : error ? error : `${formatTime(currentTime)} / ${formatTime(duration)}`}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          {downloadUrl ? (
            <a
              href={downloadUrl}
              download
              className="inline-flex h-7 w-7 items-center justify-center rounded-md text-stone-500 hover:bg-stone-200/60 hover:text-stone-800"
              title="Download audio"
              aria-label="Download audio file"
            >
              <Download className="h-3.5 w-3.5" />
            </a>
          ) : null}

          {onReplace ? (
            <button
              type="button"
              onClick={onReplace}
              className="inline-flex h-7 w-7 items-center justify-center rounded-md text-stone-500 hover:bg-stone-200/60 hover:text-stone-800"
              title="Replace audio"
              aria-label="Replace audio file"
            >
              <Upload className="h-3.5 w-3.5" />
            </button>
          ) : null}

          {onDelete ? (
            <button
              type="button"
              onClick={onDelete}
              className="inline-flex h-7 w-7 items-center justify-center rounded-md text-stone-400 hover:bg-rose-50 hover:text-rose-600"
              title="Delete audio"
              aria-label="Delete audio file"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          ) : null}
        </div>
      </div>

      {/* Progress scrubber */}
      <div className="group relative mb-2 flex items-center">
        <input
          type="range"
          min="0"
          max={duration || 100}
          value={currentTime}
          onChange={handleSeek}
          disabled={!duration}
          aria-label="Seek audio timeline"
          className="h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-stone-200 accent-stone-800 transition-all focus:outline-hidden disabled:opacity-40"
          style={{
            background: `linear-gradient(to right, #44403c 0%, #44403c ${progressPercent}%, #e7e5e4 ${progressPercent}%, #e7e5e4 100%)`,
          }}
        />
      </div>

      {/* Playback controls bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
        {/* Left: Play/Pause, Rewind, Forward */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => skip(-10)}
            className="flex h-7 w-7 items-center justify-center rounded-full text-stone-600 hover:bg-stone-200/60 active:scale-95"
            title="Rewind 10 seconds"
            aria-label="Rewind 10 seconds"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </button>

          <button
            type="button"
            onClick={togglePlay}
            disabled={Boolean(error)}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-stone-900 text-white shadow-sm transition-transform hover:bg-stone-800 active:scale-95 disabled:bg-stone-400"
            title={isPlaying ? 'Pause' : 'Play'}
            aria-label={isPlaying ? 'Pause audio' : 'Play audio'}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin text-white" />
            ) : isPlaying ? (
              <Pause className="h-4 w-4 fill-white" />
            ) : (
              <Play className="h-4 w-4 fill-white translate-x-0.5" />
            )}
          </button>

          <button
            type="button"
            onClick={() => skip(10)}
            className="flex h-7 w-7 items-center justify-center rounded-full text-stone-600 hover:bg-stone-200/60 active:scale-95"
            title="Fast forward 10 seconds"
            aria-label="Fast forward 10 seconds"
          >
            <RotateCw className="h-3.5 w-3.5" />
          </button>

          <span className="ml-1 text-[11px] font-medium text-stone-600 tabular-nums">
            {formatTime(currentTime)}
          </span>
        </div>

        {/* Right: Speed & Volume */}
        <div className="flex items-center gap-2">
          {/* Playback speed selector */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowSpeedMenu((open) => !open)}
              className="flex h-6 items-center rounded-md border border-stone-200 bg-white px-1.5 text-[11px] font-semibold text-stone-700 shadow-2xs hover:bg-stone-100"
              title="Playback speed"
            >
              {speed}x
            </button>

            {showSpeedMenu ? (
              <div
                className="absolute right-0 bottom-full z-20 mb-1 flex flex-col rounded-lg border border-stone-200 bg-white py-1 shadow-md"
                role="menu"
              >
                {SPEEDS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => changeSpeed(s)}
                    className={cx(
                      'px-3 py-1 text-left text-xs',
                      s === speed ? 'bg-stone-100 font-semibold text-stone-900' : 'text-stone-600 hover:bg-stone-50',
                    )}
                  >
                    {s}x
                  </button>
                ))}
              </div>
            ) : null}
          </div>

          {/* Volume control */}
          {!compact ? (
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={toggleMute}
                className="flex h-7 w-7 items-center justify-center rounded-md text-stone-500 hover:text-stone-800"
                title={isMuted ? 'Unmute' : 'Mute'}
                aria-label={isMuted ? 'Unmute volume' : 'Mute volume'}
              >
                {isMuted || volume === 0 ? (
                  <VolumeX className="h-3.5 w-3.5" />
                ) : volume < 0.5 ? (
                  <Volume1 className="h-3.5 w-3.5" />
                ) : (
                  <Volume2 className="h-3.5 w-3.5" />
                )}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                aria-label="Volume slider"
                className="h-1.5 w-14 cursor-pointer appearance-none rounded-lg bg-stone-200 accent-stone-800"
              />
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}
