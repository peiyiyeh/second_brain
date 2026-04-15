import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useStore = create(
  persist(
    (set) => ({
      // State
      journals: [],
      awareness: [],
      inventory: [],
      goals: [],
      yarn: [],
      projects: [],
      
      // Investment OS State
      portfolio: [],
      investJournals: [],
      cashBalance: 0,


      // Actions - Journals
      addJournal: (journal) => set((state) => ({ journals: [...state.journals, { ...journal, id: Date.now() }] })),
      updateJournal: (id, updated) => set((state) => ({
        journals: state.journals.map((j) => (j.id === id ? { ...j, ...updated } : j))
      })),
      removeJournal: (id) => set((state) => ({ journals: state.journals.filter((j) => j.id !== id) })),

      // Actions - Awareness
      addAwareness: (record) => set((state) => ({ awareness: [...state.awareness, { ...record, id: Date.now() }] })),
      updateAwareness: (id, updated) => set((state) => ({
        awareness: state.awareness.map((a) => (a.id === id ? { ...a, ...updated } : a))
      })),
      removeAwareness: (id) => set((state) => ({ awareness: state.awareness.filter((a) => a.id !== id) })),

      // Actions - Inventory
      addInventoryItem: (item) => set((state) => ({ inventory: [...state.inventory, { ...item, id: Date.now() }] })),
      updateInventoryItem: (id, updated) => set((state) => ({
        inventory: state.inventory.map((i) => (i.id === id ? { ...i, ...updated } : i))
      })),
      removeInventoryItem: (id) => set((state) => ({ inventory: state.inventory.filter((i) => i.id !== id) })),

      // Actions - Goals
      addGoal: (goal) => set((state) => ({
        goals: [...state.goals, { ...goal, id: Date.now(), current: 0, createdAt: new Date().toISOString() }]
      })),
      updateGoal: (id, updated) => set((state) => ({
        goals: state.goals.map((g) => (g.id === id ? { ...g, ...updated } : g))
      })),
      removeGoal: (id) => set((state) => ({ goals: state.goals.filter((g) => g.id !== id) })),
      incrementGoal: (id, amount = 1) => set((state) => ({
        goals: state.goals.map((g) => (g.id === id ? { ...g, current: g.current + amount } : g))
      })),

      // Actions - Knitting (Yarn)
      addYarn: (yarn) => set((state) => ({ yarn: [...state.yarn, { ...yarn, id: Date.now() }] })),
      updateYarn: (id, updated) => set((state) => ({
        yarn: state.yarn.map((y) => (y.id === id ? { ...y, ...updated } : y))
      })),
      removeYarn: (id) => set((state) => ({ yarn: state.yarn.filter((y) => y.id !== id) })),

      // Actions - Knitting (Projects)
      addProject: (project) => set((state) => ({
        projects: [...state.projects, { yarnUsed: [], status: '想法', ...project, id: Date.now() }]
      })),
      updateProject: (id, updated) => set((state) => ({
        projects: state.projects.map((p) => (p.id === id ? { ...p, ...updated } : p))
      })),
      removeProject: (id) => set((state) => ({ projects: state.projects.filter((p) => p.id !== id) })),

      // Actions - Investment OS
      addPortfolio: (item) => set((state) => ({ portfolio: [...state.portfolio, { ...item, id: Date.now() }] })),
      updatePortfolio: (id, updated) => set((state) => ({
        portfolio: state.portfolio.map((p) => (p.id === id ? { ...p, ...updated } : p))
      })),
      removePortfolio: (id) => set((state) => ({ portfolio: state.portfolio.filter((p) => p.id !== id) })),
      
      addInvestJournal: (journal) => set((state) => ({ investJournals: [...state.investJournals, { ...journal, id: Date.now() }] })),
      updateInvestJournal: (id, updated) => set((state) => ({
        investJournals: state.investJournals.map((j) => (j.id === id ? { ...j, ...updated } : j))
      })),
      removeInvestJournal: (id) => set((state) => ({ investJournals: state.investJournals.filter((j) => j.id !== id) })),

      updateCashBalance: (amount) => set(() => ({ cashBalance: amount })),
    }),
    {
      name: 'second-brain-storage', // key in localStorage
    }
  )
);
