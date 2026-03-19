import { useState, useRef, useCallback } from "react";
import { Panel } from "@/components/layout";
import { Button, Label } from "@/components/ui";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
} from "@/components/ui/select";
import {
    Check,
    Clock,
    Copy,
    CornerDownLeft,
    Download,
    GripVertical,
    ListMusic,
    Music,
    Plus,
    Radio,
    Tv,
    Upload,
    Video,
    X,
} from "lucide-react";

// ─── Playlist modes ───────────────────────────────────────────────────────────

export type PlaylistMode = "music" | "iptv" | "radio" | "video";

interface ModeInfo {
    label: string;
    icon: React.ElementType;
    description: string;
    /** What the "entry" is called in the UI */
    entryLabel: string;
    /** Default format when switching to this mode */
    defaultFormat: PlaylistFormat;
    /** Which formats make sense for this mode */
    formats: PlaylistFormat[];
}

const MODE_INFO: Record<PlaylistMode, ModeInfo> = {
    music: {
        label: "Music",
        icon: Music,
        description: "Local files or streams — VLC, foobar2000, Winamp, etc.",
        entryLabel: "track",
        defaultFormat: "m3u8",
        formats: ["m3u", "m3u8", "pls", "xspf", "wpl"],
    },
    iptv: {
        label: "IPTV",
        icon: Tv,
        description: "Live TV channels — Plex, Jellyfin, TiviMate, Kodi, etc.",
        entryLabel: "channel",
        defaultFormat: "m3u",
        formats: ["m3u", "m3u8"],
    },
    radio: {
        label: "Radio / Podcast",
        icon: Radio,
        description: "Internet radio & podcast feeds — Shoutcast, Winamp, VLC",
        entryLabel: "station",
        defaultFormat: "pls",
        formats: ["m3u", "m3u8", "pls", "xspf"],
    },
    video: {
        label: "Video / VOD",
        icon: Video,
        description: "Video files or VOD streams — VLC, Windows Media Player",
        entryLabel: "item",
        defaultFormat: "xspf",
        formats: ["m3u", "m3u8", "xspf", "asx", "wpl"],
    },
};

const MODES = Object.keys(MODE_INFO) as PlaylistMode[];

// ─── Playlist formats ─────────────────────────────────────────────────────────

export type PlaylistFormat = "m3u" | "m3u8" | "pls" | "xspf" | "asx" | "wpl";

interface FormatInfo {
    label: string;
    ext: string;
    mime: string;
    description: string;
}

const FORMAT_INFO: Record<PlaylistFormat, FormatInfo> = {
    m3u: {
        label: "M3U",
        ext: "m3u",
        mime: "audio/x-mpegurl",
        description: "Classic — supported by virtually every media player",
    },
    m3u8: {
        label: "M3U8",
        ext: "m3u8",
        mime: "application/x-mpegURL",
        description: "UTF-8 M3U — handles non-ASCII names, required for IPTV",
    },
    pls: {
        label: "PLS",
        ext: "pls",
        mime: "audio/x-scpls",
        description: "INI-style — foobar2000, Winamp, Shoutcast radio",
    },
    xspf: {
        label: "XSPF",
        ext: "xspf",
        mime: "application/xspf+xml",
        description: "XML — W3C standard, rich metadata, web-friendly",
    },
    asx: {
        label: "ASX",
        ext: "asx",
        mime: "video/x-ms-asf",
        description: "Windows Media XML — legacy streams & WMP",
    },
    wpl: {
        label: "WPL",
        ext: "wpl",
        mime: "application/vnd.ms-wpl",
        description: "Windows Media Player Library — XML-based",
    },
};

// ─── Entry types (one per mode) ───────────────────────────────────────────────

interface BaseEntry {
    id: string;
    url: string;
}

interface MusicEntry extends BaseEntry {
    mode: "music";
    title: string;
    artist: string;
    album: string;
    duration: number; // seconds, -1 = unknown
}

interface IptvEntry extends BaseEntry {
    mode: "iptv";
    name: string;    // tvg-name
    tvgId: string;   // tvg-id  (EPG matching)
    logo: string;    // tvg-logo URL
    group: string;   // group-title
}

interface RadioEntry extends BaseEntry {
    mode: "radio";
    name: string;
    genre: string;
    duration: number; // -1 for live streams
}

interface VideoEntry extends BaseEntry {
    mode: "video";
    title: string;
    description: string;
    duration: number;
}

type Entry = MusicEntry | IptvEntry | RadioEntry | VideoEntry;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function uid() {
    return Math.random().toString(36).slice(2, 9);
}

function parseDuration(str: string): number {
    const clean = str.trim();
    if (!clean || clean === "-1") return -1;
    const parts = clean.split(":").map(Number);
    if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
    if (parts.length === 2) return parts[0] * 60 + parts[1];
    return Number(parts[0]) || -1;
}

function formatDuration(secs: number): string {
    if (secs < 0) return "--:--";
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    if (h > 0)
        return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
    return `${m}:${String(s).padStart(2, "0")}`;
}

function totalDuration(entries: Entry[]): string {
    const total = entries.reduce((a, e) => {
        const d = "duration" in e ? (e as any).duration : -1;
        return d >= 0 ? a + d : a;
    }, 0);
    if (total === 0) return "";
    return formatDuration(total);
}

function blankEntry(mode: PlaylistMode): Entry {
    switch (mode) {
        case "music":
            return { id: uid(), mode, url: "", title: "", artist: "", album: "", duration: -1 };
        case "iptv":
            return { id: uid(), mode, url: "", name: "", tvgId: "", logo: "", group: "" };
        case "radio":
            return { id: uid(), mode, url: "", name: "", genre: "", duration: -1 };
        case "video":
            return { id: uid(), mode, url: "", title: "", description: "", duration: -1 };
    }
}

function escapeXML(str: string): string {
    return str
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&apos;");
}

// ─── Serialisers ──────────────────────────────────────────────────────────────

function serializeM3U(entries: Entry[], playlistName: string, mode: PlaylistMode): string {
    const lines: string[] = [];

    if (mode === "iptv") {
        lines.push("#EXTM3U");
    } else {
        lines.push("#EXTM3U");
        lines.push(`#PLAYLIST:${playlistName}`);
    }
    lines.push("");

    for (const e of entries) {
        switch (e.mode) {
            case "music": {
                const label = [e.artist, e.title].filter(Boolean).join(" - ") || e.url;
                lines.push(`#EXTINF:${e.duration},${label}`);
                if (e.album) lines.push(`#EXTALB:${e.album}`);
                lines.push(e.url);
                break;
            }
            case "iptv": {
                // Build attribute string in the standard IPTV M3U format
                const parts: string[] = ["-1"];
                if (e.tvgId) parts.push(`tvg-id="${e.tvgId}"`);
                if (e.name) parts.push(`tvg-name="${e.name}"`);
                if (e.logo) parts.push(`tvg-logo="${e.logo}"`);
                if (e.group) parts.push(`group-title="${e.group}"`);
                lines.push(`#EXTINF:${parts.join(" ")},${e.name || e.url}`);
                lines.push(e.url);
                break;
            }
            case "radio": {
                lines.push(`#EXTINF:${e.duration},${e.name || e.url}`);
                if (e.genre) lines.push(`#EXTGENRE:${e.genre}`);
                lines.push(e.url);
                break;
            }
            case "video": {
                lines.push(`#EXTINF:${e.duration},${e.title || e.url}`);
                lines.push(e.url);
                break;
            }
        }
    }

    return lines.join("\n");
}

function serializePLS(entries: Entry[]): string {
    const lines = ["[playlist]", ""];
    entries.forEach((e, i) => {
        const n = i + 1;
        lines.push(`File${n}=${e.url}`);
        const name =
            e.mode === "music" ? [e.artist, e.title].filter(Boolean).join(" - ")
                : e.mode === "iptv" ? e.name
                    : e.mode === "radio" ? e.name
                        : (e as VideoEntry).title;
        if (name) lines.push(`Title${n}=${name}`);
        const dur = "duration" in e ? (e as any).duration : -1;
        lines.push(`Length${n}=${dur}`);
        lines.push("");
    });
    lines.push(`NumberOfEntries=${entries.length}`);
    lines.push("Version=2");
    return lines.join("\n");
}

function serializeXSPF(entries: Entry[], playlistName: string): string {
    const trackXML = entries
        .map((e) => {
            const parts: string[] = [];
            const title =
                e.mode === "music" ? e.title
                    : e.mode === "iptv" ? e.name
                        : e.mode === "radio" ? e.name
                            : (e as VideoEntry).title;
            const creator =
                e.mode === "music" ? e.artist
                    : e.mode === "iptv" ? e.group
                        : "";
            const annotation =
                e.mode === "video" ? (e as VideoEntry).description : "";

            if (title) parts.push(`      <title>${escapeXML(title)}</title>`);
            if (creator) parts.push(`      <creator>${escapeXML(creator)}</creator>`);
            if (annotation) parts.push(`      <annotation>${escapeXML(annotation)}</annotation>`);
            if (e.mode === "iptv" && e.logo)
                parts.push(`      <image>${escapeXML(e.logo)}</image>`);
            const dur = "duration" in e ? (e as any).duration : -1;
            if (dur >= 0) parts.push(`      <duration>${dur * 1000}</duration>`);
            parts.push(`      <location>${escapeXML(e.url)}</location>`);
            return `    <track>\n${parts.join("\n")}\n    </track>`;
        })
        .join("\n");

    return `<?xml version="1.0" encoding="UTF-8"?>
<playlist version="1" xmlns="http://xspf.org/ns/0/">
  <title>${escapeXML(playlistName)}</title>
  <trackList>
${trackXML}
  </trackList>
</playlist>`;
}

function serializeASX(entries: Entry[], playlistName: string): string {
    const xml = entries
        .map((e) => {
            const title =
                e.mode === "music" ? [e.artist, e.title].filter(Boolean).join(" - ")
                    : e.mode === "iptv" ? e.name
                        : e.mode === "radio" ? e.name
                            : (e as VideoEntry).title;
            return `  <ENTRY>\n    ${title ? `<TITLE>${escapeXML(title)}</TITLE>\n    ` : ""}<REF HREF="${escapeXML(e.url)}" />\n  </ENTRY>`;
        })
        .join("\n");

    return `<ASX VERSION="3.0">\n  <TITLE>${escapeXML(playlistName)}</TITLE>\n${xml}\n</ASX>`;
}

function serializeWPL(entries: Entry[], playlistName: string): string {
    const items = entries
        .map((e) => `    <media src="${escapeXML(e.url)}" />`)
        .join("\n");

    return `<?wpl version="1.0"?>
<smil>
  <head>
    <title>${escapeXML(playlistName)}</title>
  </head>
  <body>
    <seq>
${items}
    </seq>
  </body>
</smil>`;
}

function generatePlaylist(
    entries: Entry[],
    format: PlaylistFormat,
    playlistName: string,
    mode: PlaylistMode
): string {
    switch (format) {
        case "m3u":
        case "m3u8": return serializeM3U(entries, playlistName, mode);
        case "pls": return serializePLS(entries);
        case "xspf": return serializeXSPF(entries, playlistName);
        case "asx": return serializeASX(entries, playlistName);
        case "wpl": return serializeWPL(entries, playlistName);
    }
}

// ─── Import parser ────────────────────────────────────────────────────────────

function parseM3UFile(text: string, mode: PlaylistMode): Entry[] {
    const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);
    const entries: Entry[] = [];
    let pending: Record<string, any> = {};

    for (const line of lines) {
        if (line.startsWith("#EXTM3U") || line.startsWith("#PLAYLIST:")) continue;

        if (line.startsWith("#EXTINF:")) {
            const after = line.slice(8);
            const commaIdx = after.indexOf(",");
            const attrStr = commaIdx >= 0 ? after.slice(0, commaIdx) : after;
            const label = commaIdx >= 0 ? after.slice(commaIdx + 1).trim() : "";

            // Parse inline key="value" IPTV attributes
            const attrs: Record<string, string> = {};
            for (const m of attrStr.matchAll(/(\w[\w-]*)="([^"]*)"/g)) {
                attrs[m[1]] = m[2];
            }

            const durationMatch = attrStr.match(/^(-?\d+)/);
            pending.duration = durationMatch ? parseInt(durationMatch[1], 10) : -1;
            pending.label = label;
            pending.attrs = attrs;
            continue;
        }

        if (line.startsWith("#EXTALB:")) { pending.album = line.slice(8).trim(); continue; }
        if (line.startsWith("#EXTGENRE:")) { pending.genre = line.slice(10).trim(); continue; }

        if (!line.startsWith("#")) {
            const entry = blankEntry(mode);
            entry.url = line;

            switch (mode) {
                case "music": {
                    const e = entry as MusicEntry;
                    e.duration = pending.duration ?? -1;
                    e.album = pending.album ?? "";
                    const [artist, ...rest] = (pending.label ?? "").split(" - ");
                    if (rest.length > 0) { e.artist = artist.trim(); e.title = rest.join(" - ").trim(); }
                    else { e.title = (pending.label ?? "").trim(); }
                    break;
                }
                case "iptv": {
                    const e = entry as IptvEntry;
                    const a = pending.attrs ?? {};
                    e.name = a["tvg-name"] ?? pending.label ?? "";
                    e.tvgId = a["tvg-id"] ?? "";
                    e.logo = a["tvg-logo"] ?? "";
                    e.group = a["group-title"] ?? "";
                    break;
                }
                case "radio": {
                    const e = entry as RadioEntry;
                    e.name = pending.label ?? "";
                    e.genre = pending.genre ?? "";
                    e.duration = pending.duration ?? -1;
                    break;
                }
                case "video": {
                    const e = entry as VideoEntry;
                    e.title = pending.label ?? "";
                    e.duration = pending.duration ?? -1;
                    break;
                }
            }

            entries.push(entry);
            pending = {};
        }
    }

    return entries;
}

// ─── Shared field input ───────────────────────────────────────────────────────

function Field({
    value,
    onChange,
    placeholder,
    mono = false,
    className = "",
}: {
    value: string;
    onChange: (v: string) => void;
    placeholder: string;
    mono?: boolean;
    className?: string;
}) {
    return (
        <input
            className={`bg-transparent border-b border-(--border-default) focus:border-(--primary-500) outline-none text-sm text-(--text-primary) py-0.5 placeholder:text-(--text-tertiary) ${mono ? "font-mono" : ""} ${className}`}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
        />
    );
}

// ─── Row components per mode ──────────────────────────────────────────────────

function MusicRow({ entry, index, onChange, onRemove }: { entry: MusicEntry; index: number; onChange: (id: string, p: Partial<MusicEntry>) => void; onRemove: (id: string) => void }) {
    return (
        <div className="flex items-center gap-2 py-2 px-1 rounded-lg hover:bg-(--surface-raised) group transition-colors">
            <span className="text-(--text-tertiary) shrink-0"><GripVertical size={14} /></span>
            <span className="text-xs font-mono text-(--text-tertiary) w-5 shrink-0 text-right">{index + 1}</span>
            <div className="flex flex-1 items-center gap-2 min-w-0 flex-wrap sm:flex-nowrap">
                <Field className="flex-1 min-w-0" value={entry.url} onChange={(v) => onChange(entry.id, { url: v })} placeholder="URL or file path" />
                <Field className="w-28 shrink-0" value={entry.title} onChange={(v) => onChange(entry.id, { title: v })} placeholder="Title" />
                <Field className="w-24 shrink-0" value={entry.artist} onChange={(v) => onChange(entry.id, { artist: v })} placeholder="Artist" />
                <Field className="w-24 shrink-0" value={entry.album} onChange={(v) => onChange(entry.id, { album: v })} placeholder="Album" />
                <Field mono className="w-16 shrink-0"
                    value={entry.duration >= 0 ? formatDuration(entry.duration) : ""}
                    onChange={(v) => onChange(entry.id, { duration: parseDuration(v) })}
                    placeholder="0:00" />
            </div>
            <button onClick={() => onRemove(entry.id)} className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity text-(--text-tertiary) hover:text-red-500"><X size={14} /></button>
        </div>
    );
}

function IptvRow({ entry, index, onChange, onRemove }: { entry: IptvEntry; index: number; onChange: (id: string, p: Partial<IptvEntry>) => void; onRemove: (id: string) => void }) {
    return (
        <div className="flex items-center gap-2 py-2 px-1 rounded-lg hover:bg-(--surface-raised) group transition-colors">
            <span className="text-(--text-tertiary) shrink-0"><GripVertical size={14} /></span>
            <span className="text-xs font-mono text-(--text-tertiary) w-5 shrink-0 text-right">{index + 1}</span>
            <div className="flex flex-1 items-center gap-2 min-w-0 flex-wrap sm:flex-nowrap">
                <Field className="flex-1 min-w-0" value={entry.url} onChange={(v) => onChange(entry.id, { url: v })} placeholder="Stream URL" />
                <Field className="w-28 shrink-0" value={entry.name} onChange={(v) => onChange(entry.id, { name: v })} placeholder="Channel name" />
                <Field className="w-20 shrink-0" value={entry.tvgId} onChange={(v) => onChange(entry.id, { tvgId: v })} placeholder="tvg-id" />
                <Field className="w-24 shrink-0" value={entry.group} onChange={(v) => onChange(entry.id, { group: v })} placeholder="Group" />
                <Field className="w-40 shrink-0" value={entry.logo} onChange={(v) => onChange(entry.id, { logo: v })} placeholder="Logo URL" />
            </div>
            <button onClick={() => onRemove(entry.id)} className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity text-(--text-tertiary) hover:text-red-500"><X size={14} /></button>
        </div>
    );
}

function RadioRow({ entry, index, onChange, onRemove }: { entry: RadioEntry; index: number; onChange: (id: string, p: Partial<RadioEntry>) => void; onRemove: (id: string) => void }) {
    return (
        <div className="flex items-center gap-2 py-2 px-1 rounded-lg hover:bg-(--surface-raised) group transition-colors">
            <span className="text-(--text-tertiary) shrink-0"><GripVertical size={14} /></span>
            <span className="text-xs font-mono text-(--text-tertiary) w-5 shrink-0 text-right">{index + 1}</span>
            <div className="flex flex-1 items-center gap-2 min-w-0 flex-wrap sm:flex-nowrap">
                <Field className="flex-1 min-w-0" value={entry.url} onChange={(v) => onChange(entry.id, { url: v })} placeholder="Stream URL" />
                <Field className="w-36 shrink-0" value={entry.name} onChange={(v) => onChange(entry.id, { name: v })} placeholder="Station name" />
                <Field className="w-28 shrink-0" value={entry.genre} onChange={(v) => onChange(entry.id, { genre: v })} placeholder="Genre" />
            </div>
            <button onClick={() => onRemove(entry.id)} className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity text-(--text-tertiary) hover:text-red-500"><X size={14} /></button>
        </div>
    );
}

function VideoRow({ entry, index, onChange, onRemove }: { entry: VideoEntry; index: number; onChange: (id: string, p: Partial<VideoEntry>) => void; onRemove: (id: string) => void }) {
    return (
        <div className="flex items-center gap-2 py-2 px-1 rounded-lg hover:bg-(--surface-raised) group transition-colors">
            <span className="text-(--text-tertiary) shrink-0"><GripVertical size={14} /></span>
            <span className="text-xs font-mono text-(--text-tertiary) w-5 shrink-0 text-right">{index + 1}</span>
            <div className="flex flex-1 items-center gap-2 min-w-0 flex-wrap sm:flex-nowrap">
                <Field className="flex-1 min-w-0" value={entry.url} onChange={(v) => onChange(entry.id, { url: v })} placeholder="URL or file path" />
                <Field className="w-32 shrink-0" value={entry.title} onChange={(v) => onChange(entry.id, { title: v })} placeholder="Title" />
                <Field className="w-36 shrink-0" value={entry.description} onChange={(v) => onChange(entry.id, { description: v })} placeholder="Description" />
                <Field mono className="w-16 shrink-0"
                    value={entry.duration >= 0 ? formatDuration(entry.duration) : ""}
                    onChange={(v) => onChange(entry.id, { duration: parseDuration(v) })}
                    placeholder="0:00" />
            </div>
            <button onClick={() => onRemove(entry.id)} className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity text-(--text-tertiary) hover:text-red-500"><X size={14} /></button>
        </div>
    );
}

// ─── Column headers per mode ──────────────────────────────────────────────────

function ColumnHeaders({ mode }: { mode: PlaylistMode }) {
    const cols: [string, string][] =
        mode === "music"
            ? [["URL / Path", "flex-1 min-w-0"], ["Title", "w-28 shrink-0 hidden sm:block"], ["Artist", "w-24 shrink-0 hidden sm:block"], ["Album", "w-24 shrink-0 hidden sm:block"], ["Duration", "w-16 shrink-0 hidden sm:block"]]
            : mode === "iptv"
                ? [["Stream URL", "flex-1 min-w-0"], ["Channel Name", "w-28 shrink-0 hidden sm:block"], ["tvg-id", "w-20 shrink-0 hidden sm:block"], ["Group", "w-24 shrink-0 hidden sm:block"], ["Logo URL", "w-40 shrink-0 hidden sm:block"]]
                : mode === "radio"
                    ? [["Stream URL", "flex-1 min-w-0"], ["Station Name", "w-36 shrink-0 hidden sm:block"], ["Genre", "w-28 shrink-0 hidden sm:block"]]
                    : [["URL / Path", "flex-1 min-w-0"], ["Title", "w-32 shrink-0 hidden sm:block"], ["Description", "w-36 shrink-0 hidden sm:block"], ["Duration", "w-16 shrink-0 hidden sm:block"]];

    return (
        <div className="flex items-center gap-2 mb-1 px-1">
            <span className="w-5 shrink-0" />
            <span className="w-5 shrink-0" />
            <div className="flex flex-1 items-center gap-2 min-w-0">
                {cols.map(([label, cls]) => (
                    <Label key={label} size="xs" className={cls}>{label}</Label>
                ))}
            </div>
            <span className="w-4 shrink-0" />
        </div>
    );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function PlaylistGeneratorTool() {
    const [mode, setMode] = useState<PlaylistMode>("music");
    const [format, setFormat] = useState<PlaylistFormat>("m3u8");
    const [playlistName, setPlaylistName] = useState("My Playlist");
    const [entries, setEntries] = useState<Entry[]>([blankEntry("music")]);
    const [copied, setCopied] = useState(false);
    const [preview, setPreview] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // ── Mode switch ────────────────────────────────────────────────────────────

    const switchMode = (next: PlaylistMode) => {
        setMode(next);
        setFormat(MODE_INFO[next].defaultFormat);
        setEntries([blankEntry(next)]);
    };

    // ── Entry mutations ────────────────────────────────────────────────────────

    const addEntry = () => setEntries((prev) => [...prev, blankEntry(mode)]);

    const removeEntry = (id: string) =>
        setEntries((prev) => prev.filter((e) => e.id !== id));

    const changeEntry = useCallback(
        (id: string, patch: Partial<Entry>) =>
            setEntries((prev) =>
                prev.map((e) => (e.id === id ? ({ ...e, ...patch } as Entry) : e))
            ),
        []
    );

    const clearAll = () => {
        setEntries([blankEntry(mode)]);
        setPlaylistName("My Playlist");
    };

    // ── Import ────────────────────────────────────────────────────────────────

    const handleImport = (file: File) => {
        const reader = new FileReader();
        reader.onload = (ev) => {
            const text = ev.target?.result as string;
            const imported = parseM3UFile(text, mode);
            if (imported.length > 0) {
                setEntries(imported);
                setPlaylistName(file.name.replace(/\.[^.]+$/, ""));
            }
        };
        reader.readAsText(file);
    };

    // ── Export ────────────────────────────────────────────────────────────────

    const filledEntries = entries.filter((e) => e.url.trim());
    const generated = generatePlaylist(filledEntries, format, playlistName, mode);
    const info = FORMAT_INFO[format];
    const modeInfo = MODE_INFO[mode];
    const total = totalDuration(entries);
    const entryLabel = modeInfo.entryLabel;
    const allowedFormats = modeInfo.formats;

    const download = () => {
        const blob = new Blob([generated], { type: info.mime + ";charset=utf-8" });
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = `${playlistName.replace(/\s+/g, "_") || "playlist"}.${info.ext}`;
        a.click();
        URL.revokeObjectURL(a.href);
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(generated).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 1400);
        });
    };

    // ─── Render ───────────────────────────────────────────────────────────────

    return (
        <div className="space-y-2">
            {/* Hidden file input */}
            <input
                ref={fileInputRef}
                type="file"
                accept=".m3u,.m3u8,.pls"
                className="hidden"
                onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) handleImport(f);
                    e.target.value = "";
                }}
            />

            {/* ── Mode tabs ── */}
            <Panel className="p-1">
                <div className="flex gap-1">
                    {MODES.map((m) => {
                        const mi = MODE_INFO[m];
                        const Icon = mi.icon;
                        const active = m === mode;
                        return (
                            <button
                                key={m}
                                onClick={() => switchMode(m)}
                                className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-md text-sm font-medium transition-colors ${active
                                        ? "bg-(--surface-raised) text-(--text-primary) shadow-sm"
                                        : "text-(--text-secondary) hover:text-(--text-primary) hover:bg-(--surface-raised)/50"
                                    }`}
                            >
                                <Icon size={14} className="shrink-0" />
                                <span className="hidden sm:inline">{mi.label}</span>
                            </button>
                        );
                    })}
                </div>
            </Panel>

            {/* ── Toolbar ── */}
            <Panel className="space-y-2">
                {/* Row 1: name + format */}
                <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
                    <ListMusic size={16} className="shrink-0 text-(--text-secondary)" />
                    <input
                        className="flex-1 min-w-0 bg-transparent border-b border-(--border-default) focus:border-(--primary-500) outline-none text-sm font-medium text-(--text-primary) py-0.5"
                        value={playlistName}
                        onChange={(e) => setPlaylistName(e.target.value)}
                        placeholder="Playlist name"
                    />
                    <Select value={format} onValueChange={(v) => setFormat(v as PlaylistFormat)}>
                        <SelectTrigger className="w-28 shrink-0">{FORMAT_INFO[format].label}</SelectTrigger>
                        <SelectContent>
                            {allowedFormats.map((f) => (
                                <SelectItem key={f} value={f}>
                                    <span className="font-medium">{FORMAT_INFO[f].label}</span>
                                    <span className="ml-2 text-(--text-tertiary) text-xs hidden sm:inline">
                                        .{FORMAT_INFO[f].ext}
                                    </span>
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Description */}
                <p className="text-xs text-(--text-tertiary) pl-6">
                    <span className="font-medium text-(--text-secondary)">{modeInfo.label} · </span>
                    {modeInfo.description}
                    {" · "}
                    {info.description}
                </p>

                {/* Row 2: actions */}
                <div className="flex items-center gap-2 flex-wrap">
                    <Button variant="secondary" size="xs" icon={Upload} onClick={() => fileInputRef.current?.click()} title="Import an existing M3U or PLS file">
                        Import
                    </Button>
                    <Button variant="secondary" size="xs" icon={preview ? X : Copy} onClick={() => setPreview((p) => !p)}>
                        {preview ? "Hide preview" : "Preview"}
                    </Button>

                    <div className="flex-1" />

                    {total && (
                        <span className="flex items-center gap-1 text-xs text-(--text-tertiary)">
                            <Clock size={11} />
                            {total}
                        </span>
                    )}
                    <span className="text-xs text-(--text-tertiary)">
                        {filledEntries.length} {entryLabel}{filledEntries.length !== 1 ? "s" : ""}
                    </span>
                    <Button variant="ghost" size="xs" icon={CornerDownLeft} onClick={clearAll}>
                        Clear
                    </Button>
                </div>
            </Panel>

            {/* ── Entry list ── */}
            <Panel>
                <ColumnHeaders mode={mode} />
                <div className="border-t border-(--border-default) mb-1" />

                <div className="divide-y divide-(--border-subtle)">
                    {entries.map((entry, i) => {
                        if (entry.mode === "music")
                            return <MusicRow key={entry.id} entry={entry} index={i} onChange={changeEntry as any} onRemove={removeEntry} />;
                        if (entry.mode === "iptv")
                            return <IptvRow key={entry.id} entry={entry} index={i} onChange={changeEntry as any} onRemove={removeEntry} />;
                        if (entry.mode === "radio")
                            return <RadioRow key={entry.id} entry={entry} index={i} onChange={changeEntry as any} onRemove={removeEntry} />;
                        return <VideoRow key={entry.id} entry={entry as VideoEntry} index={i} onChange={changeEntry as any} onRemove={removeEntry} />;
                    })}
                </div>

                <button
                    onClick={addEntry}
                    className="mt-3 w-full flex items-center justify-center gap-2 py-2 rounded-lg border border-dashed border-(--border-default) text-xs text-(--text-tertiary) hover:text-(--text-secondary) hover:border-(--border-strong) transition-colors"
                >
                    <Plus size={13} />
                    Add {entryLabel}
                </button>
            </Panel>

            {/* ── Raw preview ── */}
            {preview && (
                <Panel>
                    <div className="flex items-center justify-between mb-2">
                        <Label>Preview — .{info.ext}</Label>
                        <Button size="xs" variant="secondary" icon={copied ? Check : Copy} className={copied ? "text-green-500" : ""} onClick={copyToClipboard}>
                            {copied ? "Copied" : "Copy"}
                        </Button>
                    </div>
                    <pre className="text-xs font-mono text-(--text-secondary) bg-(--surface-sunken) rounded-lg p-3 overflow-x-auto whitespace-pre leading-relaxed max-h-72 overflow-y-auto">
                        {filledEntries.length > 0 ? (
                            generated
                        ) : (
                            <span className="text-(--text-tertiary) italic">
                                Add at least one {entryLabel} URL to see output.
                            </span>
                        )}
                    </pre>
                </Panel>
            )}

            {/* ── Download bar ── */}
            <Panel className="flex items-center gap-3">
                {(() => { const Icon = modeInfo.icon; return <Icon size={15} className="text-(--text-secondary) shrink-0" />; })()}
                <div className="flex-1 min-w-0">
                    <p className="text-sm text-(--text-primary) font-medium truncate">
                        {playlistName || "playlist"}.{info.ext}
                    </p>
                    <p className="text-xs text-(--text-tertiary)">
                        {filledEntries.length === 0
                            ? `Add ${entryLabel}s above, then download.`
                            : `${filledEntries.length} ${entryLabel}${filledEntries.length !== 1 ? "s" : ""}${total ? ` · ${total}` : ""} · ${modeInfo.label} · ${info.label}`}
                    </p>
                </div>
                <Button onClick={copyToClipboard} variant="secondary" icon={copied ? Check : Copy} className={copied ? "text-green-500" : ""} disabled={filledEntries.length === 0} />
                <Button onClick={download} icon={Download} disabled={filledEntries.length === 0}>
                    Download
                </Button>
            </Panel>
        </div>
    );
}