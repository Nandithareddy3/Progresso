import { useState } from 'react';
import styles from './WelcomePage.module.css';
import CreateHousehold from '../components/CreateHousehold';
import JoinHousehold from '../components/JoinHousehold';
import { FaPlusCircle, FaSignInAlt } from 'react-icons/fa';

const WelcomePage = () => {
    const [view, setView] = useState('choices');
    const user = JSON.parse(localStorage.getItem('user'));
    const ChoiceCard = ({ onClick, title, description, icon, isPrimary }) => (
        <div
            className={`${styles.optionCard} ${isPrimary ? styles.primary : ''}`}
            onClick={onClick}
        >
            {icon}
            <h3>{title}</h3>
            <p className={styles.description}>{description}</p>
        </div>
    );

    const renderContent = () => {
        switch (view) {
            case 'create':
                return (
                    <>
                        <CreateHousehold />
                        <button onClick={() => setView('choices')} className={styles.backButton}>
                            ← Back to options
                        </button>
                    </>
                );
            case 'join':
                return (
                    <>
                        <JoinHousehold />
                        <button onClick={() => setView('choices')} className={styles.backButton}>
                            ← Back to options
                        </button>
                    </>
                );
            default: // 'choices' view
                return (
                    <div className={styles.optionsContainer}>
                        <ChoiceCard
                            onClick={() => setView('create')}
                            title="Create a New Group"
                            description="Set up a new shared space and become the admin."
                            icon={<FaPlusCircle size={40} color="#27ae60" />}
                            isPrimary
                        />
                        <ChoiceCard
                            onClick={() => setView('join')}
                            title="Join with an Invite Code"
                            description="Enter a code to join an existing Group."
                            icon={<FaSignInAlt size={40} color="#555" />}
                        />
                    </div>
                );
        }
    };

    return (
        <div className={styles.welcomePage}>
            <div className={styles.welcomeContent}>
                <h1>Welcome, {user.name}!</h1>
                <p>You're not part of a group yet. Get started by choosing an option below.</p>
                {renderContent()}
            </div>
        </div>
    );
};

export default WelcomePage;