import { NavLink } from 'react-router-dom';
import './NavBar.css';

const NavBar = () => {
  const toggleTheme = () => {
    document.documentElement.classList.toggle('theme-dark');
  };
  return (
    <header className='navbar'>
      <a href='/' className='logo-link'>
        <div className='logo-wrapper'>
          <img src={require('../assets/logo-engaz-gold.png')} alt='ENGAZ' className='logo-gold' />
          <img src={require('../assets/logo-engaz-white.png')} alt='ENGAZ' className='logo-white' style={{ opacity: 0 }} />
        </div>
        <div className='logo-text'>
          <h1>ENGAZ</h1>
          <span>إنجاز للتطوير العقاري</span>
        </div>
      </a>
      <nav className='nav-links'>
        <NavLink to='/' end className={({ isActive }) => isActive ? 'nav-link-active' : undefined}>الرئيسية</NavLink>
        <NavLink to='/projects' className={({ isActive }) => isActive ? 'nav-link-active' : undefined}>مشاريعنا</NavLink>
        <NavLink to='/portfolio' className={({ isActive }) => isActive ? 'nav-link-active' : undefined}>سابقة أعمالنا</NavLink>
        <NavLink to='/about' className={({ isActive }) => isActive ? 'nav-link-active' : undefined}>عن الشركة</NavLink>
        <NavLink to='/contact' className='nav-btn'>تواصل معنا</NavLink>
      </nav>
      <button className='theme-toggle' onClick={toggleTheme}>☀︎/☾</button>
    </header>
  );
};

export default NavBar;

