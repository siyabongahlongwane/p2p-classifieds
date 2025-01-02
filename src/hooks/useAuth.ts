import { Dispatch, SetStateAction, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from '../typings/User.type';

const useAuth = () => {
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const serverURL = import.meta.env.VITE_API_URL;

    // Register function, setContextUser: () => void)
    const signUp = async (first_name: string, last_name: string, email: string, phone: string, password: string, showLoader: () => void, hideLoader: () => void) => {
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

            setTimeout(() => {
                navigate('/sign-in');
                hideLoader();
            }, 1500);
            setError('');
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message);
            }
        } finally {
            setLoading(false);
            setTimeout(() => {
                setLoading(false);
                hideLoader();
            }, 1500);
        }
    };

    // Sign In function
    const signIn = async (email: string, password: string, selectedLoginMethod: string, setContextUser: Dispatch<SetStateAction<User>>, showLoader: () => void, hideLoader: () => void) => {
        setLoading(true);
        if (selectedLoginMethod !== 'pwd') {
            console.log('GET OTP');
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

            setContextUser(result.payload);
            localStorage.setItem('token', result.token || '');
            localStorage.setItem('user', JSON.stringify(result.payload || ''));
            setTimeout(() => {
                navigate('/home');
            }, 1500);
            setError('');
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message);
            }
        } finally {
            setTimeout(() => {
                setLoading(false);
                hideLoader();
            }, 1500);
        }
    };

    // Logout function
    const logout = (setContextUser: Dispatch<SetStateAction<User | null>>) => {
        setContextUser(null);
        setTimeout(() => {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
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
