import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import styles from './DashboardPage.module.css';
import choreService from '../services/choreService';

const ChoreBankDetailPage = () => {
    const [chores, setChores] = useState([]);
    const { token } = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        choreService.getHouseholdChores(token).then(setChores);
    }, [token]);

    return (
        <motion.div
            layoutId="chore-bank-card"
            className={styles.card}
            transition={{ duration: 0.5, ease: "easeInOut" }}
        >
            <div className={styles.detailHeader}>
                <motion.h2>Tasks</motion.h2>
                <Link to="/dashboard" className={styles.backLink}>← Back</Link>
            </div>
            {chores.length > 0 ? (
                chores.map((chore) => (
                    <motion.div key={chore._id} className={styles.assignmentItem}>
                        <span>{chore.name}</span>
                        <strong>{chore.points} pts</strong>
                    </motion.div>
                ))
            ) : (<p>No tasks in yet.</p>)}
        </motion.div>
    );
};

export default ChoreBankDetailPage;