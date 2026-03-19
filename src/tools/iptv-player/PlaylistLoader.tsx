import React, { useEffect, useState } from 'react';
import { parse } from 'iptv-playlist-parser';
import type { Channel } from './types';
import { Button, Input, Label } from '@/components/ui';
import { MoveRight } from 'lucide-react';
import FileDropZone from '@/components/advanced/FileDropZone';
import { Panel } from '@/components/layout';

interface PlaylistLoaderProps {
  onLoad: (channels: Channel[], playlistUrl?: string) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  initialUrl?: string;
  compact?: boolean;
}

export default function PlaylistLoader({ onLoad, isLoading, setIsLoading, initialUrl = '', compact = false }: PlaylistLoaderProps) {
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

  // temp
  useEffect(() => {
    loadUrl('https://iptv-org.github.io/iptv/index.m3u');
  }, [])

  const handleLoadUrl = async (e: React.SubmitEvent) => {
    e.preventDefault();
    if (!url.trim()) return;

    setIsLoading(true);
    setError('');
    loadUrl();
  };

  const loadUrl = async (link?: string) => {
    link = link || "https://iptv-org.github.io/iptv/index.m3u";
    try {
      const res = await fetch(link);
      if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`);
      const text = await res.text();
      handleParseContent(text, link);
    } catch (err: any) {
      setIsLoading(false);
      setError('Failed to fetch playlist URL. Note: Many public IPTV playlists intentionally block browser requests (CORS). Try downloading the file and uploading it below instead.');
    }
  }

  const handleFileUpload = (file: File) => {
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
    <div className="flex flex-col items-center justify-center rounded-lg text-center gap-2 max-w-full">
      <Panel className="w-full space-y-2">
        <form onSubmit={handleLoadUrl} className="flex flex-col gap-2">
          <Input
            type="url"
            label="Playlist URL"
            placeholder="https://example.com/playlist.m3u"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className='flex-1'
            disabled={isLoading}
          />
          <Button
            type="submit"
            disabled={isLoading || !url.trim()}
            variant={compact ? "ghost" : "primary"}
            icon={MoveRight}
            iconPos="right"
            className='w-full md:max-w-fit'
          >
            {isLoading ? 'Loading...' : 'Load URL'}
          </Button>
        </form>
      </Panel>

      {!compact && (
        <div className="w-full">
          <FileDropZone
            onUpload={f => handleFileUpload(f.file)}
            accepts=".m3u,.m3u8"
            emoji="📁"
          />
        </div>
      )}

      {error && (
        <Panel>
          <Label className="w-full text-(--color-error) text-center">
            {error}
          </Label>
        </Panel>
      )}
    </div>
  );
}
