import { useMemo, useState } from 'react';
import TopBar from './components/layout/TopBar.jsx';
import Features from './pages/Features.jsx';
import Tables from './pages/Tables.jsx';
import './App.css';

export default function App() {
  const [active, setActive] = useState('features');

  const content = useMemo(() => {
    if (active === 'tables') return <Tables />;
    return <Features />;
  }, [active]);

  return (
    <div className="appShell">
      <TopBar active={active} onChange={setActive} />
      <div className="page">{content}</div>
    </div>
  );
}

