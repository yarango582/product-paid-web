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
    amount?: number;
    currency?: string;
    reference?: string;
    internalTransactionId?: string;
    externalTransactionId?: string;
  }

  export interface TransactionData {
    productId: string;
    cardNumber: string;
    cardHolder: string;
    expiryDate: string;
    cvv: string;
  }

  export interface IPaymentDetails {
    cardNumber: string;
    cardHolder: string;
    expirationDate: string;
    cvv: string;
  }

  export interface IProcessPayment {
    productId: string;
    quantity: number;
    cardToken: string;
    email: string;
    paymentDetails: IPaymentDetails;
  }