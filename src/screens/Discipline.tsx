import React, { useEffect, useState } from 'react';
import { useProgressStore } from '../store';
import { disciplineChecklists, disciplineRules, levelLabels } from '../data/discipline';
import { SectionHead, Bar, Pill } from '../components/app-ui';

const TODAY = new Date().toISOString().slice(0, 10);

type Tab = 'checks' | 'rules';

const Discipline: React.FC = () => {
  const { xp, checklistsDone, completeChecklist, dayOpened } = useProgressStore();
  const [tab, setTab] = useState<Tab>('checks');
  const [openRule, setOpenRule] = useState<string | null>(null);

  useEffect(() => {
    dayOpened();
  }, [dayOpened]);

  const isDone = (id: string): boolean => Boolean(checklistsDone[id]?.includes(TODAY));
  const doneCount = disciplineChecklists.reduce((n, c) => (isDone(c.id) ? n + 1 : n), 0);

  const handleChecklist = (id: string) => {
    if (!isDone(id)) completeChecklist(id);
  };

  return (
    <div className="bg-[#161c1c] text-[#E2DAC2] min-h-screen p-6">
      <SectionHead kicker="Стандарты станции" title="Дисциплина" />

      <div className="mt-6 flex items-center gap-3">
        <Bar value={Math.round((doneCount / disciplineChecklists.length) * 100)} color="#4FBBBC" />
        <span className="text-xs font-mono text-[#8a979c]">XP <span className="text-[#E2DAC2]">{xp}</span></span>
      </div>

      <div className="mt-6 inline-flex gap-2">
        <button
          onClick={() => setTab('checks')}
          className={`px-4 py-2 rounded-lg text-sm font-bold transition ${tab === 'checks' ? 'bg-[#4FBBBC] text-[#161c1c]' : 'bg-[#222a2a] border border-[#33403f] text-[#E2DAC2] hover:border-[#4FBBBC]'}`}
        >
          Чек-листы
        </button>
        <button
          onClick={() => setTab('rules')}
          className={`px-4 py-2 rounded-lg text-sm font-bold transition ${tab === 'rules' ? 'bg-[#4FBBBC] text-[#161c1c]' : 'bg-[#222a2a] border border-[#33403f] text-[#E2DAC2] hover:border-[#4FBBBC]'}`}
        >
          Правила
        </button>
      </div>

      {tab === 'checks' ? (
        <div className="mt-6 space-y-3">
          {disciplineChecklists.map((checklist) => {
            const done = isDone(checklist.id);
            return (
              <div key={checklist.id} className="bg-[#222a2a] border border-[#33403f] rounded-xl p-4 anim-rise">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                  <div>
                    <div className="text-xs font-bold text-[#4FBBBC] uppercase tracking-wider">
                      {checklist.kicker}
                    </div>
                    <div className="text-sm font-semibold text-[#E2DAC2]">{checklist.title}</div>
                  </div>
                  {done && <Pill color="#4FBBBC">сегодня ✓</Pill>}
                </div>
                <ul className="mt-4 space-y-2">
                  {checklist.items.map((item) => (
                    <li key={item.id} className="flex items-center gap-3 anim-pop">
                      <input
                        type="checkbox"
                        checked={done}
                        disabled={done}
                        onChange={() => handleChecklist(checklist.id)}
                        className="w-4 h-4 rounded border-[#33403f] bg-[#161c1c] text-[#4FBBBC] focus:outline-none"
                      />
                      <span className={`text-sm leading-relaxed ${done ? 'line-through text-[#6b6b5c]' : 'text-[#E2DAC2]'}`}>
                        {item.text}
                      </span>
                      <span className="ml-auto text-[10px] font-bold text-[#8a979c]">{item.tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="mt-6 space-y-3">
          {disciplineRules.map((rule) => {
            const color = levelLabels[rule.level];
            const open = openRule === rule.id;
            return (
              <div key={rule.id} className="bg-[#222a2a] border border-[#33403f] rounded-lg overflow-hidden anim-rise">
                <button
                  onClick={() => setOpenRule(open ? null : rule.id)}
                  className="flex w-full items-center gap-3 px-4 py-3 text-left transition hover:bg-[#1a2121]"
                >
                  <Pill color={color}>{rule.level}</Pill>
                  <span className="text-sm font-semibold text-[#E2DAC2]">{rule.title}</span>
                  <span className="ml-auto text-[10px] text-[#8a979c]">{open ? 'скрыть' : 'развернуть'}</span>
                </button>
                {open && (
                  <div className="px-4 pb-4 anim-pop">
                    <div className="space-y-3">
                      <div>
                        <div className="text-xs font-bold text-[#F39120] uppercase tracking-wider">Требование</div>
                        <p className="text-sm text-[#b4bec2] leading-relaxed">{rule.rule}</p>
                      </div>
                      <div>
                        <div className="text-xs font-bold text-[#4FBBBC] uppercase tracking-wider">Почему</div>
                        <p className="text-sm text-[#b4bec2] leading-relaxed">{rule.why}</p>
                      </div>
                      <div>
                        <div className="text-xs font-bold text-[#EC4624] uppercase tracking-wider">Как</div>
                        <p className="text-sm text-[#b4bec2] leading-relaxed">{rule.how}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Discipline;
