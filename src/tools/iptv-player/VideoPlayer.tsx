import React, { useEffect, useRef, useState } from 'react';
import Hls from 'hls.js';
import { AlertTriangle, SkipBack, SkipForward, Tv } from 'lucide-react';
import { Button } from '@/components/ui';

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

        const hls = new Hls({ enableWorker: true, lowLatencyMode: true });
        hls.loadSource(url);
        hls.attachMedia(video);

        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          setIsBuffering(false);
          video.play().catch((e) => console.error('Play error:', e));
        });

        hls.on(Hls.Events.ERROR, (_, data) => {
          if (data.fatal) {
            switch (data.type) {
              case Hls.ErrorTypes.NETWORK_ERROR:
                setError('Network error: unable to load stream (CORS or offline)');
                hls.startLoad();
                break;
              case Hls.ErrorTypes.MEDIA_ERROR:
                setError('Media error: stream format not supported or corrupted');
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
        video.src = url;
        video.addEventListener('loadedmetadata', () => {
          setIsBuffering(false);
          video.play().catch((e) => console.error('Play error:', e));
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
    <div className="relative w-full h-full bg-black flex flex-col group rounded-lg overflow-hidden border border-(--border-default) shadow-(--shadow-md)">

      {/* ── Empty state ── */}
      {!url && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 z-10">
          <div className="flex items-center justify-center w-14 h-14 rounded-full bg-(--surface-raised) border border-(--border-default)">
            <Tv size={22} className="text-(--text-tertiary)" />
          </div>
          <p className="text-sm text-(--text-tertiary)">Select a channel to start watching</p>
        </div>
      )}

      {/* ── Error overlay ── */}
      {error && url && (
        <div className="absolute inset-0 flex items-center justify-center z-10 p-4 bg-black/80 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-3 text-center max-w-xs bg-(--surface-elevated) border border-(--border-default) rounded-lg p-5 shadow-(--shadow-lg)">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-red-500/10 border border-red-500/20">
              <AlertTriangle size={18} className="text-red-500" />
            </div>
            <div>
              <p className="text-sm font-semibold text-(--text-primary) mb-1">Playback Error</p>
              <p className="text-xs text-(--text-secondary) leading-relaxed">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* ── Buffering spinner ── */}
      {/* {isBuffering && url && !error && (
        <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
          <div className="w-10 h-10 rounded-full border-2 border-(--border-default) border-t-(--primary-500) animate-spin" />
        </div>
      )} */}

      {/* ── Video element ── */}
      <video
        ref={videoRef}
        className="w-full h-full object-contain bg-black"
        controls
        playsInline
        onWaiting={() => setIsBuffering(true)}
        onPlaying={() => setIsBuffering(false)}
        onEnded={onEnded}
      />

      {/* ── Title bar (hover reveal) ── */}
      {title && url && (
        <div className="absolute top-0 left-0 right-0 px-4 pt-4 pb-8 bg-linear-to-b from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20">
          <p className="text-sm font-medium text-white truncate drop-shadow-sm">{title}</p>
        </div>
      )}

      {/* ── Prev button ── */}
      {url && onPrev && (
        <div className="absolute top-1/2 -translate-y-1/2 left-3 opacity-0 group-hover:opacity-100 transition-opacity z-20">
          <Button
            onClick={onPrev}
            title="Previous channel"
            variant='ghost'
            icon={SkipBack}
          />
        </div>
      )}

      {/* ── Next button ── */}
      {url && onNext && (
        <div className="absolute top-1/2 -translate-y-1/2 right-3 opacity-0 group-hover:opacity-100 transition-opacity z-20">
          <Button
            onClick={onNext}
            title="Next channel"
            variant='ghost'
            icon={SkipForward}
          />
        </div>
      )}
    </div>
  );
}