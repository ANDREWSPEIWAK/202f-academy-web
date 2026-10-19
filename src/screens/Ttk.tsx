import { useEffect, useMemo, useState } from 'react';
import { useProgressStore } from '../store';
import { recipes, ttkCategories, type Recipe } from '../data/recipes';
import { Bar, Pill, SectionHead, EmptyNote } from '../components/app-ui';

const BG = '#161c1c';
const CARD = '#222a2a';
const SURFACE = '#263030';
const AQUA = '#4FBBBC';
const HEAT = '#F39120';
const RUST = '#EC4624';
const CREAM = '#E2DAC2';

const CAT_COLOR: Record<string, string> = { espresso: AQUA, filter: HEAT, milk: CREAM, cold: AQUA, signature: RUST };

export default function Ttk(): JSX.Element {
  const state = useProgressStore();
  const { known, addXp, markKnown, readLesson } = state;

  const [query, setQuery] = useState('');
  const [catId, setCatId] = useState<string>('all');
  const [openRecipeId, setOpenRecipeId] = useState<string | null>(null);
  const [trainerRecipe, setTrainerRecipe] = useState<Recipe | null>(null);

  const knownCount = Object.values(known).filter(Boolean).length;

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    return recipes.filter((r) => {
      const catOk = catId === 'all' || r.category === catId;
      if (!q) return catOk;
      const haystack = (r.name + ' ' + r.recipe.ru + ' ' + r.taste.ru + ' ' + r.method.ru + ' ' + r.category).toLowerCase();
      return catOk && haystack.includes(q);
    });
  }, [query, catId, recipes]);

  useEffect(() => {
    if (openRecipeId) readLesson(`ttk:${openRecipeId}`);
  }, [openRecipeId, readLesson]);

  const catTitle = (id: string) => (id === 'all' ? 'Все' : ttkCategories.find((c) => c.id === id)?.title ?? id);

  const RecipeCard = ({ r }: { r: Recipe }) => {
    const isKnown = !!known[r.id];
    return (
      <div
        onClick={() => setOpenRecipeId(r.id)}
        className="cursor-pointer p-3"
        style={{ background: CARD, border: `1px solid #334545`, borderRadius: '12px' }}
      >
        <div className="flex justify-between items-start mb-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full" style={{ background: isKnown ? AQUA : '#334545' }} />
            <span className="text-xs font-bold text-cream/50">{isKnown ? 'Изучено' : 'Изучить'}</span>
          </div>
          <Pill color={CAT_COLOR[r.category] ?? AQUA}>{catTitle(r.category)}</Pill>
        </div>
        <h4 className="text-sm font-bold text-cream mb-1">{r.name}</h4>
        <p className="text-xs text-cream/70">{r.recipe.ru}</p>
        <p className="mt-1 text-xs text-cream/50">{r.steps.ru.length} шагов · тапните, чтобы открыть техкарту</p>
      </div>
    );
  };

  const RecipeModal = () => {
    const r = recipes.find((x) => x.id === openRecipeId);
    if (!r) return null;
    const isKnown = !!known[r.id];
    return (
      <div className="fixed inset-0 z-50" style={{ background: 'rgba(22,28,28,0.75)', backdropFilter: 'blur(8px)' }} onClick={() => setOpenRecipeId(null)}>
        <div className="anim-pop mt-10 mb-10 mx-3 lg:mx-20" style={{ background: CARD, border: `1px solid #334545`, borderRadius: '14px' }} onClick={(e) => e.stopPropagation()}>
          <div className="p-4 flex items-start justify-between" style={{ borderBottom: `1px solid #334545` }}>
            <div>
              <h3 className="text-base font-bold text-cream">{r.name}</h3>
              <Pill color={CAT_COLOR[r.category] ?? AQUA} className="mt-1">{catTitle(r.category)}</Pill>
            </div>
            <button type="button" onClick={() => markKnown(r.id, !isKnown)} className="px-3 py-1.5 rounded text-xs font-bold" style={{ background: isKnown ? SURFACE : AQUA, color: isKnown ? CREAM : '#161c1c' }}>
              {isKnown ? 'Отмечено как изученное · +6 XP' : 'Отметить изученным · +6 XP'}
            </button>
          </div>
          <div className="p-4 space-y-4">
            <div>
              <h4 className="text-xs font-bold text-cream/60 uppercase tracking-wider mb-1">Рецепт</h4>
              <p className="text-sm text-cream/90">{r.recipe.ru}</p>
            </div>
            <div>
              <h4 className="text-xs font-bold text-cream/60 uppercase tracking-wider mb-1">Вкус</h4>
              <p className="text-sm text-cream/90">{r.taste.ru}</p>
            </div>
            <div>
              <h4 className="text-xs font-bold text-cream/60 uppercase tracking-wider mb-1">Метод</h4>
              <p className="text-sm text-cream/90">{r.method.ru}</p>
            </div>
            <div>
              <h4 className="text-xs font-bold text-cream/60 uppercase tracking-wider mb-1">Шаги сборки</h4>
              <ol className="list-decimal list-inside text-sm text-cream/80 space-y-1">
                {r.steps.ru.map((step, i) => <li key={i}>{step}</li>)}
              </ol>
            </div>
            <button type="button" onClick={() => { setOpenRecipeId(null); setTrainerRecipe(r); }} className="w-full py-2.5 rounded-lg text-sm font-bold" style={{ background: HEAT, color: '#161c1c' }}>
              Тренировать сборку
            </button>
          </div>
        </div>
      </div>
    );
  };

  const BuildTrainer = () => {
    const recipe = trainerRecipe!;
    const steps = recipe.steps.ru;
    const [order, setOrder] = useState<number[]>([]);
    const [tapped, setTapped] = useState<number[]>([]);
    const [done, setDone] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
      setOrder(steps.map((_, i) => i).sort(() => Math.random() - 0.5));
      setTapped([]);
      setDone(false);
      setMessage('');
    }, [recipe.id, steps]);

    const onTap = (origIndex: number) => {
      if (done) return;
      const expected = tapped.length;
      if (origIndex === expected) {
        setTapped((prev) => {
          const next = [...prev, origIndex];
          if (next.length === steps.length) {
            setDone(true);
            addXp(10);
            markKnown(recipe.id, true);
            setMessage('Верно! Рецепт изучен · +10 XP');
          }
          return next;
        });
      } else {
        setTapped([]);
        setMessage('Порядок нарушен — начните заново');
        setTimeout(() => setMessage(''), 1500);
      }
    };

    return (
      <div className="fixed inset-0 z-50" style={{ background: 'rgba(22,28,28,0.75)', backdropFilter: 'blur(8px)' }} onClick={() => setTrainerRecipe(null)}>
        <div className="anim-pop mt-10 mb-10 mx-3 lg:mx-20" style={{ background: CARD, border: `1px solid #334545`, borderRadius: '14px' }} onClick={(e) => e.stopPropagation()}>
          <div className="p-4 flex items-start justify-between" style={{ borderBottom: `1px solid #334545` }}>
            <div>
              <button type="button" onClick={() => setTrainerRecipe(null)} className="text-sm font-bold text-cream/60 hover:text-cream">← Карточка</button>
              <h3 className="text-sm font-bold text-cream mt-1">Тренировка: {recipe.name}</h3>
            </div>
          </div>
          <div className="p-4 space-y-3">
            <p className="text-xs text-cream/60">Тапните шаги в правильном порядке сборки</p>
            {message && <p className="text-xs text-cream/50">{message}</p>}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {order.map((origIndex, position) => {
                const used = tapped.includes(origIndex);
                return (
                  <button
                    key={origIndex}
                    type="button"
                    disabled={done || used}
                    onClick={() => onTap(origIndex)}
                    className="p-2 text-left text-xs rounded"
                    style={{ background: used ? SURFACE : CARD, border: `1px solid ${used ? AQUA : '#334545'}`, color: CREAM }}
                  >
                    {String(position + 1)}. {steps[origIndex]}
                  </button>
                );
              })}
            </div>
            {done && <p className="text-xs font-bold text-aqua">Верно! Рецепт изучен · +10 XP</p>}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div style={{ background: BG, minHeight: '100vh', color: CREAM }} className="px-3 pb-24">
      <SectionHead kicker="ТТК · техкарты станции" title="Рецепты и сборка" />

      <div style={{ background: CARD, border: `1px solid #334545`, borderRadius: '12px' }} className="mt-5 p-4">
        <div className="flex justify-between mb-1">
          <span className="text-xs font-bold text-cream">Известно рецептов</span>
          <span className="text-xs font-bold text-cream">{knownCount} / {recipes.length}</span>
        </div>
        <Bar value={recipes.length ? Math.round((knownCount / recipes.length) * 100) : 0} color={AQUA} h={8} />
      </div>

      <div className="mt-4">
        <input
          className="w-full px-3 py-2 rounded-lg text-sm"
          style={{ background: SURFACE, border: `1px solid #334545`, color: CREAM }}
          placeholder="Поиск: flat white, раф, V60, мартини…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {[{ id: 'all', title: 'Все' }, ...ttkCategories].map((c) => {
          const active = catId === c.id;
          const color = c.id === 'all' ? AQUA : (CAT_COLOR[c.id] ?? AQUA);
          return (
            <button key={c.id} onClick={() => setCatId(c.id)} className="px-3 py-1.5 rounded-full text-xs font-bold" style={{ background: active ? color : 'transparent', border: active ? 'none' : `1px solid #334545`, color: active ? '#161c1c' : CREAM }}>
              {c.title}
            </button>
          );
        })}
      </div>

      {filtered.length === 0 ? (
        <div className="mt-6"><EmptyNote>Рецепты не найдены</EmptyNote></div>
      ) : (
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {filtered.map((r) => <RecipeCard key={r.id} r={r} />)}
        </div>
      )}

      {openRecipeId && <RecipeModal />}
      {trainerRecipe && <BuildTrainer />}
    </div>
  );
}
