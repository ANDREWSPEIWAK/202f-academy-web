// ===== 202f Academy — Вкусовое колесо (эталон от живого сайта) =====

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

export const wheelColors = ['#F39120', '#4FBBBC', '#EC4624', '#E2DAC2'];

export const wheelCategories: WheelCategory[] = [
  {
    id: 'floral',
    title: 'Цветочное',
    short: 'Флораль',
    notes: ['Жасмин', 'Белый чай', 'Акация', 'Бергамот'],
    grind: 'Средне-мелкий',
    brew: 'V60, Kalita 185',
    fill: '#F39120',
    regions: [
      { name: 'Эфиопия', why: 'Геиша,_IRGACHEFE — цветущий аромат' },
      { name: 'Кения', why: 'Чёрная смородина с цветочной нотой' },
    ],
  },
  {
    id: 'berry',
    title: 'Ягодное',
    short: 'Ягода',
    notes: ['Чёрная смородина', 'Клубника', 'Малина', 'Черника'],
    grind: 'Средне-мелкий',
    brew: 'Аэропресс, фильтр',
    fill: '#EC4624',
    regions: [
      { name: 'Кения', why: 'Смородина и вишня' },
      { name: 'Эфиопия', why: 'Ягодная сложность натуральных' },
    ],
  },
  {
    id: 'citrus',
    title: 'Цитрусовое',
    short: 'Цитрус',
    notes: ['Лимон', 'Апельсин', 'Грейпфрут', 'Лайм'],
    grind: 'Средне-мелкий',
    brew: 'V60',
    fill: '#F39120',
    regions: [
      { name: 'Кения', why: 'Яркая цитрусовая кислотность' },
      { name: 'Колумбия', why: 'Апельсиновая сладость' },
    ],
  },
  {
    id: 'stone',
    title: 'Косточковое',
    short: 'Косточка',
    notes: ['Абрикос', 'Персик', 'Вишня', 'Слива'],
    grind: 'Средний',
    brew: 'Kalita 185',
    fill: '#E2DAC2',
    regions: [
      { name: 'Бурунди', why: 'Абрикос и персик' },
      { name: 'Руанда', why: 'Вишневая сладость' },
    ],
  },
  {
    id: 'wine',
    title: 'Винообразное',
    short: 'Вино',
    notes: ['Красное вино', 'Пуэрто-рико', 'Ферментированное'],
    grind: 'Средне-крупный',
    brew: 'Фильтр, капли',
    fill: '#EC4624',
    regions: [
      { name: 'Панама', why: 'Вишня и бочка' },
      { name: 'Колумбия', why: 'Винообразная сложность' },
    ],
  },
  {
    id: 'green',
    title: 'Травяное',
    short: 'Трава',
    notes: ['Зелёный чай', 'Трава', 'Травяной чай'],
    grind: 'Средний',
    brew: 'Аэропресс',
    fill: '#4FBBBC',
    regions: [
      { name: 'Вьетнам', why: 'Травяные ноты робусты' },
      { name: 'Индия', why: 'Травяной профиль' },
    ],
  },
  {
    id: 'nut',
    title: 'Ореховое',
    short: 'Орех',
    notes: ['Миндаль', 'Арахис', 'Грецкий орех', 'Лесной орех'],
    grind: 'Средне-крупный',
    brew: 'Эспрессо, фильтр',
    fill: '#E2DAC2',
    regions: [
      { name: 'Бразилия', why: 'Орех и шоколад' },
      { name: 'Индия', why: 'Ореховая сладость' },
    ],
  },
  {
    id: 'sweet',
    title: 'Сладкое',
    short: 'Сладость',
    notes: ['Карамель', 'Шоколад', 'Мёд', 'Кленовый сироп'],
    grind: 'Средне-мелкий',
    brew: 'Капучино, эспрессо',
    fill: '#4FBBBC',
    regions: [
      { name: 'Гватемала', why: 'Карамель и шоколад' },
      { name: 'Бразилия', why: 'Молочный шоколад' },
    ],
  },
];