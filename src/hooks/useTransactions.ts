

export const useTransactions = () => {
    return {
        transactions: [],
        setTransactions: (prev: (prev: any) => any[]) => { console.log(prev) },
        loading: false,
        error: null
    }
}