import { useState } from 'react';
import useLoaderStore from '../stores/useLoaderStore';

const useApi = (baseUrl: string) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const { showLoader, hideLoader } = useLoaderStore();

    const getToken = () => {
        const stored = localStorage.getItem('token') || null;
        if (!stored || stored === 'undefined') return null;
        return stored;
    };

    const fetchData = async (url: string, options = {}) => {
        setLoading(true);
        setError(null);

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
                    ...(options as any).headers,
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            setData(result.payload);
            return result.payload;
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
            setTimeout(() => {
                setLoading(false);
                hideLoader();
            }, 1500);
        }
    };

    const get = async (endpoint: string) => {
        const data = await fetchData(`${baseUrl}${endpoint}`);
        setData(data);
        return data;
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
