import React, { useState } from 'react';
import Card from '../components/Card';
import Button from '../components/Button';
import styles from './Shift.module.css';
import { useShiftStore } from '../store/shiftStore';
import { useT } from '../i18n';

function fmt(iso: string): string {
  return new Date(iso).toLocaleString(undefined, {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

const Shift: React.FC = () => {
  const t = useT();
  const { open, history, openShift, closeShift, addDrinks, addIncident, addNote } = useShiftStore();
  const [incident, setIncident] = useState('');
  const [note, setNote] = useState('');

  if (!open) {
    return (
      <div className={styles.shift}>
        <h1 className={styles.title}>{t('shift.title')}</h1>
        <Card>
          <p className={styles.empty}>{t('shift.noShift')}</p>
          <Button fullWidth onClick={openShift}>
            {t('shift.start')}
          </Button>
        </Card>

        {history.length > 0 && (
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>{t('shift.history')}</h2>
            <div className={styles.list}>
              {history.map((s) => (
                <Card key={s.id}>
                  <div className={styles.historyRow}>
                    <span className={styles.historyDate}>
                      {fmt(s.openedAt)} → {fmt(s.closedAt)}
                    </span>
                    <span className={styles.historyDrinks}>
                      {s.drinks} {t('shift.drinks').toLowerCase()}
                    </span>
                  </div>
                  {s.incidents.length > 0 && (
                    <p className={styles.historyMeta}>
                      {t('shift.issues')}: {s.incidents.length}
                    </p>
                  )}
                </Card>
              ))}
            </div>
          </section>
        )}
      </div>
    );
  }

  return (
    <div className={styles.shift}>
      <h1 className={styles.title}>{t('shift.title')}</h1>

      <Card className={styles.activeCard}>
        <div className={styles.activeTop}>
          <span className={styles.liveDot} aria-hidden="true" />
          <div>
            <p className={styles.activeLabel}>{t('shift.active')}</p>
            <p className={styles.activeSince}>{fmt(open.openedAt)}</p>
          </div>
        </div>
        <div className={styles.counters}>
          <div className={styles.counter}>
            <span className={styles.counterValue}>{open.drinks}</span>
            <span className={styles.counterLabel}>{t('shift.drinks')}</span>
          </div>
          <div className={styles.counter}>
            <span className={styles.counterValue}>{open.incidents.length}</span>
            <span className={styles.counterLabel}>{t('shift.issues')}</span>
          </div>
          <div className={styles.counter}>
            <span className={styles.counterValue}>{open.notes.length}</span>
            <span className={styles.counterLabel}>{t('shift.notes')}</span>
          </div>
        </div>
        <Button variant="secondary" fullWidth onClick={() => addDrinks(10)}>
          {t('shift.addDrink')}
        </Button>
        <Button variant="danger" fullWidth onClick={closeShift}>
          {t('shift.close')}
        </Button>
      </Card>

      <Card>
        <p className={styles.blockLabel}>{t('shift.issues')}</p>
        <div className={styles.inputRow}>
          <input
            className={styles.input}
            value={incident}
            onChange={(e) => setIncident(e.target.value)}
            placeholder={t('shift.issuePlaceholder')}
          />
          <Button
            onClick={() => {
              addIncident(incident);
              setIncident('');
            }}
            disabled={!incident.trim()}
          >
            +
          </Button>
        </div>
        {open.incidents.length > 0 && (
          <ul className={styles.logList}>
            {open.incidents.map((i) => (
              <li key={i.id} className={styles.logItem}>
                <span className={styles.logTime}>{fmt(i.at)}</span>
                <span>{i.text}</span>
              </li>
            ))}
          </ul>
        )}
      </Card>

      <Card>
        <p className={styles.blockLabel}>{t('shift.notes')}</p>
        <div className={styles.inputRow}>
          <input
            className={styles.input}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder={t('shift.notePlaceholder')}
          />
          <Button
            onClick={() => {
              addNote(note);
              setNote('');
            }}
            disabled={!note.trim()}
          >
            +
          </Button>
        </div>
        {open.notes.length > 0 && (
          <ul className={styles.logList}>
            {open.notes.map((n) => (
              <li key={n.id} className={styles.logItem}>
                <span className={styles.logTime}>{fmt(n.at)}</span>
                <span>{n.text}</span>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
};

export default Shift;
