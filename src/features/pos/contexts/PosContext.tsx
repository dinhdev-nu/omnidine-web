import React, { useEffect, useState, useCallback } from 'react';
import { fetchPosInit } from '@/services/pos';
import { toAppError } from '@/services/core/error';
import { PosContext, type PosContextType } from './pos-context';
import type { PosInitData } from '@/types/domain/pos-init';
import type { AppError } from '@/services/core/types';

interface PosProviderProps {
    slug: string;
    children: React.ReactNode;
}

export const PosProvider: React.FC<PosProviderProps> = ({ slug, children }) => {
    const [data, setData] = useState<PosInitData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<AppError | null>(null);

    const fetchData = useCallback(async () => {
        if (!slug?.trim()) {
            const slugError: AppError = {
                message: 'POS slug is required',
            };
            setData(null);
            setError(slugError);
            setLoading(false);
            return Promise.reject(slugError);
        }

        try {
            setLoading(true);
            setError(null);
            const result = await fetchPosInit(slug);
            setData(result);
            return;
        } catch (err) {
            const appError = toAppError(err, 'Failed to fetch POS init data');
            setData(null);
            setError(appError);
            return Promise.reject(appError);
        } finally {
            setLoading(false);
        }
    }, [slug]);

    useEffect(() => {
        fetchData().catch(() => undefined);
    }, [fetchData]);

    const value: PosContextType = {
        data,
        loading,
        error,
    };

    return <PosContext.Provider value={value}>{children}</PosContext.Provider>;
};
