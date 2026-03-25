import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { GripVertical, AlertCircle } from 'lucide-react';
import { nanoid } from 'nanoid';
import { useBuilderStore } from './store/useBuilderStore';
import { generateCode } from './utils/generateCode';
import type { FieldType } from './types';

const SectionHeader = ({ title }: { title: string }) => (
  <div className="flex items-center justify-center mb-6">
    <div className="h-px bg-slate-700 flex-1"></div>
    <h2 className="text-white text-lg mx-4 tracking-wide whitespace-nowrap">{title}</h2>
    <div className="h-px bg-slate-700 flex-1"></div>
  </div>
);

const InfoText = ({ text }: { text: string }) => (
  <div className="flex items-start gap-2 text-slate-400 text-xs mb-6 leading-relaxed">
    <AlertCircle size={14} className="mt-0.5 shrink-0" />
    <p>{text}</p>
  </div>
);

function App() {
  const { fields, view, addField, removeField, clearFields, setView } = useBuilderStore();
  
  const [fieldName, setFieldName] = useState('');
  const [fieldType, setFieldType] = useState<FieldType>('text');
  const [showValidation, setShowValidation] = useState(false);

  const { register, handleSubmit, watch, formState: { errors, touchedFields } } = useForm();

  const handleCreate = () => {
    if (!fieldName) return;
    addField({ id: nanoid(), name: fieldName, type: fieldType, validation: showValidation });
    setFieldName('');
  };

  if (view === 'preview') {
    return (
      <div className="min-h-screen bg-[#0b1121] text-white p-4 md:p-8 font-sans w-full">
        <div className="w-full mx-auto grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 lg:gap-8">
          
          <div className="flex flex-col h-full">
            <SectionHeader title="Example" />
            <form onSubmit={handleSubmit(d => console.log(d))} className="space-y-4">
              {fields.map(field => (
                <div key={field.id}>
                  {field.type === 'checkbox' ? (
                     <div className="flex justify-center">
                        <input type="checkbox" {...register(field.name, { required: field.validation })} className="w-4 h-4" />
                     </div>
                  ) : field.type === 'select' ? (
                    <select {...register(field.name, { required: field.validation })} className="w-full p-2 bg-white text-white rounded">
                      <option value="">Select...</option>
                      <option value="A">Option A</option>
                    </select>
                  ) : (
                    <input 
                      type={field.type} 
                      placeholder={field.name} 
                      {...register(field.name, { required: field.validation })}
                      className="w-full p-2 rounded text-white outline-none border-2 border-transparent focus:border-[#ec5990]"
                    />
                  )}
                </div>
              ))}
              <button type="submit" className="w-full bg-[#ec5990] text-white py-3 font-semibold tracking-widest mt-4 hover:bg-[#d04374] transition-colors">
                SUBMIT
              </button>
              <div className="flex items-center my-4">
                 <div className="h-1px bg-slate-700 flex-1"></div><span className="text-slate-500 text-xs px-2">or</span><div className="h-[1px] bg-slate-700 flex-1"></div>
              </div>
              <button type="button" onClick={() => setView('builder')} className="w-full border border-[#ec5990] text-white py-3 font-semibold tracking-widest hover:bg-[#ec5990]/10 transition-colors">
                EDIT
              </button>
            </form>
          </div>

          <div className="flex flex-col h-full">
            <SectionHeader title="Watch" />
            <InfoText text="Change inputs value to update watched values" />
            <pre className="text-[#a6e22e] text-sm overflow-x-auto bg-[#0d1526] p-4 rounded border border-slate-800 flex-1">
              {JSON.stringify(watch(), null, 2)}
            </pre>
          </div>

          <div className="flex flex-col h-full">
            <SectionHeader title="Errors" />
            <InfoText text="Validation errors will appear here" />
            <pre className="text-[#f92672] text-sm overflow-x-auto bg-[#0d1526] p-4 rounded border border-slate-800 flex-1">
              {JSON.stringify(errors, null, 2)}
            </pre>
          </div>

          <div className="flex flex-col h-full">
            <SectionHeader title="Touched" />
            <InfoText text="Touched fields will display here" />
            <pre className="text-[#e6db74] text-sm overflow-x-auto bg-[#0d1526] p-4 rounded border border-slate-800 flex-1">
              {JSON.stringify(touchedFields, null, 2)}
            </pre>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0b1121] text-white p-4 md:p-8 font-sans w-full">
      <div className="text-center mb-10 shrink-0">
        <h1 className="text-4xl font-bold mb-2">Form Builder</h1>
        <p className="text-[#ec5990] text-sm">Build your form with code and example.</p>
      </div>

      <div className="w-full mx-auto grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8 xl:gap-12">
        
        <div className="flex flex-col h-full">
          <SectionHeader title="Layout" />
          <InfoText text="You can start adding fields with Input Creator." />
          <div className="space-y-3 flex-1">
            {fields.map((field) => (
              <div key={field.id} className="flex items-center justify-between border border-slate-700 rounded p-2 bg-[#121a2f]">
                <div className="flex items-center gap-3 overflow-hidden">
                  <GripVertical size={16} className="text-slate-500 cursor-grab shrink-0" />
                  <span className="text-sm truncate">{field.name}</span>
                </div>
                <div className="flex gap-2 shrink-0 ml-2">
                  <button className="bg-slate-700 hover:bg-slate-600 text-xs px-3 py-1 rounded text-slate-200 transition-colors">EDIT</button>
                  <button onClick={() => removeField(field.id)} className="bg-slate-700 hover:bg-slate-600 text-xs px-3 py-1 rounded text-slate-200 transition-colors">DELETE</button>
                </div>
              </div>
            ))}
            
            {fields.length > 0 && (
              <div className="flex justify-end gap-2 mt-4">
                <button className="bg-slate-700 hover:bg-slate-600 text-xs px-4 py-2 rounded font-semibold transition-colors">RESET</button>
                <button onClick={clearFields} className="bg-slate-700 hover:bg-slate-600 text-xs px-4 py-2 rounded font-semibold transition-colors">DELETE ALL</button>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col h-full">
          <SectionHeader title="Input Creator" />
          <InfoText text="This form allows you to create and update inputs. The Generate Form button will create a new form with the updates." />
          
          <div className="space-y-5">
            <div>
              <label className="block text-sm mb-1 text-slate-300">Name:</label>
              <input 
                type="text" 
                value={fieldName}
                onChange={(e) => setFieldName(e.target.value)}
                className="w-full p-2 rounded text-white outline-none border-2 border-gray-600 focus:border-[#ec5990]" 
              />
            </div>
            
            <div>
              <label className="block text-sm mb-1 text-slate-300">Type:</label>
              <select 
                value={fieldType}
                onChange={(e) => setFieldType(e.target.value as FieldType)}
                className="w-full p-2 rounded text-white outline-none border-2 border-gray-600 focus:border-[#ec5990]"
              >
                <option value="text">Text</option>
                <option value="email">Email</option>
                <option value="tel">Mobile number</option>
                <option value="checkbox">Checkbox</option>
                <option value="select">Select</option>
              </select>
            </div>
            
            <div className="flex items-center gap-2">
              <input 
                type="checkbox" 
                id="validation" 
                checked={showValidation}
                onChange={(e) => setShowValidation(e.target.checked)}
                className="w-4 h-4 accent-[#ec5990]"
              />
              <label htmlFor="validation" className="text-sm text-slate-300">Show validation</label>
            </div>

            <button onClick={handleCreate} className="w-full bg-[#ec5990] text-white py-3 rounded-sm font-semibold tracking-widest mt-4 hover:bg-[#d04374] transition-colors">
              CREATE
            </button>
            
            <div className="flex items-center my-4">
               <div className="h-[1px] bg-slate-800 flex-1"></div><span className="text-slate-500 text-xs px-2">or</span><div className="h-[1px] bg-slate-800 flex-1"></div>
            </div>

            <button onClick={() => setView('preview')} className="w-full border border-[#ec5990] text-[#ec5990] py-3 rounded-sm font-semibold tracking-widest hover:bg-[#ec5990]/10 transition-colors">
              GENERATE FORM
            </button>
          </div>
        </div>

        <div className="flex flex-col h-full">
          <SectionHeader title="Code" />
          <InfoText text="As you are making changes over the form, the code section will be updated and you can copy the code as well." />
          
          <div className="relative bg-[#0d1526] p-4 rounded border border-slate-800 flex-1 overflow-x-auto min-h-[400px]">
            <button 
              onClick={() => navigator.clipboard.writeText(generateCode(fields))}
              className="absolute top-4 right-4 bg-slate-700 hover:bg-slate-600 text-xs px-3 py-1 rounded text-slate-200 transition-colors"
            >
              COPY
            </button>
            <pre className="text-sm font-mono leading-relaxed mt-8">
              <code className="text-[#a6e22e]">{generateCode(fields)}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;