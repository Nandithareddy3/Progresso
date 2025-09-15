import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Form.module.css';
import { toast } from 'react-toastify';
import householdService from '../services/householdService';
import userService from '../services/userService';

const CreateHousehold = () => {
    const [name, setName] = useState('');
    const navigate = useNavigate();

    const onSubmit = async (e) => {
        e.preventDefault();
        try {
            const originalUser = JSON.parse(localStorage.getItem('user'));
            if (!originalUser?.token) throw new Error('No token found');

            const updatedUserWithHousehold = await householdService.createHousehold({ name }, originalUser.token);
            toast.success(`Household "${updatedUserWithHousehold.household.name}" created!`);

            // Merge the original user (with token) and the new user data
            const mergedUser = { ...originalUser, ...updatedUserWithHousehold };
            localStorage.setItem('user', JSON.stringify(mergedUser));

            navigate('/dashboard');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Could not create household');
        }
    };

    return (
        <form className={styles.form} onSubmit={onSubmit}>
            <h3>Create a New Household</h3>
            <div className={styles.inputGroup}>
                <label htmlFor="name">Household Name</label>
                <input type="text" id="name" name="name" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <button type="submit" className={styles.submitButton}>Create</button>
        </form>
    );
};
export default CreateHousehold;