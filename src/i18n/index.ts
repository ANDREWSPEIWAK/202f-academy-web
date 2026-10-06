import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Lang = 'ru' | 'en';

type Dict = Record<string, string>;

const ru: Dict = {
  'app.name': 'BaristaOS Academy',
  'app.tagline': 'Академическая система подготовки бариста',

  // Nav
  'nav.home': 'Главная',
  'nav.path': 'Путь',
  'nav.tests': 'Тесты',
  'nav.shift': 'Смена',
  'nav.more': 'Ещё',
  'nav.library': 'Библиотека',
  'nav.profile': 'Профиль',
  'nav.discipline': 'Дисциплина',
  'nav.wheel': 'Колесо вкусов',
  'nav.practice': 'Практика',
  'nav.trainer': 'Тренер',
  'nav.admin': 'Админ-панель',

  // Landing
  'landing.hero.title': 'Академия бариста нового уровня',
  'landing.hero.sub': 'Путь Junior → Skilled → PRO: 15 ступеней, обязательные контрольные, порог 85%. Серьёзная система для серьёзной работы.',
  'landing.signin': 'Вход',
  'landing.signup': 'Регистрация',
  'landing.email': 'Email',
  'landing.password': 'Пароль',
  'landing.name': 'Имя',
  'landing.login': 'Войти',
  'landing.register': 'Создать аккаунт',
  'landing.logout': 'Выйти',
  'landing.haveAccount': 'Уже есть аккаунт?',
  'landing.noAccount': 'Нет аккаунта?',
  'landing.demoAdmin': 'Демо-админ: admin@202f.coffee / admin202f',
  'landing.err.exists': 'Пользователь с таким email уже существует',
  'landing.err.notFound': 'Неверный email или пароль',
  'landing.err.fields': 'Заполните все поля (пароль от 6 символов)',

  // Home
  'home.greeting.night': 'Ночная смена',
  'home.greeting.morning': 'Доброе утро',
  'home.greeting.day': 'Добрый день',
  'home.greeting.evening': 'Добрый вечер',
  'home.currentStep': 'Текущая ступень',
  'home.startStep': 'Начать ступень',
  'home.continueStep': 'Продолжить ступень',
  'home.stepProgress': 'Прогресс ступени',
  'home.stat.xp': 'XP накоплено',
  'home.stat.lessons': 'Уроков завершено',
  'home.stat.tests': 'Тестов сдано',
  'home.stat.steps': 'Ступеней закрыто',
  'home.quick.title': 'Быстрый доступ',
  'home.quick.calc': 'Калькуляторы',
  'home.quick.calcDesc': 'Рецепт, доза, температура',
  'home.quick.timers': 'Таймеры',
  'home.quick.timersDesc': 'Эспрессо, bloom, чай',
  'home.quick.diary': 'Дневник смены',
  'home.quick.diaryDesc': 'События и показатели смены',
  'home.quick.analyzer': 'Анализатор',
  'home.quick.analyzerDesc': 'Диагностика пролива по параметрам',
  'home.quick.assistant': 'AI-ассистент',
  'home.quick.assistantDesc': 'espresso / milk / filter / service / sensory',
  'home.assignments': 'Назначено шефом',
  'home.assignmentsEmpty': 'Назначений пока нет',
  'home.assignmentsDone': 'Выполнено',
  'home.goTo': 'Перейти',

  // Calculators
  'calc.title': 'Калькуляторы',
  'calc.ratio': 'Рецепт по соотношению',
  'calc.dose': 'Доза, г',
  'calc.ratioLabel': 'Соотношение 1:X',
  'calc.yield': 'Выход напитка',
  'calc.doseFromYield': 'Доза под выход',
  'calc.targetYield': 'Целевой выход, г',
  'calc.temp': 'Температура',
  'calc.tempHint': 'Фильтр: 92–96 °C · Эспрессо: 92–94 °C · Тёмная обжарка: ниже',
  'calc.result': 'Результат',

  // Timers
  'timers.title': 'Таймеры',
  'timers.espresso': 'Эспрессо 25–30 с',
  'timers.bloom': 'Bloom 45 с',
  'timers.steaming': 'Взбивание молока',
  'timers.start': 'Старт',
  'timers.stop': 'Стоп',
  'timers.reset': 'Сброс',
  'timers.inRange': 'В норме',
  'timers.tooFast': 'Быстро — смелите крупнее',
  'timers.tooSlow': 'Медленно — смелите мельче',

  // Analyzer
  'analyzer.title': 'Анализатор пролива',
  'analyzer.dose': 'Доза сухого кофе, г',
  'analyzer.yield': 'Выход эспрессо, г',
  'analyzer.time': 'Время, с',
  'analyzer.taste': 'Вкус',
  'analyzer.taste.sour': 'Кислый / недоэкстрагирован',
  'analyzer.taste.bitter': 'Горький / переэкстрагирован',
  'analyzer.taste.balanced': 'Сбалансированный',
  'analyzer.analyze': 'Проанализировать',
  'analyzer.ratio': 'Соотношение',
  'analyzer.rate': 'Темп пролива',
  'analyzer.verdict': 'Заключение',
  'analyzer.ok': 'Параметры в референсном окне. Профиль сбалансирован.',
  'analyzer.sourAdvice': 'Соотношение слишком широкое или темп высокий: смелите мельче, увеличьте дозу или сократите выход.',
  'analyzer.bitterAdvice': 'Признаки переэкстракции: смелите крупнее, снизьте температуру или сократите время.',
  'analyzer.fastAdvice': 'Пролив слишком быстрый: уплотните темперовку или смелите мельче.',
  'analyzer.slowAdvice': 'Пролив слишком медленный: смелите крупнее или ослабьте темперовку.',

  // Assistant
  'assistant.title': 'AI-ассистент',
  'assistant.segment': 'Сегмент',
  'assistant.espresso': 'Эспрессо',
  'assistant.milk': 'Молоко',
  'assistant.filter': 'Фильтр',
  'assistant.service': 'Сервис',
  'assistant.sensory': 'Сенсорика',
  'assistant.placeholder': 'Опишите проблему или задайте вопрос…',
  'assistant.ask': 'Спросить',
  'assistant.hint': 'Ассистент работает по базе знаний ТТК и SCA-стандартов. Для аттестационных вопросов используйте Тесты.',

  // Shift
  'shift.title': 'Дневник смены',
  'shift.start': 'Открыть смену',
  'shift.close': 'Закрыть смену',
  'shift.active': 'Смена открыта',
  'shift.noShift': 'Смена не открыта',
  'shift.drinks': 'Напитков сделано',
  'shift.issues': 'Инциденты',
  'shift.notes': 'Заметки',
  'shift.addDrink': '+10 напитков',
  'shift.addIssue': 'Добавить инцидент',
  'shift.issuePlaceholder': 'Что произошло?',
  'shift.notePlaceholder': 'Заметка по смене…',
  'shift.log': 'Журнал',
  'shift.summary': 'Итог смены',
  'shift.history': 'История смен',
  'shift.empty': 'Пока пусто',

  // Discipline
  'discipline.title': 'Дисциплина',
  'discipline.daily': 'Ежедневные стандарты',
  'discipline.reset': 'Новый день — чек-лист обновится',
  'discipline.doneToday': 'Стандарты дня выполнены',

  // Wheel
  'wheel.title': 'Колесо вкусов',
  'wheel.hint': 'Нажмите на сегмент, чтобы увидеть описание',

  // More
  'more.title': 'Ещё',
  'more.language': 'Язык интерфейса',
  'more.contentNote': 'Учебный контент (уроки и банк вопросов) пока на русском — локализация контента в следующей итерации.',

  // Common
  'common.back': 'Назад',
  'common.close': 'Закрыть',
  'common.save': 'Сохранить',
  'common.cancel': 'Отмена',

  'path.status.locked': 'Закрыто',
  'path.status.available': 'Доступно',
  'path.status.in_progress': 'В процессе',
  'path.status.completed': 'Завершено',
};

const en: Dict = {
  'app.name': 'BaristaOS Academy',
  'app.tagline': 'Academic barista training system',

  'nav.home': 'Home',
  'nav.path': 'Path',
  'nav.tests': 'Tests',
  'nav.shift': 'Shift',
  'nav.more': 'More',
  'nav.library': 'Library',
  'nav.profile': 'Profile',
  'nav.discipline': 'Discipline',
  'nav.wheel': 'Flavor Wheel',
  'nav.practice': 'Practice',
  'nav.trainer': 'Trainer',
  'nav.admin': 'Admin panel',

  'landing.hero.title': 'The next level of barista education',
  'landing.hero.sub': 'Junior → Skilled → PRO: 15 steps, mandatory control tests, 85% threshold. A serious system for serious work.',
  'landing.signin': 'Sign in',
  'landing.signup': 'Sign up',
  'landing.email': 'Email',
  'landing.password': 'Password',
  'landing.name': 'Name',
  'landing.login': 'Sign in',
  'landing.register': 'Create account',
  'landing.logout': 'Log out',
  'landing.haveAccount': 'Already have an account?',
  'landing.noAccount': 'No account yet?',
  'landing.demoAdmin': 'Demo admin: admin@202f.coffee / admin202f',
  'landing.err.exists': 'A user with this email already exists',
  'landing.err.notFound': 'Wrong email or password',
  'landing.err.fields': 'Fill in all fields (password 6+ characters)',

  'home.greeting.night': 'Night shift',
  'home.greeting.morning': 'Good morning',
  'home.greeting.day': 'Good afternoon',
  'home.greeting.evening': 'Good evening',
  'home.currentStep': 'Current step',
  'home.startStep': 'Start step',
  'home.continueStep': 'Continue step',
  'home.stepProgress': 'Step progress',
  'home.stat.xp': 'XP earned',
  'home.stat.lessons': 'Lessons completed',
  'home.stat.tests': 'Tests passed',
  'home.stat.steps': 'Steps closed',
  'home.quick.title': 'Quick access',
  'home.quick.calc': 'Calculators',
  'home.quick.calcDesc': 'Recipe, dose, temperature',
  'home.quick.timers': 'Timers',
  'home.quick.timersDesc': 'Espresso, bloom, tea',
  'home.quick.diary': 'Shift diary',
  'home.quick.diaryDesc': 'Shift events and metrics',
  'home.quick.analyzer': 'Shot analyzer',
  'home.quick.analyzerDesc': 'Diagnose your extraction',
  'home.quick.assistant': 'AI assistant',
  'home.quick.assistantDesc': 'espresso / milk / filter / service / sensory',
  'home.assignments': 'Assigned by head barista',
  'home.assignmentsEmpty': 'No assignments yet',
  'home.assignmentsDone': 'Completed',
  'home.goTo': 'Open',

  'calc.title': 'Calculators',
  'calc.ratio': 'Recipe by ratio',
  'calc.dose': 'Dose, g',
  'calc.ratioLabel': 'Ratio 1:X',
  'calc.yield': 'Beverage yield',
  'calc.doseFromYield': 'Dose for target yield',
  'calc.targetYield': 'Target yield, g',
  'calc.temp': 'Temperature',
  'calc.tempHint': 'Filter: 92–96 °C · Espresso: 92–94 °C · Darker roasts: lower',
  'calc.result': 'Result',

  'timers.title': 'Timers',
  'timers.espresso': 'Espresso 25–30 s',
  'timers.bloom': 'Bloom 45 s',
  'timers.steaming': 'Milk steaming',
  'timers.start': 'Start',
  'timers.stop': 'Stop',
  'timers.reset': 'Reset',
  'timers.inRange': 'In range',
  'timers.tooFast': 'Too fast — grind coarser',
  'timers.tooSlow': 'Too slow — grind finer',

  'analyzer.title': 'Shot analyzer',
  'analyzer.dose': 'Dry dose, g',
  'analyzer.yield': 'Espresso yield, g',
  'analyzer.time': 'Time, s',
  'analyzer.taste': 'Taste',
  'analyzer.taste.sour': 'Sour / under-extracted',
  'analyzer.taste.bitter': 'Bitter / over-extracted',
  'analyzer.taste.balanced': 'Balanced',
  'analyzer.analyze': 'Analyze',
  'analyzer.ratio': 'Ratio',
  'analyzer.rate': 'Flow rate',
  'analyzer.verdict': 'Verdict',
  'analyzer.ok': 'Parameters are within the reference window. Profile is balanced.',
  'analyzer.sourAdvice': 'Ratio too wide or flow too fast: grind finer, raise the dose, or cut the yield.',
  'analyzer.bitterAdvice': 'Signs of over-extraction: grind coarser, lower the temperature, or shorten the time.',
  'analyzer.fastAdvice': 'Flow is too fast: improve tamping or grind finer.',
  'analyzer.slowAdvice': 'Flow is too slow: grind coarser or loosen the tamp.',

  'assistant.title': 'AI assistant',
  'assistant.segment': 'Segment',
  'assistant.espresso': 'Espresso',
  'assistant.milk': 'Milk',
  'assistant.filter': 'Filter',
  'assistant.service': 'Service',
  'assistant.sensory': 'Sensory',
  'assistant.placeholder': 'Describe the problem or ask a question…',
  'assistant.ask': 'Ask',
  'assistant.hint': 'The assistant answers from the ТТК and SCA knowledge base. For assessment questions use Tests.',

  'shift.title': 'Shift diary',
  'shift.start': 'Open shift',
  'shift.close': 'Close shift',
  'shift.active': 'Shift is open',
  'shift.noShift': 'No open shift',
  'shift.drinks': 'Drinks made',
  'shift.issues': 'Incidents',
  'shift.notes': 'Notes',
  'shift.addDrink': '+10 drinks',
  'shift.addIssue': 'Add incident',
  'shift.issuePlaceholder': 'What happened?',
  'shift.notePlaceholder': 'Shift note…',
  'shift.log': 'Log',
  'shift.summary': 'Shift summary',
  'shift.history': 'Shift history',
  'shift.empty': 'Nothing yet',

  'discipline.title': 'Discipline',
  'discipline.daily': 'Daily standards',
  'discipline.reset': 'A new day resets the checklist',
  'discipline.doneToday': 'Daily standards complete',

  'wheel.title': 'Flavor wheel',
  'wheel.hint': 'Tap a segment to see its description',

  'more.title': 'More',
  'more.language': 'Interface language',
  'more.contentNote': 'Learning content (lessons and question bank) is still in Russian — content localization comes next.',

  'common.back': 'Back',
  'common.close': 'Close',
  'common.save': 'Save',
  'common.cancel': 'Cancel',

  'path.status.locked': 'Locked',
  'path.status.available': 'Available',
  'path.status.in_progress': 'In progress',
  'path.status.completed': 'Completed',
};

const DICTS: Record<Lang, Dict> = { ru, en };

interface I18nState {
  lang: Lang;
  setLang: (lang: Lang) => void;
}

export const useI18nStore = create<I18nState>()(
  persist(
    (set) => ({
      lang: 'ru',
      setLang: (lang) => set({ lang }),
    }),
    { name: '202f-i18n' }
  )
);

/** Hook: returns the translation function bound to the current language */
export function useT() {
  const lang = useI18nStore((s) => s.lang);
  return (key: string): string => DICTS[lang][key] ?? DICTS.ru[key] ?? key;
}
