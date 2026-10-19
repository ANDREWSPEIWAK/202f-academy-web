import React from 'react';
import Card from '../components/Card';
import ProgressBar from '../components/ProgressBar';
import styles from './Discipline.module.css';
import { useT } from '../i18n';

/**
 * Ежедневные стандарты станции. Чек-лист привязан к дате:
 * новый день — новый лист. Хранится в localStorage.
 */
const STANDARDS: { id: string; text: string }[] = [
  { id: 'd1', text: 'Кофемашина и grinder прогреты, продуты паровики' },
  { id: 'd2', text: 'Калибровка помола по первому проливу (весы + таймер)' },
  { id: 'd3', text: 'Питчер, шейкеры, джиггеры — вымыты и продезинфицированы' },
  { id: 'd4', text: 'Холодильник: молоко ≤ +4 °C, FIFO по срокам' },
  { id: 'd5', text: 'Рабочая поверхность: чистая, сухая, без посторонних предметов' },
  { id: 'd6', text: 'Вода: фильтр проверен, TDS в норме по журналу' },
  { id: 'd7', text: 'Вкус тест-шота записан в журнал до открытия' },
  { id: 'd8', text: 'Каждые 2 часа: продув группы, протирка холдеров, wipe станции' },
];

const KEY = '202f-discipline';

function loadToday(): Record<string, boolean> {
  const today = new Date().toISOString().slice(0, 10);
  try {
    const raw = JSON.parse(localStorage.getItem(KEY) || '{}');
    return raw.date === today ? raw.checks : {};
  } catch {
    return {};
  }
}

function saveToday(checks: Record<string, boolean>) {
  localStorage.setItem(KEY, JSON.stringify({ date: new Date().toISOString().slice(0, 10), checks }));
}

const Discipline: React.FC = () => {
  const t = useT();
  const checks = loadToday();
  const done = STANDARDS.filter((s) => checks[s.id]).length;
  const all = done === STANDARDS.length;

  const toggle = (id: string) => {
    const next = { ...checks, [id]: !checks[id] };
    saveToday(next);
    // перерисовка: локальное состояние через forceUpdate-паттерн не нужен —
    // React обновит компонент при следующем рендере, поэтому используем key-трюк ниже
    window.dispatchEvent(new Event('202f-discipline-change'));
  };

  const [, setTick] = React.useReducer((x: number) => x + 1, 0);
  React.useEffect(() => {
    const h = () => setTick();
    window.addEventListener('202f-discipline-change', h);
    return () => window.removeEventListener('202f-discipline-change', h);
  }, []);

  return (
    <div className={styles.discipline}>
      <h1 className="srOnly">{t('discipline.title')}</h1>

      <Card>
        <ProgressBar value={Math.round((done / STANDARDS.length) * 100)} label={t('discipline.daily')} />
        {all ? (
          <p className={styles.done}>{t('discipline.doneToday')}</p>
        ) : (
          <p className={styles.hint}>{t('discipline.reset')}</p>
        )}
      </Card>

      <div className={styles.list}>
        {STANDARDS.map((s) => (
          <label key={s.id} className={`${styles.item} ${checks[s.id] ? styles.itemDone : ''}`}>
            <input
              type="checkbox"
              className={styles.checkbox}
              checked={!!checks[s.id]}
              onChange={() => toggle(s.id)}
            />
            <span className={styles.text}>{s.text}</span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default Discipline;
