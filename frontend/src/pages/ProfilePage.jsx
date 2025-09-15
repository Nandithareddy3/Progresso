import { useState, useEffect } from 'react';
import styles from './ProfilePage.module.css';
import userService from '../services/userService';
import assignmentService from '../services/assignmentService';

const ProfilePage = () => {
    const [stats, setStats] = useState({ totalPoints: 0, tasksCompleted: 0 });
    const [history, setHistory] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const user = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [statsData, historyData] = await Promise.all([
                    userService.getUserStats(user.token),
                    assignmentService.getAssignmentHistory(user.token)
                ]);
                setStats(statsData);
                setHistory(historyData);
            } catch (error) {
                console.error("Failed to fetch profile data", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [user.token]);

    const level = Math.floor(stats.totalPoints / 100) + 1;

    if (isLoading) return <h2>Loading profile...</h2>

    return (
        <div className={styles.profilePage}>
            <div className={styles.leftColumn}>
                <div className={styles.profileCard}>
                    <div className={styles.avatar}></div>
                    <h2>{user.name}</h2>
                    <p>Level {level}</p>
                </div>
                <div className={styles.statsCard}>
                    <div><span>Points</span><strong>{stats.totalPoints}</strong></div>
                    <div><span>Tasks Completed</span><strong>{stats.tasksCompleted}</strong></div>
                </div>
            </div>
            <div className={styles.rightColumn}>
                <div className={styles.historyCard}>
                    <h2>Tasks History</h2>
                    {history.length > 0 ? (
                        history.map(item => (
                            <div key={item._id} className={styles.historyRow}>
                                <span>{item.chore.name}</span>
                                <span className={styles.historyDate}>
                                    {new Date(item.updatedAt).toLocaleDateString()}
                                </span>
                                <strong className={styles.historyPoints}>+{item.chore.points} pts</strong>
                            </div>
                        ))
                    ) : (
                        <p>You haven't completed any tasks yet.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;