import { useEffect, useRef, useState } from 'react';
import { useAppSelector } from '../store/hooks';
import { startChat, sendMessage, onMessageReceived, offMessageReceived } from '../services/chatService';
import type { ChatMessage } from '../types';
import s from './ChatPage.module.scss';

export default function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [draft, setDraft] = useState('');
  const currentUser = useAppSelector((state) => state.auth.currentUser);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let active = true;

    startChat()
      .then(() => {
        if (!active) return;
        onMessageReceived((msg) => {
          setMessages((prev) => [...prev, msg]);
        });
      })
      .catch((err) => console.error('[Chat] Gagal connect:', err));

    return () => {
      active = false;
      offMessageReceived();
    };
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    const text = draft.trim();
    if (!text) return;
    setDraft('');
    try {
      await sendMessage(text);
    } catch (err) {
      console.error('[Chat] Gagal kirim:', err);
    }
  }

  return (
    <div className={s.chat}>
      <h1>Chat</h1>
      <div className={s.messages}>
        {messages.map((m, i) => (
          <div
            key={i}
            className={`${s.bubble} ${m.user === currentUser?.username ? s.mine : ''}`}
          >
            <span className={s.author}>{m.user}</span>
            <p className={s.text}>{m.message}</p>
            <span className={s.time}>
              {new Date(m.sentAt).toLocaleTimeString()}
            </span>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
      <form className={s.form} onSubmit={handleSend}>
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Tulis pesan..."
        />
        <button type="submit">Kirim</button>
      </form>
    </div>
  );
}
