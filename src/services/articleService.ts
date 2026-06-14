import { api } from './apiClient';
import type { Article } from '../types';

export function getArticles(): Promise<Article[]> {
  return api<Article[]>('/articles');
}

export function getArticleById(id: number): Promise<Article> {
  return api<Article>(`/articles/${id}`);
}

export function addArticle(data: { title: string; summary: string; content: string }): Promise<Article> {
  return api<Article>('/articles', { method: 'POST', body: JSON.stringify(data) });
}
