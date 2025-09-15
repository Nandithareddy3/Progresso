
import { useState } from 'react';
import styles from './Form.module.css';
import { toast } from 'react-toastify';
import choreService from '../services/choreService';

const AddChoreForm = ({ onChoreAdded }) => {
    const [formData, setFormData] = useState({ name: '', points: '' });
    const { name, points } = formData;
    const { token } = JSON.parse(localStorage.getItem('user'));

    const onChange = (e) => {
        setFormData((prevState) => ({ ...prevState, [e.target.name]: e.target.value }));
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        try {
            await choreService.createChore({ name, points: Number(points) }, token);
            toast.success('Chore added to the bank!');
            onChoreAdded();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to add chore');
        }
    };

    return (
        <form className={styles.form} onSubmit={onSubmit}>
            <h3>Add a New task to the Bank</h3>
            <div className={styles.inputGroup}>
                <label htmlFor="name">Task Name</label>
                <input type="text" id="name" name="name" value={name} onChange={onChange} required />
            </div>
            <div className={styles.inputGroup}>
                <label htmlFor="points">Points Value</label>
                <input type="number" id="points" name="points" value={points} onChange={onChange} required />
            </div>
            <button type="submit" className={styles.submitButton}>Add Task</button>
        </form>
    );
};

export default AddChoreForm;