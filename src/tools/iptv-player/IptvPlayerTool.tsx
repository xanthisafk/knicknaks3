import React, { useState, useCallback, useEffect } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { useHotkeys } from 'react-hotkeys-hook';
import { db } from './store';
import type { Channel } from './types';
import PlaylistLoader from './PlaylistLoader';
import ChannelList from './ChannelList';
import VideoPlayer from './VideoPlayer';
import { Panel } from '@/components/layout';
import { Label } from '@/components/ui';
import { Folder, Keyboard, Star } from 'lucide-react';

export default function IptvPlayerTool() {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [activeChannel, setActiveChannel] = useState<Channel | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [view, setView] = useState<'loader' | 'player'>('loader');
  const [isActiveChannelFav, setIsActiveChannelFav] = useState(false);

  // ── Persistence ────────────────────────────────────────────────────────────
  const favorites = useLiveQuery(() => db.favorites.toArray(), []) || [];
  const favoriteUrls = new Set(favorites.map((f) => f.url));
  const initialUrl = useLiveQuery(() => db.preferences.get('lastPlaylistUrl'), []);

  // ── Handlers ───────────────────────────────────────────────────────────────
  const handlePlaylistLoaded = async (loadedChannels: Channel[], sourceUrl?: string) => {
    setChannels(loadedChannels);
    setView('player');
    if (sourceUrl) {
      await db.preferences.put({ key: 'lastPlaylistUrl', value: sourceUrl });
    }
  };

  const handleSelectChannel = async ({ channel, favorite }: { channel: Channel, favorite: boolean }) => {
    setActiveChannel(channel);
    setIsActiveChannelFav(favorite);
    await db.history.put({
      id: channel.url,
      name: channel.name,
      url: channel.url,
      group: channel.group,
      logo: channel.logo,
      lastPlayedAt: Date.now(),
    });
  };

  const handleToggleFavorite = async (channel: Channel) => {
    if (favoriteUrls.has(channel.url)) {
      await db.favorites.delete(channel.url);
      setIsActiveChannelFav(false);
    } else {
      await db.favorites.put({
        id: channel.url,
        name: channel.name,
        url: channel.url,
        group: channel.group,
        logo: channel.logo,
        addedAt: Date.now(),
      });
      setIsActiveChannelFav(true);
    }
  };

  const playNext = useCallback(() => {
    if (!activeChannel || channels.length === 0) return;
    const idx = channels.findIndex((c) => c.url === activeChannel.url);
    if (idx !== -1 && idx < channels.length - 1) handleSelectChannel({ channel: channels[idx + 1], favorite: isActiveChannelFav });
  }, [activeChannel, channels]);

  const playPrev = useCallback(() => {
    if (!activeChannel || channels.length === 0) return;
    const idx = channels.findIndex((c) => c.url === activeChannel.url);
    if (idx > 0) handleSelectChannel({ channel: channels[idx - 1], favorite: isActiveChannelFav });
  }, [activeChannel, channels]);

  const toggleFavoriteCurrent = useCallback(() => {
    if (activeChannel) handleToggleFavorite(activeChannel);
  }, [activeChannel, favoriteUrls]);

  // ── Hotkeys ────────────────────────────────────────────────────────────────
  useHotkeys('right', (e) => { e.preventDefault(); playNext(); }, [playNext]);
  useHotkeys('left', (e) => { e.preventDefault(); playPrev(); }, [playPrev]);
  useHotkeys('f', (e) => { e.preventDefault(); toggleFavoriteCurrent(); }, [toggleFavoriteCurrent]);

  // ── Loader view ────────────────────────────────────────────────────────────
  if (view === "loader") {
    return (
      <PlaylistLoader
        onLoad={handlePlaylistLoaded}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        initialUrl={initialUrl?.value || ''}
      />
    );
  }

  // ── Player view ────────────────────────────────────────────────────────────
  if (view === "player") return (
    <div className="flex flex-col gap-2">
      {/* Playlist switcher — compact bar above player */}
      <PlaylistLoader
        onLoad={handlePlaylistLoaded}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        initialUrl={initialUrl?.value || ''}
        compact={true}
      />

      {/* Video player */}
      <Panel className="p-0 overflow-hidden">
        <div className="w-full aspect-video">
          <VideoPlayer
            url={activeChannel?.url}
            title={activeChannel?.name}
            onNext={playNext}
            onPrev={playPrev}
          />
        </div>

        {/* Channel info bar */}
        <div className="px-4 py-3 flex items-center justify-between gap-4 border-t border-(--border-default)">
          <div className="flex-1 min-w-0">
            {activeChannel ? (
              <div className="flex items-center gap-3 min-w-0">
                {isActiveChannelFav && (
                  <Star size={11} className="text-yellow-500" />
                )}
                <p className="text-sm font-medium text-(--text-primary) truncate">
                  {activeChannel.name}
                </p>
                {activeChannel.group && (
                  <span className="flex items-center gap-1 text-xs text-(--text-tertiary) shrink-0">
                    <Folder size={11} />
                    {activeChannel.group}
                  </span>
                )}
              </div>
            ) : (
              <p className="text-sm text-(--text-tertiary)">Select a channel below</p>
            )}
          </div>

          {/* Keyboard hint */}
          <div className="hidden sm:flex items-center gap-2 text-xs text-(--text-tertiary) shrink-0">
            <Keyboard size={11} />
            <kbd className="bg-(--surface-elevated) border border-(--border-default) px-1.5 py-0.5 rounded text-xs font-mono text-(--text-secondary)">←</kbd>
            <kbd className="bg-(--surface-elevated) border border-(--border-default) px-1.5 py-0.5 rounded text-xs font-mono text-(--text-secondary)">→</kbd>
            <span>navigate</span>
            <kbd className="bg-(--surface-elevated) border border-(--border-default) px-1.5 py-0.5 rounded text-xs font-mono text-(--text-secondary)">F</kbd>
            <span>favorite</span>
          </div>
        </div>
      </Panel>

      {/* Channel list — horizontal scrolling pills */}
      <ChannelList
        channels={channels}
        onSelectChannel={handleSelectChannel}
        favorites={favoriteUrls}
        activeChannelUrl={activeChannel?.url}
        onToggleFavorite={handleToggleFavorite}
      />
    </div>
  );
}