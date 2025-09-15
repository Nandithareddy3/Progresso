import { useState, useEffect } from 'react';
import styles from './LeaderboardDetailPage.module.css';
import householdService from '../services/householdService';
import { motion } from 'framer-motion';

const LeaderboardDetailPage = () => {
    const [leaderboard, setLeaderboard] = useState([]);
    const { token } = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        householdService.getLeaderboard(token).then(setLeaderboard);
    }, [token]);

    return (
        <motion.div
            className={styles.pageContainer}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <h1 className={styles.pageHeader}>Leaderboard</h1>
            <div>
                {leaderboard.map((entry) => (
                    <div key={entry.userId} className={styles.userRow}>
                        <div className={styles.avatar}></div>
                        <div className={styles.name}>{entry.userName}</div>
                        <div className={styles.points}>{entry.totalPoints} Points</div>
                        <div className={styles.progressBar}>
                            <div
                                className={styles.progress}
                                style={{ width: `${(entry.totalPoints / 200) * 100}%` }}
                            ></div>
                        </div>
                    </div>
                ))}
            </div>
        </motion.div>
    );
};

export default LeaderboardDetailPage;