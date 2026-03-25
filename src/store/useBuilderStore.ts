import { create } from 'zustand';
import type { FormField } from '../types';

interface BuilderState {
  fields: FormField[];
  view: 'builder' | 'code' | 'preview';
  addField: (field: FormField) => void;
  updateField: (id: string, updates: Partial<FormField>) => void;
  removeField: (id: string) => void;
  moveField: (dragIndex: number, hoverIndex: number) => void;
  clearFields: () => void;
  setView: (view: 'builder' | 'code' | 'preview') => void;
}

export const useBuilderStore = create<BuilderState>((set) => ({
  fields: [],
  view: 'builder',
  addField: (field) => set((state) => ({ fields: [...state.fields, field] })),
  updateField: (id, updates) => set((state) => ({
    fields: state.fields.map(f => f.id === id ? { ...f, ...updates } : f)
  })),
  removeField: (id) => set((state) => ({ 
    fields: state.fields.filter(f => f.id !== id) 
  })),
  moveField: (dragIndex, hoverIndex) => set((state) => {
    const newFields = [...state.fields];
    const draggedField = newFields[dragIndex];
    newFields.splice(dragIndex, 1);
    newFields.splice(hoverIndex, 0, draggedField);
    return { fields: newFields };
  }),
  clearFields: () => set({ fields: [] }),
  setView: (view) => set({ view }),
}));