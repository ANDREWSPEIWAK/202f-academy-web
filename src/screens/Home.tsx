import React, { useEffect, useRef, useState } from 'react';
import Card from '../components/Card';
import Button from '../components/Button';
import ProgressBar from '../components/ProgressBar';
import Badge from '../components/Badge';
import styles from './Home.module.css';
import { useProgressStore, getCurrentStep, getStepProgress, getStepStatus, countCompletedSteps } from '../store/progressStore';
import { getLevelInfo, Step } from '../data/gamification';
import { useAdminStore, Assignment } from '../store/adminStore';
import { useAuthStore } from '../store/authStore';
import { answerQuestion, Segment } from '../data/assistantKB';
import { useT } from '../i18n';
import type { NavSection } from '../components/Layout';

interface HomeProps {
  onNavigate: (section: NavSection) => void;
  onOpenStep: (stepId: string) => void;
}

type QuickTool = 'calc' | 'timers' | 'analyzer' | 'assistant' | null;

const STATUS_LABEL_KEY: Record<string, string> = {
  locked: 'path.status.locked',
  available: 'path.status.available',
  in_progress: 'path.status.in_progress',
  completed: 'path.status.completed',
};

const Home: React.FC<HomeProps> = ({ onNavigate, onOpenStep }) => {
  const t = useT();
  const state = useProgressStore();
  const user = useAuthStore((s) => s.user);
  const assignments = useAdminStore((s) => s.assignments);
  const markDone = useAdminStore((s) => s.markDone);
  const [tool, setTool] = useState<QuickTool>(null);

  const currentStep: Step = getCurrentStep(state);
  const level = getLevelInfo(currentStep.level);
  const stepProgress = getStepProgress(currentStep, state);
  const status = getStepStatus(currentStep, state);

  const lessonsDone = state.completedLessons ? Object.keys(state.completedLessons).length : 0;
  const testsPassed = Object.values(state.testResults).filter((r) => r.passed).length;

  const myAssignments = user
    ? assignments.filter((a) => a.targetEmail === user.email && !a.done)
    : [];

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 6) return t('home.greeting.night');
    if (hour < 12) return t('home.greeting.morning');
    if (hour < 18) return t('home.greeting.day');
    return t('home.greeting.evening');
  };

  const toggleTool = (next: Exclude<QuickTool, null>) => setTool((cur) => (cur === next ? null : next));

  return (
    <div className={styles.home}>
      <div className={styles.header}>
        <h1 className={styles.greeting}>{greeting()}</h1>
        <p className={styles.subtitle}>{t('app.tagline')}</p>
      </div>

      {myAssignments.length > 0 && (
        <section className={styles.section}>
          <h3 className={styles.sectionTitle}>{t('home.assignments')}</h3>
          <div className={styles.assignList}>
            {myAssignments.map((a: Assignment) => (
              <Card key={a.id} className={styles.assignCard}>
                <div className={styles.assignTop}>
                  <Badge variant="warning">{a.kind === 'drill' ? 'Тренажёр' : 'Контрольный тест'}</Badge>
                  <button type="button" className={styles.assignDone} onClick={() => markDone(a.id)}>
                    {t('home.assignmentsDone')}
                  </button>
                </div>
                <p className={styles.assignRef}>
                  {a.kind === 'drill' ? `Категория: ${a.refId}` : a.refId}
                </p>
                {a.note && <p className={styles.assignNote}>{a.note}</p>}
                <Button
                  fullWidth
                  onClick={() => (a.kind === 'drill' ? onNavigate('tests') : onNavigate('tests'))}
                >
                  {t('home.goTo')}
                </Button>
              </Card>
            ))}
          </div>
        </section>
      )}

      <Card className={styles.currentCard}>
        <div className={styles.currentTop}>
          <div>
            <p className={styles.currentLabel}>{t('home.currentStep')}</p>
            <h2 className={styles.currentTitle}>
              {level.name} · Step {currentStep.index}
            </h2>
            <p className={styles.currentFocus}>{currentStep.title}</p>
          </div>
          <Badge variant={currentStep.isAttestation ? 'danger' : 'primary'}>{t(STATUS_LABEL_KEY[status])}</Badge>
        </div>
        <ProgressBar value={stepProgress} label={t('home.stepProgress')} />
        <p className={styles.currentHint}>{currentStep.focus}</p>
        <Button fullWidth onClick={() => onOpenStep(currentStep.id)}>
          {stepProgress === 0 ? t('home.startStep') : t('home.continueStep')}
        </Button>
      </Card>

      <div className={styles.statsGrid}>
        <Card>
          <div className={styles.stat}>
            <span className={styles.statValue}>{state.xp}</span>
            <span className={styles.statLabel}>{t('home.stat.xp')}</span>
          </div>
        </Card>
        <Card>
          <div className={styles.stat}>
            <span className={styles.statValue}>{lessonsDone}</span>
            <span className={styles.statLabel}>{t('home.stat.lessons')}</span>
          </div>
        </Card>
        <Card>
          <div className={styles.stat}>
            <span className={styles.statValue}>{testsPassed}</span>
            <span className={styles.statLabel}>{t('home.stat.tests')}</span>
          </div>
        </Card>
        <Card>
          <div className={styles.stat}>
            <span className={styles.statValue}>{countCompletedSteps(state)}/15</span>
            <span className={styles.statLabel}>{t('home.stat.steps')}</span>
          </div>
        </Card>
      </div>

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>{t('home.quick.title')}</h3>
        <div className={styles.quickGrid}>
          <button type="button" className={`${styles.quickBtn} ${tool === 'calc' ? styles.quickActive : ''}`} onClick={() => toggleTool('calc')}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <rect x="5" y="3" width="14" height="18" rx="2" />
              <path d="M8 7h8M8 12h2M12 12h2M16 12h.5M8 16h2M12 16h2M16 16h.5" />
            </svg>
            <span>{t('home.quick.calc')}</span>
          </button>
          <button type="button" className={`${styles.quickBtn} ${tool === 'timers' ? styles.quickActive : ''}`} onClick={() => toggleTool('timers')}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="12" cy="13" r="8" />
              <path d="M12 9v4l2.5 2.5" />
              <path d="M9 2h6" />
            </svg>
            <span>{t('home.quick.timers')}</span>
          </button>
          <button type="button" className={styles.quickBtn} onClick={() => onNavigate('shift')}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M12 20h9" />
              <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
            </svg>
            <span>{t('home.quick.diary')}</span>
          </button>
          <button type="button" className={`${styles.quickBtn} ${tool === 'analyzer' ? styles.quickActive : ''}`} onClick={() => toggleTool('analyzer')}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M3 20h18" />
              <path d="M6 20v-6M11 20V8M16 20v-9M21 20V5" />
            </svg>
            <span>{t('home.quick.analyzer')}</span>
          </button>
          <button type="button" className={`${styles.quickBtn} ${tool === 'assistant' ? styles.quickActive : ''}`} onClick={() => toggleTool('assistant')}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M21 12a8 8 0 1 1-4-6.9" />
              <path d="M9 11h.01M13 11h.01" strokeWidth="2.5" />
              <path d="M9.5 15a4 4 0 0 0 5 0" />
            </svg>
            <span>{t('home.quick.assistant')}</span>
          </button>
        </div>

        {tool === 'calc' && <Calculators />}
        {tool === 'timers' && <Timers />}
        {tool === 'analyzer' && <Analyzer />}
        {tool === 'assistant' && <Assistant />}
      </div>
    </div>
  );
};

/* ---------- Калькуляторы ---------- */

const Calculators: React.FC = () => {
  const t = useT();
  const [dose, setDose] = useState('15');
  const [ratio, setRatio] = useState('16.7');
  const [targetYield, setTargetYield] = useState('250');

  const d = parseFloat(dose) || 0;
  const r = parseFloat(ratio) || 0;
  const y = parseFloat(targetYield) || 0;

  return (
    <Card className={styles.panel}>
      <p className={styles.panelTitle}>{t('calc.ratio')}</p>
      <div className={styles.calcRow}>
        <label className={styles.calcField}>
          <span>{t('calc.dose')}</span>
          <input type="number" inputMode="decimal" min="0" value={dose} onChange={(e) => setDose(e.target.value)} />
        </label>
        <span className={styles.calcX}>×</span>
        <label className={styles.calcField}>
          <span>{t('calc.ratioLabel')}</span>
          <input type="number" inputMode="decimal" min="0" step="0.1" value={ratio} onChange={(e) => setRatio(e.target.value)} />
        </label>
        <span className={styles.calcEq}>=</span>
        <div className={styles.calcResult}>{(d * r).toFixed(1)} г</div>
      </div>

      <p className={styles.panelTitle}>{t('calc.doseFromYield')}</p>
      <div className={styles.calcRow}>
        <label className={styles.calcField}>
          <span>{t('calc.targetYield')}</span>
          <input type="number" inputMode="decimal" min="0" value={targetYield} onChange={(e) => setTargetYield(e.target.value)} />
        </label>
        <span className={styles.calcEq}>÷</span>
        <label className={styles.calcField}>
          <span>{t('calc.ratioLabel')}</span>
          <input type="number" inputMode="decimal" min="0" step="0.1" value={ratio} onChange={(e) => setRatio(e.target.value)} />
        </label>
        <span className={styles.calcEq}>=</span>
        <div className={styles.calcResult}>{r > 0 ? (y / r).toFixed(1) : '—'} г</div>
      </div>

      <p className={styles.panelHint}>{t('calc.tempHint')}</p>
    </Card>
  );
};

/* ---------- Таймеры ---------- */

const Timers: React.FC = () => {
  const t = useT();
  const [ms, setMs] = useState(0);
  const [running, setRunning] = useState(false);
  const raf = useRef<number | null>(null);
  const startedAt = useRef<number>(0);

  useEffect(() => {
    if (!running) return;
    startedAt.current = performance.now() - ms;
    const tick = () => {
      setMs(performance.now() - startedAt.current);
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running]);

  const seconds = ms / 1000;
  const inRange = seconds >= 25 && seconds <= 30;
  const verdict = !running && seconds > 0 ? (inRange ? t('timers.inRange') : seconds < 25 ? t('timers.tooFast') : t('timers.tooSlow')) : null;

  return (
    <Card className={styles.panel}>
      <p className={styles.panelTitle}>{t('timers.espresso')}</p>
      <div className={styles.timerDisplay} data-inrange={inRange || undefined}>
        {seconds.toFixed(1)} с
      </div>
      {verdict && <p className={`${styles.timerVerdict} ${inRange ? styles.verdictOk : styles.verdictBad}`}>{verdict}</p>}
      <div className={styles.timerRow}>
        <Button onClick={() => setRunning((r) => !r)}>{running ? t('timers.stop') : t('timers.start')}</Button>
        <Button
          variant="secondary"
          onClick={() => {
            setRunning(false);
            setMs(0);
          }}
        >
          {t('timers.reset')}
        </Button>
      </div>
    </Card>
  );
};

/* ---------- Анализатор ---------- */

const Analyzer: React.FC = () => {
  const t = useT();
  const [dose, setDose] = useState('18');
  const [yieldG, setYieldG] = useState('38');
  const [time, setTime] = useState('27');
  const [taste, setTaste] = useState<'balanced' | 'sour' | 'bitter'>('balanced');
  const [result, setResult] = useState<string | null>(null);

  const analyze = () => {
    const d = parseFloat(dose) || 0;
    const y = parseFloat(yieldG) || 0;
    const s = parseFloat(time) || 0;
    const ratio = d > 0 ? y / d : 0;
    const rate = s > 0 ? y / s : 0; // г/с

    const parts: string[] = [
      `${t('analyzer.ratio')}: 1:${ratio.toFixed(1)} · ${t('analyzer.rate')}: ${rate.toFixed(2)} г/с`,
    ];

    let verdict = t('analyzer.ok');
    if (taste === 'sour') verdict = t('analyzer.sourAdvice');
    if (taste === 'bitter') verdict = t('analyzer.bitterAdvice');
    if (taste === 'balanced' && rate > 1.7) verdict = t('analyzer.fastAdvice');
    if (taste === 'balanced' && rate < 1.1) verdict = t('analyzer.slowAdvice');

    parts.push(`${t('analyzer.verdict')}: ${verdict}`);
    setResult(parts.join('\n'));
  };

  return (
    <Card className={styles.panel}>
      <p className={styles.panelTitle}>{t('analyzer.title')}</p>
      <div className={styles.anGrid}>
        <label className={styles.calcField}>
          <span>{t('analyzer.dose')}</span>
          <input type="number" inputMode="decimal" min="0" value={dose} onChange={(e) => setDose(e.target.value)} />
        </label>
        <label className={styles.calcField}>
          <span>{t('analyzer.yield')}</span>
          <input type="number" inputMode="decimal" min="0" value={yieldG} onChange={(e) => setYieldG(e.target.value)} />
        </label>
        <label className={styles.calcField}>
          <span>{t('analyzer.time')}</span>
          <input type="number" inputMode="decimal" min="0" value={time} onChange={(e) => setTime(e.target.value)} />
        </label>
      </div>
      <div className={styles.tasteRow} role="radiogroup" aria-label={t('analyzer.taste')}>
        {(
          [
            ['sour', t('analyzer.taste.sour')],
            ['balanced', t('analyzer.taste.balanced')],
            ['bitter', t('analyzer.taste.bitter')],
          ] as const
        ).map(([key, label]) => (
          <button
            key={key}
            type="button"
            role="radio"
            aria-checked={taste === key}
            className={`${styles.tasteBtn} ${taste === key ? styles.tasteActive : ''}`}
            onClick={() => setTaste(key)}
          >
            {label}
          </button>
        ))}
      </div>
      <Button fullWidth onClick={analyze}>
        {t('analyzer.analyze')}
      </Button>
      {result && <pre className={styles.anResult}>{result}</pre>}
    </Card>
  );
};

/* ---------- AI-ассистент ---------- */

const SEGMENTS: { id: Segment; labelKey: string }[] = [
  { id: 'espresso', labelKey: 'assistant.espresso' },
  { id: 'milk', labelKey: 'assistant.milk' },
  { id: 'filter', labelKey: 'assistant.filter' },
  { id: 'service', labelKey: 'assistant.service' },
  { id: 'sensory', labelKey: 'assistant.sensory' },
];

const Assistant: React.FC = () => {
  const t = useT();
  const [segment, setSegment] = useState<Segment>('espresso');
  const [question, setQuestion] = useState('');
  const [thread, setThread] = useState<{ q: string; a: string }[]>([]);

  const ask = () => {
    if (!question.trim()) return;
    const a = answerQuestion(segment, question);
    setThread((prev) => [{ q: question.trim(), a }, ...prev].slice(0, 10));
    setQuestion('');
  };

  return (
    <Card className={styles.panel}>
      <p className={styles.panelTitle}>{t('assistant.title')}</p>
      <div className={styles.segRow} role="tablist" aria-label={t('assistant.segment')}>
        {SEGMENTS.map((s) => (
          <button
            key={s.id}
            type="button"
            role="tab"
            aria-selected={segment === s.id}
            className={`${styles.segBtn} ${segment === s.id ? styles.segActive : ''}`}
            onClick={() => setSegment(s.id)}
          >
            {t(s.labelKey)}
          </button>
        ))}
      </div>

      <div className={styles.askRow}>
        <input
          className={styles.input}
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder={t('assistant.placeholder')}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.nativeEvent.isComposing) ask();
          }}
        />
        <Button onClick={ask} disabled={!question.trim()}>
          {t('assistant.ask')}
        </Button>
      </div>

      {thread.length > 0 && (
        <div className={styles.thread}>
          {thread.map((m, i) => (
            <div key={i} className={styles.threadItem}>
              <p className={styles.threadQ}>{m.q}</p>
              <p className={styles.threadA}>{m.a}</p>
            </div>
          ))}
        </div>
      )}

      <p className={styles.panelHint}>{t('assistant.hint')}</p>
    </Card>
  );
};

export default Home;
