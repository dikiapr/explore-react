import { useAppSelector } from '../store/hooks';
import ArticleCard from '../components/ArticleCard';
import s from './HomePage.module.scss';

export default function HomePage() {
  const { items, status } = useAppSelector((s) => s.articles);

  return (
    <div>
      <h1 className={s.heading}>Daftar Artikel</h1>
      {status === 'loading' && <p className={s.empty}>Memuat artikel...</p>}
      {status === 'failed' && <p className={s.empty}>Gagal memuat artikel. Coba refresh halaman.</p>}
      {status === 'idle' && items.length === 0 && (
        <p className={s.empty}>Belum ada artikel. Tulis artikel pertamamu!</p>
      )}
      <div className={s.list}>
        {items.map((article) => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </div>
    </div>
  );
}
