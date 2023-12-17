import { useState } from 'react';
import PropTypes from 'prop-types';

const BurgerMenu = ({ switchToSettings, switchToForm, switchToInfo }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="burger">
      <button className="burger__button" onClick={toggleMenu}>
        ☰
      </button>
      {isOpen && (
        <div className="burger__items">
            <a className='burger__link' onClick={switchToInfo}>Информация</a>
            <a className='burger__link' onClick={switchToSettings}>Настройки</a>
            <a className='burger__link' onClick={switchToForm}>Расчёт</a>
        </div>
      )}
    </div>
  );
};

BurgerMenu.propTypes = {
  switchToSettings: PropTypes.func,
  switchToForm: PropTypes.func,
  switchToInfo: PropTypes.func,
};

export default BurgerMenu;
