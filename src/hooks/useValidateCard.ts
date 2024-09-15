import { useCallback, useState } from "react";
import { createCardToken } from "../services/api";
import { TransactionData } from "../types";

export const useValidateCard = (cardInfo: TransactionData) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [cardToken, setCardToken] = useState<string | null>(null);

    const validateCard = useCallback(async () => {
        setLoading(true);
        try {
            const cardTokenResponse = await createCardToken(cardInfo);
            setCardToken(cardTokenResponse.data.id);
        } catch (err) {
            console.error(err);
            setError('Failed to validate card');
        } finally {
            setLoading(false);
        }
    }, [cardInfo]);

    return { cardToken, loading, error, validateCard };
}