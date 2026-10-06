// Система квалификаций BaristaOS 202f
// Три уровня (Junior / Skilled / PRO), в каждом ровно 5 ступеней.
// Шеф-бариста — отдельная должность, в систему квалификаций не входит.

export type LevelId = 'JUNIOR' | 'SKILLED' | 'PRO';

export interface Level {
  id: LevelId;
  name: string;
  subtitle: string;
  description: string;
  accent: 'aqua' | 'heat' | 'rust';
}

export interface Step {
  id: string;
  level: LevelId;
  index: number; // 1..5
  title: string;
  focus: string;
  xpRequired: number; // накопительный XP для доступа к ступени
  xpReward: number; // XP за завершение ступени (контрольный тест + чек-лист)
  lessonIds: string[];
  controlTestId: string;
  checklist: string[];
  isAttestation: boolean;
}

export const LEVELS: Level[] = [
  {
    id: 'JUNIOR',
    name: 'Junior',
    subtitle: 'База профессии',
    description:
      'Фундамент работы бариста: зерно, помол, экстракция, эспрессо и молоко. Цель — уверенно и стабильно готовить базовое меню по стандартам 202f.',
    accent: 'aqua',
  },
  {
    id: 'SKILLED',
    name: 'Skilled',
    subtitle: 'Уверенное владение',
    description:
      'Осознанное управление вкусом: дайлинг эспрессо, альтернатива, сенсорика по протоколу SCA, вода и диагностика ошибок.',
    accent: 'heat',
  },
  {
    id: 'PRO',
    name: 'PRO',
    subtitle: 'Профессиональный уровень',
    description:
      'Глубокая экспертиза: обжарка и происхождение, сигнатурное меню, менеджмент смены, обучение других и стандарты качества.',
    accent: 'rust',
  },
];

// XP-пороги высокие: прогресс медленный и осознанный.
// Перепрыгивать уровни и ступени запрещено — доступ открывается строго по цепочке.
export const STEPS: Step[] = [
  // ===== JUNIOR =====
  {
    id: 'junior-1',
    level: 'JUNIOR',
    index: 1,
    title: 'Зерно и свежесть',
    focus: 'Анатомия зерна, арабика и робуста, способы обработки, свежесть и дегазация',
    xpRequired: 0,
    xpReward: 400,
    lessonIds: ['j1-l1', 'j1-l2'],
    controlTestId: 'ct-junior-1',
    checklist: [
      'Определить на упаковке происхождение, обработку и дату обжарки',
      'Объяснить разницу между мытой и натуральной обработкой',
      'Рассчитать возраст зерна в днях от даты обжарки',
    ],
    isAttestation: false,
  },
  {
    id: 'junior-2',
    level: 'JUNIOR',
    index: 2,
    title: 'Помол и экстракция',
    focus: 'Базовая теория экстракции, фракции помола, контактное время',
    xpRequired: 400,
    xpReward: 450,
    lessonIds: ['j2-l1', 'j2-l2'],
    controlTestId: 'ct-junior-2',
    checklist: [
      'Настроить кофемолку на эталонный помол для эспрессо',
      'Объяснить, как размер помола влияет на время экстракции',
      'Определить недо- и переэкстракцию по вкусу',
    ],
    isAttestation: false,
  },
  {
    id: 'junior-3',
    level: 'JUNIOR',
    index: 3,
    title: 'Эспрессо',
    focus: 'Дозирование, темперовка, время пролива, рецепт 1:2',
    xpRequired: 850,
    xpReward: 500,
    lessonIds: ['j3-l1', 'j3-l2'],
    controlTestId: 'ct-junior-3',
    checklist: [
      'Приготовить двойной эспрессо 18 г → 36 г за 25–32 с',
      'Равномерно распределить и темперовать таблетку',
      'Прочитать пролив: скорость, цвет, время',
    ],
    isAttestation: false,
  },
  {
    id: 'junior-4',
    level: 'JUNIOR',
    index: 4,
    title: 'Молоко и базовое меню',
    focus: 'Стеаминг, микропена 60–65 °C, капучино и латте по стандарту',
    xpRequired: 1350,
    xpReward: 550,
    lessonIds: ['j4-l1', 'j4-l2'],
    controlTestId: 'ct-junior-4',
    checklist: [
      'Взбить молоко с глянцевой микропеной без крупных пузырей',
      'Приготовить капучино по ТТК 202f',
      'Приготовить латте по ТТК 202f',
    ],
    isAttestation: false,
  },
  {
    id: 'junior-5',
    level: 'JUNIOR',
    index: 5,
    title: 'Аттестация Junior',
    focus: 'Итоговая теория уровня и практические стандарты смены',
    xpRequired: 1900,
    xpReward: 800,
    lessonIds: ['j5-l1'],
    controlTestId: 'att-junior',
    checklist: [
      'Смена под наблюдением: полный цикл от калибровки до закрытия',
      'Стабильные проливы: 5 эспрессо подряд в рецепте',
      'Молочная станция: 3 напитка подряд без брака',
    ],
    isAttestation: true,
  },

  // ===== SKILLED =====
  {
    id: 'skilled-1',
    level: 'SKILLED',
    index: 1,
    title: 'Дайлинг эспрессо',
    focus: 'Системная настройка рецепта, TDS и extraction yield',
    xpRequired: 2700,
    xpReward: 600,
    lessonIds: ['s1-l1', 's1-l2'],
    controlTestId: 'ct-skilled-1',
    checklist: [
      'Настроить новый сорт за 15 минут по протоколу дайлинга',
      'Измерить TDS и рассчитать extraction yield',
      'Вести журнал дайлинга: изменения и результат',
    ],
    isAttestation: false,
  },
  {
    id: 'skilled-2',
    level: 'SKILLED',
    index: 2,
    title: 'Фильтр-кофе',
    focus: 'V60, Kalita 185, AeroPress: пульсирующий пролив, bloom, купаж времени',
    xpRequired: 3300,
    xpReward: 650,
    lessonIds: ['s2-l1', 's2-l2'],
    controlTestId: 'ct-skilled-2',
    checklist: [
      'Сварить V60 18 г → 300 г за 2:45–3:00',
      'Сварить AeroPress по базовому рецепту 202f',
      'Объяснить выбор помола и температуры под сорт',
    ],
    isAttestation: false,
  },
  {
    id: 'skilled-3',
    level: 'SKILLED',
    index: 3,
    title: 'Сенсорика',
    focus: 'Протокол каппинга SCA, flavor wheel, калибровка вкуса',
    xpRequired: 3950,
    xpReward: 700,
    lessonIds: ['s3-l1', 's3-l2'],
    controlTestId: 'ct-skilled-3',
    checklist: [
      'Провести каппинг 3 образцов по протоколу SCA',
      'Описать 5 напитков терминологией flavor wheel',
      'Определить дефект чашки (земляной, ферментный, окисленный)',
    ],
    isAttestation: false,
  },
  {
    id: 'skilled-4',
    level: 'SKILLED',
    index: 4,
    title: 'Вода и диагностика',
    focus: 'TDS и химия воды, диагностика ошибок экстракции',
    xpRequired: 4650,
    xpReward: 750,
    lessonIds: ['s4-l1', 's4-l2'],
    controlTestId: 'ct-skilled-4',
    checklist: [
      'Измерить TDS воды на станции и оценить пригодность',
      'Диагностировать 5 типовых ошибок пролива по вкусу и времени',
      'Скорректировать рецепт по результатам диагностики',
    ],
    isAttestation: false,
  },
  {
    id: 'skilled-5',
    level: 'SKILLED',
    index: 5,
    title: 'Аттестация Skilled',
    focus: 'Итоговая теория уровня и слепая сенсорная проверка',
    xpRequired: 5400,
    xpReward: 1000,
    lessonIds: ['s5-l1'],
    controlTestId: 'att-skilled',
    checklist: [
      'Дайлинг незнакомого сорта без подсказок',
      'Слепой каппинг: определить обработку и дефект',
      'Полное меню альтернативы по ТТК без ошибок',
    ],
    isAttestation: true,
  },

  // ===== PRO =====
  {
    id: 'pro-1',
    level: 'PRO',
    index: 1,
    title: 'Обжарка и происхождение',
    focus: 'Стадии обжарки, roast profile, влияние происхождения и процесса',
    xpRequired: 6400,
    xpReward: 800,
    lessonIds: ['p1-l1', 'p1-l2'],
    controlTestId: 'ct-pro-1',
    checklist: [
      'Определить стадию обжарки по цвету и запаху',
      'Объяснить влияние Maillard-реакции на вкус чашки',
      'Составить профиль ожиданий для сорта по происхождению',
    ],
    isAttestation: false,
  },
  {
    id: 'pro-2',
    level: 'PRO',
    index: 2,
    title: 'Меню и сигнатуры',
    focus: 'Баланс кислотность/сладость/горечь, разработка сигнатурных напитков',
    xpRequired: 7200,
    xpReward: 850,
    lessonIds: ['p2-l1', 'p2-l2'],
    controlTestId: 'ct-pro-2',
    checklist: [
      'Разработать сигнатурный напиток с ТТК и расчётом себестоимости',
      'Сбалансировать рецепт: кислотность, сладость, текстура',
      'Провести дегустацию и зафиксировать версию рецепта',
    ],
    isAttestation: false,
  },
  {
    id: 'pro-3',
    level: 'PRO',
    index: 3,
    title: 'Смена и бар-менеджмент',
    focus: 'Workflow станции, калибровка, чистка, учёт запасов',
    xpRequired: 8050,
    xpReward: 900,
    lessonIds: ['p3-l1', 'p3-l2'],
    controlTestId: 'ct-pro-3',
    checklist: [
      'Провести открытие и закрытие станции по чек-листу 202f',
      'Калибровать помолку и станцию в течение смены',
      'Вести учёт расхода зерна и молока',
    ],
    isAttestation: false,
  },
  {
    id: 'pro-4',
    level: 'PRO',
    index: 4,
    title: 'Обучение и стандарты',
    focus: 'Наставничество, ТТК, контроль качества команды',
    xpRequired: 8950,
    xpReward: 950,
    lessonIds: ['p4-l1', 'p4-l2'],
    controlTestId: 'ct-pro-4',
    checklist: [
      'Провести вводный инструктаж нового бариста',
      'Проверить напиток коллеги по чек-листу качества',
      'Актуализировать ТТК по результатам проверки',
    ],
    isAttestation: false,
  },
  {
    id: 'pro-5',
    level: 'PRO',
    index: 5,
    title: 'Аттестация PRO',
    focus: 'Итоговая теория уровня и комплексная практическая проверка',
    xpRequired: 9900,
    xpReward: 1500,
    lessonIds: ['p5-l1'],
    controlTestId: 'att-pro',
    checklist: [
      'Полный цикл: дайлинг, меню, смена, обучение — под наблюдением',
      'Сигнатурный напиток: защита рецепта перед комиссией',
      'Аудит станции и план корректирующих действий',
    ],
    isAttestation: true,
  },
];

export const XP = {
  LESSON_COMPLETED: 60,
  CHECKLIST_ITEM: 40,
  CONTROL_TEST_PASS: 250,
  ATTESTATION_PASS: 600,
  DRILL_CORRECT: 10,
  TRAINING_COMPLETE: 80,
} as const;

export function getStepsByLevel(level: LevelId): Step[] {
  return STEPS.filter((s) => s.level === level).sort((a, b) => a.index - b.index);
}

export function getStep(stepId: string): Step | undefined {
  return STEPS.find((s) => s.id === stepId);
}

export function getNextStep(stepId: string): Step | undefined {
  const idx = STEPS.findIndex((s) => s.id === stepId);
  return idx >= 0 ? STEPS[idx + 1] : undefined;
}

export function getLevelInfo(level: LevelId): Level {
  return LEVELS.find((l) => l.id === level)!;
}

export function formatXp(xp: number): string {
  return xp.toLocaleString('ru-RU');
}
