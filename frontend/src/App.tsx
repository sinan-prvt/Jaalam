import { Provider } from 'react-redux';
import { store } from './store';
import Router from './Router';
import { Toaster } from 'react-hot-toast';
import ClickSpark from './components/ui/ClickSpark';
import './App.css';

function App() {
  return (
    <Provider store={store}>
      <Toaster position="bottom-right" toastOptions={{ duration: 4000, style: { background: '#1e293b', color: '#fff', borderRadius: '12px', fontWeight: 600 } }} />
      <ClickSpark sparkColor="#00ffff" sparkCount={6} sparkRadius={20} sparkSize={8} duration={350}>
        <Router />
      </ClickSpark>
    </Provider>
  );
}

export default App;
