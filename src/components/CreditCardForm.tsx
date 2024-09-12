
interface CreditCardFormProps {
    products: unknown[];
    onTransactionComplete: (transaction: unknown) => void;
};

export const CreditCardForm = ({ products, onTransactionComplete }: CreditCardFormProps) => {
    console.log(products, onTransactionComplete);
    return (
        <>CreditCardForm</>
    )
};