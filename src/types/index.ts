export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    stockQuantity: number;
    publicImageURL?: string;
  }

  export interface Transaction {
    id: number;
    product: Product;
    status: 'PENDING' | 'APPROVED' | 'FAILED';
    totalAmount: number;
  }

  export interface TransactionData {
    productId: number;
    cardNumber: string;
    expiryDate: string;
    cvv: string;
  }