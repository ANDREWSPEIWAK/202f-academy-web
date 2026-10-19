// ===== 202f Academy — Рецепты ТТК (эталон от живого сайта) =====

export interface LocalText { ru: string; en: string }

export interface Recipe {
  id: string;
  name: string;
  category: string;
  recipe: LocalText;
  taste: LocalText;
  method: LocalText;
  steps: { ru: string[]; en: string[] };
}

export interface TtkCategory { id: string; title: string; kicker: string }

export const ttkCategories: TtkCategory[] = [
  { id: 'espresso', title: 'Эспрессо', kicker: 'База станции' },
  { id: 'filter', title: 'Фильтр', kicker: 'Пуровер и заварка' },
  { id: 'milk', title: 'Молочные', kicker: 'Эспрессо + молоко' },
  { id: 'cold', title: 'Холодные', kicker: 'Лёд и сиропы' },
  { id: 'signature', title: 'Авторские', kicker: 'Спецпредложения 202f' },
];

export const recipes: Recipe[] = [
  // --- Эспрессо ---
  {
    id: 'ristretto',
    name: 'Ристретто',
    category: 'espresso',
    recipe: { ru: '18 г кофе → 18–22 мл', en: '18 g coffee → 18–22 ml' },
    taste: { ru: 'Плотный, сладкий, низкая кислотность', en: 'Syrupy, sweet, low acidity' },
    method: { ru: 'Короткая экстракция, первый_segment шота', en: 'Short extraction, first segment of the shot' },
    steps: { ru: ['Прогреть чашку и холдер', 'Смолоть 18 г в сухую корзину', 'Дистрибьют и темпинг', 'Запуск, стоп на 18–22 мл'], en: ['Warm cup and portafilter', 'Grind 18 g into dry basket', 'Distribute and tamp', 'Start, stop at 18–22 ml'] },
  },
  {
    id: 'espresso',
    name: 'Эспрессо',
    category: 'espresso',
    recipe: { ru: '18 г кофе → 34–36 мл', en: '18 g coffee → 34–36 ml' },
    taste: { ru: 'Сбалансированный, тело, карамель', en: 'Balanced, body, caramel' },
    method: { ru: 'Классический шот 1:2, 25–30 с', en: 'Classic shot 1:2, 25–30 s' },
    steps: { ru: ['Прогреть чашку и холдер', 'Смолоть 18 г', 'Дистрибьют и темпинг', 'Экстракция 25–30 с, стоп на 34–36 мл'], en: ['Warm cup and portafilter', 'Grind 18 g', 'Distribute and tamp', 'Extract 25–30 s, stop at 34–36 ml'] },
  },
  {
    id: 'lungo',
    name: 'Лунго',
    category: 'espresso',
    recipe: { ru: '18 г кофе → 60–80 мл', en: '18 g coffee → 60–80 ml' },
    taste: { ru: 'Более жидкий, горче, ниже тела', en: 'Thinner, more bitter, lower body' },
    method: { ru: 'Тот же помол, больше воды через таблетку', en: 'Same grind, more water through puck' },
    steps: { ru: ['Эспрессо по рецепту', 'Продлить пролив до 60–80 мл'], en: ['Espresso per recipe', 'Extend pull to 60–80 ml'] },
  },
  {
    id: 'americano',
    name: 'Американо',
    category: 'espresso',
    recipe: { ru: 'Двойной шот + горячая вода 120–150 мл', en: 'Double shot + hot water 120–150 ml' },
    taste: { ru: 'Мягче эспрессо, объём больше', en: 'Softer than espresso, larger volume' },
    method: { ru: 'Шот first, затем вода (не наоборот)', en: 'Shot first, then water (not vice versa)' },
    steps: { ru: ['Приготовить двойной эспрессо', 'Долить горячую воду до объёма'], en: ['Prepare double espresso', 'Top up with hot water to volume'] },
  },
  {
    id: 'flat-white',
    name: 'Флэт уайт',
    category: 'milk',
    recipe: { ru: 'Двойной шот + микропена 120–150 мл', en: 'Double shot + microfoam 120–150 ml' },
    taste: { ru: 'Крепкий кофе, мало пены, гладкая текстура', en: 'Strong coffee, little foam, smooth texture' },
    method: { ru: 'Минимум пены, максимум плотности молока', en: 'Minimum foam, maximum milk density' },
    steps: { ru: ['Двойной эспрессо', 'Взбить молоко с микропеной', 'Слить в чашку, смешать'], en: ['Double espresso', 'Steam milk with microfoam', 'Pour into cup, mix'] },
  },
  {
    id: 'cappuccino',
    name: 'Капучино',
    category: 'milk',
    recipe: { ru: 'Двойной шот + молоко 150–180 мл', en: 'Double shot + milk 150–180 ml' },
    taste: { ru: 'Сбалансированный кофе и молоко, пена', en: 'Balanced coffee and milk, with foam' },
    method: { ru: 'Плотная пена, больше воздуха чем у латте', en: 'Dense foam, more air than latte' },
    steps: { ru: ['Двойной эспрессо', 'Взбить молоко с пеной', 'Собрать напиток'], en: ['Double espresso', 'Steam milk with foam', 'Assemble drink'] },
  },
  {
    id: 'latte',
    name: 'Латте',
    category: 'milk',
    recipe: { ru: 'Двойной шот + молоко 240–300 мл', en: 'Double shot + milk 240–300 ml' },
    taste: { ru: 'Мягкий, молочный, слабый кофейный вкус', en: 'Soft, milky, mild coffee taste' },
    method: { ru: 'Почти без шапки, гладкая микропена', en: 'Almost no cap, smooth microfoam' },
    steps: { ru: ['Двойной эспрессо', 'Взбить молоко, мало пены', 'Собрать напиток'], en: ['Double espresso', 'Steam milk, little foam', 'Assemble drink'] },
  },
  {
    id: 'cortado',
    name: 'Кортадо',
    category: 'espresso',
    recipe: { ru: '18 г кофе → 34–36 мл + молоко 35–40 мл, 1:1', en: '18 g coffee → 34–36 ml + milk 35–40 ml, 1:1' },
    taste: { ru: 'Яркий эспрессо, молоко смягчает кислотность', en: 'Bright espresso, milk softens acidity' },
    method: { ru: 'Равные части эспрессо и молока', en: 'Equal parts espresso and milk' },
    steps: { ru: ['Эспрессо по рецепту', 'Добавить молоко 35–40 мл'], en: ['Espresso per recipe', 'Add milk 35–40 ml'] },
  },
  {
    id: 'macchiato',
    name: 'Маккиато',
    category: 'espresso',
    recipe: { ru: 'Эспрессо + капелька пены молока', en: 'Espresso + drop of milk foam' },
    taste: { ru: 'Эспрессо с легким молочным акцентом', en: 'Espresso with light milk accent' },
    method: { ru: 'Пятно пены на эспрессо', en: 'Foam spot on espresso' },
    steps: { ru: ['Эспрессо по рецепту', 'Добавить каплю пены'], en: ['Espresso per recipe', 'Add drop of foam'] },
  },
  // --- Фильтр ---
  {
    id: 'v60',
    name: 'V60',
    category: 'filter',
    recipe: { ru: '18 г → ~300 мл, блум 30–40 г, 2:45–3:00', en: '18 g → ~300 ml, bloom 30–40 g, 2:45–3:00' },
    taste: { ru: 'Яркая кислотность, чистый профиль', en: 'Bright acidity, clean profile' },
    method: { ru: 'Конус, спираль от центра, не лить на бумагу', en: 'Cone, spiral from center, do not pour on paper' },
    steps: { ru: ['Ополоснуть фильтр, прогреть воронку', 'Засыпать кофе, сделать лунку', 'Блум 30–40 г, подождать оседания', 'Пролив спиралью, уровень стабилен'], en: ['Rinse filter, warm dripper', 'Add coffee, make well', 'Bloom 30–40 g, wait for bed to settle', 'Pour spiral, keep level stable'] },
  },
  {
    id: 'kalita',
    name: 'Kalita Wave 185',
    category: 'filter',
    recipe: { ru: '21 г → 320 мл, блум 30–40 г, не лить на волны', en: '21 g → 320 ml, bloom 30–40 g, do not pour on waves' },
    taste: { ru: 'Ровная экстракция, прощает ошибки технике', en: 'Even extraction, forgiving of technique' },
    method: { ru: 'Плоское дно, три отверстия, пульсы', en: 'Flat bottom, three holes, pulses' },
    steps: { ru: ['Ополоснуть фильтр', 'Блум по всему слою 30–40 г', 'Первый пролив 120 мл', 'Второй 150–160 мл до 320 мл'], en: ['Rinse filter', 'Bloom across whole bed 30–40 g', 'First pour 120 ml', 'Second 150–160 ml to 320 ml'] },
  },
  {
    id: 'aeropress',
    name: 'Aeropress',
    category: 'filter',
    recipe: { ru: '18 г, 2 фильтра, стир 10–15 с, пресс 40–50 с', en: '18 g, 2 filters, stir 10–15 s, press 40–50 s' },
    taste: { ru: 'Плотное тело, короткий цикл', en: 'Dense body, short cycle' },
    method: { ru: 'Обычная ориентация, не inverted', en: 'Standard orientation, not inverted' },
    steps: { ru: ['Два фильтра в крышку', '18 г, залить, перемешать 10–15 с', 'Прессовать медленно 40–50 с'], en: ['Two filters in cap', '18 g, pour, stir 10–15 s', 'Press slowly 40–50 s'] },
  },
  {
    id: 'coldbrew',
    name: 'Cold brew',
    category: 'cold',
    recipe: { ru: '90 г на 1 л, крупный помол, 17–24 ч', en: '90 g per 1 l, coarse grind, 17–24 h' },
    taste: { ru: 'Мало кислоты, плотное тело, шоколад', en: 'Low acidity, dense body, chocolate' },
    method: { ru: 'Холодная экстракция в холодильнике', en: 'Cold extraction in refrigerator' },
    steps: { ru: ['Крупный помол, залить холодной водой', 'Настаивать 17–24 ч', 'Отфильтровать, порция 150–180 мл'], en: ['Coarse grind, pour cold water', 'Steep 17–24 h', 'Filter, serve 150–180 ml'] },
  },
  {
    id: 'batch-brew',
    name: 'Батч-брю',
    category: 'filter',
    recipe: { ru: '70 г на 1 л, средний помол', en: '70 g per 1 l, medium grind' },
    taste: { ru: 'Стабильный профиль для потока гостей', en: 'Stable profile for guest flow' },
    method: { ru: 'Автоматическая заварка', en: 'Automatic brewing' },
    steps: { ru: ['Засыпать кофе, запустить заварку', 'Подать из диспенсера'], en: ['Add coffee, start brewing', 'Serve from dispenser'] },
  },
  // --- Холодные ---
  {
    id: 'iced-latte',
    name: 'Айс латте',
    category: 'cold',
    recipe: { ru: 'Эспрессо + лёд + молоко 200 мл', en: 'Espresso + ice + milk 200 ml' },
    taste: { ru: 'Освежающий, молочный', en: 'Refreshing, milky' },
    method: { ru: 'Лёд, эспрессо, молоко', en: 'Ice, espresso, milk' },
    steps: { ru: ['Наполнить стакан льдом', 'Добавить эспрессо', 'Долить молоко'], en: ['Fill glass with ice', 'Add espresso', 'Top up with milk'] },
  },
  {
    id: 'iced-americano',
    name: 'Айс américано',
    category: 'cold',
    recipe: { ru: 'Двойной шот + лёд + вода 200 мл', en: 'Double shot + ice + water 200 ml' },
    taste: { ru: 'Освежающий, мягкий', en: 'Refreshing, soft' },
    method: { ru: 'Лёд, шот, вода', en: 'Ice, shot, water' },
    steps: { ru: ['Наполнить стакан льдом', 'Добавить шот', 'Долить воду'], en: ['Fill glass with ice', 'Add shot', 'Top up with water'] },
  },
  // --- Авторские ---
  {
    id: 'raf',
    name: 'Раф',
    category: 'signature',
    recipe: { ru: 'Эспрессо + сливки + сироп, взбить вместе', en: 'Espresso + cream + syrup, steam together' },
    taste: { ru: 'Сладкий, плотный, десертный', en: 'Sweet, dense, dessert-like' },
    method: { ru: 'Взбивать эспрессо со сливками и сиропом', en: 'Steam espresso with cream and syrup' },
    steps: { ru: ['Эспрессо в питчер', 'Добавить сливки и сироп', 'Взбить до 60 °C'], en: ['Espresso in pitcher', 'Add cream and syrup', 'Steam to 60 °C'] },
  },
  {
    id: 'flat-white-ice',
    name: 'Айс флэт уайт',
    category: 'cold',
    recipe: { ru: 'Двойной шот + лёд + микропена 150 мл', en: 'Double shot + ice + microfoam 150 ml' },
    taste: { ru: 'Крепкий, молочный, освежающий', en: 'Strong, milky, refreshing' },
    method: { ru: 'Шот, лёд, микропена', en: 'Shot, ice, microfoam' },
    steps: { ru: ['Наполнить стакан льдом', 'Добавить двойной шот', 'Долить микропену'], en: ['Fill glass with ice', 'Add double shot', 'Top up with microfoam'] },
  },
  {
    id: 'matcha-latte',
    name: 'Матча латте',
    category: 'signature',
    recipe: { ru: 'Матча 2 г + молоко 200 мл, взбить', en: 'Matcha 2 g + milk 200 ml, steam' },
    taste: { ru: 'Травяной, сладкий, молочный', en: 'Grassy, sweet, milky' },
    method: { ru: 'Развести матчу, добавить молоко', en: 'Dissolve matcha, add milk' },
    steps: { ru: ['Развести матча порошок водой', 'Добавить молоко, взбить'], en: ['Dissolve matcha powder with water', 'Add milk, steam'] },
  },
  {
    id: 'lemonade-coffee',
    name: 'Кофейный лимонад',
    category: 'signature',
    recipe: { ru: 'Холодный фильтр + лимон + сироп + лёд', en: 'Cold filter + lemon + syrup + ice' },
    taste: { ru: 'Кисло-сладкий, освежающий', en: 'Sweet-sour, refreshing' },
    method: { ru: 'Смешать ингредиенты со льдом', en: 'Mix ingredients with ice' },
    steps: { ru: ['Холодный фильтр в стакан', 'Добавить лимон и сироп', 'Лёд, перемешать'], en: ['Cold filter in glass', 'Add lemon and syrup', 'Ice, stir'] },
  },
];

console.log(`Recipes loaded: ${recipes.length}`);