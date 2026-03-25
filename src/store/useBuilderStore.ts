import { create } from 'zustand';
import type { FormField } from '../types';

interface BuilderState {
  fields: FormField[];
  view: 'builder' | 'preview';
  addField: (field: FormField) => void;
  removeField: (id: string) => void;
  clearFields: () => void;
  setView: (view: 'builder' | 'preview') => void;
}

export const useBuilderStore = create<BuilderState>((set) => ({
  fields: [],
  view: 'builder',
  addField: (field) => set((state) => ({ fields: [...state.fields, field] })),
  removeField: (id) => set((state) => ({ 
    fields: state.fields.filter(f => f.id !== id) 
  })),
  clearFields: () => set({ fields: [] }),
  setView: (view) => set({ view }),
}));