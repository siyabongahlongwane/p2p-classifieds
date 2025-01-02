// src/hooks/useApi.js
import { useState } from 'react';
import useLoaderStore from '../stores/useLoaderStore';

const useApi = (baseUrl: string) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const { showLoader, hideLoader } = useLoaderStore();

    const fetchData = async (url: string, options = {}) => {
        setLoading(true);
        setError(null);
        try {
            showLoader();
            const response = await fetch(url, options);
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
        setLoading(true);
        setError(null);
        try {
            showLoader();
            const response = await fetchData(`${baseUrl}${endpoint}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });
            return response;
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

    const put = async (endpoint: string, payload: any) => {
        await fetchData(`${baseUrl}${endpoint}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });
    };

    const remove = async (endpoint: string) => {
        await fetchData(`${baseUrl}${endpoint}`, {
            method: 'DELETE',
        });
    };

    return { data, loading, error, get, post, put, remove };
};

export default useApi;
