import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import styles from './DashboardPage.module.css';
import assignmentService from '../services/assignmentService';
import householdService from '../services/householdService';
import choreService from '../services/choreService';
import userService from '../services/userService';
import { toast } from 'react-toastify';
import Modal from '../components/Modal';
import AddChoreForm from '../components/AddChoreForm';
import AssignChoreForm from '../components/AssignChoreForm';
import { FaCheck } from 'react-icons/fa';

const DashboardPage = () => {
    const [user, setUser] = useState(null);
    const [household, setHousehold] = useState(null);
    const [myAssignments, setMyAssignments] = useState([]);
    const [allAssignments, setAllAssignments] = useState([]);
    const [leaderboard, setLeaderboard] = useState([]);
    const [chores, setChores] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isAddChoreModalOpen, setIsAddChoreModalOpen] = useState(false);
    const [isAssignChoreModalOpen, setIsAssignChoreModalOpen] = useState(false);

    const fetchDashboardData = useCallback(async () => {
        try {
            const { token } = JSON.parse(localStorage.getItem('user'));
            if (!token) throw new Error("No token found");

            const [userData, myAssignmentData, leaderboardData, choreData, allAssignmentsData] = await Promise.all([
                userService.getProfile(token),
                assignmentService.getMyAssignments(token),
                householdService.getLeaderboard(token),
                choreService.getHouseholdChores(token),
                assignmentService.getHouseholdAssignments(token),
            ]);
            setUser(userData);
            setHousehold(userData.household);
            setMyAssignments(myAssignmentData);
            setLeaderboard(leaderboardData);
            setChores(choreData);
            setAllAssignments(allAssignmentsData);
        } catch (error) {
            toast.error('Could not load dashboard data.');
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        setIsLoading(true);
        fetchDashboardData();
    }, [fetchDashboardData]);

    const handleActionCompletion = () => {
        setIsAddChoreModalOpen(false);
        setIsAssignChoreModalOpen(false);
        fetchDashboardData();
    };

    const handleCompleteChore = async (assignmentId) => {
        try {
            const { token } = JSON.parse(localStorage.getItem('user'));
            await assignmentService.updateAssignmentStatus(assignmentId, true, token);
            toast.success("Task completed! Great job!");
            fetchDashboardData();
        } catch (error) {
            toast.error("Could not update Task status.");
        }
    };

    const handleCopyCode = () => {
        const inviteLink = `${window.location.origin}/join/${household.inviteCode}`;
        navigator.clipboard.writeText(inviteLink);
        toast.success('Invite link copied to clipboard!');
    };

    const isAdmin = user && household && user._id === household.admin;

    if (isLoading) { return <div className={styles.loadingContainer}><h2>Loading...</h2></div>; }
    if (!user || !household) { return <div className={styles.loadingContainer}><h2>Please complete onboarding.</h2></div>; }

    return (
        <div className={styles.dashboard}>
            {/* Modals */}
            <Modal isOpen={isAddChoreModalOpen} onClose={() => setIsAddChoreModalOpen(false)}>
                <AddChoreForm onChoreAdded={handleActionCompletion} />
            </Modal>
            <Modal isOpen={isAssignChoreModalOpen} onClose={() => setIsAssignChoreModalOpen(false)}>
                <AssignChoreForm chores={chores} members={household.members} onAssignmentCreated={handleActionCompletion} />
            </Modal>

            {/* Header */}
            <header className={styles.header}>
                <h1>{household.name}</h1>
                <div className={styles.headerActions}>
                    {isAdmin && (
                        <>
                            <button onClick={() => setIsAddChoreModalOpen(true)} className={styles.headerButton}>Add Chore</button>
                            <button onClick={() => setIsAssignChoreModalOpen(true)} className={styles.headerButton}>Assign Chore</button>
                        </>
                    )}
                </div>
            </header>

            {/* Grid */}
            <div className={styles.grid}>
                <div className={`${styles.card} ${styles.choresCard}`}>
                    <h3>My Active Chores</h3>
                    {myAssignments.filter(a => !a.isComplete).length > 0 ? (
                        myAssignments.filter(a => !a.isComplete).map((assignment) => (
                            <div key={assignment._id} className={styles.assignmentItem}>
                                <span>{assignment.chore.name}</span>
                                <div className={styles.choreActions}>
                                    <strong>{assignment.chore.points} pts</strong>
                                    <button className={styles.completeButton} onClick={() => handleCompleteChore(assignment._id)}><FaCheck /></button>
                                </div>
                            </div>
                        ))
                    ) : (<p>You have no active Tasks. Great job!</p>)}
                </div>

                <div className={`${styles.card} ${styles.leaderboardCard}`}>
                    <h3>Assigned Tasks Overview</h3>
                    {allAssignments && allAssignments.length > 0 ? (
                        allAssignments.map((assignment) => (
                            <div key={assignment._id} className={styles.assignmentItem}>
                                <span>{assignment.chore.name}</span>
                                <span className={styles.assignedToText}>{assignment.assignedTo.name}</span>
                            </div>
                        ))
                    ) : (<p>No Tasks are currently assigned.</p>)}
                </div>

                <div className={`${styles.card} ${styles.membersCard}`}>
                    <h3>Group Members</h3>
                    {household.members && household.members.length > 0 ? (
                        household.members.map(member => (
                            <div key={member._id} className={styles.memberItem}>
                                <span className={member._id === household.admin ? styles.adminName : ''}>{member.name}</span>
                                {member._id === household.admin && <span className={styles.adminLabel}>(Admin)</span>}
                            </div>
                        ))
                    ) : (<p>Your Group has no members yet.</p>)}
                    {isAdmin && (
                        <div className={styles.inviteSection}>
                            <p>Invite others with this link:</p>
                            <div className={styles.inviteCodeBox}>
                                <strong>{`${window.location.origin}/join/${household.inviteCode}`}</strong>
                                <button onClick={handleCopyCode} className={styles.cardButton}>Copy</button>
                            </div>
                        </div>
                    )}
                </div>

                {isAdmin && (
                    <div className={`${styles.card} ${styles.bankCard}`}>
                        <h3>Chore Bank</h3>
                        {chores && chores.length > 0 ? (
                            chores.map((chore) => (
                                <div key={chore._id} className={styles.assignmentItem}>
                                    <span>{chore.name}</span>
                                    <strong>{chore.points} pts</strong>
                                </div>
                            ))
                        ) : (<p>No Group in the bank yet. Add one!</p>)}
                    </div>
                )}
            </div>
        </div>
    );
};

export default DashboardPage;