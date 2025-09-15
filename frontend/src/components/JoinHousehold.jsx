import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Form.module.css';
import { toast } from 'react-toastify';
import householdService from '../services/householdService';
import userService from '../services/userService';

const JoinHousehold = () => {
    const [inviteCode, setInviteCode] = useState('');
    const navigate = useNavigate();

    const onSubmit = async (e) => {
        e.preventDefault();
        try {
            const originalUser = JSON.parse(localStorage.getItem('user'));
            if (!originalUser?.token) throw new Error('No token found');

            const updatedUserWithHousehold = await householdService.joinHousehold({ inviteCode }, originalUser.token);
            toast.success(`Successfully joined "${updatedUserWithHousehold.household.name}"!`);

            const mergedUser = { ...originalUser, ...updatedUserWithHousehold };
            localStorage.setItem('user', JSON.stringify(mergedUser));

            navigate('/dashboard');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Could not join household');
        }
    };

    return (
        <form className={styles.form} onSubmit={onSubmit}>
            <h3>Join with an Invite Code</h3>
            <div className={styles.inputGroup}>
                <label htmlFor="inviteCode">Invite Code</label>
                <input type="text" id="inviteCode" name="inviteCode" value={inviteCode} onChange={(e) => setInviteCode(e.target.value)} required />
            </div>
            <button type="submit" className={styles.submitButton}>Join</button>
        </form>
    );
};
export default JoinHousehold;