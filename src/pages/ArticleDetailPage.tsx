import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchArticleById } from '../store/slices/articlesSlice';
import s from './ArticleDetailPage.module.scss';

export default function ArticleDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const numericId = id ? Number(id) : NaN;
  const article = useAppSelector((s) =>
    Number.isFinite(numericId)
      ? (s.articles.items.find((a) => a.id === numericId) ?? null)
      : null,
  );
  const detailStatus = useAppSelector((s) => s.articles.detailStatus);

  useEffect(() => {
    if (!article && Number.isFinite(numericId)) {
      dispatch(fetchArticleById(numericId));
    }
  }, [article, numericId, dispatch]);

  if (article) {
    const tanggal = new Date(article.createdAt).toLocaleDateString('id-ID', {
      day: 'numeric', month: 'long', year: 'numeric',
    });

    return (
      <div className={s.wrapper}>
        <button className={s.backBtn} onClick={() => navigate(-1)}>← Kembali</button>
        <h1 className={s.title}>{article.title}</h1>
        <p className={s.summary}>{article.summary}</p>
        <span className={s.meta}>
          Ditulis oleh <strong>{article.authorName}</strong> · {tanggal}
        </span>
        <hr className={s.divider} />
        <div className={s.content}>{article.content}</div>
      </div>
    );
  }

  if (detailStatus === 'notFound') {
    return (
      <div>
        <p className={s.notFound}>Artikel tidak ditemukan.</p>
        <button className={s.backBtn} onClick={() => navigate(-1)}>← Kembali</button>
      </div>
    );
  }

  return (
    <div>
      <p className={s.notFound}>Memuat artikel...</p>
      <button className={s.backBtn} onClick={() => navigate(-1)}>← Kembali</button>
    </div>
  );
}
