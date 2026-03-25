import type { FormField } from '../types';

export const generateCode = (fields: FormField[]) => {
  let inputs = '';
  fields.forEach(f => {
    const requiredStr = f.validation ? `, { required: true }` : '';
    if (f.type === 'select') {
      inputs += `\n      <select {...register("${f.name}"${requiredStr})}>\n        <option value="A">Option A</option>\n      </select>`;
    } else {
      inputs += `\n      <input type="${f.type}" placeholder="${f.name}" {...register("${f.name}"${requiredStr})} />`;
    }
  });

  return `import React from 'react';
import { useForm } from 'react-hook-form';

export default function App() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const onSubmit = data => console.log(data);
  console.log(errors);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>${inputs}
      <input type="submit" />
    </form>
  );
}`;
};