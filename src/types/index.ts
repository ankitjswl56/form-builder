export type FieldType = 'text' | 'email' | 'tel' | 'checkbox' | 'select' | 'radio' | 'textarea';

export interface FormField {
  id: string;
  name: string;
  type: FieldType;
  validation: boolean;
}

export interface DragItem {
  type: FieldType;
}