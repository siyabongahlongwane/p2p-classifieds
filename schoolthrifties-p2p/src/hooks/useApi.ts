import { useState } from 'react';
import useLoaderStore from '../stores/useLoaderStore';
import { useUserStore } from '../stores/useUserStore';

const useApi = (baseUrl: string) => {
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string>('');

    const { showLoader, hideLoader } = useLoaderStore();

    const getToken = () => {
        const stored = localStorage.getItem('token');
        if (!stored || stored === 'undefined') return null;
        return stored;
    };

    const fetchData = async (url: string, options: RequestInit = {}) => {
        setLoading(true);
        setError('');

        const token = getToken();
        const defaultHeaders = {
            'Content-Type': 'application/json',
            ...(token && { Authorization: `Bearer ${token}` }),
        };

        try {
            showLoader();

            const response = await fetch(url, {
                ...options,
                headers: {
                    ...defaultHeaders,
                    ...(options.headers || {}),
                },
            });

            const result = await response.json();

            if (!response.ok) {
                const message =
                    result?.err ||
                    'An unexpected error occurred';
                setError(message);
                if(response.status === 401){
                    setTimeout(() => {
                        useUserStore.getState().removeUser();
                        window.location.href = '/sign-in';
                    }, 2000)
                }
                throw new Error(message);
            }

            setData(result.payload || []);
            return result.payload;
        } catch (err: any) {
            const fallback = err?.message || 'Unexpected error occurred';
            setError(fallback);
            throw new Error(fallback);
        } finally {
            setLoading(false);
            setTimeout(() => {
                hideLoader();
            }, 1500);
        }
    };

    const get = async (endpoint: string) => {
        return await fetchData(`${baseUrl}${endpoint}`);
    };

    const post = async (endpoint: string, payload: unknown) => {
        return await fetchData(`${baseUrl}${endpoint}`, {
            method: 'POST',
            body: JSON.stringify(payload),
        });
    };

    const put = async (endpoint: string, payload: unknown) => {
        return await fetchData(`${baseUrl}${endpoint}`, {
            method: 'PUT',
            body: JSON.stringify(payload),
        });
    };

    const remove = async (endpoint: string) => {
        return await fetchData(`${baseUrl}${endpoint}`, {
            method: 'DELETE',
        });
    };

    return { data, loading, error, get, post, put, remove };
};

export default useApi;
