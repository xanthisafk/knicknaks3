import { useMemo, useState, useRef, useEffect, useCallback } from 'react';
import type { Channel } from './types';
import { Panel } from '@/components/layout';
import { Search, Star, Tv, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Badge, Button, Input, Label } from '@/components/ui';
import { cn } from '@/lib';

interface ChannelListProps {
  channels: Channel[];
  onSelectChannel: ({ channel, favorite }: { channel: Channel, favorite: boolean }) => void;
  favorites: Set<string>;
  onToggleFavorite: (channel: Channel) => void;
  activeChannelUrl?: string;
}

// ── Debounce hook ──────────────────────────────────────────────────────────────
function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return debounced;
}

// ── Scroll strip helper ────────────────────────────────────────────────────────
function useScrollStrip(ref: React.RefObject<HTMLDivElement | null>) {
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(false);

  const update = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    setCanLeft(el.scrollLeft > 4);
    setCanRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  }, [ref]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    update();
    el.addEventListener('scroll', update, { passive: true });
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => { el.removeEventListener('scroll', update); ro.disconnect(); };
  }, [ref, update]);

  const scrollBy = useCallback((dir: 'left' | 'right') => {
    const el = ref.current;
    if (!el) return;
    el.scrollBy({ left: dir === 'left' ? -240 : 240, behavior: 'smooth' });
  }, [ref]);

  return { canLeft, canRight, scrollBy };
}

// ── Channel Card ───────────────────────────────────────────────────────────────
interface CardProps {
  channel: Channel;
  isActive: boolean;
  isFav: boolean;
  onSelect: () => void;
  onToggleFav: (e: React.MouseEvent) => void;
  cardRef?: React.Ref<HTMLButtonElement>;
}

function ChannelCard({ channel, isActive, isFav, onSelect, onToggleFav, cardRef }: CardProps) {
  const [imgFailed, setImgFailed] = useState(false);

  return (
    <span
      ref={cardRef}
      onClick={onSelect}
      className={cn(
        "group/card relative shrink-0 flex flex-col items-center justify-between gap-1.5",
        "w-26 h-30 p-2 m-2 rounded-md transition-all text-center",
        isActive
          ? "ring-2 ring-primary-500 bg-(--surface-elevated)"
          : isFav ? "ring-2 ring-yellow-500"
            : "hover:ring-2 hover:ring-primary-300"
      )}
    >
      {/* Icon */}
      <div className="flex-1 flex items-center justify-center shrink-0">
        {channel.logo && !imgFailed ? (
          <img
            src={channel.logo}
            alt={`${channel.name} logo`}
            className="w-10 h-10 object-contain"
            loading="lazy"
            decoding="async"
            onError={() => setImgFailed(true)}
          />
        ) : (
          <Tv size={20} className="opacity-40" />
        )}
      </div>

      {/* Name */}
      <Label className='text-wrap' size={"xs"}>{channel.name}</Label>
    </span>
  );
}

// ── ScrollStrip wrapper ────────────────────────────────────────────────────────
function ScrollStrip({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const { canLeft, canRight, scrollBy } = useScrollStrip(ref);

  return (
    <div className={`w-full relative flex items-center gap-1 px-4 ${className}`}>
      {/* Left chevron */}
      <Button
        onClick={() => scrollBy('left')}
        icon={ChevronLeft}
        variant='ghost'
        aria-hidden={!canLeft}
        className='h-full'
      />

      {/* Scrollable strip */}
      <div
        ref={ref}
        className="flex px-1 gap-1 overflow-x-auto scrollbar-none flex-1 min-w-0"
      >
        {children}
      </div>

      {/* Right chevron */}
      <Button
        onClick={() => scrollBy('right')}
        icon={ChevronRight}
        variant='ghost'
        aria-hidden={!canRight}
        className='h-full'
      />
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────────
const VISIBLE_PAGE = 120; // render at most this many cards at once

export default function ChannelList({
  channels,
  onSelectChannel,
  favorites,
  activeChannelUrl,
  onToggleFavorite,
}: ChannelListProps) {
  const [searchRaw, setSearchRaw] = useState('');
  const [activeGroup, setActiveGroup] = useState<string | null>(null);
  const [showFavOnly, setShowFavOnly] = useState(false);
  const [page, setPage] = useState(0);

  const activeRef = useRef<HTMLButtonElement>(null);
  const channelStripRef = useRef<HTMLDivElement>(null);

  // Debounce search input — 150 ms feels instant but avoids filtering 12k items on every keystroke
  const search = useDebounce(searchRaw, 150);

  // Reset page on filter change
  useEffect(() => { setPage(0); }, [search, activeGroup, showFavOnly]);

  // ── Groups ─────────────────────────────────────────────────────────────────
  const groups = useMemo(() => {
    const seen = new Set<string>();
    const out: string[] = [];
    for (const c of channels) {
      if (c.group && !seen.has(c.group)) { seen.add(c.group); out.push(c.group); }
    }
    return out;
  }, [channels]);

  // ── Filtered list (memo only recalcs when debounced search changes) ─────────
  const filtered = useMemo(() => {
    let list = channels;
    if (showFavOnly) list = list.filter((c) => favorites.has(c.url));
    if (activeGroup) list = list.filter((c) => c.group === activeGroup);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          (c.group && c.group.toLowerCase().includes(q))
      );
    }
    return list;
  }, [channels, search, activeGroup, showFavOnly, favorites]);

  // ── Windowed slice ──────────────────────────────────────────────────────────
  const totalPages = Math.ceil(filtered.length / VISIBLE_PAGE);
  const visible = useMemo(
    () => filtered.slice(page * VISIBLE_PAGE, (page + 1) * VISIBLE_PAGE),
    [filtered, page]
  );

  // ── Scroll active into view ─────────────────────────────────────────────────
  useEffect(() => {
    activeRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
  }, [activeChannelUrl]);

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <Panel className="flex flex-col gap-2">

      {/* ── Toolbar ── */}
      <div className="w-full flex flex-col gap-2">
        {/* Search */}
        <div className="flex-1 flex flex-row gap-2">
          <Button
            onClick={() => setShowFavOnly((p) => !p)}
            icon={Star}
            variant={showFavOnly ? 'primary' : 'secondary'}
          />
          <Input
            type="text"
            leadingIcon={Search}
            placeholder="Search channels..."
            value={searchRaw}
            className="flex-1"
            onChange={(e) => setSearchRaw(e.target.value)}
          />
          <Button
            onClick={() => setSearchRaw('')}
            icon={X}
            variant='ghost'
          />
        </div>
        <Label>found: {filtered.length.toLocaleString()} {showFavOnly ? 'favorites' : 'channels'}</Label>

      </div>

      {/* ── Group filter pills (with chevrons) ── */}
      {groups.length > 0 && (
        <ScrollStrip>
          <Badge
            onClick={() => setActiveGroup(null)}
            variant={activeGroup === null ? "success" : "ghost"}
            className="cursor-pointer"
            text={"All"}
          />
          {groups.map((group) => (
            <Badge
              key={group}
              onClick={() => setActiveGroup(activeGroup === group ? null : group)}
              variant={activeGroup === group ? "success" : "ghost"}
              className="cursor-pointer"
              text={group}
            />
          ))}
        </ScrollStrip>
      )}

      {/* ── Channel cards (with chevrons) ── */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-6 gap-2">
          <Label>No channels match your filters</Label>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          <ScrollStrip>
            {visible.map((channel) => {
              const isActive = channel.url === activeChannelUrl;
              const isFav = favorites.has(channel.url);
              return (
                <ChannelCard
                  key={channel.url}
                  channel={channel}
                  isActive={isActive}
                  isFav={isFav}
                  onSelect={() => onSelectChannel({ channel: channel, favorite: isFav })}
                  onToggleFav={(e) => { e.stopPropagation(); onToggleFavorite(channel); }}
                  cardRef={isActive ? activeRef : undefined}
                />
              );
            })}
          </ScrollStrip>

          {/* ── Pagination (when filtered > VISIBLE_PAGE) ── */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between">
              <Button
                disabled={page === 0}
                onClick={() => setPage((p) => p - 1)}
                icon={ChevronLeft}
                variant='ghost'
              >Previous</Button>
              <Label size='xs'>
                Page {page + 1} / {totalPages} —— showing {visible.length.toLocaleString()} of {filtered.length.toLocaleString()} channels
              </Label>
              <Button
                disabled={page >= totalPages - 1}
                onClick={() => setPage((p) => p + 1)}
                icon={ChevronRight}
                iconPos='right'
                variant='ghost'
              >Next</Button>
            </div>
          )}
        </div>
      )}
    </Panel>
  );
}