import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './LoginPage.module.css';
import { toast } from 'react-toastify';
import authService from '../services/authService';

const RegisterPage = () => {
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const navigate = useNavigate();
    const { name, email, password } = formData;

    const onChange = (e) => {
        setFormData((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }));
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        try {
            await authService.register({ name, email, password });
            toast.success('Registration Successful!');
            navigate('/welcome');
        } catch (error) {
            const message =
                (error.response?.data?.message) || error.message || error.toString();
            toast.error(message);
        }
    };

    return (
        <div className={styles.loginPage}>

            <div className={styles.leftPanel}>
                <h1>Progresso</h1>
                <p>Bring balance to your Work, one Task at a time.</p>
            </div>


            <div className={styles.rightPanel}>
                <form className={styles.form} onSubmit={onSubmit}>
                    <h2>Create an Account</h2>

                    <div className={styles.inputGroup}>
                        <label htmlFor="name">Name</label>
                        <input type="text" id="name" name="name" value={name} onChange={onChange} required />
                    </div>

                    <div className={styles.inputGroup}>
                        <label htmlFor="email">Email</label>
                        <input type="email" id="email" name="email" value={email} onChange={onChange} required />
                    </div>

                    <div className={styles.inputGroup}>
                        <label htmlFor="password">Password</label>
                        <input type="password" id="password" name="password" value={password} onChange={onChange} required />
                    </div>

                    <button type="submit" className={styles.submitButton}>
                        Register
                    </button>

                    <p className={styles.toggleText}>
                        Already have an account? <Link to="/login">Login</Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default RegisterPage;