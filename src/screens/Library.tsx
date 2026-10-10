import React, { useState } from 'react';
import Card from '../components/Card';
import Badge from '../components/Badge';
import styles from './Library.module.css';
import { useRecipeStore } from '../store/recipeStore';
import { seedData } from '../data/seedData';

const CATEGORY_LABEL: Record<string, string> = {
  ESPRESSO: 'Эспрессо-меню',
  FILTER: 'Фильтр',
  SPECIALTY_COFFEE: 'Спешелти',
  MATCHA: 'Матча',
  COLD_DRINKS: 'Холодные напитки',
  SMOOTHIES: 'Смузи',
  SIGNATURES: 'Сигнатуры',
};

const RESOURCE_CATEGORY: Record<string, string> = {
  METHODS: 'Методы заваривания',
  THEORY: 'Теория',
  VIDEOS: 'Видео',
  BOOKS: 'Книги',
  SENSORY: 'Сенсорика',
  SERVICE: 'Сервис',
  COFFEE_SCIENCE: 'Наука о кофе',
  ROASTING: 'Обжарка',
};

const Library: React.FC = () => {
  const recipes = useRecipeStore((s) => s.recipes);
  const [tab, setTab] = useState<'ttk' | 'resources'>('ttk');

  const allRecipes = recipes.length > 0 ? recipes : seedData.recipes;
  const categories = Array.from(new Set(allRecipes.map((r) => r.category)));

  return (
    <div className={styles.library}>
      <div className={styles.header}>
        <h1 className={styles.title}>Библиотека</h1>
      </div>

      <div className={styles.tabs} role="tablist">
        <button
          type="button"
          role="tab"
          aria-selected={tab === 'ttk'}
          className={`${styles.tab} ${tab === 'ttk' ? styles.tabActive : ''}`}
          onClick={() => setTab('ttk')}
        >
          ТТК напитков
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={tab === 'resources'}
          className={`${styles.tab} ${tab === 'resources' ? styles.tabActive : ''}`}
          onClick={() => setTab('resources')}
        >
          Материалы
        </button>
      </div>

      {tab === 'ttk' && (
        <div className={styles.content}>
          {categories.map((category) => (
            <section key={category} className={styles.section}>
              <h2 className={styles.sectionTitle}>{CATEGORY_LABEL[category] ?? category}</h2>
              <div className={styles.recipeList}>
                {allRecipes
                  .filter((r) => r.category === category)
                  .map((recipe) => (
                    <Card key={recipe.id} className={styles.recipeCard}>
                      <div className={styles.recipeTop}>
                        <p className={styles.recipeName}>{recipe.name}</p>
                        <Badge variant="secondary" size="small">
                          v{recipe.version}
                        </Badge>
                      </div>
                      <p className={styles.recipeDesc}>{recipe.description}</p>
                      <div className={styles.recipeIngredients}>
                        {recipe.ingredients.map((ing, i) => (
                          <span key={i} className={styles.ingredient}>
                            {ing.name} — {ing.amount} {ing.unit}
                          </span>
                        ))}
                      </div>
                      <pre className={styles.recipeMethod}>{recipe.method}</pre>
                      <div className={styles.recipeMeta}>
                        {recipe.temperature != null && <span>Температура подачи: {recipe.temperature} °C</span>}
                        {recipe.glassType && <span>Посуда: {recipe.glassType}</span>}
                        {recipe.notes && <span>Примечание: {recipe.notes}</span>}
                      </div>
                    </Card>
                  ))}
              </div>
            </section>
          ))}
        </div>
      )}

      {tab === 'resources' && (
        <div className={styles.content}>
          <div className={styles.resourceList}>
            {seedData.resources.map((res) => (
              <Card key={res.id} className={styles.resourceCard}>
                <div className={styles.resourceTop}>
                  <Badge variant="primary" size="small">
                    {RESOURCE_CATEGORY[res.category] ?? res.category}
                  </Badge>
                  {res.duration != null && <span className={styles.resourceDuration}>{res.duration} мин</span>}
                </div>
                <p className={styles.resourceTitle}>{res.title}</p>
                <p className={styles.resourceDesc}>{res.description}</p>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Library;
