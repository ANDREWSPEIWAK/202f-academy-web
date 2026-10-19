// Матрица навыков 202f: группы навыков, сопоставленные с категориями
// вопросов и контрольными тестами. Значения вычисляются из реального
// прогресса (тренажёр, тесты, тренировки), а не хранятся.

import { CategoryStat, errorRate } from '../engine/testingEngine';
import { TestResult } from '../store/progressStore';

export interface TrainingResultSummary {
  bestScore: number;
  attempts: number;
}

export interface SkillDef {
  id: string;
  nameRu: string;
  nameEn: string;
  /** категории вопросов, питающих теорию навыка */
  categories: string[];
  /** контрольные тесты, питающие теорию навыка */
  testIds: string[];
  /** тренировки, питающие практику навыка */
  taskIds: string[];
  /** стартовая оценка, пока нет данных */
  baseline: number;
}

export const SKILL_DEFS: SkillDef[] = [
  {
    id: 'coffee-knowledge',
    nameRu: 'Кофейная теория',
    nameEn: 'Coffee Knowledge',
    categories: ['Зерно', 'Обжарка'],
    testIds: ['ct-junior-1'],
    taskIds: [],
    baseline: 35,
  },
  {
    id: 'espresso',
    nameRu: 'Эспрессо',
    nameEn: 'Espresso',
    categories: ['Эспрессо', 'Экстракция', 'Помол и экстракция'],
    testIds: ['ct-junior-2', 'ct-junior-3'],
    taskIds: ['dial-in-espresso', 'grinder-calibration', 'consistency-challenge'],
    baseline: 30,
  },
  {
    id: 'dial-in',
    nameRu: 'Дайлинг',
    nameEn: 'Dial-in',
    categories: ['Дайлинг'],
    testIds: ['ct-skilled-1'],
    taskIds: ['dial-in-espresso'],
    baseline: 25,
  },
  {
    id: 'filter',
    nameRu: 'Фильтр-кофе',
    nameEn: 'Filter Brewing',
    categories: ['Фильтр'],
    testIds: ['ct-skilled-2'],
    taskIds: ['v60-brew', 'kalita-brew'],
    baseline: 25,
  },
  {
    id: 'milk',
    nameRu: 'Молоко',
    nameEn: 'Milk',
    categories: ['Молоко'],
    testIds: ['ct-junior-4'],
    taskIds: ['milk-texturing', 'latte-art'],
    baseline: 30,
  },
  {
    id: 'sensory',
    nameRu: 'Сенсорика',
    nameEn: 'Sensory',
    categories: ['Сенсорика'],
    testIds: ['ct-skilled-3'],
    taskIds: ['sensory-identification'],
    baseline: 20,
  },
  {
    id: 'equipment-water',
    nameRu: 'Оборудование и вода',
    nameEn: 'Equipment & Water',
    categories: ['Вода'],
    testIds: ['ct-skilled-4'],
    taskIds: ['grinder-calibration', 'machine-cleaning'],
    baseline: 25,
  },
  {
    id: 'service-workflow',
    nameRu: 'Сервис и воркфлоу',
    nameEn: 'Service & Workflow',
    categories: ['Сервис', 'Смена', 'Меню', 'Обучение'],
    testIds: [],
    taskIds: ['workflow-challenge', 'machine-cleaning'],
    baseline: 30,
  },
];

export type SkillTrend = 'up' | 'stable' | 'down' | 'none';
export type Confidence = 'low' | 'medium' | 'high';

export interface SkillMetric {
  def: SkillDef;
  /** 0–100 */
  value: number;
  /** вклад теории и практики (для подписей) */
  theory: number | null;
  practice: number | null;
  level: 'not_started' | 'learning' | 'practicing' | 'competent' | 'advanced';
  confidence: Confidence;
  trend: SkillTrend;
  /** категории с высокой долей ошибок */
  weakAreas: string[];
  /** что делать дальше: категория тренажёра или тренировка */
  recommendation: { kind: 'drill'; category: string } | { kind: 'training'; taskId: string } | null;
}

function theoryScore(
  def: SkillDef,
  categoryStats: Record<string, CategoryStat>,
  testResults: Record<string, TestResult>
): { score: number | null; points: number; weak: string[] } {
  let weighted = 0;
  let weight = 0;
  let points = 0;
  const weak: string[] = [];
  for (const cat of def.categories) {
    const stat = categoryStats[cat];
    if (!stat) continue;
    const total = stat.correct + stat.wrong;
    if (total === 0) continue;
    weighted += (1 - errorRate(stat)) * total;
    weight += total;
    points += total;
    if (errorRate(stat) >= 0.3) weak.push(cat);
  }
  for (const testId of def.testIds) {
    const res = testResults[testId];
    if (!res) continue;
    weighted += res.bestScore * 2;
    weight += 2;
    points += 2;
  }
  return { score: weight > 0 ? Math.round(weighted / weight) : null, points, weak };
}

function practiceScore(def: SkillDef, trainingResults: Record<string, TrainingResultSummary>): number | null {
  const scores = def.taskIds
    .map((id) => trainingResults[id])
    .filter((r): r is TrainingResultSummary => !!r && r.attempts > 0);
  if (scores.length === 0) return null;
  const avg = scores.reduce((acc, s) => acc + s.bestScore, 0) / scores.length;
  return Math.round(avg);
}

function toLevel(value: number): SkillMetric['level'] {
  if (value < 20) return 'not_started';
  if (value < 40) return 'learning';
  if (value < 60) return 'practicing';
  if (value < 80) return 'competent';
  return 'advanced';
}

export function computeSkillMatrix(
  categoryStats: Record<string, CategoryStat>,
  testResults: Record<string, TestResult>,
  trainingResults: Record<string, TrainingResultSummary>
): SkillMetric[] {
  return SKILL_DEFS.map((def) => {
    const theory = theoryScore(def, categoryStats, testResults);
    const practice = practiceScore(def, trainingResults);

    let value: number;
    if (theory.score !== null && practice !== null) value = Math.round(theory.score * 0.6 + practice * 0.4);
    else if (theory.score !== null) value = theory.score;
    else if (practice !== null) value = practice;
    else value = def.baseline;

    const confidence: Confidence = theory.points >= 15 ? 'high' : theory.points >= 5 ? 'medium' : 'low';
    const hasData = theory.score !== null || practice !== null;
    const trend: SkillTrend = !hasData ? 'none' : value >= def.baseline + 8 ? 'up' : value <= def.baseline - 8 ? 'down' : 'stable';

    let recommendation: SkillMetric['recommendation'] = null;
    const weakestCategory = theory.weak[0] ?? null;
    if (practice !== null && theory.score !== null && practice < theory.score - 10 && def.taskIds.length > 0) {
      recommendation = { kind: 'training', taskId: def.taskIds[0] };
    } else if (weakestCategory) {
      recommendation = { kind: 'drill', category: weakestCategory };
    } else if (theory.score === null && def.categories.length > 0) {
      recommendation = { kind: 'drill', category: def.categories[0] };
    } else if (def.taskIds.length > 0) {
      recommendation = { kind: 'training', taskId: def.taskIds[0] };
    }

    return {
      def,
      value,
      theory: theory.score,
      practice,
      level: toLevel(value),
      confidence,
      trend,
      weakAreas: theory.weak,
      recommendation,
    };
  });
}

/** Среднее по матрице — используется в сертификации */
export function averageSkillValue(metrics: SkillMetric[]): number {
  if (metrics.length === 0) return 0;
  return Math.round(metrics.reduce((acc, m) => acc + m.value, 0) / metrics.length);
}
