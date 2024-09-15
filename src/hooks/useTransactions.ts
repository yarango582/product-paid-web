import { Transaction } from '../types';
import { fetchTransactions } from '../services/api';
import { useEffect, useState } from 'react';

export const useTransactions = () => {

    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadTransactions = async () => {
            try {
                const data = await fetchTransactions();
                setTransactions(data);
            } catch (err) {
                console.error(err);
                setError('Failed to load transactions');
            } finally {
                setLoading(false);
            }
        }
        loadTransactions();
    }, []);

    return { transactions, loading, error };
}