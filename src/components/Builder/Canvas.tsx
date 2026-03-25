import { useDrop } from 'react-dnd';
import { nanoid } from 'nanoid';
import { useBuilderStore } from '../../store/useBuilderStore';
import type { DragItem } from '../../types';

export const Canvas = () => {
  const { fields, addField } = useBuilderStore();

  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'FORM_FIELD',
    drop: (item: DragItem) => {
      addField({
        id: nanoid(),
        type: item.type,
        name: `New ${item.type}`,
        validation: false,       
      });
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  return (
    <div className="flex-1 overflow-y-auto p-8 flex justify-center">
      <div
        ref={(node) => { drop(node); }}
        className={`w-full max-w-3xl min-h-[600px] bg-white rounded-lg shadow-md border-2 transition-all duration-200 p-8 ${
          isOver ? 'border-blue-500 bg-blue-50/50' : 'border-transparent'
        }`}
      >
        {fields.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-gray-400 border-2 border-dashed border-gray-200 rounded-lg">
            <p className="text-lg font-medium">Drop fields here to build your form</p>
            <p className="text-sm">Select a tool from the left panel</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {fields.map((field) => (
              <div 
                key={field.id} 
                className="p-4 border border-gray-200 rounded-md bg-white hover:border-blue-300 transition-colors group relative"
              >
                <div className="flex items-center justify-between mb-2">
                  <label className="font-semibold text-gray-800">{field.name}</label>
                  <span className="text-xs font-mono text-gray-400 bg-gray-100 px-2 py-1 rounded">
                    {field.type}
                  </span>
                </div>
                <div className="h-10 w-full bg-gray-50 border border-gray-200 rounded pointer-events-none"></div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};