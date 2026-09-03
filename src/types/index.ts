// User & Authentication
export type UserRole = 'student' | 'trainer' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserProfile {
  userId: string;
  currentLevel: 'JUNIOR' | 'SKILLED' | 'PRO';
  totalProgress: number; // 0-100
  currentStreak: number;
  totalLessonsCompleted: number;
  totalTestsPassed: number;
  totalBrewLogsRecorded: number;
  joinedAt: Date;
}

// Levels & Progression
export type LevelType = 'JUNIOR' | 'SKILLED' | 'PRO';

export interface LevelRequirement {
  level: LevelType;
  requiredProgress: number; // 0-100
  requiredTestsPassed: number;
  requiredLessonsCompleted: number;
  unlocked: boolean;
}

// Skills
export type SkillLevel = 'NOT_STARTED' | 'LEARNING' | 'PRACTICING' | 'COMPETENT' | 'ADVANCED';

export interface Skill {
  id: string;
  name: string;
  description: string;
  category: 'COFFEE_KNOWLEDGE' | 'ESPRESSO' | 'MILK' | 'FILTER' | 'SENSORY' | 'SERVICE' | 'WORKFLOW' | 'RECIPES' | 'TROUBLESHOOTING' | 'QUALITY_CONTROL' | 'TRAINING' | 'LEADERSHIP';
  icon: string;
}

export interface UserSkillProgress {
  userId: string;
  skillId: string;
  level: SkillLevel;
  progress: number; // 0-100
  completedLessons: number;
  assessmentsPassed: number;
  lastUpdated: Date;
}

// Courses & Learning
export interface Course {
  id: string;
  title: string;
  description: string;
  level: LevelType;
  moduleIds: string[];
  estimatedDuration: number; // in minutes
  order: number;
  icon: string;
}

export interface Module {
  id: string;
  courseId: string;
  title: string;
  description: string;
  lessonIds: string[];
  order: number;
  estimatedDuration: number; // in minutes
}

export type LessonDifficulty = 'EASY' | 'MEDIUM' | 'HARD';

export interface Lesson {
  id: string;
  moduleId: string;
  title: string;
  description: string;
  difficulty: LessonDifficulty;
  estimatedTime: number; // in minutes
  learningObjectives: string[];
  theory: string;
  examples: string[];
  commonMistakes: string[];
  practicalTask?: string;
  skillIds: string[];
  order: number;
}

export interface UserLessonProgress {
  userId: string;
  lessonId: string;
  completed: boolean;
  startedAt: Date;
  completedAt?: Date;
  timeSpent: number; // in seconds
  knowledgeCheckScore?: number; // 0-100
}

// Tests & Assessments
export type QuestionType = 'SINGLE_CHOICE' | 'MULTIPLE_CHOICE' | 'TRUE_FALSE' | 'NUMERIC' | 'RECIPE_CALCULATION' | 'SCENARIO' | 'TROUBLESHOOTING';

export interface TestQuestion {
  id: string;
  type: QuestionType;
  question: string;
  difficulty: LessonDifficulty;
  category: string;
  timeLimit?: number; // in seconds
  points: number;
  options?: {
    id: string;
    text: string;
    isCorrect: boolean;
  }[];
  correctAnswer?: string | number;
  explanation?: string;
  skillId?: string;
}

export interface Test {
  id: string;
  title: string;
  description: string;
  type: 'QUIZ' | 'CERTIFICATION' | 'PRACTICAL';
  level: LevelType;
  questionIds: string[];
  passingScore: number; // 0-100
  timeLimit?: number; // in minutes
  skillIds: string[];
  order: number;
}

export interface TestAttempt {
  id: string;
  userId: string;
  testId: string;
  startedAt: Date;
  completedAt?: Date;
  answers: {
    questionId: string;
    answer: string | number | string[];
    timeSpent: number; // in seconds
  }[];
  score: number; // 0-100
  passed: boolean;
  weakAreas?: string[];
}

// Practical Assessments
export interface AssessmentCriterion {
  id: string;
  name: string;
  description: string;
  maxScore: number;
  weight: number; // 0-1
}

export interface PracticalAssessment {
  id: string;
  title: string;
  description: string;
  type: 'ESPRESSO_DIALING' | 'V60_BREWING' | 'MILK_TEXTURING' | 'LATTE_ART' | 'KALITA_BREWING' | 'AEROPRESS_BREWING';
  level: LevelType;
  criteriaIds: string[];
  skillIds: string[];
}

export interface AssessmentAttempt {
  id: string;
  userId: string;
  assessmentId: string;
  startedAt: Date;
  completedAt?: Date;
  scores: {
    criterionId: string;
    score: number;
    feedback?: string;
  }[];
  totalScore: number; // 0-100
  passed: boolean;
  trainerFeedback?: string;
  status: 'IN_PROGRESS' | 'SUBMITTED' | 'APPROVED' | 'REJECTED';
  trainerApprovedBy?: string;
  trainerApprovedAt?: Date;
}

// Recipes
export type RecipeCategory = 'ESPRESSO' | 'FILTER' | 'SPECIALTY_COFFEE' | 'MATCHA' | 'COLD_DRINKS' | 'SMOOTHIES' | 'SIGNATURES';
export type RecipeStandard = 'SCA_REFERENCE' | '202F_STANDARD' | 'HOUSE_RECIPE';

export interface Ingredient {
  name: string;
  amount: number;
  unit: string; // g, ml, tsp, etc.
}

export interface Recipe {
  id: string;
  name: string;
  category: RecipeCategory;
  standard: RecipeStandard;
  description: string;
  ingredients: Ingredient[];
  method: string;
  glassType?: string;
  temperature?: number; // in Celsius
  presentation?: string;
  notes?: string;
  version: string;
  createdAt: Date;
  updatedAt: Date;
}

// Brew Log
export interface BrewLog {
  id: string;
  userId: string;
  date: Date;
  brewMethod: 'ESPRESSO' | 'V60' | 'KALITA_185' | 'AEROPRESS';
  coffee: string;
  origin?: string;
  process?: string; // natural, washed, etc.
  roast?: string;
  dose: number; // in grams
  water: number; // in grams or ml
  ratio: number; // 1:X
  grindSetting: number; // arbitrary scale
  waterTemperature: number; // in Celsius
  bloomTime: number; // in seconds
  totalTime: number; // in seconds
  tds?: number; // Total Dissolved Solids %
  extractionYield?: number; // %
  taste: string;
  notes: string;
  rating: number; // 1-5
  createdAt: Date;
  updatedAt: Date;
}

// Library Resources
export type ResourceCategory = 'METHODS' | 'THEORY' | 'VIDEOS' | 'BOOKS' | 'SENSORY' | 'SERVICE' | 'COFFEE_SCIENCE' | 'ROASTING';

export interface LibraryResource {
  id: string;
  title: string;
  description: string;
  category: ResourceCategory;
  type: 'VIDEO' | 'ARTICLE' | 'PDF' | 'BOOK' | 'PODCAST';
  url?: string;
  duration?: number; // in minutes
  imageUrl?: string;
  skillIds?: string[];
  createdAt: Date;
}

export interface UserResourceProgress {
  userId: string;
  resourceId: string;
  progress: number; // 0-100
  completed: boolean;
  completedAt?: Date;
}

// Trainer Messages (AI Trainer)
export interface TrainerMessage {
  id: string;
  userId: string;
  mode: 'TRAINER' | 'GUEST' | 'EXAM';
  userMessage: string;
  trainerResponse: string;
  guidingQuestion?: string; // For TRAINER mode
  isCoaching: boolean;
  createdAt: Date;
}

// Achievements
export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  type: 'LESSON_MILESTONE' | 'TEST_ACHIEVEMENT' | 'SKILL_MASTERY' | 'SPECIAL';
  requirement: {
    type: string;
    value: number;
  };
}

export interface UserAchievement {
  userId: string;
  achievementId: string;
  unlockedAt: Date;
}

// Certificates
export interface Certificate {
  id: string;
  userId: string;
  level: LevelType;
  issuedAt: Date;
  certificateNumber: string;
}
