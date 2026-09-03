import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Recipe } from '../types';

interface RecipeState {
  recipes: Recipe[];
  addRecipe: (recipe: Recipe) => void;
  updateRecipe: (recipe: Recipe) => void;
  getRecipe: (id: string) => Recipe | undefined;
  getRecipesByCategory: (category: string) => Recipe[];
  searchRecipes: (query: string) => Recipe[];
}

export const useRecipeStore = create<RecipeState>()(persist(
  (set, get) => ({
    recipes: [],

    addRecipe: (recipe: Recipe) => {
      const { recipes } = get();
      recipes.push(recipe);
      set({ recipes });
    },

    updateRecipe: (recipe: Recipe) => {
      const { recipes } = get();
      const index = recipes.findIndex((r) => r.id === recipe.id);
      if (index !== -1) {
        recipes[index] = recipe;
        set({ recipes });
      }
    },

    getRecipe: (id: string) => {
      const { recipes } = get();
      return recipes.find((r) => r.id === id);
    },

    getRecipesByCategory: (category: string) => {
      const { recipes } = get();
      return recipes.filter((r) => r.category === category);
    },

    searchRecipes: (query: string) => {
      const { recipes } = get();
      const q = query.toLowerCase();
      return recipes.filter(
        (r) =>
          r.name.toLowerCase().includes(q) ||
          r.description.toLowerCase().includes(q) ||
          r.notes?.toLowerCase().includes(q)
      );
    },
  }),
  {
    name: '202f-recipe-store',
  }
));
