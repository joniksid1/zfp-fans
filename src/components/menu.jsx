import { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

const BurgerMenu = ({ switchToSettings, switchToForm, switchToInfo, switchToResults }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = (event) => {
    // Проверяем, был ли клик вне меню
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  const handleEscapeClose = (event) => {
    if (event.key === 'Escape') {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('click', closeMenu);
    document.addEventListener('keydown', handleEscapeClose);

    // Убираем обработчики событий при размонтировании компонента

    return () => {
      document.removeEventListener('click', closeMenu);
      document.removeEventListener('keydown', handleEscapeClose);
    };
  }, []);

  return (
    <div className="burger" ref={menuRef}>
      <button className="burger__button" onClick={toggleMenu}>
        ☰
      </button>
      {isOpen && (
        <div className="burger__items">
            <a className='burger__link' onClick={switchToInfo}>Информация</a>
            <a className='burger__link' onClick={switchToSettings}>Настройки</a>
            <a className='burger__link' onClick={switchToForm}>Расчёт</a>
            <a className='burger__link' onClick={switchToResults}>Результаты расчёта</a>
        </div>
      )}
    </div>
  );
};

BurgerMenu.propTypes = {
  switchToSettings: PropTypes.func,
  switchToForm: PropTypes.func,
  switchToInfo: PropTypes.func,
  switchToResults: PropTypes.func,
};

export default BurgerMenu;
