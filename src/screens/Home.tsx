import React from 'react';
import styles from './Home.module.css';
import Card from '../components/Card';
import Button from '../components/Button';
import ProgressBar from '../components/ProgressBar';
import Badge from '../components/Badge';
import { useT } from '../i18n';
import type { NavSection } from '../components/Layout';

const STATUS_LABEL_KEY: Record<string, string> = {
  locked: 'path.status.locked',
  available: 'path.status.available',
  in_progress: 'path.status.in_progress',
  completed: 'path.status.completed',
};

interface HomeProps {
  onNavigate: (section: NavSection) => void;
  onOpenStep: (stepId: string) => void;
}

const Home: React.FC<HomeProps> = (_) => {
  const t = useT();

  return (
    <div className="home">
      <div className="header">
        <h1 className={styles.greeting}>Hello World</h1>
      </div>

      <div className={styles.currentCard}>
        <div className={styles.currentTop}>
          <div>
            <p className={styles.currentLabel}>{t('home.currentStep')}</p>
            <h2 className={styles.currentTitle}>
              Level · Step 1
            </h2>
            <p className={styles.currentFocus}>{t('home.currentFocus')}</p>
          </div>
          <Badge variant="primary">
            {t(STATUS_LABEL_KEY.available)}
          </Badge>
        </div>
        <ProgressBar value={50} label={t('home.stepProgress')} />
        <p className={styles.currentHint}>{t('home.currentHint')}</p>
        <Button
          onClick={() => {/* TODO */}}
          size="large"
        >
          {t('home.startStep')}
        </Button>
      </div>

      <div className={styles.statsGrid}>
        <Card>
          <div className={styles.stat}>
            <span className={styles.statValue}>1000</span>
            <span className={styles.statLabel}>{t('home.stat.xp')}</span>
          </div>
        </Card>
        <Card>
          <div className={styles.stat}>
            <span className={styles.statValue}>50</span>
            <span className={styles.statLabel}>{t('home.stat.lessons')}</span>
          </div>
        </Card>
        <Card>
          <div className={styles.stat}>
            <span className={styles.statValue}>10</span>
            <span className={styles.statLabel}>{t('home.stat.tests')}</span>
          </div>
        </Card>
        <Card>
          <div className={styles.stat}>
            <span className={styles.statValue}>5/15</span>
            <span className={styles.statLabel}>{t('home.stat.steps')}</span>
          </div>
        </Card>
      </div>

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>{t('home.quick.title')}</h3>
        <div className={styles.quickGrid}>
          <Button
            onClick={() => {/* TODO */}}
          >
            {t('home.quick.calc')}
          </Button>
          <Button
            onClick={() => {/* TODO */}}
          >
            {t('home.quick.timers')}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Home;
