import React, { useState } from 'react';
import { parse } from 'iptv-playlist-parser';
import type { Channel } from './types';

interface PlaylistLoaderProps {
  onLoad: (channels: Channel[], playlistUrl?: string) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  initialUrl?: string;
}

export default function PlaylistLoader({ onLoad, isLoading, setIsLoading, initialUrl = '' }: PlaylistLoaderProps) {
  const [url, setUrl] = useState(initialUrl);
  const [error, setError] = useState('');

  const handleParseContent = (content: string, sourceUrl?: string) => {
    try {
      const parsed = parse(content);
      const channels: Channel[] = parsed.items.map(item => ({
        name: item.name,
        url: item.url,
        logo: item.tvg?.logo || '',
        group: item.group?.title || ''
      }));
      onLoad(channels, sourceUrl);
    } catch (err: any) {
      setError('Failed to parse playlist: Invalid or unsupported M3U format.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoadUrl = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;

    setIsLoading(true);
    setError('');

    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`);
      const text = await res.text();
      handleParseContent(text, url);
    } catch (err: any) {
      setIsLoading(false);
      setError('Failed to fetch playlist URL. Note: Many public IPTV playlists intentionally block browser requests (CORS). Try downloading the file and uploading it below instead.');
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    setError('');

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      handleParseContent(content);
    };
    reader.onerror = () => {
      setError('Failed to read file');
      setIsLoading(false);
    };
    reader.readAsText(file);
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-(--surface-elevated) border border-(--border-default) rounded-lg text-center gap-6 max-w-xl mx-auto mt-10 shadow-(--shadow-md)">
      <div className="text-5xl">📺</div>
      <div>
        <h2 className="text-xl font-bold mb-2 text-(--text-primary)">Load IPTV Playlist</h2>
        <p className="text-(--text-secondary) text-sm">
          Paste an M3U/M3U8 URL or upload a local file to start watching channels directly in your browser.
        </p>
      </div>

      <form onSubmit={handleLoadUrl} className="w-full flex gap-2">
        <input
          type="url"
          placeholder="https://example.com/playlist.m3u"
          className="flex-1 px-3 py-2 bg-(--surface-bg) border border-(--border-default) rounded-md focus:outline-none focus:border-(--border-focus) focus:ring-2 focus:ring-(--ring-color) transition-colors text-sm text-(--text-primary) placeholder:text-(--text-tertiary)"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading || !url.trim()}
          className="px-4 py-2 bg-primary-500 hover:bg-primary-600 active:bg-primary-700 text-white rounded-md font-medium disabled:opacity-50 transition-colors text-sm shadow-(--shadow-sm) hover:shadow-(--shadow-md)"
        >
          {isLoading ? 'Loading...' : 'Load URL'}
        </button>
      </form>

      <div className="flex items-center gap-4 w-full text-(--text-tertiary) text-xs uppercase font-medium">
        <div className="flex-1 h-px bg-(--border-default)"></div>
        <span>OR</span>
        <div className="flex-1 h-px bg-(--border-default)"></div>
      </div>

      <div className="w-full">
        <label className="cursor-pointer flex flex-col items-center gap-3 p-8 border-2 border-dashed border-(--border-default) rounded-lg bg-(--surface-bg) hover:border-(--border-hover) hover:bg-(--surface-secondary) transition-all">
          <span className="text-3xl text-(--text-tertiary)">📁</span>
          <div className="flex flex-col gap-1">
            <span className="font-medium text-sm text-(--text-primary)">Upload .m3u File</span>
            <span className="text-xs text-(--text-secondary)">Parse large lists instantly</span>
          </div>
          <input
            type="file"
            accept=".m3u,.m3u8"
            className="hidden"
            onChange={handleFileUpload}
            disabled={isLoading}
          />
        </label>
      </div>

      {error && (
        <div className="w-full p-4 bg-(--color-error)/10 text-(--color-error) border border-(--color-error)/20 rounded-md text-sm text-center">
          {error}
        </div>
      )}
    </div>
  );
}
