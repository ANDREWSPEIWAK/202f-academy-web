import { create } from 'zustand';
import { persist } from 'zustand/middleware';
export const useSkillStore = create()(persist((set, get) => ({
    skills: new Map(),
    userSkillProgress: new Map(),
    addSkill: (skill) => {
        const { skills } = get();
        skills.set(skill.id, skill);
        set({ skills });
    },
    getSkill: (skillId) => {
        const { skills } = get();
        return skills.get(skillId);
    },
    updateSkillProgress: (progress) => {
        const { userSkillProgress } = get();
        const key = `${progress.userId}-${progress.skillId}`;
        userSkillProgress.set(key, progress);
        set({ userSkillProgress });
    },
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
