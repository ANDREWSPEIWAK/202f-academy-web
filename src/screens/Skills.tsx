import React, { useMemo } from 'react';
import Card from '../components/Card';
import Badge from '../components/Badge';
import ProgressBar from '../components/ProgressBar';
import styles from './Skills.module.css';
import { NavSection } from '../components/Layout';
import { useT, useI18nStore } from '../i18n';
import { useProgressStore } from '../store/progressStore';
import { useTrainingStore, summarizeAll } from '../store/trainingStore';
import { computeSkillMatrix, averageSkillValue, SkillMetric } from '../data/skillMatrix';
import { getTask } from '../data/trainingTasks';

interface SkillsProps {
  onNavigate: (section: NavSection) => void;
}

const LEVEL_KEY: Record<SkillMetric['level'], string> = {
  not_started: 'skills.level.not_started',
  learning: 'skills.level.learning',
  practicing: 'skills.level.practicing',
  competent: 'skills.level.competent',
  advanced: 'skills.level.advanced',
};

const TREND_KEY: Record<SkillMetric['trend'], string> = {
  up: 'skills.trend.up',
  stable: 'skills.trend.stable',
  down: 'skills.trend.down',
  none: 'skills.trend.none',
};

const TREND_GLYPH: Record<SkillMetric['trend'], string> = {
  up: '↑',
  stable: '→',
  down: '↓',
  none: '·',
};

const Skills: React.FC<SkillsProps> = ({ onNavigate }) => {
  const t = useT();
  const lang = useI18nStore((s) => s.lang);
  const categoryStats = useProgressStore((s) => s.categoryStats);
  const testResults = useProgressStore((s) => s.testResults);
  const attempts = useTrainingStore((s) => s.attempts);

  const trainingSummary = useMemo(() => summarizeAll(attempts), [attempts]);
  const metrics = useMemo(
    () => computeSkillMatrix(categoryStats, testResults, trainingSummary),
    [categoryStats, testResults, trainingSummary]
  );
  const average = averageSkillValue(metrics);

  return (
    <div className={styles.skills}>
      <div className={styles.header}>
        <h1 className={styles.title}>{t('skills.title')}</h1>
      </div>

      <Card className={styles.summaryCard}>
        <div className={styles.summary}>
          <div>
            <p className={styles.summaryValue}>{average}%</p>
            <p className={styles.summaryLabel}>{t('skills.summary')}</p>
          </div>
          <div className={styles.summaryMeta}>
            <span className={styles.summaryCount}>{metrics.filter((m) => m.value >= 60).length}/8</span>
            <span className={styles.summaryMetaLabel}>{t('skills.competentCount')}</span>
          </div>
        </div>
      </Card>

      <div className={styles.list}>
        {metrics.map((m) => {
          const name = lang === 'en' ? m.def.nameEn : m.def.nameRu;
          const recTask = m.recommendation?.kind === 'training' ? getTask(m.recommendation.taskId) : null;
          return (
            <Card key={m.def.id} className={styles.skillCard}>
              <div className={styles.skillTop}>
                <p className={styles.skillName}>{name}</p>
                <Badge variant={m.value >= 60 ? 'success' : m.value >= 40 ? 'warning' : 'secondary'} size="small">
                  {t(LEVEL_KEY[m.level])}
                </Badge>
              </div>

              <div className={styles.valueRow}>
                <span className={styles.skillValue}>{m.value}%</span>
                <span className={`${styles.trend} ${styles[`trend_${m.trend}`]}`}>
                  <span aria-hidden="true">{TREND_GLYPH[m.trend]}</span> {t(TREND_KEY[m.trend])}
                </span>
              </div>

              <div className={styles.bars}>
                <div className={styles.barRow}>
                  <span className={styles.barLabel}>{t('skills.theory')}</span>
                  {m.theory !== null ? (
                    <ProgressBar value={m.theory} showLabel={false} size="small" />
                  ) : (
                    <span className={styles.noData}>—</span>
                  )}
                  <span className={styles.barValue}>{m.theory !== null ? `${m.theory}%` : '—'}</span>
                </div>
                <div className={styles.barRow}>
                  <span className={styles.barLabel}>{t('skills.practice')}</span>
                  {m.practice !== null ? (
                    <ProgressBar value={m.practice} showLabel={false} size="small" />
                  ) : (
                    <span className={styles.noData}>—</span>
                  )}
                  <span className={styles.barValue}>{m.practice !== null ? `${m.practice}%` : '—'}</span>
                </div>
              </div>

              <div className={styles.metaRow}>
                <span className={styles.confidence}>
                  <span className={styles.confidenceLabel}>{t('skills.confidence')}:</span>
                  <span className={styles.dots} aria-label={t(`skills.confidence.${m.confidence}`)}>
                    {[0, 1, 2].map((i) => (
                      <span
                        key={i}
                        className={`${styles.dot} ${
                          (m.confidence === 'high' && i < 3) ||
                          (m.confidence === 'medium' && i < 2) ||
                          (m.confidence === 'low' && i < 1)
                            ? styles.dotOn
                            : ''
                        }`}
                      />
                    ))}
                  </span>
                </span>
                {m.weakAreas.length > 0 && (
                  <span className={styles.weak}>{t('skills.weakAreas')}: {m.weakAreas.join(', ')}</span>
                )}
              </div>

              {m.recommendation && (
                <button
                  type="button"
                  className={styles.recommendation}
                  onClick={() => onNavigate(m.recommendation!.kind === 'training' ? 'training' : 'tests')}
                >
                  <span className={styles.recLabel}>
                    {m.recommendation.kind === 'drill'
                      ? `${t('skills.recDrill')}: ${m.recommendation.category}`
                      : `${t('skills.recTraining')}: ${lang === 'en' ? recTask!.titleEn : recTask!.titleRu}`}
                  </span>
                  <span className={styles.recArrow} aria-hidden="true">→</span>
                </button>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default Skills;
