
interface ProductDetailsProps {
    products: unknown[];
};

export const ProductDetails = ({ products }: ProductDetailsProps) => {
    console.log(products);
    return (
        <>ProductDetails</>
    )
};