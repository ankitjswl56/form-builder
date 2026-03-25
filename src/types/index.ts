export type FieldType = 'text' | 'email' | 'textarea' | 'select';

export interface FormField {
  id: string;
  type: FieldType;
  label: string;
  placeholder?: string;
  required: boolean;
}

export interface DragItem {
  type: FieldType;
}