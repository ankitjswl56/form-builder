import type { FormField } from '../types';

export const generateCode = (fields: FormField[]) => {
  let inputs = '';
  const inputClass = `className="w-full bg-[#121a2f] border border-slate-700 text-white p-3 rounded-md focus:outline-none focus:border-[#f56c40] placeholder-slate-500 mb-4"`;

  fields.forEach(f => {
    const requiredStr = f.validation ? `, { required: true }` : '';
    const defaultVal = f.defaultValue ? ` defaultValue="${f.defaultValue}"` : '';
    const defaultChecked = f.defaultValue ? ` defaultChecked` : '';
    
    if (f.type === 'select') {
      const optionsHtml = f.options?.map(opt => `\n          <option value="${opt.value}">${opt.label}</option>`).join('') || '';
      inputs += `\n        <select {...register("${f.name}"${requiredStr})} ${inputClass}${defaultVal}>\n          <option value="">Select ${f.name}...</option>${optionsHtml}\n        </select>`;
    } else if (f.type === 'textarea') {
      inputs += `\n        <textarea placeholder="${f.name}" {...register("${f.name}"${requiredStr})} ${inputClass} rows={4}${defaultVal} />`;
    } else if (f.type === 'checkbox') {
      inputs += `\n        <div className="flex items-center gap-3 mb-4">\n          <input type="checkbox" id="${f.id}" {...register("${f.name}"${requiredStr})} className="w-5 h-5 accent-[#f56c40]"${defaultChecked} />\n          <label htmlFor="${f.id}" className="text-white font-medium">${f.name}</label>\n        </div>`;
    } else {
      inputs += `\n        <input type="${f.type}" placeholder="${f.name}" {...register("${f.name}"${requiredStr})} ${inputClass}${defaultVal} />`;
    }
  });

  return `import React from 'react';
import { useForm } from 'react-hook-form';

export default function GeneratedForm() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  
  const onSubmit = (data) => console.log("Form Submitted:", data);

  return (
    <div className="min-h-screen bg-[#0b1121] p-8 font-sans">
      <div className="max-w-md mx-auto bg-[#0d1526] p-8 rounded-xl border border-slate-800 shadow-2xl">
        <h2 className="text-2xl font-bold text-white mb-6">Generated Form</h2>
        <form onSubmit={handleSubmit(onSubmit)}>${inputs}
          <button type="submit" className="w-full bg-[#f56c40] text-white py-3 rounded-md font-bold hover:bg-[#e05a30] transition-colors mt-4">
            SUBMIT FORM
          </button>
        </form>
      </div>
    </div>
  );
}`;
};