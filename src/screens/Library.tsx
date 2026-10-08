import React, { useState } from 'react';
import Card from '../components/Card';
import Button from '../components/Button';
import Badge from '../components/Badge';
import styles from './Library.module.css';

interface Article {
  id: string;
  title: string;
  category: string;
  level: 'BASE' | 'MEDIUM' | 'PRO';
  readTime: number;
  isRead: boolean;
}

const articles: Article[] = [
  { id: '1', title: 'Ботаника кофейной вишни', category: 'Зерно', level: 'BASE', readTime: 5, isRead: true },
  { id: '2', title: 'Обработка: натуральная, мытая, honey', category: 'Зерно', level: 'BASE', readTime: 8, isRead: false },
  { id: '3', title: 'Химия обжарки: реакция Майяра', category: 'Обжарка', level: 'PRO', readTime: 12, isRead: false },
  { id: '4', title: 'Экстракция: TDS и EY на практике', category: 'Экстракция', level: 'MEDIUM', readTime: 10, isRead: true },
  { id: '5', title: 'Вода для кофе: SCA стандарты', category: 'Вода', level: 'MEDIUM', readTime: 7, isRead: false },
  { id: '6', title: 'Каппинг по протоколу SCA', category: 'Сенсорика', level: 'MEDIUM', readTime: 9, isRead: false },
  { id: '7', title: 'Латте-арт: основы', category: 'Молоко', level: 'BASE', readTime: 6, isRead: true },
  { id: '8', title: 'Сигнатурные напитки: разработка ТТК', category: 'Меню', level: 'PRO', readTime: 15, isRead: false },
];

const categories = ['Все', 'Зерно', 'Обжарка', 'Экстракция', 'Вода', 'Сенсорика', 'Молоко', 'Меню'];

const Library: React.FC = () => {
  const [filter, setFilter] = useState(categories[0]);
  const [selected, setSelected] = useState<Article | null>(null);

  const filtered = articles.filter((a) => filter === 'Все' || a.category === filter);

  return (
    <div className={styles.library}>
      <div className={styles.header}>
        <h1 className={styles.title}>Библиотека</h1>
      </div>

      <div className={styles.filters}>
        {categories.map((c) => (
          <Button
            key={c}
            variant={filter === c ? 'primary' : 'secondary'}
            size="small"
            onClick={() => setFilter(c)}
          >
            {c}
          </Button>
        ))}
      </div>

      <div className={styles.layout}>
        <div className={styles.list}>
          {filtered.map((article) => (
            <Card
              key={article.id}
              className={`${styles.item} ${selected?.id === article.id ? styles.selected : ''}`}
              onClick={() => setSelected(article)}
            >
              <div className={styles.itemHeader}>
                <Badge variant={article.level === 'PRO' ? 'danger' : article.level === 'MEDIUM' ? 'warning' : 'primary'}>
                  {article.level}
                </Badge>
                <span className={styles.category}>{article.category}</span>
              </div>
              <h3 className={styles.itemTitle}>{article.title}</h3>
              <div className={styles.itemMeta}>
                <span>{article.readTime} мин</span>
                {article.isRead && <span className={styles.read}>✓ Прочитано</span>}
              </div>
            </Card>
          ))}
        </div>

        {selected && (
          <div className={styles.preview}>
            <Card>
              <div className={styles.previewHeader}>
                <Badge variant={selected.level === 'PRO' ? 'danger' : selected.level === 'MEDIUM' ? 'warning' : 'primary'}>
                  {selected.level}
                </Badge>
                <span className={styles.previewCategory}>{selected.category}</span>
              </div>
              <h2 className={styles.previewTitle}>{selected.title}</h2>
              <div className={styles.previewContent}>
                <p>Содержание статьи будет здесь. Это превью выбранной статьи из библиотеки знаний.</p>
                <p>Здесь будет полный текст урока с иллюстрациями, схемами и практическими заданиями.</p>
              </div>
              <div className={styles.previewMeta}>
                <span>{selected.readTime} мин чтения</span>
                <Button variant="primary" size="small">Читать</Button>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default Library;