import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './LoginPage.module.css';
import { toast } from 'react-toastify';
import authService from '../services/authService';

const LoginPage = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const navigate = useNavigate();
    const { email, password } = formData;

    const onChange = (e) => {
        setFormData((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }));
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        try {
            await authService.login({ email, password });
            toast.success('Login Successful!');
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
                <p>Bring balance to your work, one task at a time.</p>
            </div>
            <div className={styles.rightPanel}>
                <form className={styles.form} onSubmit={onSubmit}>
                    <h2>Welcome Back!</h2>

                    <div className={styles.inputGroup}>
                        <label htmlFor="email">Email</label>
                        <input type="email" id="email" name="email" value={email} onChange={onChange} required />
                    </div>

                    <div className={styles.inputGroup}>
                        <label htmlFor="password">Password</label>
                        <input type="password" id="password" name="password" value={password} onChange={onChange} required />
                    </div>

                    <button type="submit" className={styles.submitButton}>
                        Login
                    </button>

                    <p className={styles.toggleText}>
                        Don't have an account? <Link to="/register">Register</Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;