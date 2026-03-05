import React, { useState, useEffect, useCallback } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { useHotkeys } from 'react-hotkeys-hook';
import { db } from './store';
import type { Channel } from './types';
import PlaylistLoader from './PlaylistLoader';
import ChannelList from './ChannelList';
import VideoPlayer from './VideoPlayer';

export default function IptvPlayerTool() {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [activeChannel, setActiveChannel] = useState<Channel | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [view, setView] = useState<'loader' | 'player'>('loader');

  // Load from Dexie
  const favorites = useLiveQuery(() => db.favorites.toArray(), []) || [];
  const favoriteUrls = new Set(favorites.map(f => f.url));
  
  const initialUrl = useLiveQuery(() => db.preferences.get('lastPlaylistUrl'), []);

  const handlePlaylistLoaded = async (loadedChannels: Channel[], sourceUrl?: string) => {
    setChannels(loadedChannels);
    setView('player');
    
    if (sourceUrl) {
      await db.preferences.put({ key: 'lastPlaylistUrl', value: sourceUrl });
    }
  };

  const handleSelectChannel = async (channel: Channel) => {
    setActiveChannel(channel);
    await db.history.put({
      id: channel.url,
      name: channel.name,
      url: channel.url,
      group: channel.group,
      logo: channel.logo,
      lastPlayedAt: Date.now()
    });
  };

  const handleToggleFavorite = async (channel: Channel) => {
    if (favoriteUrls.has(channel.url)) {
      await db.favorites.delete(channel.url);
    } else {
      await db.favorites.put({
        id: channel.url,
        name: channel.name,
        url: channel.url,
        group: channel.group,
        logo: channel.logo,
        addedAt: Date.now()
      });
    }
  };

  const playNext = useCallback(() => {
    if (!activeChannel || channels.length === 0) return;
    const idx = channels.findIndex(c => c.url === activeChannel.url);
    if (idx !== -1 && idx < channels.length - 1) {
      handleSelectChannel(channels[idx + 1]);
    }
  }, [activeChannel, channels]);

  const playPrev = useCallback(() => {
    if (!activeChannel || channels.length === 0) return;
    const idx = channels.findIndex(c => c.url === activeChannel.url);
    if (idx > 0) {
      handleSelectChannel(channels[idx - 1]);
    }
  }, [activeChannel, channels]);

  const toggleFavoriteCurrent = useCallback(() => {
    if (activeChannel) {
      handleToggleFavorite(activeChannel);
    }
  }, [activeChannel, favoriteUrls]);

  // Hotkeys
  useHotkeys('right', (e) => { e.preventDefault(); playNext(); }, [playNext]);
  useHotkeys('left', (e) => { e.preventDefault(); playPrev(); }, [playPrev]);
  useHotkeys('f', (e) => { e.preventDefault(); toggleFavoriteCurrent(); }, [toggleFavoriteCurrent]);
  
  return (
    <div className="flex flex-col h-[calc(100vh-12rem)] min-h-[600px] w-full bg-[var(--surface-bg)] rounded-[var(--radius-xl)] border border-[var(--border-default)] overflow-hidden shadow-[var(--shadow-sm)] mt-4">
      {view === 'loader' ? (
        <div className="p-4 h-full overflow-y-auto flex items-center justify-center bg-[var(--surface-secondary)]">
          <PlaylistLoader 
            onLoad={handlePlaylistLoaded} 
            isLoading={isLoading} 
            setIsLoading={setIsLoading} 
            initialUrl={initialUrl?.value || ''}
          />
        </div>
      ) : (
        <div className="flex flex-col md:flex-row h-full">
          <div className="w-full md:w-1/3 lg:w-1/4 h-1/2 md:h-full border-b md:border-b-0 md:border-r border-[var(--border-default)] bg-[var(--surface-elevated)]">
            <div className="h-full flex flex-col">
              <div className="flex items-center justify-between p-3 border-b border-[var(--border-default)] bg-[var(--surface-secondary)]">
                <h3 className="font-semibold text-sm flex items-center gap-2 text-[var(--text-primary)]"><span>📋</span> Channels</h3>
                <button 
                  onClick={() => setView('loader')}
                  className="text-xs font-medium px-2 py-1 bg-[var(--surface-bg)] border border-[var(--border-default)] hover:bg-[var(--surface-secondary)] hover:border-[var(--border-hover)] rounded-[var(--radius-sm)] transition-colors text-[var(--text-secondary)] hover:text-[var(--text-primary)] cursor-pointer"
                >
                  Change Playlist
                </button>
              </div>
              <div className="flex-1 overflow-hidden">
                 <ChannelList 
                   channels={channels}
                   onSelectChannel={handleSelectChannel}
                   favorites={favoriteUrls}
                   activeChannelUrl={activeChannel?.url}
                   onToggleFavorite={handleToggleFavorite}
                 />
              </div>
            </div>
          </div>
          <div className="w-full md:w-2/3 lg:w-3/4 h-1/2 md:h-full bg-[var(--surface-bg)] p-4 flex flex-col items-center justify-center relative">
             <div className="w-full h-full max-h-[80vh] flex flex-col items-center justify-center">
                 <div className="w-full aspect-video max-w-6xl bg-[var(--surface-secondary)] rounded-[var(--radius-2xl)] shadow-[var(--shadow-xl)] border border-[var(--border-default)] relative overflow-hidden flex items-center justify-center">
                    <VideoPlayer 
                      url={activeChannel?.url} 
                      title={activeChannel?.name}
                      onNext={playNext}
                      onPrev={playPrev}
                    />
                 </div>
                 {activeChannel ? (
                   <div className="mt-6 text-center max-w-2xl px-4 w-full">
                     <h2 className="text-xl font-bold truncate text-[var(--text-primary)]" title={activeChannel.name}>{activeChannel.name}</h2>
                     <p className="text-sm text-[var(--text-secondary)] mt-2 flex items-center justify-center gap-4 flex-wrap">
                       {activeChannel.group && <span className="flex items-center gap-1">📁 {activeChannel.group}</span>}
                       <span className="flex items-center gap-2">⌨️ <kbd className="bg-[var(--surface-elevated)] border border-[var(--border-default)] px-1.5 py-0.5 rounded-[var(--radius-sm)] text-xs font-mono font-bold text-[var(--text-primary)] shadow-[var(--shadow-xs)]">Right</kbd> / <kbd className="bg-[var(--surface-elevated)] border border-[var(--border-default)] px-1.5 py-0.5 rounded-[var(--radius-sm)] text-xs font-mono font-bold text-[var(--text-primary)] shadow-[var(--shadow-xs)]">Left</kbd>: Channel</span>
                       <span className="flex items-center gap-2"><kbd className="bg-[var(--surface-elevated)] border border-[var(--border-default)] px-1.5 py-0.5 rounded-[var(--radius-sm)] text-xs font-mono font-bold text-[var(--text-primary)] shadow-[var(--shadow-xs)]">F</kbd>: Favorite</span>
                     </p>
                   </div>
                 ) : (
                   <div className="mt-6 text-center text-[var(--text-tertiary)] text-sm">
                     <p>Select a channel from the list to start playing.</p>
                   </div>
                 )}
             </div>
          </div>
        </div>
      )}
    </div>
  );
}
