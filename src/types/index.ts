export {};

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

export type UserRole = 'student' | 'instructor' | 'admin';

export interface Course {
  id: string;
  name: string;
  description: string;
  moduleIds: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Module {
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
  ingredients: string[];
  instructions: string[];
  brewMethod: string;
  dose: number;
  water: number;
  brewTime: number;
  rating: number;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}