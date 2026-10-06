import React from 'react';
import Card from '../components/Card';
import Button from '../components/Button';
import ProgressBar from '../components/ProgressBar';
import Badge from '../components/Badge';
import styles from './Home.module.css';
import { useProgressStore, getCurrentStep, getStepProgress, getStepStatus, countCompletedSteps } from '../store/progressStore';
import { getLevelInfo, formatXp, Step } from '../data/gamification';
import type { NavSection } from '../components/Layout';

interface HomeProps {
  onNavigate: (section: NavSection) => void;
  onOpenStep: (stepId: string) => void;
}

const STATUS_LABEL: Record<string, string> = {
  locked: 'Заблокирована',
  available: 'Доступна',
  in_progress: 'В работе',
  completed: 'Завершена',
};

const Home: React.FC<HomeProps> = ({ onNavigate, onOpenStep }) => {
  const state = useProgressStore();
  const currentStep: Step = getCurrentStep(state);
  const level = getLevelInfo(currentStep.level);
  const stepProgress = getStepProgress(currentStep, state);
  const status = getStepStatus(currentStep, state);

  const completedStepsCount = state.completedLessons ? Object.keys(state.completedLessons).length : 0;
  const testsPassed = Object.values(state.testResults).filter((r) => r.passed).length;

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 6) return 'Ночная смена';
    if (hour < 12) return 'Доброе утро';
    if (hour < 18) return 'Добрый день';
    return 'Добрый вечер';
  };

  return (
    <div className={styles.home}>
      <div className={styles.header}>
        <h1 className={styles.greeting}>{greeting()}</h1>
        <p className={styles.subtitle}>BaristaOS 202f — академическая система подготовки</p>
      </div>

      <Card className={styles.currentCard}>
        <div className={styles.currentTop}>
          <div>
            <p className={styles.currentLabel}>Текущая ступень</p>
            <h2 className={styles.currentTitle}>
              {level.name} · Step {currentStep.index}
            </h2>
            <p className={styles.currentFocus}>{currentStep.title}</p>
          </div>
          <Badge variant={currentStep.isAttestation ? 'danger' : 'primary'}>{STATUS_LABEL[status]}</Badge>
        </div>
        <ProgressBar value={stepProgress} label="Прогресс ступени" />
        <p className={styles.currentHint}>{currentStep.focus}</p>
        <Button fullWidth onClick={() => onOpenStep(currentStep.id)}>
          {stepProgress === 0 ? 'Начать ступень' : 'Продолжить ступень'}
        </Button>
      </Card>

      <div className={styles.statsGrid}>
        <Card>
          <div className={styles.stat}>
            <span className={styles.statValue}>{formatXp(state.xp)}</span>
            <span className={styles.statLabel}>XP накоплено</span>
          </div>
        </Card>
        <Card>
          <div className={styles.stat}>
            <span className={styles.statValue}>{completedStepsCount}</span>
            <span className={styles.statLabel}>Уроков завершено</span>
          </div>
        </Card>
        <Card>
          <div className={styles.stat}>
            <span className={styles.statValue}>{testsPassed}</span>
            <span className={styles.statLabel}>Тестов сдано</span>
          </div>
        </Card>
        <Card>
          <div className={styles.stat}>
            <span className={styles.statValue}>{countCompletedSteps(state)}/15</span>
            <span className={styles.statLabel}>Ступеней закрыто</span>
          </div>
        </Card>
      </div>

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Инструменты смены</h3>
        <div className={styles.toolsGrid}>
          <Card interactive onClick={() => onNavigate('practice')}>
            <div className={styles.tool}>
              <span className={styles.toolIcon} aria-hidden="true">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="13" r="8" />
                  <path d="M12 9v4l2.5 2.5" />
                  <path d="M9 2h6" />
                </svg>
              </span>
              <div>
                <p className={styles.toolName}>Практика</p>
                <p className={styles.toolDesc}>Таймеры, калькуляторы, журнал проливов</p>
              </div>
            </div>
          </Card>
          <Card interactive onClick={() => onNavigate('trainer')}>
            <div className={styles.tool}>
              <span className={styles.toolIcon} aria-hidden="true">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 3v18" />
                  <path d="M5 8l7-5 7 5" />
                  <path d="M5 16l7 5 7-5" />
                </svg>
              </span>
              <div>
                <p className={styles.toolName}>Тренер</p>
                <p className={styles.toolDesc}>Разбор ошибок и наводящие вопросы</p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Принцип системы</h3>
        <Card>
          <ul className={styles.principles}>
            <li>Контрольные тесты между ступенями — обязательны, порог 85%</li>
            <li>Практические чек-листы закрываются только на станции</li>
            <li>Уровни и ступени проходятся строго последовательно</li>
            <li>Аттестация уровня — допуск к следующему уровню</li>
          </ul>
        </Card>
      </div>
    </div>
  );
};

export default Home;
