import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useProgressStore, type ProgressState } from '../store';
import { barPositions, serviceFlow, timeStandards, sequenceRules, rushDrinks, ausPrinciples, rushStepsLegend } from '../data/service';
import { guideStandards } from '../data/guide';
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

const Panel = ({ children }: { children: React.ReactNode }) => (
  <section className="anim-rise" style={{ background: CARD, border: `1px solid ${LINE}`, borderRadius: 16, padding: 20, marginBottom: 16 }}>
    {children}
  </section>
);

type Tab = 'model' | 'standards' | 'rush';

const tabLabel: Record<Tab, string> = { model: 'Модель', standards: 'Стандарты', rush: 'Rush' };

type RushOrder = { id: number; drink: (typeof rushDrinks)[number]; step: number; patience: number };

const RushSim: React.FC<{ actions: ProgressState }> = ({ actions }) => {
  const timeRef = useRef(60);
  const [queue, setQueue] = useState<RushOrder[]>([]);
  const [served, setServed] = useState(0);
  const [lost, setLost] = useState(0);
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const nextId = useRef(0);

  const current = queue[0];
  const expected = current ? current.drink.steps[current.step] : null;

  const endGame = useCallback(() => {
    setRunning(false);
    actions.recordRush(served);
    actions.addXp(served * 5);
    setResult(`Игра окончена · Обслужено: ${served} · Потеряно: ${lost}`);
  }, [actions, served, lost]);

  useEffect(() => {
    if (!running || result) return;
    timeRef.current = 60;
    const id = setInterval(() => {
      timeRef.current -= 1;
      setQueue((prev) => {
        const next: RushOrder[] = [];
        let newLost = 0;
        for (const o of prev) {
          const p = o.patience - 1;
          if (p <= 0) newLost += 1;
          else next.push({ ...o, patience: p });
        }
        if (newLost > 0) setLost((l) => l + newLost);
        if (Math.random() < 0.4 && next.length < 4) {
          const drink = rushDrinks[Math.floor(Math.random() * rushDrinks.length)];
          next.push({ id: nextId.current++, drink, step: 0, patience: drink.patience });
        }
        return next;
      });
      if (timeRef.current <= 0) {
        clearInterval(id);
        endGame();
      }
    }, 1000);
    return () => clearInterval(id);
  }, [running, result, endGame]);

  const tapStep = useCallback((label: string) => {
    if (!running || result || !queue.length) return;
    setQueue((prev) => {
      const o = prev[0];
      if (!o) return prev;
      if (label !== o.drink.steps[o.step]) return prev;
      const nextStep = o.step + 1;
      if (nextStep >= o.drink.steps.length) {
        setServed((s) => s + 1);
        return prev.slice(1);
      }
      return [{ ...o, step: nextStep }, ...prev.slice(1)];
    });
  }, [running, result, queue]);

  const startGame = useCallback(() => {
    timeRef.current = 60;
    setQueue([]);
    setServed(0);
    setLost(0);
    setResult(null);
    setRunning(true);
  }, []);

  const resetGame = useCallback(() => {
    timeRef.current = 60;
    setQueue([]);
    setServed(0);
    setLost(0);
    setResult(null);
    setRunning(false);
  }, []);

  const timerPct = Math.round((timeRef.current / 60) * 100);

  return (
    <Panel>
      <SectionHead kicker="Rush-симулятор" title="Час пик" sub="60 секунд · нажимайте шаги напитков по очереди" />
      <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 12, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
          <ProgressRing value={timerPct} size={88} color={running ? AQUA : RUST} stroke={6} />
          <span style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: MUTED }}>Время</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <span style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: MUTED }}>Обслужено</span>
          <span style={{ fontSize: 22, fontWeight: 800, color: AQUA }}>{served}</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <span style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: MUTED }}>Потеряно</span>
          <span style={{ fontSize: 22, fontWeight: 800, color: RUST }}>{lost}</span>
        </div>
        <Pill color={running ? AQUA : result ? RUST : AQUA}>
          {running ? 'Идёт…' : result ? 'Завершено' : 'Готово'}
        </Pill>
        {result ? null : (
          <button type="button" onClick={running ? resetGame : startGame} style={{
            background: running ? RUST : AQUA, color: '#000', border: 'none', borderRadius: 8, padding: '10px 16px', fontWeight: 900, cursor: 'pointer',
          }}>
            {running ? 'Стоп' : 'Старт'}
          </button>
        )}
      </div>

      {result && <p style={{ margin: '0 0 10px 0', fontSize: 12, color: MUTED }}>{served * 5} XP начислено (×5 за гостя)</p>}

      <div style={{ display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
        {rushStepsLegend.map((label) => {
          const isExpected = expected === label;
          return (
            <button
              key={label}
              type="button"
              onClick={() => tapStep(label)}
              disabled={!running || result != null}
              className="anim-pop"
              style={{
                background: isExpected ? AQUA : INK,
                color: isExpected ? '#000' : CREAM,
                border: `1px solid ${isExpected ? AQUA : LINE}`,
                borderRadius: 8, padding: '6px 10px', fontSize: 11.5, fontWeight: 800,
                textTransform: 'uppercase', letterSpacing: '0.05em',
                cursor: (running && !result) ? 'pointer' : 'default',
                opacity: (running && !result) ? 1 : 0.5,
              }}
            >
              {label}
            </button>
          );
        })}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))', gap: 10 }}>
        {queue.map((o) => {
          const pct = Math.round((o.patience / o.drink.patience) * 100);
          return (
            <div key={o.id} className="anim-pop" style={{
              background: INK, border: `1px solid ${o.id === current?.id ? AQUA : LINE}`, borderRadius: 10, padding: 10,
            }}>
              <p style={{ margin: '0 0 6px 0', fontSize: 12, fontWeight: 800, color: CREAM }}>{o.drink.name}</p>
              <p style={{ margin: '0 0 6px 0', fontSize: 11, color: MUTED }}>Шаг {o.step + 1} / {o.drink.steps.length}</p>
              <p style={{ margin: '0 0 6px 0', fontSize: 11, fontWeight: 800, color: o.patience <= 10 ? RUST : MUTED }}>{o.drink.steps[o.step] || 'Готово'}</p>
              <Bar value={pct} color={o.patience <= 10 ? RUST : HEAT} h={5} />
            </div>
          );
        })}
        {queue.length === 0 && !result && <EmptyNote>Нет заказов. Нажмите Старт.</EmptyNote>}
      </div>
    </Panel>
  );
};

const Shift: React.FC = () => {
  const actions = useProgressStore();
  const [tab, setTab] = useState<Tab>('model');
  const [openPositions, setOpenPositions] = useState<string[]>([]);

  const togglePosition = useCallback((id: string) => {
    setOpenPositions((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }, []);

  useEffect(() => {
    actions.dayOpened();
  }, [actions.dayOpened]);

  return (
    <div style={{ background: BG, minHeight: '100vh', color: CREAM, padding: 24 }}>
      <SectionHead kicker="Смена" title="Смена" sub="Стандарты сервиса, поток и симулятор часа пик" />
      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        {(['model', 'standards', 'rush'] as const).map((t) => {
          const active = tab === t;
          return (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className="anim-pop"
              style={{
                background: active ? AQUA : INK,
                color: active ? '#000' : CREAM,
                border: `1px solid ${LINE}`, borderRadius: 10, padding: '8px 14px', fontWeight: 800, fontSize: 13,
                cursor: 'pointer', opacity: active ? 1 : 0.85,
              }}
            >
              {tabLabel[t]}
            </button>
          );
        })}
      </div>

      {tab === 'model' && (
        <>
          <Panel>
            <SectionHead kicker="Модель сервиса" title="Принципы AUS" sub={`Пять правил работы в пике`} />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 12 }}>
              {ausPrinciples.map((p, i) => (
                <div key={i} className="anim-pop" style={{ background: INK, border: `1px solid ${LINE}`, borderRadius: 12, padding: 14 }}>
                  <span style={{ display: 'inline-block', fontSize: 12, fontWeight: 800, color: AQUA, marginBottom: 6 }}>{`Принцип ${i + 1}`}</span>
                  <p style={{ margin: 0, fontSize: 13.5, lineHeight: 1.5, color: CREAM }}>{p}</p>
                </div>
              ))}
            </div>
          </Panel>

          <Panel>
            <SectionHead kicker="Поток обслуживания" title="Цепочка сервиса" sub={`${serviceFlow.length} этапа от заказа до выдачи`} />
            <div style={{ display: 'flex', gap: 10, overflowX: 'auto', paddingBottom: 10 }}>
              {serviceFlow.map((s, i) => (
                <div key={s.n} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, minWidth: 150 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 34, height: 34, borderRadius: '50%', background: AQUA, color: '#000', fontWeight: 900, fontSize: 15 }}>{s.n}</div>
                  <p style={{ margin: 0, fontSize: 13, fontWeight: 800, color: CREAM, textAlign: 'center' }}>{s.title}</p>
                  <p style={{ margin: '4px 0 0 0', fontSize: 11, fontWeight: 800, color: HEAT, textAlign: 'center' }}>{s.time}</p>
                  <p style={{ margin: '6px 0 0 0', fontSize: 11, color: MUTED, textAlign: 'center', lineHeight: 1.4 }}>{s.desc}</p>
                  {i < serviceFlow.length - 1 && <div style={{ marginTop: 16, width: 16, height: 2, background: HEAT }} />}
                </div>
              ))}
            </div>
          </Panel>

          <Panel>
            <SectionHead kicker="Позиции на баре" title="Станции" sub={`${barPositions.length} позиции с миссией, обязанствами и правилом`} />
            {barPositions.map((pos) => {
              const isOpen = openPositions.includes(pos.id);
              return (
                <div key={pos.id} className="anim-pop" style={{ background: INK, border: `1px solid ${LINE}`, borderRadius: 12, marginBottom: 10, overflow: 'hidden' }}>
                  <button
                    type="button"
                    onClick={() => togglePosition(pos.id)}
                    style={{ width: '100%', textAlign: 'left', background: 'transparent', border: 'none', padding: 12, cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                  >
                    <div>
                      <p style={{ margin: 0, fontSize: 14, fontWeight: 800, color: CREAM }}>{pos.title}</p>
                      <p style={{ margin: '2px 0 0 0', fontSize: 11, color: MUTED }}>{pos.en}</p>
                    </div>
                    <span style={{ color: AQUA, fontWeight: 800, fontSize: 11 }}>{isOpen ? '▲' : '▼'}</span>
                  </button>
                  <p style={{ margin: 0, padding: '0 12px 10px 12px', fontSize: 12, color: CREAM }}>{pos.mission}</p>
                  {isOpen && (
                    <div style={{ padding: '0 12px 12px 12px', borderTop: `1px solid ${LINE}` }}>
                      <p style={{ margin: '0 0 6px 0', fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: MUTED }}>Обязанности</p>
                      <ul style={{ margin: '0 0 8px 0', paddingLeft: 16, fontSize: 12.5, color: CREAM, lineHeight: 1.6 }}>
                        {pos.duties.map((d, di) => <li key={di}>{d}</li>)}
                      </ul>
                      <p style={{ margin: 0, fontSize: 11.5, fontStyle: 'italic', color: HEAT }}>Правило: {pos.rule}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </Panel>

          <Panel>
            <SectionHead kicker="Правила последовательности" title="Приоритеты" sub={`${sequenceRules.length} правила оптимизации потока`} />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 10 }}>
              {sequenceRules.map((r, i) => (
                <div key={i} className="anim-pop" style={{ background: INK, border: `1px solid ${LINE}`, borderRadius: 10, padding: 12 }}>
                  <p style={{ margin: '0 0 6px 0', fontSize: 13, fontWeight: 800, color: CREAM }}>{r.title}</p>
                  <p style={{ margin: 0, fontSize: 12, color: MUTED, lineHeight: 1.5 }}>{r.desc}</p>
                </div>
              ))}
            </div>
          </Panel>
        </>
      )}

      {tab === 'standards' && (
        <>
          <Panel>
            <SectionHead kicker="Нормы времени" title="Стандарты напитков" sub={`${timeStandards.length} позиций`} />
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12.5 }}>
                <thead>
                  <tr>
                    {['Напиток', 'Цель', 'Лимит', 'Примечание'].map((h) => (
                      <th key={h} style={{ textAlign: 'left', padding: '8px 10px', fontSize: 10.5, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: MUTED, borderBottom: `1px solid ${LINE}` }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {timeStandards.map((ts) => (
                    <tr key={ts.drink} style={{ borderBottom: `1px solid ${LINE}` }}>
                      <td style={{ padding: '8px 10px', fontWeight: 700, color: CREAM }}>{ts.drink}</td>
                      <td style={{ padding: '8px 10px', color: AQUA, fontWeight: 700 }}>{ts.target}</td>
                      <td style={{ padding: '8px 10px', color: RUST }}>{ts.limit}</td>
                      <td style={{ padding: '8px 10px', color: MUTED, fontSize: 11.5 }}>{ts.note}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Panel>

          <Panel>
            <SectionHead kicker="Справочник" title="Руководство по стандартам" sub={`${guideStandards.length} раздела`} />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 12 }}>
              {guideStandards.map((g) => (
                <div key={g.id} className="anim-pop" style={{ background: INK, border: `1px solid ${LINE}`, borderRadius: 12, padding: 14 }}>
                  <span style={{ display: 'inline-block', fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: AQUA, marginBottom: 6 }}>{g.kicker}</span>
                  <p style={{ margin: '0 0 8px 0', fontSize: 14, fontWeight: 800, color: CREAM }}>{g.title}</p>
                  <p style={{ margin: '0 0 10px 0', fontSize: 12, color: MUTED, lineHeight: 1.5 }}>{g.body}</p>
                  <div style={{ fontSize: 11 }}>
                    <p style={{ margin: '0 0 6px 0', fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: MUTED }}>{g.table.headers.join('  |  ')}</p>
                    {g.table.rows.slice(0, 3).map((row, ri) => (
                      <p key={ri} style={{ margin: '0 0 3px 0', fontSize: 10.5, color: CREAM, fontFamily: 'monospace' }}>{row.join('  →  ')}</p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Panel>
        </>
      )}

      {tab === 'rush' && <RushSim actions={actions} />}
    </div>
  );
};

export default Shift;
