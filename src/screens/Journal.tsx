import React, { useMemo, useState } from 'react';
import Card from '../components/Card';
import Button from '../components/Button';
import Input from '../components/Input';
import styles from './Journal.module.css';
import { useT, useI18nStore } from '../i18n';
import { useJournalStore, JournalEntry, entriesForTask } from '../store/journalStore';
import { TRAINING_TASKS } from '../data/trainingTasks';

const Journal: React.FC = () => {
  const t = useT();
  const lang = useI18nStore((s) => s.lang);
  const entries = useJournalStore((s) => s.entries);
  const addEntry = useJournalStore((s) => s.addEntry);
  const removeEntry = useJournalStore((s) => s.removeEntry);

  const [adding, setAdding] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [form, setForm] = useState({
    training: '',
    coffee: '',
    equipment: '',
    recipe: '',
    result: '',
    taste: '',
    problem: '',
    changed: '',
    nextStep: '',
    rating: 3,
  });

  const set = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const canSave = form.training.trim() !== '' && form.result.trim() !== '';

  const save = () => {
    if (!canSave) return;
    const matchedTask = TRAINING_TASKS.find(
      (task) => task.titleRu === form.training.trim() || task.titleEn === form.training.trim()
    );
    addEntry({ ...form, training: form.training.trim(), taskId: matchedTask?.id });
    setForm({
      training: '',
      coffee: '',
      equipment: '',
      recipe: '',
      result: '',
      taste: '',
      problem: '',
      changed: '',
      nextStep: '',
      rating: 3,
    });
    setAdding(false);
  };

  // Сравнение попыток: тренировки, встречающиеся более одного раза
  const comparable = useMemo(() => {
    const ids = new Set(entries.map((e) => e.taskId).filter((id): id is string => !!id));
    return Array.from(ids)
      .map((id) => ({ id, rows: entriesForTask(entries, id) }))
      .filter((g) => g.rows.length >= 2);
  }, [entries]);

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString(lang === 'en' ? 'en-US' : 'ru-RU', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });

  return (
    <div className={styles.journal}>
      <div className={styles.header}>
        <h1 className="srOnly">{t('journal.title')}</h1>
        
</div>

      {!adding && (
        <Button fullWidth onClick={() => setAdding(true)}>
          {t('journal.add')}
        </Button>
      )}

      {adding && (
        <Card className={styles.formCard}>
          <p className={styles.sectionLabel}>{t('journal.add')}</p>
          <div className={styles.formGrid}>
            <Input label={t('journal.field.training')} value={form.training} onChange={set('training')} fullWidth />
            <Input label={t('journal.field.coffee')} value={form.coffee} onChange={set('coffee')} fullWidth />
            <Input label={t('journal.field.equipment')} value={form.equipment} onChange={set('equipment')} fullWidth />
            <Input label={t('journal.field.recipe')} value={form.recipe} onChange={set('recipe')} fullWidth />
            <Input label={t('journal.field.result')} value={form.result} onChange={set('result')} fullWidth />
            <Input label={t('journal.field.taste')} value={form.taste} onChange={set('taste')} fullWidth />
            <Input label={t('journal.field.problem')} value={form.problem} onChange={set('problem')} fullWidth />
            <Input label={t('journal.field.changed')} value={form.changed} onChange={set('changed')} fullWidth />
            <Input label={t('journal.field.nextStep')} value={form.nextStep} onChange={set('nextStep')} fullWidth />
          </div>

          <div className={styles.ratingRow}>
            <span className={styles.ratingLabel}>{t('journal.field.rating')}</span>
            <div className={styles.ratingButtons} role="radiogroup" aria-label={t('journal.field.rating')}>
              {[1, 2, 3, 4, 5].map((v) => (
                <button
                  key={v}
                  type="button"
                  role="radio"
                  aria-checked={form.rating === v}
                  className={`${styles.ratingBtn} ${form.rating >= v ? styles.ratingOn : ''}`}
                  onClick={() => setForm((f) => ({ ...f, rating: v }))}
                >
                  ★
                </button>
              ))}
            </div>
          </div>

          <div className={styles.formActions}>
            <Button variant="secondary" size="small" onClick={() => setAdding(false)}>
              {t('common.cancel')}
            </Button>
            <Button size="small" disabled={!canSave} onClick={save}>
              {t('common.save')}
            </Button>
          </div>
        </Card>
      )}

      {entries.length === 0 && !adding && (
        <Card>
          <p className={styles.empty}>{t('journal.empty')}</p>
        </Card>
      )}

      <div className={styles.timeline}>
        {entries.map((entry: JournalEntry) => (
          <Card key={entry.id} className={styles.entryCard}>
            <button
              type="button"
              className={styles.entryHead}
              onClick={() => setExpandedId(expandedId === entry.id ? null : entry.id)}
              aria-expanded={expandedId === entry.id}
            >
              <div className={styles.entryMeta}>
                <span className={styles.entryDate}>{formatDate(entry.createdAt)}</span>
                <span className={styles.entryRating} aria-label={`${entry.rating}/5`}>
                  {'★'.repeat(entry.rating)}
                  <span className={styles.ratingOff}>{'★'.repeat(5 - entry.rating)}</span>
                </span>
              </div>
              <p className={styles.entryTraining}>{entry.training}</p>
              {(entry.coffee || entry.equipment) && (
                <p className={styles.entrySub}>
                  {[entry.coffee, entry.equipment].filter(Boolean).join(' · ')}
                </p>
              )}
            </button>

            {expandedId === entry.id && (
              <div className={styles.entryBody}>
                <Detail label={t('journal.field.recipe')} value={entry.recipe} />
                <Detail label={t('journal.field.result')} value={entry.result} />
                <Detail label={t('journal.field.taste')} value={entry.taste} />
                <Detail label={t('journal.field.problem')} value={entry.problem} />
                <Detail label={t('journal.field.changed')} value={entry.changed} />
                <Detail label={t('journal.field.nextStep')} value={entry.nextStep} highlight />
                <button type="button" className={styles.delete} onClick={() => removeEntry(entry.id)}>
                  {t('journal.delete')}
                </button>
              </div>
            )}
          </Card>
        ))}
      </div>

      {comparable.length > 0 && (
        <section className={styles.compareSection}>
          <h2 className={styles.compareTitle}>{t('journal.compare')}</h2>
          {comparable.map((group) => {
            const task = TRAINING_TASKS.find((task) => task.id === group.id);
            const name = task ? (lang === 'en' ? task.titleEn : task.titleRu) : group.id;
            return (
              <Card key={group.id} className={styles.compareCard}>
                <p className={styles.compareName}>{name}</p>
                <div className={styles.compareRows}>
                  {group.rows
                    .slice()
                    .reverse()
                    .map((row, i) => (
                      <div key={row.id} className={styles.compareRow}>
                        <span className={styles.compareIdx}>#{i + 1}</span>
                        <span className={styles.compareDate}>{formatDate(row.createdAt)}</span>
                        <span className={styles.compareResult}>{row.result || '—'}</span>
                        <span className={styles.compareRating}>{'★'.repeat(row.rating)}</span>
                      </div>
                    ))}
                </div>
              </Card>
            );
          })}
        </section>
      )}
    </div>
  );
};

const Detail: React.FC<{ label: string; value: string; highlight?: boolean }> = ({ label, value, highlight }) => {
  if (!value) return null;
  return (
    <div className={`${styles.detail} ${highlight ? styles.detailHighlight : ''}`}>
      <span className={styles.detailLabel}>{label}</span>
      <span className={styles.detailValue}>{value}</span>
    </div>
  );
};

export default Journal;
