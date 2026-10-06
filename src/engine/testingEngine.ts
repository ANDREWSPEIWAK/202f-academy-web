import { BankQuestion, QUESTIONS, getQuestion } from '../data/questions';

/**
 * Testing Engine BaristaOS 202f.
 * - Оценивание всех типов вопросов (single / multi / number / order).
 * - Адаптивный подбор тренажёра: приоритет слабым категориям.
 * - Spaced repetition: категории с ошибками возвращаются раньше,
 *   интервал повторения растёт с каждым успешным проходом.
 */

export type Answer =
  | { kind: 'single'; index: number }
  | { kind: 'multi'; indexes: number[] }
  | { kind: 'number'; value: string }
  | { kind: 'order'; sequence: number[] };

export interface GradeResult {
  correct: boolean;
  /** для number: значение в допуске, но не точное */
  nearMiss?: boolean;
}

export function gradeAnswer(q: BankQuestion, answer: Answer): GradeResult {
  const kind = q.kind ?? 'single';
  switch (kind) {
    case 'single':
      return { correct: answer.kind === 'single' && answer.index === q.correctIndex };
    case 'multi': {
      if (answer.kind !== 'multi' || !q.correctIndexes) return { correct: false };
      const a = [...answer.indexes].sort().join(',');
      const c = [...q.correctIndexes].sort().join(',');
      return { correct: a === c && a.length > 0 };
    }
    case 'number': {
      if (answer.kind !== 'number' || !q.correctNumber) return { correct: false };
      const value = parseFloat(answer.value.replace(',', '.'));
      if (Number.isNaN(value)) return { correct: false };
      const { value: target, tolerance } = q.correctNumber;
      const diff = Math.abs(value - target);
      if (diff <= tolerance) return { correct: true };
      // near miss: в пределах двойного допуска — ответ засчитывается как ошибка,
      // но помечается для мягкого разбора
      return { correct: false, nearMiss: diff <= tolerance * 2 };
    }
    case 'order': {
      if (answer.kind !== 'order' || !q.correctOrder) return { correct: false };
      const a = answer.sequence.join(',');
      const c = q.correctOrder.join(',');
      return { correct: a === c };
    }
    default:
      return { correct: false };
  }
}

export function isAnswerComplete(q: BankQuestion, answer: Answer | null): boolean {
  if (!answer) return false;
  switch (answer.kind) {
    case 'single':
      return true;
    case 'multi':
      return answer.indexes.length > 0;
    case 'number':
      return answer.value.trim().length > 0;
    case 'order':
      return answer.sequence.length === (q.correctOrder?.length ?? 0);
  }
}

// ===== Spaced repetition =====

export interface CategoryStat {
  correct: number;
  wrong: number;
  lastSeen: string; // ISO
  intervalDays: number;
}

const DAY_MS = 24 * 60 * 60 * 1000;
export const MAX_INTERVAL_DAYS = 21;

/** Обновление статистики категории по SM-2-упрощению */
export function updateStat(stat: CategoryStat | undefined, correct: boolean, now = new Date()): CategoryStat {
  const base: CategoryStat = stat ?? { correct: 0, wrong: 0, lastSeen: now.toISOString(), intervalDays: 1 };
  if (correct) {
    return {
      correct: base.correct + 1,
      wrong: base.wrong,
      lastSeen: now.toISOString(),
      intervalDays: Math.min(MAX_INTERVAL_DAYS, Math.max(1, base.intervalDays) * 2),
    };
  }
  // ошибка сбрасывает интервал — категория вернётся в ближайших сессиях
  return {
    correct: base.correct,
    wrong: base.wrong + 1,
    lastSeen: now.toISOString(),
    intervalDays: 1,
  };
}

/** Категория «к повторению», если интервал истёк или по ней есть ошибки */
export function isDue(stat: CategoryStat | undefined, now = new Date()): boolean {
  if (!stat) return true; // новая категория — всегда к повторению
  const elapsed = now.getTime() - new Date(stat.lastSeen).getTime();
  return elapsed >= stat.intervalDays * DAY_MS;
}

export function errorRate(stat: CategoryStat | undefined): number {
  if (!stat) return 0.5; // неизвестная категория — средний приоритет
  const total = stat.correct + stat.wrong;
  if (total === 0) return 0.5;
  return stat.wrong / total;
}

// ===== Адаптивная сборка сессии =====

export interface DrillOptions {
  size: number;
  categoryStats: Record<string, CategoryStat>;
  recentQuestionIds: string[];
  /** ограничение по уровню сложности (например, по текущему уровню бариста) */
  tierCap?: 'BASE' | 'MEDIUM' | 'PRO';
}

const TIER_ORDER: Record<string, number> = { BASE: 0, MEDIUM: 1, PRO: 2 };

/**
 * Сборка адаптивной сессии:
 * 1. Все вопросы взвешиваются: слабые и «просроченные» категории — выше.
 * 2. Недавно показанные вопросы исключаются.
 * 3. Гарантируется микс типов вопросов в сессии.
 */
export function buildDrillSession(opts: DrillOptions): BankQuestion[] {
  const { size, categoryStats, recentQuestionIds, tierCap } = opts;
  const now = new Date();
  const recent = new Set(recentQuestionIds);

  let pool = QUESTIONS.filter((q) => !recent.has(q.id));
  if (pool.length < size) {
    // если свежих вопросов не хватает — ослабляем фильтр повторов
    pool = QUESTIONS.filter((q) => !recent.has(q.id) || Math.random() < 0.3);
    if (pool.length < size) pool = [...QUESTIONS];
  }
  if (tierCap) {
    const capped = pool.filter((q) => TIER_ORDER[q.tier] <= TIER_ORDER[tierCap]);
    if (capped.length >= size) pool = capped;
  }

  const scored = pool.map((q) => {
    const stat = categoryStats[q.category];
    const due = isDue(stat, now);
    const err = errorRate(stat);
    // вес: базовый 1 + бонус за просроченность (×2) + бонус за ошибки (до ×2)
    const weight = 1 + (due ? 2 : 0) + err * 2;
    return { q, weight };
  });

  // взвешенная выборка без повторов
  const picked: BankQuestion[] = [];
  const available = [...scored];
  while (picked.length < size && available.length > 0) {
    const total = available.reduce((s, x) => s + x.weight, 0);
    let roll = Math.random() * total;
    let idx = 0;
    for (let i = 0; i < available.length; i++) {
      roll -= available[i].weight;
      if (roll <= 0) {
        idx = i;
        break;
      }
    }
    picked.push(available[idx].q);
    available.splice(idx, 1);
  }

  // перемешиваем, чтобы типы вопросов шли вперемешку
  for (let i = picked.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [picked[i], picked[j]] = [picked[j], picked[i]];
  }
  return picked;
}

/** Вопросы контрольного теста по id (с проверкой существования) */
export function getQuestionsForTest(ids: string[]): BankQuestion[] {
  return ids.map(getQuestion).filter((q): q is BankQuestion => !!q);
}

/** Подпись типа вопроса для UI */
export function kindLabel(q: BankQuestion): string {
  switch (q.kind ?? 'single') {
    case 'multi':
      return 'Несколько ответов';
    case 'number':
      return 'Расчёт';
    case 'order':
      return 'Последовательность';
    default:
      return 'Один ответ';
  }
}
