
interface TransactionListProps {
    transactions: unknown[];
};

export const TransactionList = ({ transactions }: TransactionListProps) => {
    console.log(transactions);
    return (
        <>TransactionList</>
    )
};