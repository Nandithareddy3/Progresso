

import styles from './Sidebar.module.css';
import { NavLink, useNavigate } from 'react-router-dom';
import authService from '../services/authService';

const Sidebar = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        authService.logout();
        navigate('/login');
    };

    return (
        <aside className={styles.sidebar}>
            <div className={styles.logo}>Progresso</div>
            <nav className={styles.nav}>
                <ul className={styles.navList}>
                    <li className={styles.navItem}>
                        <NavLink to="/dashboard">Dashboard</NavLink>
                    </li>

                </ul>
            </nav>
            <button onClick={handleLogout} className={styles.logoutButton}>
                Logout
            </button>
        </aside>
    );
};

export default Sidebar;