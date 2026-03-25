import { create } from 'zustand';
import type { FormField } from '../types';

interface BuilderState {
  fields: FormField[];
  addField: (field: FormField) => void;
  removeField: (id: string) => void;
}

export const useBuilderStore = create<BuilderState>((set) => ({
  fields: [],
  addField: (field) => set((state) => ({ fields: [...state.fields, field] })),
  removeField: (id) => set((state) => ({ 
    fields: state.fields.filter(f => f.id !== id) 
  })),
}));