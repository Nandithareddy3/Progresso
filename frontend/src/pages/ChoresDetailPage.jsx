
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from './ChoresDetailPage.module.css';
import { motion } from 'framer-motion';
import assignmentService from '../services/assignmentService';

const ChoresDetailPage = () => {
    const [assignments, setAssignments] = useState([]);
    const { token } = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        assignmentService.getMyAssignments(token).then(setAssignments);
    }, [token]);

    return (
        <motion.div layoutId="chores-card" className={styles.detailContainer}>
            <div className={styles.detailHeader} transition={{ duration: 0.5, ease: "easeInOut" }}
            >
                <motion.h2>All Active Chores</motion.h2>
                <Link to="/dashboard" className={styles.backLink}>← Back to Dashboard</Link>
            </div>
            {assignments.filter(a => !a.isComplete).map((assignment) => (
                <motion.div key={assignment._id} className={styles.assignmentItem}>
                    <span>{assignment.chore.name}</span>
                    <div className={styles.choreActions}>
                        <strong>{assignment.chore.points} pts</strong>
                    </div>
                </motion.div>
            ))
            }
        </motion.div>
    );
};
export default ChoresDetailPage;