import '../index.css';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './header';
import Main from './main';
import Footer from './footer';

function App() {
  const [view, setView] = useState('form');

  const navigate = useNavigate();

  const switchToInfo = () => {
    navigate('/info');
    setView('info');
  };

  const switchToSettings = () => {
    navigate('/');
    setView('settings');
  };

  const switchToForm = () => {
    navigate('/');
    setView('form');
  };

  const switchToResults = () => {
    navigate('/results');
    setView('results');
  };

  useEffect(() => {
    navigate('/');
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[]);

  return (
    <>
      <Header
        switchToSettings={switchToSettings}
        switchToForm={switchToForm}
        switchToInfo={switchToInfo}
        switchToResults={switchToResults}
        view={view}
      />
      <Main view={view} />
      <Footer />
    </>
  )
}

export default App
