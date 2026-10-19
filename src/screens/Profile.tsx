import React, { useCallback, useEffect, useState } from 'react';
import { useProgressStore } from '../store';
import { ranks, badges, rankFor, badgeFor } from '../data/gamification';
import { ProgressRing, Bar, Pill, SectionHead, EmptyNote } from '../components/app-ui';

const BG = '#161c1c';
const CARD = '#222a2a';
const AQUA = '#4FBBBC';
const HEAT = '#F39120';
const RUST = '#EC4624';
const CREAM = '#E2DAC2';
const MUTED = '#8a9a9a';
const LINE = '#2d3a3a';
const INK = '#1a2121';

const rankColor = (id: string): string => {
  switch (id) {
    case 'trainee': return AQUA;
    case 'barista': return HEAT;
    case 'senior': return RUST;
    case 'head': return '#B8860B';
    case 'legend': return '#9B59B6';
    default: return CREAM;
  }
};

const Panel = ({ children }: { children: React.ReactNode }) => (
  <section className="anim-rise" style={{ background: CARD, border: `1px solid ${LINE}`, borderRadius: 16, padding: 20, marginBottom: 16 }}>
    {children}
  </section>
);

const StatCard = ({ label, value, color }: { label: string; value: string | number; color: string }) => (
  <div className="anim-pop" style={{ background: INK, border: `1px solid ${LINE}`, borderRadius: 12, padding: 14 }}>
    <p style={{ margin: '0 0 6px 0', fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', color: MUTED }}>{label}</p>
    <p style={{ margin: 0, fontSize: 26, fontWeight: 800, color, letterSpacing: '-0.02em' }}>{value}</p>
  </div>
);

const Profile: React.FC = () => {
  const state = useProgressStore();
  const { xp, streak, known, lessonsRead, examKnown, quizBest, blitzBest, rushBest, days, earnedBadges, quests, dayOpened, resetAll, claimCode, syncNow } = state;

  const [deviceId, setDeviceId] = useState<string | null>(null);
  const [copyOk, setCopyOk] = useState(false);
  const [code, setCode] = useState('');
  const [syncStatus, setSyncStatus] = useState<'idle' | 'ok' | 'err'>('idle');
  const [syncMsg, setSyncMsg] = useState('');

  const knownCount = Object.keys(known).length;
  const examKnownCount = Object.keys(examKnown).length;
  const lessonsCount = Object.keys(lessonsRead).length;
  const daysCount = days.length;

  const rank = rankFor(xp);
  const nextRank = rank.next;
  const pct = nextRank ? Math.round((rank.into / Math.max(1, rank.span)) * 100) : 100;
  const xpToNext = nextRank ? Math.max(0, nextRank.xp - xp) : 0;

  const computedEarned = new Set(badgeFor({
    knownCount,
    quizBest,
    blitzBest,
    streak: streak.count,
    rushBest,
    days: daysCount,
    examKnownCount,
    questsDoneToday: quests.items.filter((q) => q.done).length,
    questsTotalToday: quests.items.length,
    checklistsDoneToday: Object.values(state.checklistsDone).flat(),
  }));

  useEffect(() => {
    dayOpened();
    const stored = localStorage.getItem('202f:deviceId');
    if (stored) {
      setDeviceId(stored);
    } else {
      const id = `dev-${Math.random().toString(36).slice(2, 10)}`;
      localStorage.setItem('202f:deviceId', id);
      setDeviceId(id);
    }
  }, [dayOpened]);

  const handleCopy = useCallback(() => {
    if (!deviceId || !navigator.clipboard) return;
    navigator.clipboard.writeText(deviceId).then(() => {
      setCopyOk(true);
      setTimeout(() => setCopyOk(false), 1500);
    });
  }, [deviceId]);

  const handleClaim = useCallback(() => {
    if (!code.trim()) return;
    claimCode(code.trim());
    setSyncMsg(`Код ${code.trim()} отправлен на привязку`);
    setSyncStatus('ok');
    setCode('');
  }, [claimCode, code]);

  const handleSync = useCallback(() => {
    setSyncStatus('idle');
    syncNow();
    setSyncMsg('Синхронизация запрашивается…');
    setTimeout(() => setSyncStatus('ok'), 900);
  }, [syncNow]);

  const handleReset = useCallback(() => {
    if (window.confirm('Сбросить весь прогресс? Это действие необратимо.')) {
      resetAll();
      setSyncMsg('Прогресс сброшен');
    }
  }, [resetAll]);

  const stats = [
    { label: 'Стрик', value: streak.count, color: AQUA },
    { label: 'ТТК', value: knownCount, color: HEAT },
    { label: 'Экзамен', value: examKnownCount, color: RUST },
    { label: 'Методики', value: lessonsCount, color: CREAM },
    { label: 'Квиз', value: `${quizBest}%`, color: AQUA },
    { label: 'Блиц', value: blitzBest, color: HEAT },
    { label: 'Rush', value: rushBest, color: RUST },
    { label: 'Дней', value: daysCount, color: CREAM },
  ];

  return (
    <div style={{ background: BG, minHeight: '100vh', color: CREAM, padding: 24 }}>
      <SectionHead kicker="Профиль" title="Профиль" sub="Ваш прогресс, ранг, бейджи и синхронизация устройств" />

      <Panel>
        <h2 style={{ margin: '0 0 12px 0', fontSize: 20, fontWeight: 800, color: CREAM }}>Ранг и XP</h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
          <ProgressRing value={pct} size={120} color={rankColor(rank.current.id)} />
          <div style={{ flex: 1, minWidth: 200 }}>
            <p style={{ margin: '0 0 4px 0', fontSize: 22, fontWeight: 800, color: CREAM }}>{rank.current.title}</p>
            <p style={{ margin: '0 0 10px 0', fontSize: 13, color: MUTED }}>{rank.current.perk}</p>
            <p style={{ margin: '0 0 8px 0', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: AQUA }}>XP: {xp.toLocaleString('ru-RU')}</p>
            {nextRank ? (
              <>
                <p style={{ margin: '0 0 6px 0', fontSize: 12, color: MUTED }}>До следующего ранга: {xpToNext.toLocaleString('ru-RU')} XP</p>
                <Bar value={pct} color={rankColor(rank.current.id)} h={8} />
              </>
            ) : (
              <p style={{ margin: 0, fontSize: 12, color: AQUA, fontWeight: 700 }}>Максимальный ранг достигнут</p>
            )}
          </div>
        </div>
        <p style={{ margin: '14px 0 10px 0', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: MUTED }}>Все ранги</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: 10 }}>
          {ranks.map((r) => {
            const done = xp >= r.xp;
            return (
              <div key={r.id} className="anim-pop" style={{ background: INK, border: `1px solid ${LINE}`, borderRadius: 10, padding: 10, opacity: done ? 1 : 0.5 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 6 }}>
                  <span style={{ fontWeight: 800, color: done ? CREAM : MUTED, fontSize: 13 }}>{r.title}</span>
                  <Pill color={rankColor(r.id)}>{done ? 'Получен' : `${r.xp} XP`}</Pill>
                </div>
                <p style={{ margin: '0 0 8px 0', fontSize: 11, color: MUTED, lineHeight: 1.35 }}>{r.perk}</p>
                <Bar value={done ? 100 : Math.min(100, Math.round((xp / Math.max(1, r.xp)) * 100))} color={rankColor(r.id)} h={5} />
              </div>
            );
          })}
        </div>
      </Panel>

      <Panel>
        <SectionHead kicker="Статистика" title="Показатели смены" />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
          {stats.map((s) => (
            <StatCard key={s.label} label={s.label} value={s.value} color={s.color} />
          ))}
        </div>
      </Panel>

      <Panel>
        <SectionHead kicker="Бейджи" title="Коллекция" sub={`Получено ${earnedBadges.length} из ${badges.length}`} />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 12 }}>
          {badges.map((b) => {
            const isEarned = computedEarned.has(b.id);
            return (
              <div key={b.id} className="anim-pop" style={{
                background: INK, border: `1px solid ${LINE}`, borderRadius: 12, padding: 12,
                opacity: isEarned ? 1 : 0.45, filter: isEarned ? 'none' : 'grayscale(1)',
                transition: 'all 0.2s ease',
              }}>
                <div style={{ fontSize: 24, lineHeight: 1, marginBottom: 8 }} aria-hidden="true">{b.icon}</div>
                <p style={{ margin: '0 0 4px 0', fontSize: 13, fontWeight: 800, color: CREAM }}>{b.title}</p>
                <p style={{ margin: 0, fontSize: 10.5, color: MUTED, lineHeight: 1.35 }}>{b.desc}</p>
              </div>
            );
          })}
        </div>
        {badges.length === 0 && <EmptyNote>Бейджи пока не доступны</EmptyNote>}
      </Panel>

      <Panel>
        <SectionHead kicker="Синхронизация" title="Устройство" sub="Привязка к аккаунту и обмен данными" />
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12, flexWrap: 'wrap' }}>
          <Pill color={syncStatus === 'ok' ? AQUA : syncStatus === 'err' ? RUST : AQUA}>
            {syncStatus === 'ok' ? 'Синхронизировано' : syncStatus === 'err' ? 'Ошибка' : 'Готово'}
          </Pill>
          {deviceId && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: INK, border: `1px solid ${LINE}`, borderRadius: 8, padding: '6px 10px' }}>
              <span style={{ fontSize: 11, fontFamily: 'monospace', color: CREAM, fontWeight: 700 }}>{deviceId}</span>
              <button type="button" onClick={handleCopy} style={{ background: 'transparent', border: 'none', color: AQUA, cursor: 'pointer', padding: 4, borderRadius: 4, fontWeight: 700 }}>
                {copyOk ? 'Скопировано' : 'Копировать ID'}
              </button>
            </div>
          )}
        </div>
        <div style={{ display: 'flex', gap: 8, marginBottom: 12, alignItems: 'flex-end', flexWrap: 'wrap' }}>
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="claimCode"
            style={{ background: INK, border: `1px solid ${LINE}`, borderRadius: 8, color: CREAM, padding: '8px 12px', flex: 1, minWidth: 140, fontSize: 13 }}
          />
          <button type="button" onClick={handleClaim} disabled={!code.trim()} style={{ background: AQUA, color: '#000', border: 'none', borderRadius: 8, padding: '8px 16px', fontWeight: 800, cursor: code.trim() ? 'pointer' : 'default', opacity: code.trim() ? 1 : 0.5 }}>
            Загрузить
          </button>
          <button type="button" onClick={handleSync} style={{ background: '#2d3a3a', border: `1px solid ${LINE}`, borderRadius: 8, color: CREAM, padding: '8px 16px', fontWeight: 800, cursor: 'pointer' }}>
            Синхронизировать
          </button>
        </div>
        {syncMsg && <p style={{ margin: 0, fontSize: 12, color: syncStatus === 'ok' ? AQUA : MUTED }}>{syncMsg}</p>}
      </Panel>

      <Panel>
        <SectionHead kicker="Сброс" title="Удалить прогресс" sub="Необратимо удаляет XP, отметки, чек-листы и результаты" />
        <button type="button" onClick={handleReset} style={{ background: RUST, color: '#fff', border: 'none', borderRadius: 8, padding: '10px 18px', fontWeight: 800, cursor: 'pointer' }}>
          Сбросить всё
        </button>
      </Panel>
    </div>
  );
};

export default Profile;
