import { useEffect, useState } from 'react';
import { cn } from '../lib/utils';
import { useProgressStore } from '../store';
import { ranks, badges, questPool, rankFor, badgeFor, QuestState } from '../data/gamification';
import { levels, modules, attestations, skillLists } from '../data/curriculum';
import type { TheoryBlock } from '../data/curriculum';
import { recipes } from '../data/recipes';
import { ProgressRing, Bar, Pill, SectionHead, EmptyNote } from '../components/app-ui';

const BG = '#161c1c';
const CARD = '#222a2a';
const SURFACE = '#263030';
const AQUA = '#4FBBBC';
const HEAT = '#F39120';
const RUST = '#EC4624';
const CREAM = '#E2DAC2';

const LEVEL_COLOR: Record<string, string> = { junior: AQUA, skilled: HEAT, pro: RUST };

export default function Path(): JSX.Element {
  const state = useProgressStore();
  const { xp, streak, known, modulesDone, earnedBadges, quests, dayOpened, addXp, readLesson, completeModule, bumpQuest } = state;

  const [openModuleId, setOpenModuleId] = useState<string | null>(null);
  const [moduleChecks, setModuleChecks] = useState<Record<string, boolean[]>>({});

  const knownCount = Object.values(known).filter(Boolean).length;
  const rank = rankFor(xp);
  const topRank = ranks[ranks.length - 1];
  const ringValue = rank.next ? Math.round((rank.into / rank.span) * 100) : 100;
  const xpToNext = rank.next ? rank.next.xp - xp : 0;

  const fallbackQuests: QuestState[] = questPool.slice(0, 3).map((t) => ({ id: t.id, title: t.title, target: t.target, xp: t.xp, metric: t.metric, progress: 0, done: false }));
  const questDay: QuestState[] = quests.items.length ? quests.items : fallbackQuests;
  const questsDone = questDay.filter((q) => q.done).length;

  const hour = new Date().getHours();
  const greeting = hour < 6 ? 'Доброй ночи' : hour < 12 ? 'Доброе утро' : hour < 18 ? 'Добрый день' : 'Добрый вечер';

  const qualifiedBadges = badgeFor({
    knownCount,
    quizBest: state.quizBest,
    blitzBest: state.blitzBest,
    streak: streak.count,
    rushBest: state.rushBest,
    days: state.days.length,
    examKnownCount: Object.values(state.examKnown).filter(Boolean).length,
    questsDoneToday: questsDone,
    questsTotalToday: questDay.length,
    checklistsDoneToday: Object.values(state.checklistsDone).flat(),
  });

  useEffect(() => {
    dayOpened();
  }, [dayOpened]);

  const completeQuest = (q: QuestState) => {
    if (q.done) return;
    addXp(q.xp);
    bumpQuest(q.metric, q.target);
  };

  const initializeModuleChecks = (id: string) => {
    const module = modules.find((m) => m.id === id);
    if (module && !moduleChecks[id]) {
      setModuleChecks((prev) => ({ ...prev, [id]: Array(module.checklist.length).fill(false) }));
    }
  };

  const toggleModuleItem = (id: string, index: number) => {
    setModuleChecks((prev) => {
      const checks = prev[id] ?? [];
      const next = [...checks];
      next[index] = !next[index];
      const module = modules.find((m) => m.id === id);
      if (module && next.every(Boolean) && !modulesDone[id]) {
        completeModule(id);
      }
      return { ...prev, [id]: next };
    });
  };

  useEffect(() => {
    if (openModuleId) {
      initializeModuleChecks(openModuleId);
      readLesson(openModuleId);
    }
  }, [openModuleId, readLesson]);

  const renderBlock = (block: TheoryBlock): JSX.Element => {
    switch (block.type) {
      case 'p':
        return <p className="text-sm text-cream/90 leading-relaxed">{block.text}</p>;
      case 'h':
        return <h3 className="text-sm font-bold text-cream mt-3 mb-1">{block.text}</h3>;
      case 'ul':
        return (
          <ul className="list-disc list-inside text-sm text-cream/80 space-y-1 mb-3">
            {block.items.map((item, i) => <li key={i}>{item}</li>)}
          </ul>
        );
      case 'ol':
        return (
          <ol className="list-decimal list-inside text-sm text-cream/80 space-y-1 mb-3">
            {block.items.map((item, i) => <li key={i}>{item}</li>)}
          </ol>
        );
      case 'callout':
        return (
          <div className="p-3 rounded-lg mb-3" style={{ background: SURFACE, border: `1px solid ${AQUA}33`, borderLeft: `3px solid ${AQUA}` }}>
            <p className="text-sm text-cream/90">{block.text}</p>
          </div>
        );
      case 'table':
        return (
          <table className="w-full text-sm border-collapse mb-3" style={{ borderColor: '#334545' }}>
            <thead>
              <tr>
                {block.headers.map((h, i) => (
                  <th key={i} className="text-left text-xs text-cream/50 pb-1 pr-2" style={{ borderBottom: `1px solid #334545` }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row, r) => (
                <tr key={r}>
                  {row.map((cell, c) => (
                    <td key={c} className="text-sm text-cream/80 py-1 pr-2" style={{ borderBottom: `1px solid #334545` }}>
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        );
      default:
        return <p className="text-sm text-cream/90">{String(block)}</p>;
    }
  };

  return (
    <div style={{ background: BG, minHeight: '100vh', color: CREAM }} className="px-3 pb-24">
      <SectionHead kicker="Ваш путь" title="Твой путь бариста" sub={`${greeting}, бариста`} />

      <div style={{ background: CARD, border: `1px solid #334545`, borderRadius: '16px' }} className="mt-5 p-5">
        <ProgressRing value={ringValue} color={AQUA} size={120} stroke={8}>
          {rank.current.title}
        </ProgressRing>
        <p className="mt-3 text-center text-sm text-cream/70">
          {rank.next ? `До ${rank.next.title}: ${xpToNext} XP` : `Максимальный ранг — ${topRank.title}`}
        </p>
      </div>

      {qualifiedBadges.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {qualifiedBadges.map((id) => {
            const b = badges.find((x) => x.id === id);
            return b ? <Pill key={id} color={AQUA}>{b.icon} {b.title}</Pill> : null;
          })}
        </div>
      )}
      {qualifiedBadges.length === 0 && earnedBadges.length === 0 && (
        <p className="mt-4 text-center text-xs text-cream/50 italic">Бейджи пока не получены</p>
      )}

      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="p-3 anim-rise text-center" style={{ background: CARD, border: '1px solid #334545', borderRadius: '12px' }}>
          <span className="text-[20px] font-bold text-cream">{streak.count}</span>
          <p className="mt-1 text-xs text-cream/60">Стрик · дн</p>
        </div>
        <div className="p-3 anim-rise text-center" style={{ background: CARD, border: '1px solid #334545', borderRadius: '12px' }}>
          <span className="text-[20px] font-bold text-cream">{knownCount} / {recipes.length}</span>
          <p className="mt-1 text-xs text-cream/60">Рецепты ТТК</p>
        </div>
        <div className="p-3 anim-rise text-center" style={{ background: CARD, border: '1px solid #334545', borderRadius: '12px' }}>
          <span className="text-[20px] font-bold text-cream">{earnedBadges.length}</span>
          <p className="mt-1 text-xs text-cream/60">Бейджи</p>
        </div>
        <div className="p-3 anim-rise text-center" style={{ background: CARD, border: '1px solid #334545', borderRadius: '12px' }}>
          <span className="text-[20px] font-bold text-cream">{questsDone} / {questDay.length}</span>
          <p className="mt-1 text-xs text-cream/60">Квесты дня</p>
        </div>
      </div>

      <section className="mt-7">
        <h2 className="text-sm font-bold text-cream mb-3">Квесты дня</h2>
        {questDay.length === 0 ? (
          <EmptyNote>Квесты на сегодня ещё не сгенерированы</EmptyNote>
        ) : (
          <div className="space-y-2">
            {questDay.map((q) => {
              const pct = q.target ? Math.round((q.progress / q.target) * 100) : 0;
              return (
                <div key={q.id} className={cn('p-3', 'anim-rise')} style={{ background: CARD, border: `1px solid ${q.done ? AQUA : '#334545'}`, borderRadius: '10px' }}>
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-sm text-cream/90 font-medium">{q.title}</span>
                    <span className={cn('text-[11px] font-bold', q.done ? 'text-aqua' : 'text-heat')}>{q.done ? 'Готово' : `+${q.xp} XP`}</span>
                  </div>
                  <Bar value={pct} color={q.done ? AQUA : HEAT} h={6} />
                  <div className="mt-2 flex items-center gap-2">
                    <input type="checkbox" checked={q.done} disabled={q.done} onChange={() => completeQuest(q)} className="w-4 h-4 rounded" style={{ background: CARD, border: '1px solid #334545' }} />
                    <span className="text-xs text-cream/60">{q.progress} / {q.target}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      <section className="mt-8">
        <SectionHead kicker="Уровни пути" title="Модули обучения" sub="Junior · Skilled · PRO" />
        {levels.map((level) => {
          const levelModules = modules.filter((m) => m.levelId === level.id);
          const doneModules = levelModules.filter((m) => !!modulesDone[m.id]).length;
          const levelPct = levelModules.length ? Math.round((doneModules / levelModules.length) * 100) : 0;
          const att = attestations[level.id];
          const levelSkills = skillLists.filter((s) => s.levelId === level.id);
          const accent = LEVEL_COLOR[level.id] ?? AQUA;

          return (
            <section key={level.id} className={cn('anim-rise', 'mt-6')} style={{ animationDelay: '60ms' }}>
              <div className="flex items-start justify-between gap-3 mb-2">
                <div>
                  <h3 className="text-sm font-bold text-cream">{level.title}</h3>
                  <p className="text-xs text-cream/60">{level.tagline}</p>
                  {att && <p className="text-xs text-cream/50 mt-1">Аттестация уровня · {att.items.length} испытаний</p>}
                </div>
                <Pill color={accent}>{doneModules} / {levelModules.length}</Pill>
              </div>
              <div className="mt-2 mb-3"><Bar value={levelPct} color={accent} h={5} /></div>
              <p className="text-xs text-cream/60 mb-3">Навыков уровня: {levelSkills.length} · {level.duration}</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {levelModules.map((module) => {
                  const items = module.checklist;
                  const isDone = !!modulesDone[module.id];
                  const doneCount = isDone ? items.length : items.filter((_, i) => moduleChecks[module.id]?.[i]).length;
                  const itemPct = items.length ? Math.round((doneCount / items.length) * 100) : 0;
                  return (
                    <div
                      key={module.id}
                      onClick={() => setOpenModuleId(module.id)}
                      className={cn('cursor-pointer p-3', 'anim-rise')}
                      style={{ background: CARD, border: `1px solid ${isDone ? AQUA : '#334545'}`, borderRadius: '12px', animationDelay: '90ms' }}
                    >
                      <div className="flex justify-between items-start mb-1">
                        <h4 className="text-sm font-bold text-cream">{module.title}</h4>
                        <span className="text-[10px] font-bold text-cream/50">{module.duration}</span>
                      </div>
                      <p className="text-xs text-cream/60 mb-2">{module.subtitle}</p>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs text-cream/50">{doneCount} / {items.length}</span>
                        <Bar value={itemPct} color={accent} h={4} />
                      </div>
                      {isDone && <span className="text-[10px] font-bold text-aqua">Модуль пройден · +40 XP</span>}
                    </div>
                  );
                })}
              </div>
            </section>
          );
        })}
      </section>

      {openModuleId && (
        <div className="fixed inset-0 z-50" style={{ background: 'rgba(22,28,28,0.75)', backdropFilter: 'blur(8px)' }} onClick={() => setOpenModuleId(null)}>
          <div className="anim-pop mt-10 mb-10 mx-3 lg:mx-20" style={{ background: CARD, border: `1px solid #334545`, borderRadius: '14px' }} onClick={(e) => e.stopPropagation()}>
            <div className="p-4 flex items-start justify-between border-b border-#334545">
              <div>
                <h3 className="text-base font-bold text-cream">{modules.find((m) => m.id === openModuleId)?.title ?? 'Модуль'}</h3>
                <p className="text-xs text-cream/60 mt-1">{modules.find((m) => m.id === openModuleId)?.subtitle ?? ''}</p>
              </div>
              <button type="button" onClick={() => setOpenModuleId(null)} className="text-cream/50 hover:text-cream">✕</button>
            </div>
            <div className="p-4 max-h-[60vh] overflow-y-auto">
              <h4 className="text-xs font-bold text-cream/60 uppercase tracking-wider mb-3">Теория</h4>
              <div className="space-y-4">
                {modules.find((m) => m.id === openModuleId)?.theory.map(renderBlock)}
              </div>
              <h4 className="text-xs font-bold text-cream/60 uppercase tracking-wider mt-6 mb-3">Практический чек-лист</h4>
              <div className="space-y-2">
                {modules.find((m) => m.id === openModuleId)?.checklist.map((item, i) => {
                  const isDone = !!modulesDone[openModuleId];
                  const checked = isDone || moduleChecks[openModuleId]?.[i];
                  return (
                    <label key={item.id} className="flex items-center gap-3 cursor-pointer select-none" style={{ opacity: isDone ? 1 : 1 }}>
                      <input
                        type="checkbox"
                        checked={checked}
                        disabled={isDone}
                        onChange={() => toggleModuleItem(openModuleId, i)}
                        className="w-4 h-4 rounded"
                        style={{ background: CARD, border: '1px solid #334545' }}
                      />
                      <span className={cn('text-sm', checked ? 'text-aqua line-through' : 'text-cream/90')}>{item.text}</span>
                    </label>
                  );
                })}
              </div>
              {modulesDone[openModuleId] && (
                <p className="mt-3 text-xs font-bold text-aqua">Модуль пройден · +40 XP уже начислен</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
