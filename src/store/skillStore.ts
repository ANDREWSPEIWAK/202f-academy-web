import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Skill, UserSkillProgress } from '../types';

interface SkillState {
  skills: Map<string, Skill>;
  userSkillProgress: Map<string, UserSkillProgress>;
  addSkill: (skill: Skill) => void;
  getSkill: (skillId: string) => Skill | undefined;
  updateSkillProgress: (progress: UserSkillProgress) => void;
  getUserSkillProgress: (userId: string) => UserSkillProgress[];
  getSkillProgress: (userId: string, skillId: string) => UserSkillProgress | undefined;
}

export const useSkillStore = create<SkillState>()(persist(
  (set, get) => ({
    skills: new Map(),
    userSkillProgress: new Map(),

    addSkill: (skill: Skill) => set((state) => {
      const next = new Map(state.skills);
      next.set(skill.id, skill);
      return { skills: next };
    }),

    getSkill: (skillId: string) => {
      const { skills } = get();
      return skills.get(skillId);
    },

    updateSkillProgress: (progress: UserSkillProgress) => set((state) => {
      const next = new Map(state.userSkillProgress);
      const key = `${progress.userId}-${progress.skillId}`;
      next.set(key, progress);
      return { userSkillProgress: next };
    }),

    getUserSkillProgress: (userId: string) => {
      const { userSkillProgress } = get();
      return Array.from(userSkillProgress.values()).filter(
        (p) => p.userId === userId
      );
    },

    getSkillProgress: (userId: string, skillId: string) => {
      const { userSkillProgress } = get();
      return userSkillProgress.get(`${userId}-${skillId}`);
    },
  }),
  {
    name: '202f-skill-store',
  }
));
