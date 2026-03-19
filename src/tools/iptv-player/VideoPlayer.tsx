import React, { useEffect, useRef, useState } from 'react';
import Hls from 'hls.js';

interface VideoPlayerProps {
  url?: string;
  onEnded?: () => void;
  title?: string;
  onNext?: () => void;
  onPrev?: () => void;
}

export default function VideoPlayer({ url, onEnded, title, onNext, onPrev }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);
  const [error, setError] = useState('');
  const [isBuffering, setIsBuffering] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !url) return;

    setError('');
    setIsBuffering(true);

    const initPlayer = () => {
      if (Hls.isSupported()) {
        if (hlsRef.current) hlsRef.current.destroy();

        const hls = new Hls({
          enableWorker: true,
          lowLatencyMode: true,
        });

        hls.loadSource(url);
        hls.attachMedia(video);

        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          setIsBuffering(false);
          video.play().catch(e => console.error("Play error:", e));
        });

        hls.on(Hls.Events.ERROR, (event, data) => {
          if (data.fatal) {
            switch (data.type) {
              case Hls.ErrorTypes.NETWORK_ERROR:
                setError('Network error: Unable to load stream (CORS or offline)');
                hls.startLoad();
                break;
              case Hls.ErrorTypes.MEDIA_ERROR:
                setError('Media error: Stream format not supported or corrupted');
                hls.recoverMediaError();
                break;
              default:
                setError('Fatal error during playback');
                hls.destroy();
                break;
            }
            setIsBuffering(false);
          }
        });

        hlsRef.current = hls;
      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        // Native HLS support (Safari)
        video.src = url;
        video.addEventListener('loadedmetadata', () => {
          setIsBuffering(false);
          video.play().catch(e => console.error("Play error:", e));
        });

        video.addEventListener('error', () => {
          setError('Native playback error: format not supported.');
          setIsBuffering(false);
        });
      } else {
        setError('HLS is not supported in this browser');
        setIsBuffering(false);
      }
    };

    initPlayer();

    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
    };
  }, [url]);

  return (
    <div className="relative w-full h-full bg-black flex flex-col group rounded-lg overflow-hidden border border-(--border-default)">
      {!url && (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-(--text-tertiary) z-10 gap-3">
          <span className="text-4xl opacity-30">📺</span>
          <p>Select a channel to start watching</p>
        </div>
      )}

      {error && url && (
        <div className="absolute inset-0 flex items-center justify-center z-10 p-4 bg-black/80 backdrop-blur">
          <div className="text-(--color-error) text-sm text-center max-w-sm bg-(--surface-elevated) p-5 rounded-lg border border-(--border-default) shadow-(--shadow-lg)">
            <p className="font-bold mb-2 flex items-center justify-center gap-2"><span>⚠️</span> Playback Error</p>
            <p>{error}</p>
          </div>
        </div>
      )}

      {isBuffering && url && !error && (
        <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
          <div className="w-12 h-12 border-4 border-white/20 border-t-primary-500 rounded-full animate-spin"></div>
        </div>
      )}

      <video
        ref={videoRef}
        className="w-full h-full object-contain bg-black"
        controls
        playsInline
        onWaiting={() => setIsBuffering(true)}
        onPlaying={() => setIsBuffering(false)}
        onEnded={onEnded}
      />

      {title && url && (
        <div className="absolute top-0 left-0 right-0 p-4 bg-linear-to-b from-black/90 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20 flex justify-between items-start">
          <h2 className="text-white font-semibold drop-shadow-md truncate text-lg">{title}</h2>
        </div>
      )}

      {url && (
        <div className="absolute top-1/2 -translate-y-1/2 left-4 opacity-0 group-hover:opacity-100 transition-opacity z-20">
          <button onClick={onPrev} className="p-3 bg-black/50 hover:bg-black/80 text-white rounded-full backdrop-blur transition-colors cursor-pointer" title="Previous Channel">
            ⏮️
          </button>
        </div>
      )}

      {url && (
        <div className="absolute top-1/2 -translate-y-1/2 right-4 opacity-0 group-hover:opacity-100 transition-opacity z-20">
          <button onClick={onNext} className="p-3 bg-black/50 hover:bg-black/80 text-white rounded-full backdrop-blur transition-colors cursor-pointer" title="Next Channel">
            ⏭️
          </button>
        </div>
      )}
    </div>
  );
}
