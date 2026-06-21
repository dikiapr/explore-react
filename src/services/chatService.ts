import { HubConnectionBuilder, HubConnection, LogLevel } from '@microsoft/signalr';
import { getToken } from './apiClient';
import type { ChatMessage } from '../types';

const HUB_URL = `${import.meta.env.VITE_API_URL}/hubs/chat`;

let connection: HubConnection | null = null;

function buildConnection(): HubConnection {
  if (connection) return connection;

  connection = new HubConnectionBuilder()
    .withUrl(HUB_URL, {
      accessTokenFactory: () => getToken() ?? '',
    })
    .withAutomaticReconnect()
    .configureLogging(LogLevel.Warning)
    .build();

  return connection;
}

export async function startChat(): Promise<void> {
  const conn = buildConnection();
  if (conn.state === 'Disconnected') {
    await conn.start();
    console.log('[Chat] Terhubung ke hub chat');
  }
}

export async function sendMessage(message: string): Promise<void> {
  await buildConnection().invoke('SendMessage', message);
}

export function onMessageReceived(callback: (msg: ChatMessage) => void): void {
  buildConnection().on('ReceiveMessage', callback);
}

export function offMessageReceived(): void {
  buildConnection().off('ReceiveMessage');
}
