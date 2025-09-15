
import { useState } from 'react';
import styles from './Form.module.css';
import { toast } from 'react-toastify';
import assignmentService from '../services/assignmentService';

const AssignChoreForm = ({ chores, members, onAssignmentCreated }) => {
    const [choreId, setChoreId] = useState('');
    const [assignedToUserId, setAssignedToUserId] = useState('');
    const [dueDate, setDueDate] = useState('');
    const { token } = JSON.parse(localStorage.getItem('user'));

    const onSubmit = async (e) => {
        e.preventDefault();
        try {
            await assignmentService.createAssignment({ choreId, assignedToUserId, dueDate }, token);
            toast.success('Chore assigned!');
            console.log("LOG 1: Telling the dashboard to refresh...");
            onAssignmentCreated();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to assign chore');
        }
    };

    return (
        <form className={styles.form} onSubmit={onSubmit}>
            <h3>Assign a Task</h3>
            <div className={styles.inputGroup}>
                <label htmlFor="choreId">Task</label>
                <select id="choreId" value={choreId} onChange={(e) => setChoreId(e.target.value)} required>
                    <option value="" disabled>Select a Task</option>
                    {chores.map(chore => (
                        <option key={chore._id} value={chore._id}>
                            {chore.name} ({chore.points} pts)
                        </option>
                    ))}
                </select>
            </div>

            <div className={styles.inputGroup}>
                <label htmlFor="assignedToUserId">Assign To</label>
                <select id="assignedToUserId" value={assignedToUserId} onChange={(e) => setAssignedToUserId(e.target.value)} required>
                    <option value="" disabled>Select a member</option>
                    {members.map(member => (
                        <option key={member._id} value={member._id}>
                            {member.name}
                        </option>
                    ))}
                </select>
            </div>

            <div className={styles.inputGroup}>
                <label htmlFor="dueDate">Due Date</label>
                <input type="date" id="dueDate" value={dueDate} onChange={(e) => setDueDate(e.target.value)} required />
            </div>

            <button type="submit" className={styles.submitButton}>Assign Chore</button>
        </form>
    );
};
export default AssignChoreForm;