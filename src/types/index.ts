export type FieldType = 'text' | 'textarea' | 'email' | 'tel' | 'select' | 'checkbox';

export interface SelectOption {
  id: string;
  label: string;
  value: string;
}

export interface FormField {
  id: string;
  name: string;
  type: FieldType;
  validation: boolean;
  defaultValue?: string | boolean;
  options?: SelectOption[];
}

export interface DragItem {
  type: FieldType;
}