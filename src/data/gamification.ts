// ===== 202f Academy — Геймификация (эталон от живого сайта) =====

export interface Rank {
  id: string;
  title: string;
  xp: number;
  perk: string;
}

export const ranks: Rank[] = [
  { id: 'trainee', title: 'Стажёр', xp: 0, perk: 'Доступ к пути Junior' },
  { id: 'barista', title: 'Бариста', xp: 200, perk: 'Открыт уровень Skilled' },
  { id: 'senior', title: 'Старший бариста', xp: 600, perk: 'Доступ к экзамену PRO' },
  { id: 'head', title: 'Шеф-бариста', xp: 1400, perk: 'Право проводить аттестацию' },
  { id: 'legend', title: 'Легенда смены', xp: 3000, perk: 'Зал славы 202f' },
];

export interface Badge {
  id: string;
  title: string;
  desc: string;
  icon: string;
}

export const badges: Badge[] = [
  { id: 'first-steps', title: 'Первый шот', desc: 'Заверши первый день в приложении', icon: '◉' },
  { id: 'ttk-10', title: 'Десятка в голове', desc: 'Отметь «знаю» 10 рецептов ТТК', icon: '▤' },
  { id: 'ttk-40', title: 'Половина меню', desc: 'Отметь «знаю» 40 рецептов ТТК', icon: '▦' },
  { id: 'ttk-all', title: 'Меню в руках', desc: 'Выучи все 79 рецептов', icon: '★' },
  { id: 'quiz-80', title: 'Точный как весы', desc: 'Набери 80%+ в квизе ТТК', icon: '◎' },
  { id: 'blitz-hero', title: 'Блиц-гроза', desc: '8+ верных ответов в «Час пик»', icon: '⚡' },
  { id: 'exam-service', title: 'Гость доволен', desc: 'Закрой блок экзамена «Сервис»', icon: '☺' },
  { id: 'exam-full', title: 'Аттестован', desc: 'Пройди все 4 блока экзамена', icon: '✦' },
  { id: 'streak-3', title: 'Три смены подряд', desc: 'Стрик 3 дня', icon: '≋' },
  { id: 'streak-7', title: 'Неделя на баре', desc: 'Стрик 7 дней', icon: '♨' },
  { id: 'rush-6', title: 'Машина потока', desc: 'Обслужи 6+ гостей в Rush-симуляторе', icon: '➤' },
  { id: 'clean-station', title: 'Чистая группа', desc: 'Закрой чек-лист гигиены полностью', icon: '✳' },
  { id: 'shift-open', title: 'Открыл смену', desc: 'Выполни чек-лист открытия', icon: '☀' },
  { id: 'quest-day', title: 'План выполнен', desc: 'Закрой все квесты дня', icon: '✔' },
];

export interface QuestTemplate {
  id: string;
  title: string;
  target: number;
  xp: number;
  metric: 'known' | 'quiz' | 'blitz' | 'checklist' | 'rush' | 'lesson';
}

export const questPool: QuestTemplate[] = [
  { id: 'q-known-3', title: 'Выучи 3 рецепта ТТК', target: 3, xp: 40, metric: 'known' },
  { id: 'q-quiz-1', title: 'Пройди квиз по ТТК', target: 1, xp: 30, metric: 'quiz' },
  { id: 'q-blitz-6', title: '6 верных ответов в блице', target: 6, xp: 50, metric: 'blitz' },
  { id: 'q-check-1', title: 'Закрой один чек-лист дисциплины', target: 1, xp: 35, metric: 'checklist' },
  { id: 'q-rush-4', title: 'Обслужи 4 гостей в Rush', target: 4, xp: 45, metric: 'rush' },
  { id: 'q-lesson-1', title: 'Изучи методику из библиотеки', target: 1, xp: 25, metric: 'lesson' },
];

export interface QuestState {
  id: string;
  title: string;
  target: number;
  xp: number;
  metric: QuestTemplate['metric'];
  progress: number;
  done: boolean;
}

export interface RankInfo {
  current: Rank;
  next: Rank | null;
  into: number;
  span: number;
}

export function rankFor(xp: number): RankInfo {
  let current = ranks[0];
  let next: Rank | null = null;
  for (let i = 0; i < ranks.length; i++) {
    if (xp >= ranks[i].xp) current = ranks[i];
    else {
      next = ranks[i];
      break;
    }
  }
  const span = next ? next.xp - current.xp : 1;
  const into = next ? xp - current.xp : 1;
  return { current, next, into, span };
}

// ===== Backward-compatible exports for existing screens (to be replaced in Wave 4) =====

export interface Step {
  id: string;
  levelId: string;
  level: string;
  index: number;
  title: string;
  name: string;
  subtitle: string;
  description: string;
  focus: string;
  accent: string;
  xpRequired: number;
  xpReward: number;
  lessonIds: string[];
  controlTestId: string;
  checklist: string[];
  isAttestation: boolean;
}

export const STEPS: Step[] = [
  { id: 'j1', levelId: 'junior', level: 'Junior', index: 0, title: 'Зерно и свежесть', name: 'Зерно и свежесть', subtitle: 'Введение в specialty', description: 'Продукт, сервис, оборудование', focus: 'Продукт, сервис, оборудование, базовый эспрессо и молоко', accent: '#4FBBBC', xpRequired: 0, xpReward: 60, lessonIds: [], controlTestId: 'ct-j1', checklist: [], isAttestation: false },
  { id: 'j2', levelId: 'junior', level: 'Junior', index: 1, title: 'Помол и экстракция', name: 'Помол и экстракция', subtitle: 'Помол и экстракция', description: 'Помол, экстракция, каналирование', focus: 'Помол и экстракция', accent: '#4FBBBC', xpRequired: 60, xpReward: 60, lessonIds: [], controlTestId: 'ct-j2', checklist: [], isAttestation: false },
  { id: 'j3', levelId: 'junior', level: 'Junior', index: 2, title: 'Эспрессо', name: 'Эспрессо', subtitle: 'Базовый рецепт эспрессо', description: 'Доза, выход, время', focus: 'Эспрессо', accent: '#4FBBBC', xpRequired: 120, xpReward: 60, lessonIds: [], controlTestId: 'ct-j3', checklist: [], isAttestation: false },
  { id: 'j4', levelId: 'junior', level: 'Junior', index: 3, title: 'Молоко и меню', name: 'Молоко и меню', subtitle: 'Микропена и молочные напитки', description: 'Микропена, латте-арт', focus: 'Молоко и меню', accent: '#4FBBBC', xpRequired: 180, xpReward: 60, lessonIds: [], controlTestId: 'ct-j4', checklist: [], isAttestation: false },
  { id: 'j5', levelId: 'junior', level: 'Junior', index: 4, title: 'Аттестация Junior', name: 'Аттестация Junior', subtitle: 'Аттестация уровня Junior', description: 'Финальный тест Junior', focus: 'Аттестация', accent: '#EC4624', xpRequired: 240, xpReward: 600, lessonIds: [], controlTestId: 'ct-j5', checklist: [], isAttestation: true },
  { id: 's1', levelId: 'skilled', level: 'Skilled', index: 0, title: 'Диалин и TDS', name: 'Диалин и TDS', subtitle: 'Настройка рецепта под зерно', description: 'Диалин, TDS, экстракция', focus: 'Диалин', accent: '#F39120', xpRequired: 840, xpReward: 60, lessonIds: [], controlTestId: 'ct-s1', checklist: [], isAttestation: false },
  { id: 's2', levelId: 'skilled', level: 'Skilled', index: 1, title: 'Фильтр V60 / Kalita / Aeropress', name: 'Фильтр V60 / Kalita / Aeropress', subtitle: 'Методы фильтрации', description: 'V60, Kalita, Aeropress', focus: 'Фильтр', accent: '#F39120', xpRequired: 900, xpReward: 60, lessonIds: [], controlTestId: 'ct-s2', checklist: [], isAttestation: false },
  { id: 's3', levelId: 'skilled', level: 'Skilled', index: 2, title: 'Сенсорика и каппинг', name: 'Сенсорика и каппинг', subtitle: 'Каппинг SCA', description: 'Сенсорика, колесо вкусов', focus: 'Сенсорика', accent: '#F39120', xpRequired: 960, xpReward: 60, lessonIds: [], controlTestId: 'ct-s3', checklist: [], isAttestation: false },
  { id: 's4', levelId: 'skilled', level: 'Skilled', index: 3, title: 'Вода и диагностика', name: 'Вода и диагностика', subtitle: 'Стандарт воды SCA', description: 'Жёсткость, щёлочность, TDS', focus: 'Вода', accent: '#F39120', xpRequired: 1020, xpReward: 60, lessonIds: [], controlTestId: 'ct-s4', checklist: [], isAttestation: false },
  { id: 's5', levelId: 'skilled', level: 'Skilled', index: 4, title: 'Аттестация Skilled', name: 'Аттестация Skilled', subtitle: 'Аттестация уровня Skilled', description: 'Финальный тест Skilled', focus: 'Аттестация', accent: '#EC4624', xpRequired: 1080, xpReward: 600, lessonIds: [], controlTestId: 'ct-s5', checklist: [], isAttestation: true },
  { id: 'p1', levelId: 'pro', level: 'PRO', index: 0, title: 'Химия обжарки и происхождение', name: 'Химия обжарки и происхождение', subtitle: 'Три фазы и DTR', description: 'Обжарка, происхождение', focus: 'Обжарка', accent: '#EC4624', xpRequired: 1680, xpReward: 60, lessonIds: [], controlTestId: 'ct-p1', checklist: [], isAttestation: false },
  { id: 'p2', levelId: 'pro', level: 'PRO', index: 1, title: 'Меню и сигнатурные напитки', name: 'Меню и сигнатурные напитки', subtitle: 'Авторские напитки', description: 'Меню, сигнатуры', focus: 'Меню', accent: '#EC4624', xpRequired: 1740, xpReward: 60, lessonIds: [], controlTestId: 'ct-p2', checklist: [], isAttestation: false },
  { id: 'p3', levelId: 'pro', level: 'PRO', index: 2, title: 'Смена и менеджмент', name: 'Смена и менеджмент', subtitle: 'Организация смены', description: 'Смена, менеджмент', focus: 'Менеджмент', accent: '#EC4624', xpRequired: 1800, xpReward: 60, lessonIds: [], controlTestId: 'ct-p3', checklist: [], isAttestation: false },
  { id: 'p4', levelId: 'pro', level: 'PRO', index: 3, title: 'Менторинг и стандарты', name: 'Менторинг и стандарты', subtitle: 'Обучение стажёров', description: 'Менторинг, стандарты', focus: 'Менторинг', accent: '#EC4624', xpRequired: 1860, xpReward: 60, lessonIds: [], controlTestId: 'ct-p4', checklist: [], isAttestation: false },
  { id: 'p5', levelId: 'pro', level: 'PRO', index: 4, title: 'Аттестация PRO', name: 'Аттестация PRO', subtitle: 'Аттестация уровня PRO', description: 'Финальный тест PRO', focus: 'Аттестация', accent: '#EC4624', xpRequired: 1920, xpReward: 600, lessonIds: [], controlTestId: 'ct-p5', checklist: [], isAttestation: true },
];

export const LEVELS = ranks.map((r) => ({
  id: r.id,
  name: r.title,
  title: r.title,
  xp: r.xp,
  subtitle: r.perk,
  description: r.perk,
  focus: r.perk,
  accent: r.id === 'trainee' ? '#4FBBBC' : r.id === 'barista' ? '#F39120' : '#EC4624',
}));

export const XP = {
  LESSON_COMPLETED: 60,
  CHECKLIST_ITEM: 40,
  CONTROL_TEST_PASS: 250,
  ATTESTATION_PASS: 600,
  DRILL_CORRECT: 10,
  TRAINING_COMPLETE: 80,
} as const;

export function getStep(id: string): Step | undefined {
  return STEPS.find((s) => s.id === id);
}

export function getStepsByLevel(levelId: string): Step[] {
  return STEPS.filter((s) => s.levelId === levelId);
}

export function formatXp(xp: number): string {
  return xp.toLocaleString('ru-RU');
}

export function getLevelInfo(xp: number): { level: string; name: string; progress: number; nextXp: number } {
  const rank = rankFor(xp);
  return {
    level: rank.current.title,
    name: rank.current.title,
    progress: rank.into,
    nextXp: rank.next ? rank.next.xp : rank.current.xp,
  };
}

export function badgeFor(state: {
  knownCount: number;
  quizBest: number;
  blitzBest: number;
  streak: number;
  rushBest: number;
  days: number;
  examKnownCount: number;
  questsDoneToday: number;
  questsTotalToday: number;
  checklistsDoneToday: string[];
}): string[] {
  const earned: string[] = [];
  const { knownCount, quizBest, blitzBest, streak, rushBest, days, examKnownCount, questsDoneToday, questsTotalToday, checklistsDoneToday } = state;

  if (days >= 1) earned.push('first-steps');
  if (knownCount >= 10) earned.push('ttk-10');
  if (knownCount >= 40) earned.push('ttk-40');
  if (knownCount >= 79) earned.push('ttk-all');
  if (quizBest >= 80) earned.push('quiz-80');
  if (blitzBest >= 8) earned.push('blitz-hero');
  if (streak >= 3) earned.push('streak-3');
  if (streak >= 7) earned.push('streak-7');
  if (rushBest >= 6) earned.push('rush-6');
  if (checklistsDoneToday.includes('hygiene')) earned.push('clean-station');
  if (checklistsDoneToday.includes('open')) earned.push('shift-open');
  if (examKnownCount >= 8) earned.push('exam-service');
  if (examKnownCount >= 32) earned.push('exam-full');
  if (questsDoneToday === questsTotalToday && questsTotalToday > 0) earned.push('quest-day');

  return earned;
}