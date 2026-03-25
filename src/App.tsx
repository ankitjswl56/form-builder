import { Sidebar } from './components/Builder/Sidebar';
import { Canvas } from './components/Builder/Canvas';

function App() {
  return (
    <div className="flex h-screen w-full bg-gray-100 font-sans text-gray-900 overflow-hidden">
      <Sidebar />
      <Canvas />
    </div>
  );
}

export default App;