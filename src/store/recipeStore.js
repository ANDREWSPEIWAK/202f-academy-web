import { create } from 'zustand';
import { persist } from 'zustand/middleware';
export const useRecipeStore = create()(persist((set, get) => ({
    recipes: [],
    addRecipe: (recipe) => {
        const { recipes } = get();
        recipes.push(recipe);
        set({ recipes });
    },
    updateRecipe: (recipe) => {
        const { recipes } = get();
        const index = recipes.findIndex((r) => r.id === recipe.id);
        if (index !== -1) {
            recipes[index] = recipe;
            set({ recipes });
        }
    },
    getRecipe: (id) => {
        const { recipes } = get();
        return recipes.find((r) => r.id === id);
    },
    getRecipesByCategory: (category) => {
        const { recipes } = get();
        return recipes.filter((r) => r.category === category);
    },
    searchRecipes: (query) => {
        const { recipes } = get();
        const q = query.toLowerCase();
        return recipes.filter((r) => r.name.toLowerCase().includes(q) ||
            r.description.toLowerCase().includes(q) ||
            r.notes?.toLowerCase().includes(q));
    },
}), {
    name: '202f-recipe-store',
}));
