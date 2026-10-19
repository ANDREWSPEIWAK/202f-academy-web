// ===== 202f Academy — Типы данных (объединённые) =====
// Основные доменные сущности приложения. Новые поля из эталонного репозитория
// (рецепты, библиотека, геймификация, кейсы, экзамен) добавлены рядом с существующими.

// User & Authentication
export type UserRole = 'student' | 'instructor' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserProfile {
  userId: string;
  currentLevel: string;
  totalProgress: number;
  currentStreak: number;
  totalLessonsCompleted: number;
  totalTestsPassed: number;
  totalBrewLogsRecorded: number;
  joinedAt: Date;
}

export interface Course {
  id: string;
  name: string;
  description: string;
  moduleIds: string[];
  createdAt: Date;
  updatedAt: Date;
}

// Backward-compatible alias for existing stores that import 'Module' from types
export type Module = ModuleBase;

export interface ModuleBase {
  id: string;
  courseId: string;
  name: string;
  description: string;
  lessonIds: string[];
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Lesson {
  id: string;
  moduleId: string;
  title: string;
  content: string;
  order: number;
  duration: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserLessonProgress {
  userId: string;
  lessonId: string;
  completed: boolean;
  startedAt: Date;
  completedAt?: Date;
  timeSpent: number;
}

export interface BrewLog {
  id: string;
  userId: string;
  coffeeName: string;
  origin: string;
  dose: number;
  water: number;
  ratio: string;
  brewTime: number;
  brewMethod: string;
  tds?: number;
  extractionYield?: number;
  rating: number;
  date: Date;
  createdAt: Date;
  updatedAt: Date;
}

// --- Новые модели из эталонного репозитория ---

export interface LocalText { ru: string; en: string }

export interface TtkRecipe {
  id: string;
  name: string;
  category: string;
  recipe: LocalText;
  taste: LocalText;
  method: LocalText;
  steps: { ru: string[]; en: string[] };
}

export interface TtkCategory { id: string; title: string; kicker: string }

export interface LibraryTopic {
  id: string;
  title: string;
  kicker: string;
  blurb: string;
  cover?: string;
  lessonIds?: string[];
}

export interface LibraryItem {
  id: string;
  topicId: string;
  title: string;
  kind: string;
  duration: string;
  cover?: string;
  summary: string;
  youtube?: { id: string; title: string };
  recipe?: { rows: string[][] };
  sections: { title: string; steps?: string[]; body?: string }[];
}

// --- Геймификация ---

export interface Rank { id: string; title: string; xp: number; perk: string }
export interface Badge { id: string; title: string; desc: string; icon: string }
export interface QuestTemplate {
  id: string;
  title: string;
  target: number;
  xp: number;
  metric: 'known' | 'quiz' | 'blitz' | 'checklist' | 'rush' | 'lesson';
}
export interface QuestState {
  id: string;
  title: string;
  target: number;
  xp: number;
  metric: QuestTemplate['metric'];
  progress: number;
  done: boolean;
}
export interface RankInfo { current: Rank; next: Rank | null; into: number; span: number }

// --- Кейсы и экзамен ---

export interface CaseOption { text: string; score: number } // 0 ошибка, 1 терпимо, 2 профессионально
export interface ServiceCase { id: string; block: string; scene: string; options: CaseOption[]; explain: string }

export interface ExamQuestion { id: string; n: number; block: string; prompt: string; model: string }

// --- Учебный план ---

export type TheoryBlock =
  | { type: 'p'; text: string }
  | { type: 'h'; text: string }
  | { type: 'ul'; items: string[] }
  | { type: 'ol'; items: string[] }
  | { type: 'callout'; text: string }
  | { type: 'table'; headers: string[]; rows: string[][] };

export interface CurriculumModule {
  id: string;
  levelId: string;
  title: string;
  subtitle: string;
  duration: string;
  checklist: { id: string; text: string }[];
  theory: TheoryBlock[];
}

export interface AttestationItem { id: string; text: string }
export interface Attestation { title: string; examiner: string; items: AttestationItem[] }
export interface SkillList { id: string; levelId: string; title: string; items: { id: string; text: string }[] }

// --- Сервис и дисциплина ---

export interface BarPosition {
  id: string;
  title: string;
  en: string;
  mission: string;
  duties: string[];
  rule: string;
}
export interface FlowStage { n: number; title: string; desc: string; time: string }
export interface TimeStandard { drink: string; target: string; limit: string; note: string }
export interface SequenceRule { title: string; desc: string }
export interface RushDrink { id: string; name: string; steps: string[]; patience: number }

export interface ChecklistItem { id: string; text: string; tip: string }
export interface Checklist { id: string; title: string; kicker: string; items: ChecklistItem[] }
export interface DisciplineRule {
  id: string;
  title: string;
  level: 'critical' | 'major' | 'minor';
  rule: string;
  why: string;
  how: string;
}

// --- Вкусовое колесо и стандарты ---

export interface WheelCategory {
  id: string;
  title: string;
  short: string;
  notes: string[];
  grind?: string;
  brew?: string;
  fill?: string;
  regions: { name: string; why: string }[];
}

export interface GuideStandard {
  id: string;
  title: string;
  kicker: string;
  body: string;
  table: { headers: string[]; rows: string[][] };
}

// --- Существующие модели (сохранены) ---

export interface Test {
  id: string;
  title: string;
  description: string;
  questionIds: string[];
  timeLimit: number;
  passingScore: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface TestQuestion {
  id: string;
  testId: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface TestAttempt {
  id: string;
  userId: string;
  testId: string;
  answers: number[];
  score: number;
  passed: boolean;
  startedAt: Date;
  completedAt: Date;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  condition: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserAchievement {
  userId: string;
  achievementId: string;
  unlockedAt: Date;
}

export interface Skill {
  id: string;
  name: string;
  description: string;
  category: string;
  level: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserSkillProgress {
  userId: string;
  skillId: string;
  level: number;
  experience: number;
  updatedAt: Date;
}

export interface TrainerMessage {
  id: string;
  userId: string;
  role: 'user' | 'trainer';
  content: string;
  timestamp: Date;
}

export interface Recipe {
  id: string;
  name: string;
  description: string;
  category: string;
  standard?: string;
  ingredients: { name: string; amount: number; unit: string }[];
  method: string;
  glassType?: string;
  temperature?: number;
  rating?: number;
  notes?: string;
  version?: string;
  brewMethod?: string;
  dose?: number;
  water?: number;
  brewTime?: number;
  createdAt?: Date;
  updatedAt?: Date;
}