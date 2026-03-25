import { useDrag } from 'react-dnd';
import { GripVertical } from 'lucide-react';
import type { FieldType } from '../../types';

interface ToolProps {
  type: FieldType;
  label: string;
  icon: React.ReactNode;
}

export const Tool = ({ type, label, icon }: ToolProps) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'FORM_FIELD',
    item: { type },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={(node) => { drag(node); }}
      className={`flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-md cursor-grab hover:border-blue-500 hover:shadow-sm transition-all ${
        isDragging ? 'opacity-40' : 'opacity-100'
      }`}
    >
      <div className="text-gray-400 cursor-grab"><GripVertical size={16} /></div>
      <div className="text-blue-600">{icon}</div>
      <span className="font-medium text-sm text-gray-700">{label}</span>
    </div>
  );
};