import { Provider } from 'react-redux';
import { store } from './store';
import Router from './Router';
import { Toaster } from 'react-hot-toast';
import ClickSpark from './components/ui/ClickSpark';
import CustomCursor from './components/ui/CustomCursor';
import CommandPalette from './components/ui/CommandPalette';
import './App.css';

function App() {
  return (
    <Provider store={store}>
      <CustomCursor />
      <CommandPalette />
      <Toaster 
        position="bottom-right" 
        toastOptions={{ 
          duration: 4000, 
          style: { 
            background: 'rgba(15, 23, 42, 0.75)', 
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            color: '#fff', 
            borderRadius: '16px', 
            fontWeight: 700,
            border: '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: '0 10px 40px -10px rgba(0,0,0,0.5)',
            padding: '16px 24px',
          } 
        }} 
      />
      <ClickSpark sparkColor="#00ffff" sparkCount={6} sparkRadius={20} sparkSize={8} duration={350}>
        <Router />
      </ClickSpark>
    </Provider>
  );
}

export default App;
