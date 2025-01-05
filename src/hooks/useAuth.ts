import { Dispatch, SetStateAction, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from '../typings/User.type';
import useToastStore from '../stores/useToastStore';
import { useStore } from '../stores/store';
import { UserContext } from '../context/User/UserContext';
import useLoaderStore from '../stores/useLoaderStore';

const useAuth = () => {
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { setUser } = useContext(UserContext);
    const serverURL = import.meta.env.VITE_API_URL;
    const { showToast } = useToastStore();
    const { setField } = useStore();
    const { showLoader, hideLoader } = useLoaderStore();

    // Register function, setContextUser: () => void)

    const signUp = async (first_name: string, last_name: string, email: string, phone: string, password: string) => {
        setLoading(true);
        try {
            showLoader();
            const response = await fetch(serverURL + '/auth/sign-up', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    first_name, last_name, email, phone, password
                }),
            });

            const result = await response.json();

            if (!result.success) {
                throw new Error(result.err || 'Registration failed');
            }

            setUser(result.payload);
            localStorage.setItem('token', result.token || '');
            localStorage.setItem('user', JSON.stringify(result.payload || ''));
            setTimeout(() => {
                navigate('/home');
                showToast(result.msg, 'success');
            }, 1500);
            setError('');
        } catch (err: unknown) {
            if (err instanceof Error) {
                showToast(err.message, 'error');
                setError(err.message);
            }
            hideLoader();
        } finally {
            setLoading(false);
            setLoading(false);
        }
    };

    // Sign In function
    const signIn = async (email: string, password: string, selectedLoginMethod: string) => {
        setLoading(true);
        if (selectedLoginMethod !== 'pwd') {
            setLoading(false);
            return
        }
        try {
            showLoader();
            const response = await fetch(`${serverURL}/auth/sign-in?email=${email}&password=${password}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            const result = await response.json();

            if (!result.success) {
                throw new Error(result.err || 'Login failed');
            }

            setUser(result.payload);
            localStorage.setItem('token', result.token || '');
            localStorage.setItem('user', JSON.stringify(result.payload || ''));
            setTimeout(() => {
                navigate('/home');
                showToast('Logged in successfully', 'success');
            }, 1500);
            setError('');
        } catch (err: unknown) {
            if (err instanceof Error) {
                showToast(err.message, 'error');
                setError(err.message);
            } else if (typeof err == 'string') {
                showToast(err, 'error');
            }
            hideLoader();
        } finally {
            setLoading(false);
        }
    };

    // Logout function
    const logout = (setContextUser: Dispatch<SetStateAction<User | null>>) => {
        setContextUser(null);
        setTimeout(() => {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            setField('cart', []);
            setField('likes', []);
            navigate('/home');
        }, 500);
    };

    return {
        error,
        loading,
        signUp,
        signIn,
        logout,
    };
};

export default useAuth;
