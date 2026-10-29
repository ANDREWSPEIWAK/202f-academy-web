# 202f Academy — Barista OS: карта контента

Источник: BaristaOS_202f_full.zip (React 19 + TS + Vite 7 + Tailwind 3.4, интерфейс на русском).
Весь контент лежит в `src/data/*.ts` (скопировано в `data/`), единым файлом — `content.json`.
Тексты интерфейса (заголовки, подписи кнопок) зашиты в `src/sections/*.tsx`, выгружены в `ui-strings.json`.

## Файлы пакета
| Файл | Что внутри |
|---|---|
| `data/*.ts` | типизированные данные + интерфейсы, `data/index.ts` реэкспортирует всё |
| `content.json` | те же данные в JSON (для любого стека) |
| `ui-strings.json` | русские строки интерфейса по разделам |
| `CONTENT_MAP.md` | этот файл |

## Вкладки → данные
| Вкладка | Раздел | Данные |
|---|---|---|
| Путь | `Path.tsx` | `curriculum` (levels, modules, attestations), `gamification`, `recipes` |
| ТТК | `Ttk.tsx` | `recipes` (79), `ttkCategories` (14) |
| Тесты | `Tests.tsx` | `recipes`, `ttkCategories`, `exam` (40 вопросов, 4 блока), `cases` (12) |
| Смена | `Shift.tsx` | `service` (позиции бара, поток, нормативы, Rush), `guide` (6 стандартов) |
| Дисциплина | `Discipline.tsx` | `discipline` (3 чек-листа, 8 правил) |
| Методики | `Library.tsx` | `library` (14 тем, 31 материал) |
| Вкусы | `Wheel.tsx` | `wheel` (8 категорий) |
| Профиль | `Profile.tsx` | `gamification` (ранги, бейджи) |

## Структура данных

### recipes.ts — 79 техкарт
`Recipe { id, name, category, recipe{ru,en}, taste{ru,en}, method{ru,en}, steps{ru[],en[]} }`
Категории (`ttkCategories`, 14): espresso 9, filter 7, special 5, matcha 8, smoothie 3, lemonade 9, icetea 2, shake 4, chocolate 2, cocktail 8, juice 4, wine 8, other 3, icecream 7.

### curriculum.ts — обучающий путь
- `levels` (3): Junior (3–4 нед., 5 модулей), Skilled (7–10 нед., 4 модуля), PRO (постоянно, 4 модуля). Поля: `id, n, title, en, tagline, duration, focus, moduleIds`.
- `modules` (13): `id, levelId, title, subtitle, duration, checklist[{id,text}], theory[]`.
  Блоки теории (`TheoryBlock`): `p`, `h`, `ul`, `ol`, `callout`, `table{headers,rows}`.
- `attestations` (junior / skilled / pro): `title, examiner, items[{id,text}]`.
- `skillLists` (10): `id, levelId, title, items[{id,text}]`.

### exam.ts
`examBlocks` (4): Сервис и работа с гостем · Обслуживание и чистка техники · Фильтр-кофе и пуровер · Эспрессо.
`examQuestions` (40): `{ id: 'e1'…, n, block, prompt, model }` (`model` — эталонный ответ).

### cases.ts — 12 кейсов
`{ id, block, scene, options[{text, score 0|1|2}], explain }`. Блоки: Гость, Очередь, Инцидент, Аллергия, Команда, Станция, Сервис, Продажи.

### service.ts
`barPositions` (5), `serviceFlow` (6), `timeStandards` (7), `sequenceRules` (6), `rushDrinks` (8), `rushStepsLegend` (8 шагов: Заказ, Шот, Молоко, Сборка, Подача, Вода, Фильтр, Лёд), `ausPrinciples` (5).

### discipline.ts
`disciplineChecklists` (3; id `open` и `hygiene` используются в бейджах), `disciplineRules` (8), `levelLabels` (3: label + color).

### guide.ts
`guideStandards` (6).

### library.ts
`libraryTopics` (14): latte 6, v60 4, kalita 2, aeropress 1, coldbrew 1, service 3, bar 4, grind 1, sensory 1, roast 1, origin 1, water 1, systems 1, books 4 (число = материалов в теме).
`libraryItems` (31): `id, topicId, title, kind, duration, cover?, summary, youtube?{id,title}, recipe?{rows}, sections[{title, steps?, body?}]`.

### wheel.ts
`wheelCategories` (8): `id, title, short, notes[], grind?, brew?, fill?, regions[{name, why}]`.

### gamification.ts
- `ranks` (5): Стажёр 0 → Бариста 200 → Старший бариста 600 → Шеф-бариста 1400 → Легенда смены 3000 XP.
- `badges` (14), `questPool` (6 шаблонов: known 3/40, quiz 1/30, blitz 6/50, checklist 1/35, rush 4/45, lesson 1/25 — цель/XP).

## Логика прогресса (`store.ts`, ключ localStorage `barista-os-v1`)
XP: рецепт «знаю» +6, методика изучена +10, модуль закрыт +40, ответ экзамена «знаю» +8, кейс на 2 балла +12, чек-лист дня +30.
Ежедневно выбираются 3 квеста из пула, стрик считается по датам. Бейджи выдаются по условиям в `checkBadges()`.
Синхронизация с сервером (`lib/sync.ts`, папка `server/`) необязательна, без неё всё работает на localStorage.

## На что обратить внимание при переносе
1. **Картинок нет в архиве.** Данные ссылаются на `/lessons/*.jpg` (25 файлов: milk, espresso, v60, kalita, aeropress, coldbrew, cupping, grind, roast, water, service, bar, bar-peak, books, book-202f, book-hoffmann, book-rao, book-sca, origin-map, latte-heart/rosetta/swan/tulip/faults, espresso-dial). Нужна папка `public/lessons/`.
2. **Расхождение в бейдже `exam-full`:** в `store.ts` он выдаётся при 32 отмеченных вопросах, а в экзамене 40 (описание: «все 4 блока»). Бейдж `exam-service` считает только `e1`–`e10`.
3. **Бейдж `ttk-all`** жёстко привязан к 79 рецептам. При изменении числа рецептов поправьте порог в `store.ts`.
4. Тексты рецептов двуязычные (ru/en), остальной контент только на русском.
5. Идентификаторы (`id`) используются как ключи прогресса. Если переименуете, у пользователей сбросится прогресс.

## Палитра и шрифты
`#161C1C` фон · `#222A2A` iron · `#263030` карточка · `#4FBBBC` aqua · `#EC4624` rust · `#F39120` heat · `#E2DAC2` cream.
Шрифты: Manrope (текст), Unbounded (заголовки), JetBrains Mono (цифры, подписи).
