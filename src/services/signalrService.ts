import { HubConnectionBuilder, HubConnection, LogLevel } from '@microsoft/signalr';

const HUB_URL = `${import.meta.env.VITE_API_URL}/hubs/articles`;

let connection: HubConnection | null = null;

export function buildConnection(): HubConnection {
  if (connection) return connection;

  connection = new HubConnectionBuilder()
    .withUrl(HUB_URL)
    .withAutomaticReconnect()
    .configureLogging(LogLevel.Warning)
    .build();

  return connection;
}

export async function startConnection(): Promise<void> {
  const conn = buildConnection();

  if (conn.state === 'Disconnected') {
    await conn.start();
    console.log('[SignalR] Terhubung ke hub artikel');
  }
}

export async function stopConnection(): Promise<void> {
  if (connection && connection.state !== 'Disconnected') {
    await connection.stop();
    console.log('[SignalR] Koneksi ditutup');
  }
}

export function onArticleCreated(callback: (article: unknown) => void): void {
  buildConnection().on('ArticleCreated', callback);
}

export function offArticleCreated(): void {
  buildConnection().off('ArticleCreated');
}
