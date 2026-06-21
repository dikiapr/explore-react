export interface User {
  id: number;
  username: string;
  email: string;
}

export interface Article {
  id: number;
  title: string;
  summary: string;
  content: string;
  authorName: string;
  createdAt: string;
}

export interface ChatMessage {
  user: string;
  message: string;
  sentAt: string;
}
