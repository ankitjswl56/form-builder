import React, { useRef, useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useDrag, useDrop } from 'react-dnd';
import { GripHorizontal, Trash2, Plus, Code, Settings, Eye, PenTool, X } from 'lucide-react';
import { nanoid } from 'nanoid';
import { useBuilderStore } from './store/useBuilderStore';
import { generateCode } from './utils/generateCode';
import type { FormField, FieldType } from './types';

interface SortableFieldProps {
  field: FormField;
  index: number;
}

const SortableField: React.FC<SortableFieldProps> = ({ field, index }) => {
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
              <input 
                type="text" 
                value={field.name}
                onChange={(e) => updateField(field.id, { name: e.target.value })}
                className="bg-transparent border-b border-transparent hover:border-slate-600 focus:border-[#f56c40] text-white font-medium focus:outline-none px-1 py-0.5 -ml-1 transition-colors w-fit min-w-[120px]"
                placeholder="Enter field name..."
              />
              {field.validation && <span className="text-[#f56c40] ml-1">*</span>}
            </div>
            <div className="flex gap-2 relative z-10 shrink-0">
              <button onClick={() => setIsEditingSettings(true)} className="text-slate-400 hover:text-white transition-colors"><Settings size={18} /></button>
              <button onClick={() => removeField(field.id)} className="text-slate-400 hover:text-red-400 transition-colors"><Trash2 size={18} /></button>
            </div>
          </div>
          
          {field.type === 'textarea' ? (
            <textarea
              value={(field.defaultValue as string) || ''}
              onChange={(e) => updateField(field.id, { defaultValue: e.target.value })}
              className="w-full bg-[#0b1121] border border-slate-700 rounded p-2 text-white focus:border-[#f56c40] focus:outline-none min-h-[160px]"
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
            <button onClick={() => setIsEditingSettings(false)} className="bg-[#f56c40] text-white px-6 py-2 rounded font-medium hover:bg-[#e05a30] transition-colors">Done</button>
          </div>
        </div>
      )}
    </div>
  );
};

const Header = () => {
  const { fields, view, setView, clearFields } = useBuilderStore();

  return (
    <div className="sticky top-0 z-50 bg-[#0b1121]/90 backdrop-blur border-b border-slate-800">
      <div className="max-w-4xl mx-auto p-4 flex flex-col md:flex-row gap-4 justify-between items-center">
        <h1 className="text-xl font-bold text-white">Form Builder</h1>
        <div className="flex bg-[#121a2f] p-1 rounded-lg border border-slate-800">
          <button onClick={() => setView('builder')} className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${view === 'builder' ? 'bg-[#f56c40] text-white' : 'text-slate-400 hover:text-white'}`}><PenTool size={16} /> Editor</button>
          <button onClick={() => setView('preview')} className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${view === 'preview' ? 'bg-[#f56c40] text-white' : 'text-slate-400 hover:text-white'}`}><Eye size={16} /> Preview</button>
          <button onClick={() => setView('code')} className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${view === 'code' ? 'bg-[#f56c40] text-white' : 'text-slate-400 hover:text-white'}`}><Code size={16} /> Code</button>
        </div>
        {fields.length > 0 && view === 'builder' ? (
          <button onClick={clearFields} className="text-xs text-slate-500 hover:text-red-400 transition-colors">Clear All</button>
        ) : <div className="w-12"></div>}
      </div>
    </div>
  );
};

export default function App() {
  const { fields, view, addField } = useBuilderStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [submittedData, setSubmittedData] = useState<Record<string, unknown> | null>(null);

  const { register, handleSubmit, formState: { errors } } = useForm();

  useEffect(() => {
    const closeMenu = () => setIsMenuOpen(false);
    if (isMenuOpen) document.addEventListener('click', closeMenu);
    return () => document.removeEventListener('click', closeMenu);
  }, [isMenuOpen]);

  const handleAddField = (type: FieldType) => {
    addField({ 
      id: nanoid(), 
      name: `New ${type}`, 
      type, 
      validation: false,
      options: type === 'select' ? [{ id: nanoid(), label: 'Option 1', value: 'option-1' }] : []
    });
    setIsMenuOpen(false);
    setTimeout(() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' }), 50);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(generateCode(fields));
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000); 
  };

  return (
    <div className="min-h-screen bg-[#0b1121] text-white font-sans pb-32">
      <Header />

      {view === 'code' && (
        <div className="max-w-4xl mx-auto mt-10 px-4">
          <div className="relative bg-[#121a2f] p-6 rounded-lg border border-slate-800 overflow-x-auto min-h-[500px]">
            <button onClick={handleCopyCode} className="absolute top-4 right-4 bg-[#f56c40] hover:bg-[#e05a30] text-xs px-4 py-2 rounded text-white font-medium transition-colors">COPY CODE</button>
            <pre className="text-sm font-mono leading-relaxed mt-8 text-[#a6e22e] text-left">{generateCode(fields)}</pre>
          </div>
        </div>
      )}

      {view === 'preview' && (
        <div className="max-w-4xl mx-auto mt-10 px-4 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-[#121a2f] p-6 rounded-lg border border-slate-800 h-fit text-left">
            <h2 className="text-lg font-bold text-white mb-6 border-b border-slate-700 pb-2 text-left">Form Preview</h2>
            <form onSubmit={handleSubmit(setSubmittedData)} className="space-y-4">
              {fields.map(f => (
                <div key={f.id} className="flex flex-col gap-1">
                  {f.type === 'checkbox' ? (
                    <div className="flex items-center gap-3 py-2">
                      <input type="checkbox" id={f.id} defaultChecked={f.defaultValue as boolean} {...register(f.name, { required: f.validation })} className="w-4 h-4 accent-[#f56c40]" />
                      <label htmlFor={f.id} className="text-sm font-medium">{f.name} {f.validation && <span className="text-[#f56c40]">*</span>}</label>
                    </div>
                  ) : (
                    <>
                      <label className="text-sm font-medium text-slate-300 flex items-center">
                        {f.name} {f.validation && <span className="text-[#f56c40] ml-1">*</span>}
                      </label>
                      {f.type === 'textarea' ? (
                        <textarea defaultValue={f.defaultValue as string} {...register(f.name, { required: f.validation })} className="w-full bg-[#0b1121] border border-slate-700 rounded p-2 text-white focus:border-[#f56c40] focus:outline-none min-h-[160px]" />
                      ) : f.type === 'select' ? (
                        <select defaultValue={f.defaultValue as string} {...register(f.name, { required: f.validation })} className="w-full bg-[#0b1121] border border-slate-700 rounded p-2 text-white focus:border-[#f56c40] focus:outline-none">
                          <option value="">Select...</option>
                          {f.options?.map(opt => <option key={opt.id} value={opt.value}>{opt.label}</option>)}
                        </select>
                      ) : (
                        <input type={f.type} defaultValue={f.defaultValue as string} {...register(f.name, { required: f.validation })} className="w-full bg-[#0b1121] border border-slate-700 rounded p-2 text-white focus:border-[#f56c40] focus:outline-none" />
                      )}
                    </>
                  )}
                  {errors[f.name] && <span className="text-red-400 text-xs mt-1">This field is required</span>}
                </div>
              ))}
              <button type="submit" className="w-full bg-[#f56c40] hover:bg-[#e05a30] text-white font-medium py-2 rounded transition-colors mt-4">Test Submission</button>
            </form>
          </div>

          <div className="bg-[#121a2f] p-6 rounded-lg border border-slate-800 h-fit text-left">
            <h2 className="text-lg font-bold text-white mb-6 border-b border-slate-700 pb-2 text-left">Submission Output</h2>
            {submittedData ? (
              <pre className="text-sm font-mono text-[#a6e22e] overflow-auto text-left">{JSON.stringify(submittedData, null, 2)}</pre>
            ) : <p className="text-slate-500 text-sm">Submit the form to see output payload.</p>}
          </div>
        </div>
      )}

      {view === 'builder' && (
        <div className="max-w-3xl mx-auto mt-10 px-4 space-y-4">
          {fields.map((field, index) => <SortableField key={field.id} field={field} index={index} />)}
          
          <div className="relative flex justify-end pt-4 pb-8">
            <button onClick={(e) => { e.stopPropagation(); setIsMenuOpen(!isMenuOpen); }} className="flex items-center gap-2 bg-[#f56c40] hover:bg-[#e05a30] text-white px-4 py-2 rounded-md font-medium shadow-md transition-colors"><Plus size={16} /> Add Field</button>
            
            {/* Dropdown now opens downwards */}
            {isMenuOpen && (
              <div className="absolute top-full right-0 mt-2 w-48 bg-[#121a2f] border border-slate-700 rounded-lg shadow-2xl overflow-hidden animate-in slide-in-from-top-2 z-50">
                <div className="p-2">
                  {[{ type: 'text', label: 'Short Text' }, { type: 'textarea', label: 'Long Text' }, { type: 'email', label: 'Email Address' }, { type: 'tel', label: 'Phone Number' }, { type: 'select', label: 'Dropdown Select' }, { type: 'checkbox', label: 'Checkbox' }].map((item) => (
                    <button key={item.type} onClick={() => handleAddField(item.type as FieldType)} className="w-full text-left px-4 py-2.5 text-sm text-white hover:bg-[#0b1121] hover:text-[#f56c40] rounded transition-colors">{item.label}</button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {showToast && <div className="fixed bottom-10 left-1/2 -translate-x-1/2 bg-[#f56c40] text-white px-6 py-3 rounded-md shadow-xl font-medium animate-in z-50">Code copied to clipboard!</div>}
    </div>
  );
}