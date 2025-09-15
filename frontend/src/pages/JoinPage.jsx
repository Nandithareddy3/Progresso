import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import householdService from '../services/householdService';
import authService from '../services/authService';

const JoinPage = () => {
    const { inviteCode } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const handleJoin = async () => {
            const user = JSON.parse(localStorage.getItem('user'));

            if (user && user.token) {
                // SCENARIO 1: User is already logged in
                try {
                    const updatedUser = await householdService.joinHousehold({ inviteCode }, user.token);
                    localStorage.setItem('user', JSON.stringify(updatedUser));
                    toast.success("Successfully joined Group!");
                    navigate('/dashboard');
                } catch (error) {
                    toast.error(error.response?.data?.message || 'Could not join Group.');
                    navigate('/dashboard');
                }
            } else {
                // SCENARIO 2: User is NOT logged in
                localStorage.setItem('pendingInviteCode', inviteCode);
                toast.info('Please create an account or log in to join the Group.');
                navigate('/register');
            }
        };

        handleJoin();
    }, [inviteCode, navigate]);

    return <h2>Processing your invitation...</h2>;
};

export default JoinPage;