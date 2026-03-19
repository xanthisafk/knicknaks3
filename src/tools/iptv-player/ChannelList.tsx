import React, { useMemo, useState } from 'react';
import { Virtuoso } from 'react-virtuoso';
import type { Channel } from './types';

interface ChannelListProps {
  channels: Channel[];
  onSelectChannel: (channel: Channel) => void;
  favorites: Set<string>;
  onToggleFavorite: (channel: Channel) => void;
  activeChannelUrl?: string;
}

export default function ChannelList({ channels, onSelectChannel, favorites, activeChannelUrl, onToggleFavorite }: ChannelListProps) {
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    if (!search.trim()) return channels;
    const lowerSearch = search.toLowerCase();
    return channels.filter(c =>
      c.name.toLowerCase().includes(lowerSearch) ||
      (c.group && c.group.toLowerCase().includes(lowerSearch))
    );
  }, [channels, search]);

  return (
    <div className="flex flex-col h-full bg-(--surface-elevated) border border-(--border-default) rounded-lg overflow-hidden">
      <div className="p-3 border-b border-(--border-default) bg-(--surface-secondary)">
        <div className="relative">
          <span className="absolute left-3 top-2.5 text-(--text-tertiary) text-sm">🔍</span>
          <input
            type="text"
            placeholder="Search channels..."
            className="w-full pl-9 pr-3 py-2 bg-(--surface-bg) border border-(--border-default) rounded-md text-sm focus:outline-none focus:border-(--border-focus) focus:ring-2 focus:ring-(--ring-color) transition-colors text-(--text-primary) placeholder:text-(--text-tertiary)"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>
      <div className="flex-1">
        <Virtuoso
          style={{ height: '100%' }}
          data={filtered}
          itemContent={(index, channel) => {
            const isActive = channel.url === activeChannelUrl;
            const isFav = favorites.has(channel.url);

            return (
              <div
                className={`flex items-center gap-3 p-3 border-b border-(--border-default) cursor-pointer hover:bg-(--surface-secondary) transition-colors ${isActive ? 'bg-(--surface-secondary) border-l-2 border-l-(--border-focus) pl-2' : ''}`}
                onClick={() => onSelectChannel(channel)}
              >
                {channel.logo ? (
                  <img src={channel.logo} alt="" className="w-10 h-10 object-contain rounded-sm bg-(--surface-bg)" loading="lazy" onError={(e) => e.currentTarget.style.display = 'none'} />
                ) : (
                  <div className="w-10 h-10 rounded-sm bg-(--surface-bg) border border-(--border-default) flex items-center justify-center text-lg">
                    📺
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h4 className={`text-sm font-semibold truncate ${isActive ? 'text-(--border-focus)' : 'text-(--text-primary)'}`} title={channel.name}>{channel.name}</h4>
                  {channel.group && <p className="text-xs text-(--text-secondary) truncate">{channel.group}</p>}
                </div>
                <button
                  className="p-1 text-lg hover:scale-110 transition-transform cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleFavorite(channel);
                  }}
                  title={isFav ? "Remove from favorites" : "Add to favorites"}
                >
                  {isFav ? '⭐' : '☆'}
                </button>
              </div>
            );
          }}
        />
      </div>
      <div className="p-2 border-t border-(--border-default) text-xs text-(--text-secondary) text-center bg-(--surface-secondary)">
        {filtered.length} {filtered.length === 1 ? 'channel' : 'channels'}
      </div>
    </div>
  );
}
