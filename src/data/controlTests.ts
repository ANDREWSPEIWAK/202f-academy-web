// Контрольные тесты и аттестации BaristaOS 202f
// Порог прохождения всех контрольных тестов и аттестаций — 85%.

import { BankQuestion, getQuestionsByIds } from './questions';

export interface ControlTest {
  id: string;
  title: string;
  description: string;
  stepId: string;
  questionIds: string[];
  passingScore: 85;
  isAttestation: boolean;
}

function pick(ids: string[]): string[] {
  return ids;
}

export const CONTROL_TESTS: ControlTest[] = [
  {
    id: 'ct-junior-1',
    title: 'Контрольный тест: Зерно и свежесть',
    description: '6 вопросов по анатомии зерна, обработке и свежести. Порог 85%.',
    stepId: 'junior-1',
    questionIds: pick(['q-j1-1', 'q-j1-2', 'q-j1-3', 'q-j1-4', 'q-j1-5', 'q-j1-6']),
    passingScore: 85,
    isAttestation: false,
  },
  {
    id: 'ct-junior-2',
    title: 'Контрольный тест: Помол и экстракция',
    description: '6 вопросов по теории экстракции и помолу. Порог 85%.',
    stepId: 'junior-2',
    questionIds: pick(['q-j2-1', 'q-j2-2', 'q-j2-3', 'q-j2-4', 'q-j2-5', 'q-j2-6']),
    passingScore: 85,
    isAttestation: false,
  },
  {
    id: 'ct-junior-3',
    title: 'Контрольный тест: Эспрессо',
    description: '6 вопросов по рецепту, технике и диагностике эспрессо. Порог 85%.',
    stepId: 'junior-3',
    questionIds: pick(['q-j3-1', 'q-j3-2', 'q-j3-3', 'q-j3-4', 'q-j3-5', 'q-j3-6']),
    passingScore: 85,
    isAttestation: false,
  },
  {
    id: 'ct-junior-4',
    title: 'Контрольный тест: Молоко и базовое меню',
    description: '6 вопросов по стеамингу и ТТК базовых напитков. Порог 85%.',
    stepId: 'junior-4',
    questionIds: pick(['q-j4-1', 'q-j4-2', 'q-j4-3', 'q-j4-4', 'q-j4-5', 'q-j4-6']),
    passingScore: 85,
    isAttestation: false,
  },
  {
    id: 'att-junior',
    title: 'Аттестация Junior',
    description:
      'Итоговый тест уровня: 12 вопросов по всем ступеням Junior. Порог 85%. Допуск — закрытые чек-листы ступеней 1–4.',
    stepId: 'junior-5',
    questionIds: pick([
      'q-att-j-1',
      'q-att-j-2',
      'q-att-j-3',
      'q-att-j-4',
      'q-j1-4',
      'q-j1-5',
      'q-j2-4',
      'q-j2-6',
      'q-j3-4',
      'q-j3-5',
      'q-j4-4',
      'q-j4-6',
    ]),
    passingScore: 85,
    isAttestation: true,
  },
  {
    id: 'ct-skilled-1',
    title: 'Контрольный тест: Дайлинг эспрессо',
    description: '6 вопросов по протоколу дайлинга, TDS и extraction yield. Порог 85%.',
    stepId: 'skilled-1',
    questionIds: pick(['q-s1-1', 'q-s1-2', 'q-s1-3', 'q-s1-4', 'q-s1-5', 'q-s1-6']),
    passingScore: 85,
    isAttestation: false,
  },
  {
    id: 'ct-skilled-2',
    title: 'Контрольный тест: Фильтр-кофе',
    description: '6 вопросов по V60, Kalita, AeroPress и диагностике. Порог 85%.',
    stepId: 'skilled-2',
    questionIds: pick(['q-s2-1', 'q-s2-2', 'q-s2-3', 'q-s2-4', 'q-s2-5', 'q-s2-6']),
    passingScore: 85,
    isAttestation: false,
  },
  {
    id: 'ct-skilled-3',
    title: 'Контрольный тест: Сенсорика',
    description: '6 вопросов по протоколу каппинга SCA и flavor wheel. Порог 85%.',
    stepId: 'skilled-3',
    questionIds: pick(['q-s3-1', 'q-s3-2', 'q-s3-3', 'q-s3-4', 'q-s3-5', 'q-s3-6']),
    passingScore: 85,
    isAttestation: false,
  },
  {
    id: 'ct-skilled-4',
    title: 'Контрольный тест: Вода и диагностика',
    description: '6 вопросов по воде и системной диагностике ошибок. Порог 85%.',
    stepId: 'skilled-4',
    questionIds: pick(['q-s4-1', 'q-s4-2', 'q-s4-3', 'q-s4-4', 'q-s4-5', 'q-s4-6']),
    passingScore: 85,
    isAttestation: false,
  },
  {
    id: 'att-skilled',
    title: 'Аттестация Skilled',
    description:
      'Итоговый тест уровня: 12 вопросов по всем ступеням Skilled. Порог 85%. Допуск — закрытые чек-листы ступеней 1–4.',
    stepId: 'skilled-5',
    questionIds: pick([
      'q-att-s-1',
      'q-att-s-2',
      'q-att-s-3',
      'q-att-s-4',
      'q-s1-3',
      'q-s1-4',
      'q-s2-4',
      'q-s2-6',
      'q-s3-3',
      'q-s3-6',
      'q-s4-2',
      'q-s4-5',
    ]),
    passingScore: 85,
    isAttestation: true,
  },
  {
    id: 'ct-pro-1',
    title: 'Контрольный тест: Обжарка и происхождение',
    description: '6 вопросов по химии обжарки и профилям происхождения. Порог 85%.',
    stepId: 'pro-1',
    questionIds: pick(['q-p1-1', 'q-p1-2', 'q-p1-3', 'q-p1-4', 'q-p1-5', 'q-p1-6']),
    passingScore: 85,
    isAttestation: false,
  },
  {
    id: 'ct-pro-2',
    title: 'Контрольный тест: Меню и сигнатуры',
    description: '6 вопросов по балансу вкуса, ТТК и экономике меню. Порог 85%.',
    stepId: 'pro-2',
    questionIds: pick(['q-p2-1', 'q-p2-2', 'q-p2-3', 'q-p2-4', 'q-p2-5', 'q-p2-6']),
    passingScore: 85,
    isAttestation: false,
  },
  {
    id: 'ct-pro-3',
    title: 'Контрольный тест: Смена и бар-менеджмент',
    description: '6 вопросов по открытию/закрытию, калибровке и workflow. Порог 85%.',
    stepId: 'pro-3',
    questionIds: pick(['q-p3-1', 'q-p3-2', 'q-p3-3', 'q-p3-4', 'q-p3-5', 'q-p3-6']),
    passingScore: 85,
    isAttestation: false,
  },
  {
    id: 'ct-pro-4',
    title: 'Контрольный тест: Обучение и стандарты',
    description: '6 вопросов по наставничеству и контролю качества. Порог 85%.',
    stepId: 'pro-4',
    questionIds: pick(['q-p4-1', 'q-p4-2', 'q-p4-3', 'q-p4-4', 'q-p4-5', 'q-p4-6']),
    passingScore: 85,
    isAttestation: false,
  },
  {
    id: 'att-pro',
    title: 'Аттестация PRO',
    description:
      'Итоговый тест уровня: 12 вопросов по всем ступеням PRO. Порог 85%. Допуск — закрытые чек-листы ступеней 1–4.',
    stepId: 'pro-5',
    questionIds: pick([
      'q-att-p-1',
      'q-att-p-2',
      'q-att-p-3',
      'q-att-p-4',
      'q-p1-2',
      'q-p1-3',
      'q-p2-2',
      'q-p2-4',
      'q-p3-4',
      'q-p3-5',
      'q-p4-3',
      'q-p4-6',
    ]),
    passingScore: 85,
    isAttestation: true,
  },
];

export function getControlTest(testId: string): ControlTest | undefined {
  return CONTROL_TESTS.find((t) => t.id === testId);
}

export function getTestQuestions(testId: string): BankQuestion[] {
  const test = getControlTest(testId);
  if (!test) return [];
  return getQuestionsByIds(test.questionIds);
}
