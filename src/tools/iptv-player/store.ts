import Dexie, { type Table } from 'dexie';

export interface FavoriteChannel {
  id: string; // Usually the stream URL
  name: string;
  url: string;
  group?: string;
  logo?: string;
  addedAt: number;
}

export interface HistoryItem {
  id: string; // Stream URL
  name: string;
  url: string;
  group?: string;
  logo?: string;
  lastPlayedAt: number;
}

export interface Preferences {
  key: string;
  value: string; // Sticking to string/JSON for simplicity
}

export class IptvDatabase extends Dexie {
  favorites!: Table<FavoriteChannel, string>;
  history!: Table<HistoryItem, string>;
  preferences!: Table<Preferences, string>;

  constructor() {
    super('KnicknaksIptvDb');
    this.version(1).stores({
      favorites: 'id, name, group, addedAt',
      history: 'id, lastPlayedAt',
      preferences: 'key'
    });
  }
}

export const db = new IptvDatabase();
