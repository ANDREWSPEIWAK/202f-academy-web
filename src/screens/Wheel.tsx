import React, { useState } from 'react';
import Card from '../components/Card';
import styles from './Wheel.module.css';
import { useT } from '../i18n';

/**
 * Вкусовое колесо по мотивам SCA Coffee Tasting Flavour Wheel.
 * Концентрические сегменты: категория → подкатегории.
 */
interface Sub {
  name: string;
  desc: string;
}
interface Cat {
  name: string;
  color: string;
  desc: string;
  subs: Sub[];
}

const WHEEL: Cat[] = [
  {
    name: 'Сладость',
    color: '#e9f056',
    desc: 'Сладость от карамелизации сахаров и карамелизации при обжарке. Признак хорошего развития зерна.',
    subs: [
      { name: 'Карамель', desc: 'Жжёный сахар, ирис — признак средней обжарки и сладкого зерна.' },
      { name: 'Шоколад', desc: 'Какао, тёмный шоколад — типично для бразильских и центральноамериканских лотов.' },
      { name: 'Мёд', desc: 'Медовая сладость с цветочным оттенком, часто у honey-обработки.' },
      { name: 'Ваниль', desc: 'Мягкая сливочная сладость, аромат ванили.' },
    ],
  },
  {
    name: 'Фрукты',
    color: '#ff5c34',
    desc: 'Фруктовые ноты зависят от сорта, терруара и обработки. Натуральная обработка усиливает ягодность.',
    subs: [
      { name: 'Ягоды', desc: 'Чёрная смородина, малина — классика эфиопских и кенийских лотов.' },
      { name: 'Цитрус', desc: 'Лимон, апельсин, бергамот — яркая кислотность высокогорной арабики.' },
      { name: 'Косточковые', desc: 'Персик, абрикос, вишня — сладкая кислотность.' },
      { name: 'Тропические', desc: 'Ананас, манго, маракуйя — интенсивный профиль, часто у анаэробной обработки.' },
    ],
  },
  {
    name: 'Цветы',
    color: '#d7efff',
    desc: 'Флёры — маркер спелости зерна и деликатной обжарки. Ломаются при перестарке первыми.',
    subs: [
      { name: 'Жасмин', desc: 'Чайный, деликатный цветочный аромат — визитная карточка эфиопов.' },
      { name: 'Роза', desc: 'Нота розы в герметичных лотах Гейши и высокогорной арабики.' },
    ],
  },
  {
    name: 'Пряности',
    color: '#4a2b3a',
    desc: 'Пряные ноты дают происхождение (Индия, Индонезия) и развитие при обжарке.',
    subs: [
      { name: 'Корица', desc: 'Тёплая древесная сладость.' },
      { name: 'Перец', desc: 'Острая нота, характерна для робусты и некоторых натуралов.' },
    ],
  },
  {
    name: 'Обжарка',
    color: '#351e28',
    desc: 'Ноты обжарки: от хлебных до жжёных. Чем темнее roast, тем сильнее эта группа перекрывает происхождение.',
    subs: [
      { name: 'Хлебные', desc: 'Свежий хлеб, тост — светлые степени обжарки.' },
      { name: 'Орехи', desc: 'Миндаль, фундук — средняя обжарка, классика эспрессо-блендов.' },
      { name: 'Жжёные', desc: 'Табак, дым, уголь — тёмная обжарка. За пределом — горечь.' },
    ],
  },
  {
    name: 'Зелень',
    color: '#aeb8a0',
    desc: 'Растительные ноты. В умеренной дозе — сложность, в избытке — дефект обжарки или недоспелое зерно.',
    subs: [
      { name: 'Травы', desc: 'Свежая зелень, оливка — признак недоспелости или quakers.' },
      { name: 'Овощи', desc: 'Картофельный дефект (PTD), бобовые тона.' },
    ],
  },
  {
    name: 'Кислотность',
    color: '#8fc9e8',
    desc: 'Кислотность — структура чашки. Яблочная и винная — хорошо; уксусная — дефект.',
    subs: [
      { name: 'Яблочная', desc: 'Чистая malic-кислотность, свежесть зелёного яблока.' },
      { name: 'Винная', desc: 'Винная, виноградная кислотность — кенийский профиль.' },
      { name: 'Уксусная', desc: 'Резкая уксусная кислота — дефект ферментации.' },
    ],
  },
  {
    name: 'Ферментация',
    color: '#6e5a64',
    desc: 'Ферментированные ноты: от элегантных винных до дефектных. Граница проходит по чистоте чашки.',
    subs: [
      { name: 'Вино', desc: 'Винные, ягодно-бродильные ноты контролируемой анаэробики.' },
      { name: 'Скисшее', desc: 'Уксус, тухлые фрукты — дефект обработки.' },
    ],
  },
];

const CX = 110;
const CY = 110;
const R_OUT = 100;
const R_MID = 62;
const R_IN = 30;

function polar(r: number, angleDeg: number): [number, number] {
  const a = ((angleDeg - 90) * Math.PI) / 180;
  return [CX + r * Math.cos(a), CY + r * Math.sin(a)];
}

function arcPath(rOut: number, rIn: number, a0: number, a1: number): string {
  const [x0, y0] = polar(rOut, a0);
  const [x1, y1] = polar(rOut, a1);
  const [x2, y2] = polar(rIn, a1);
  const [x3, y3] = polar(rIn, a0);
  const large = a1 - a0 > 180 ? 1 : 0;
  return `M ${x0} ${y0} A ${rOut} ${rOut} 0 ${large} 1 ${x1} ${y1} L ${x2} ${y2} A ${rIn} ${rIn} 0 ${large} 0 ${x3} ${y3} Z`;
}

const Wheel: React.FC = () => {
  const t = useT();
  const [sel, setSel] = useState<{ cat: Cat; sub?: Sub } | null>(null);

  const n = WHEEL.length;
  const seg = 360 / n;

  return (
    <div className={styles.wheel}>
      <h1 className={styles.title}>{t('wheel.title')}</h1>

      <div className={styles.wheelWrap}>
        <svg viewBox="0 0 220 220" className={styles.svg} role="img" aria-label={t('wheel.title')}>
          {WHEEL.map((cat, i) => {
            const a0 = i * seg + 1;
            const a1 = (i + 1) * seg - 1;
            const [lx, ly] = polar((R_OUT + R_MID) / 2, (a0 + a1) / 2);
            return (
              <g key={cat.name}>
                <path
                  d={arcPath(R_OUT, R_MID, a0, a1)}
                  fill={cat.color}
                  stroke="rgba(0,0,0,0.25)"
                  strokeWidth="0.6"
                  className={styles.seg}
                  onClick={() => setSel({ cat })}
                >
                  <title>{cat.name}</title>
                </path>
                <text x={lx} y={ly} className={styles.catLabel} onClick={() => setSel({ cat })}>
                  {cat.name}
                </text>
                {cat.subs.map((sub, j) => {
                  const sa0 = a0 + ((a1 - a0) * j) / cat.subs.length;
                  const sa1 = a0 + ((a1 - a0) * (j + 1)) / cat.subs.length;
                  return (
                    <path
                      key={sub.name}
                      d={arcPath(R_MID, R_IN, sa0, sa1)}
                      fill={cat.color}
                      fillOpacity={sel?.sub === sub ? 1 : 0.55}
                      stroke="rgba(0,0,0,0.25)"
                      strokeWidth="0.6"
                      className={styles.seg}
                      onClick={() => setSel({ cat, sub })}
                    >
                      <title>{sub.name}</title>
                    </path>
                  );
                })}
              </g>
            );
          })}
          <circle cx={CX} cy={CY} r={R_IN - 2} fill="var(--surface)" stroke="var(--border)" />
          <text x={CX} y={CY + 4} textAnchor="middle" className={styles.centerLabel}>
            202f
          </text>
        </svg>
      </div>

      <p className={styles.hint}>{t('wheel.hint')}</p>

      {sel && (
        <Card>
          <p className={styles.selCat}>
            <span className={styles.selDot} style={{ background: sel.cat.color }} />
            {sel.cat.name}
            {sel.sub ? ` · ${sel.sub.name}` : ''}
          </p>
          <p className={styles.selDesc}>{sel.sub ? sel.sub.desc : sel.cat.desc}</p>
        </Card>
      )}
    </div>
  );
};

export default Wheel;
