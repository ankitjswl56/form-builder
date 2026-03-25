import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { LingoProviderWrapper, loadDictionary } from 'lingo.dev/react/client';

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <LingoProviderWrapper 
      loadDictionary={(locale: string | null) => loadDictionary(locale || 'en')}
    >
      <DndProvider backend={HTML5Backend}>
        {children}
      </DndProvider>
    </LingoProviderWrapper>
  );
};