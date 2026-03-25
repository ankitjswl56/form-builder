import React, { useRef, useState } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { GripHorizontal, Trash2, Settings, Plus, X } from 'lucide-react';
import { nanoid } from 'nanoid';
import { useBuilderStore } from '../store/useBuilderStore';
import type { FormField, FieldType } from '../types';

interface SortableFieldProps {
  field: FormField;
  index: number;
}

export const SortableField: React.FC<SortableFieldProps> = ({ field, index }) => {
  const ref = useRef<HTMLDivElement>(null);
  const { updateField, removeField, moveField } = useBuilderStore();
  const [isEditingSettings, setIsEditingSettings] = useState(false);

  const [{ isDragging }, drag, dragPreview] = useDrag({
    type: 'FORM_FIELD',
    item: { id: field.id, index },
    collect: (monitor) => ({ isDragging: monitor.isDragging() }),
  });

  const [, drop] = useDrop({
    accept: 'FORM_FIELD',
    hover(item: { id: string; index: number }, monitor) {
      if (!ref.current) return;
      const dragIndex = item.index;
      const hoverIndex = index;
      if (dragIndex === hoverIndex) return;

      const hoverBoundingRect = ref.current.getBoundingClientRect();
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();

      if (!clientOffset) return;

      const hoverClientY = clientOffset.y - hoverBoundingRect.top;
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) return;
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) return;

      moveField(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });

  const handleOptionChange = (optionId: string, newLabel: string) => {
    if (!field.options) return;
    const newOptions = field.options.map(opt =>
      opt.id === optionId ? { ...opt, label: newLabel, value: newLabel.toLowerCase().replace(/\s+/g, '-') } : opt
    );
    updateField(field.id, { options: newOptions });
  };

  const handleAddOption = () => {
    const currentOptions = field.options || [];
    updateField(field.id, {
      options: [...currentOptions, { id: nanoid(), label: `Option ${currentOptions.length + 1}`, value: `option-${currentOptions.length + 1}` }]
    });
  };

  const handleRemoveOption = (optionId: string) => {
    if (!field.options) return;
    updateField(field.id, { options: field.options.filter(opt => opt.id !== optionId) });
  };

  return (
    <div
      ref={(node) => { ref.current = node; drop(node); dragPreview(node); }}
      className={`relative bg-[#121a2f] border ${isEditingSettings ? 'border-[#f56c40]' : 'border-slate-800'} rounded-lg p-5 transition-all ${isDragging ? 'opacity-40' : 'opacity-100'} group`}
    >
      <div
        ref={(node) => { drag(node); }}
        className="absolute top-2 left-1/2 -translate-x-1/2 cursor-grab text-slate-600 hover:text-[#f56c40] opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <GripHorizontal size={20} />
      </div>

      {!isEditingSettings ? (
        <div className="mt-2">
          <div className="flex justify-between items-start mb-3">
            <div className="flex items-center">
              {/* Auto-growing input wrapper using CSS Grid */}
              <div className="inline-grid items-center relative">
                {/* Hidden span dictates the exact width. min-w-[5px] forces the 5px empty state */}
                <span className="invisible whitespace-pre px-1 py-0.5 font-medium col-start-1 row-start-1 min-w-[5px]">
                  {field.name || ' '}
                </span>
                <input
                  type="text"
                  value={field.name}
                  onChange={(e) => updateField(field.id, { name: e.target.value })}
                  className="col-start-1 row-start-1 w-full bg-transparent border-b border-transparent hover:border-slate-600 focus:border-[#f56c40] text-white font-medium focus:outline-none px-1 py-0.5 -ml-1 transition-colors"
                />
              </div>
              {/* Required asterisk strictly locked 3px to the right of the dynamic input */}
              {field.validation && <span className="text-[#f56c40] ml-[3px]">*</span>}
            </div>
            <div className="flex gap-2 relative z-10 shrink-0">
              <button onClick={() => setIsEditingSettings(true)} className="text-slate-400 hover:text-white transition-colors"><Settings size={18} /></button>
              <button onClick={() => removeField(field.id)} className="text-slate-400 hover:text-red-400 transition-colors"><Trash2 size={18} /></button>
            </div>
          </div>

          {/* Interactive Inputs (Captures defaultValue) */}
          {field.type === 'textarea' ? (
            <textarea
              value={(field.defaultValue as string) || ''}
              onChange={(e) => updateField(field.id, { defaultValue: e.target.value })}
              className="w-full bg-[#0b1121] border border-slate-700 rounded p-2 text-white focus:border-[#f56c40] focus:outline-none min-h-[80px]"
              placeholder="Type default text here..."
            />
          ) : field.type === 'checkbox' ? (
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={(field.defaultValue as boolean) || false}
                onChange={(e) => updateField(field.id, { defaultValue: e.target.checked })}
                className="w-5 h-5 accent-[#f56c40]"
              />
              <span className="text-sm text-slate-400">Check by default</span>
            </div>
          ) : field.type === 'select' ? (
            <select
              value={(field.defaultValue as string) || ''}
              onChange={(e) => updateField(field.id, { defaultValue: e.target.value })}
              className="w-full bg-[#0b1121] border border-slate-700 rounded p-2 text-white focus:border-[#f56c40] focus:outline-none"
            >
              <option value="">Select a default...</option>
              {field.options?.map(opt => (
                <option key={opt.id} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          ) : (
            <input
              type={field.type}
              value={(field.defaultValue as string) || ''}
              onChange={(e) => updateField(field.id, { defaultValue: e.target.value })}
              className="w-full bg-[#0b1121] border border-slate-700 rounded p-2 text-white focus:border-[#f56c40] focus:outline-none h-10"
              placeholder={`Type default ${field.type}...`}
            />
          )}
        </div>
      ) : (
        <div className="mt-2 space-y-4 border-l-2 border-[#f56c40] pl-4">
          <div className="flex justify-between items-center">
            <h3 className="text-[#f56c40] font-semibold text-sm tracking-widest uppercase">Field Settings</h3>
            <button onClick={() => removeField(field.id)} className="text-slate-500 hover:text-red-400"><Trash2 size={16} /></button>
          </div>

          <div>
            <label className="block text-xs text-slate-400 mb-1">Input Type</label>
            <select
              value={field.type}
              onChange={(e) => updateField(field.id, { type: e.target.value as FieldType })}
              className="w-full bg-[#0b1121] border border-slate-700 text-white p-2 rounded focus:outline-none focus:border-[#f56c40]"
            >
              <option value="text">Short Text</option>
              <option value="textarea">Long Text</option>
              <option value="email">Email</option>
              <option value="tel">Phone Number</option>
              <option value="select">Dropdown Select</option>
              <option value="checkbox">Checkbox</option>
            </select>
          </div>

          {/* Dynamic Options for Select Type */}
          {field.type === 'select' && (
            <div className="bg-[#0b1121] p-3 rounded border border-slate-800 space-y-2">
              <label className="block text-xs text-slate-400 mb-2 font-semibold">Dropdown Options</label>
              {field.options?.map((opt) => (
                <div key={opt.id} className="flex gap-2">
                  <input
                    type="text"
                    value={opt.label}
                    onChange={(e) => handleOptionChange(opt.id, e.target.value)}
                    className="flex-1 bg-[#121a2f] border border-slate-700 text-white p-1.5 text-sm rounded focus:outline-none focus:border-[#f56c40]"
                  />
                  <button onClick={() => handleRemoveOption(opt.id)} className="text-slate-500 hover:text-red-400 shrink-0"><X size={16} /></button>
                </div>
              ))}
              <button onClick={handleAddOption} className="text-[#f56c40] hover:text-white text-xs font-medium flex items-center gap-1 mt-2">
                <Plus size={14} /> Add Option
              </button>
            </div>
          )}

          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id={`req-${field.id}`}
              checked={field.validation}
              onChange={(e) => updateField(field.id, { validation: e.target.checked })}
              className="w-4 h-4 accent-[#f56c40]"
            />
            <label htmlFor={`req-${field.id}`} className="text-sm text-slate-300">Required Field</label>
          </div>

          <div className="flex justify-end pt-4 border-t border-slate-800">
            <button
              onClick={() => setIsEditingSettings(false)}
              className="bg-[#f56c40] text-white px-6 py-2 rounded font-medium hover:bg-[#e05a30] transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
};