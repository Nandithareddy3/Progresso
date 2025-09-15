import styles from './Navbar.module.css';
import { NavLink } from 'react-router-dom';

const Navbar = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    return (
        <nav className={styles.navbar}>
            <div className={styles.logo}>Progresso</div>
            <div className={styles.navLinks}>
                <NavLink to="/dashboard">Dashboard</NavLink>
                <NavLink to="/leaderboard">Leaderboard</NavLink>
                <NavLink to="/profile">Profile</NavLink>
            </div>
            <div className={styles.profile}>
                <span>{user?.name}</span>
            </div>
        </nav>
    );
};
export default Navbar;