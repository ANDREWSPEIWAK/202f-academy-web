import { create } from 'zustand';
import { persist } from 'zustand/middleware';
export const useSkillStore = create()(persist((set, get) => ({
    skills: new Map(),
    userSkillProgress: new Map(),
    addSkill: (skill) => set((state) => {
        const next = new Map(state.skills);
        next.set(skill.id, skill);
        return { skills: next };
    }),
    getSkill: (skillId) => {
        const { skills } = get();
        return skills.get(skillId);
    },
    updateSkillProgress: (progress) => set((state) => {
        const next = new Map(state.userSkillProgress);
        const key = `${progress.userId}-${progress.skillId}`;
        next.set(key, progress);
        return { userSkillProgress: next };
    }),
    getUserSkillProgress: (userId) => {
        const { userSkillProgress } = get();
        return Array.from(userSkillProgress.values()).filter((p) => p.userId === userId);
    },
    getSkillProgress: (userId, skillId) => {
        const { userSkillProgress } = get();
        return userSkillProgress.get(`${userId}-${skillId}`);
    },
}), {
    name: '202f-skill-store',
}));
