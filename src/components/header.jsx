import logo from '../images/header-logo.svg';
import BurgerMenu from './menu';
import PropTypes from 'prop-types';

function Header({ switchToSettings, switchToForm, switchToInfo, switchToResults, view }) {

  return (
    <header className="header">
      <div className='header__wrapper'>
        <img
          src={logo}
          alt="Логотип компании Зилон"
          className="header__logo"
        />
        <h1 className="header__title" aria-label="Расчёт вентилятора">
          {(view === 'form')
            ? 'Расчёт крышного вентилятора'
            :
            (view === 'settings') ? 'Дополнительные настройки'
              :
              (view === 'info') ? 'Информация'
                :
                (view === 'results') ? 'Результаты расчёта'
                  : 'Расчёт крышного вентилятора'
          }
        </h1>
      </div>
      <BurgerMenu
        switchToSettings={switchToSettings}
        switchToForm={switchToForm}
        switchToInfo={switchToInfo}
        switchToResults={switchToResults}
      />
    </header>
  );
}

Header.propTypes = {
  switchToSettings: PropTypes.func,
  switchToForm: PropTypes.func,
  switchToInfo: PropTypes.func,
  switchToResults: PropTypes.func,
  view: PropTypes.string,
};

export default Header;
