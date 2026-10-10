import React, { useMemo } from 'react';
import Card from '../components/Card';
import Logo202 from '../components/Logo202';
import Badge from '../components/Badge';
import ProgressBar from '../components/ProgressBar';
import styles from './Certification.module.css';
import { useT } from '../i18n';
import { useProgressStore, isStepCompleted } from '../store/progressStore';
import { useTrainingStore, summarizeAll } from '../store/trainingStore';
import { LEVELS, getStepsByLevel } from '../data/gamification';
import { computeSkillMatrix, averageSkillValue } from '../data/skillMatrix';

interface Requirement {
  key: string;
  label: string;
  done: boolean;
  detail: string;
}

interface LevelStatus {
  levelId: string;
  name: string;
  subtitle: string;
  requirements: Requirement[];
  allDone: boolean;
  readyExceptApproval: boolean;
  locked: boolean;
  progress: number;
}

// Практические тренировки, требуемые для уровня: минимум 2 из списка с порогом
const PRACTICAL_TASKS: Record<string, { ids: string[]; threshold: number; need: number }> = {
  JUNIOR: { ids: ['milk-texturing', 'machine-cleaning', 'v60-brew'], threshold: 70, need: 2 },
  SKILLED: { ids: ['dial-in-espresso', 'v60-brew', 'sensory-identification'], threshold: 70, need: 2 },
  PRO: { ids: ['workflow-challenge', 'consistency-challenge', 'latte-art'], threshold: 75, need: 2 },
};

const SKILL_THRESHOLD: Record<string, number> = {
  JUNIOR: 45,
  SKILLED: 60,
  PRO: 70,
};

const Certification: React.FC = () => {
  const t = useT();
  const progress = useProgressStore();
  const attempts = useTrainingStore((s) => s.attempts);

  const statuses = useMemo<LevelStatus[]>(() => {
    const trainingSummary = summarizeAll(attempts);
    const metrics = computeSkillMatrix(progress.categoryStats, progress.testResults, trainingSummary);
    const avgSkill = averageSkillValue(metrics);

    let prevCertified = true;
    return LEVELS.map((level) => {
      const steps = getStepsByLevel(level.id);

      const levelLessons = steps.flatMap((s) => s.lessonIds);
      const lessonsDone = levelLessons.filter((id) => progress.completedLessons[id]).length;

      const checklistTotal = steps.reduce((acc, s) => acc + s.checklist.length, 0);
      const checklistDone = steps.reduce(
        (acc, s) => acc + s.checklist.filter((_, i) => progress.checklist[`${s.id}:${i}`]).length,
        0
      );

      const levelTests = steps.map((s) => s.controlTestId);
      const testsPassed = levelTests.filter((id) => progress.testResults[id]?.passed).length;

      const practical = PRACTICAL_TASKS[level.id];
      const practicalDone = practical.ids.filter(
        (id) => (trainingSummary[id]?.bestScore ?? 0) >= practical.threshold
      ).length;

      const skillOk = avgSkill >= SKILL_THRESHOLD[level.id];

      const attestation = steps.find((s) => s.isAttestation);
      const approved = attestation ? isStepCompleted(attestation, progress) : false;

      const requirements: Requirement[] = [
        {
          key: 'lessons',
          label: t('certification.req.lessons'),
          done: lessonsDone === levelLessons.length,
          detail: `${lessonsDone}/${levelLessons.length}`,
        },
        {
          key: 'checklist',
          label: t('certification.req.checklist'),
          done: checklistDone === checklistTotal,
          detail: `${checklistDone}/${checklistTotal}`,
        },
        {
          key: 'tests',
          label: t('certification.req.tests'),
          done: testsPassed === levelTests.length,
          detail: `${testsPassed}/${levelTests.length}`,
        },
        {
          key: 'practical',
          label: t('certification.req.practical'),
          done: practicalDone >= practical.need,
          detail: `${practicalDone}/${practical.need} ≥${practical.threshold}%`,
        },
        {
          key: 'skills',
          label: t('certification.req.skills'),
          done: skillOk,
          detail: `${avgSkill}% ≥${SKILL_THRESHOLD[level.id]}%`,
        },
        {
          key: 'approval',
          label: t('certification.req.approval'),
          done: approved,
          detail: t('certification.req.approvalHint'),
        },
      ];

      const allDone = requirements.every((r) => r.done);
      const readyExceptApproval = requirements.every((r) => r.done || r.key === 'approval');
      const progressPct = Math.round((requirements.filter((r) => r.done).length / requirements.length) * 100);

      const status: LevelStatus = {
        levelId: level.id,
        name: level.name,
        subtitle: level.subtitle,
        requirements,
        allDone,
        readyExceptApproval,
        locked: !prevCertified,
        progress: progressPct,
      };
      prevCertified = allDone;
      return status;
    });
  }, [progress, attempts, t]);

  return (
    <div className={styles.certification}>
      <div className={styles.header}>
        <h1 className={styles.title}>{t('certification.title')}</h1>
      </div>

      <div className={styles.levels}>
        {statuses.map((status) => {
          const variant = status.allDone ? 'success' : status.readyExceptApproval ? 'warning' : 'secondary';
          const statusLabel = status.allDone
            ? t('certification.status.certified')
            : status.readyExceptApproval
              ? t('certification.status.eligible')
              : status.locked
                ? t('certification.status.locked')
                : t('certification.status.progress');
          return (
            <Card key={status.levelId} className={`${styles.levelCard} ${status.allDone ? styles.levelCertified : ''}`}>
              <div className={styles.levelTop}>
                <div>
                  <p className={styles.levelName}>{status.name}</p>
                  <p className={styles.levelSubtitle}>{status.subtitle}</p>
                </div>
                <Badge variant={variant} size="small">
                  {statusLabel}
                </Badge>
              </div>

              <ProgressBar value={status.progress} showLabel={false} size="small" />

              <div className={styles.reqs}>
                {status.requirements.map((req) => (
                  <div key={req.key} className={styles.reqRow}>
                    <span className={`${styles.reqCheck} ${req.done ? styles.reqCheckOn : ''}`} aria-hidden="true">
                      {req.done ? '✓' : '○'}
                    </span>
                    <span className={`${styles.reqLabel} ${req.done ? styles.reqLabelDone : ''}`}>{req.label}</span>
                    <span className={styles.reqDetail}>{req.detail}</span>
                  </div>
                ))}
              </div>

              {status.allDone && (
                <div className={styles.certificate}>
                  <Logo202 mono size={120} className={styles.certWatermark} />
                  <p className={styles.certLabel}>{t('certification.certificate')}</p>
                  <p className={styles.certNumber}>
                    202f-{status.levelId.slice(0, 3)}-{String(Math.abs(hash(status.levelId)) % 10000).padStart(4, '0')}
                  </p>
                </div>
              )}
            </Card>
          );
        })}
      </div>

      <Card>
        <p className={styles.note}>{t('certification.note')}</p>
      </Card>
    </div>
  );
};

/** Стабильный хеш строки для номера сертификата */
function hash(input: string): number {
  let h = 0;
  for (let i = 0; i < input.length; i++) {
    h = (h * 31 + input.charCodeAt(i)) | 0;
  }
  return h;
}

export default Certification;
