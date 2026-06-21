import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from './store/hooks';
import { addArticle, fetchArticles } from './store/slices/articlesSlice';
import { restoreSession } from './store/slices/authSlice';
import { getToken } from './services/apiClient';
import { startConnection, onArticleCreated, offArticleCreated } from './services/signalrService';
import type { Article } from './types';
import MasterLayout from './layout/MasterLayout';
import ProtectedRoute from './components/ProtectedRoute';
import HomePage from './pages/HomePage';
import ArticleDetailPage from './pages/ArticleDetailPage';
import WriteArticlePage from './pages/WriteArticlePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

export default function App() {
  const dispatch = useAppDispatch();
  const sessionStatus = useAppSelector((s) => s.auth.sessionStatus);
  const currentUser = useAppSelector((s) => s.auth.currentUser);

  useEffect(() => {
    dispatch(fetchArticles());
    if (getToken()) {
      dispatch(restoreSession());
    }
  }, [dispatch]);

  useEffect(() => {
    let active = true;

    startConnection()
      .then(() => {
        if (!active) return; // efek sudah di-cleanup, jangan daftar listener
        onArticleCreated((article) => {
          dispatch(addArticle(article as Article));
        });
      })
      .catch((err) => console.error('[SignalR] Gagal connect:', err));

    return () => {
      active = false;
      offArticleCreated(); // cukup lepas listener; koneksi global biarkan hidup
    };
  }, [dispatch]);

  const isRestoring = sessionStatus === 'loading' && !currentUser;

  if (isRestoring) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--gray-500)' }}>
        Memuat sesi...
      </div>
    );
  }

  return (
    <Routes>
      <Route element={<MasterLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/article/:id" element={<ArticleDetailPage />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/write" element={<WriteArticlePage />} />
        </Route>
      </Route>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
    </Routes>
  );
}
