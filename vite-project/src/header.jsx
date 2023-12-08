import logo from '../images/header-logo.svg';

function Header() {
  return (
    <header className="header">
      <div className='header__wrapper'>
        <img
          src={logo}
          alt="Логотип компании Зилон"
          className="header__logo"
        />
      </div>
    </header>
  );
}

export default Header;
