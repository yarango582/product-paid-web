// TransactionList.test.tsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { vi, MockedFunction } from 'vitest';

import TransactionList from '../../components/TransactionList';
import { useTransactions } from '../../hooks/useTransactions';
import { Transaction } from '../../types';

// Mock del hook useTransactions
vi.mock('../../hooks/useTransactions');

afterEach(() => {
    vi.clearAllMocks();
});

test('Muestra el mensaje de carga mientras se obtienen las transacciones', () => {
    const useTransactionsMock = useTransactions as MockedFunction<typeof useTransactions>;
    useTransactionsMock.mockReturnValue({
        transactions: [],
        loading: true,
        error: null,
    });

    render(<TransactionList transactions={[]}/>);

    expect(screen.getByText('Cargando transacciones...')).toBeInTheDocument();
});

test('Muestra un mensaje de error si ocurre un error al obtener las transacciones', () => {
    const useTransactionsMock = useTransactions as MockedFunction<typeof useTransactions>;
    useTransactionsMock.mockReturnValue({
        transactions: [],
        loading: false,
        error: 'Error al obtener las transacciones',
    });

    render(<TransactionList />);

    expect(screen.getByText('Error al obtener las transacciones')).toBeInTheDocument();
});

test('Muestra un mensaje indicando que no hay transacciones si la lista está vacía', () => {
    const useTransactionsMock = useTransactions as MockedFunction<typeof useTransactions>;
    useTransactionsMock.mockReturnValue({
        transactions: [],
        loading: false,
        error: null,
    });

    render(<TransactionList />);

    expect(screen.getByText('No hay transacciones disponibles.')).toBeInTheDocument();
});

test('Renderiza la lista de transacciones correctamente y permite la paginación', () => {
    const useTransactionsMock = useTransactions as MockedFunction<typeof useTransactions>;

    // Creamos una lista de transacciones de prueba (por ejemplo, 12 transacciones)
    const mockTransactions: Transaction[] = Array.from({ length: 12 }, (_, index) => ({
        id: `txn_${index + 1}`,
        externalTransactionId: `ext_txn_${index + 1}`,
        status: index % 2 === 0 ? 'APPROVED' : 'FAILED',
        amount: (index + 1) * 10,
        product: {
            id: `prod_${index + 1}`,
            name: `Producto ${index + 1}`,
            description: `Descripción del producto ${index + 1}`,
            price: (index + 1) * 10,
            stockQuantity: 100,
            publicImageURL: 'https://via.placeholder.com/150',
        },
        quantity: index + 1,
        totalAmount: (index + 1) * 10,
        currency: 'USD',
        internalTransactionId: `int_txn_${index + 1}`,
        reference: `Ref ${index + 1}`,
    }));

    useTransactionsMock.mockReturnValue({
        transactions: mockTransactions,
        loading: false,
        error: null,
    });

    render(<TransactionList />);

    // Verificamos que se muestran las transacciones de la primera página (5 transacciones por página)
    for (let i = 0; i < 5; i++) {
        expect(screen.getByText(`Producto ${i + 1}`)).toBeInTheDocument();
    }

    // Verificamos que las transacciones de la segunda página no se muestran aún
    expect(screen.queryByText('Producto 6')).not.toBeInTheDocument();

    // Navegamos a la siguiente página
    fireEvent.click(screen.getByText('Siguiente'));

    // Verificamos que ahora se muestran las transacciones de la segunda página
    for (let i = 5; i < 10; i++) {
        expect(screen.getByText(`Producto ${i + 1}`)).toBeInTheDocument();
    }

    // Navegamos a la última página
    fireEvent.click(screen.getByText('Siguiente'));

    // Verificamos que se muestran las transacciones de la tercera página
    for (let i = 10; i < 12; i++) {
        expect(screen.getByText(`Producto ${i + 1}`)).toBeInTheDocument();
    }

    // Verificamos que el botón "Siguiente" está deshabilitado en la última página
    expect(screen.getByText('Siguiente')).toBeDisabled();

    // Navegamos a la página anterior
    fireEvent.click(screen.getByText('Anterior'));

    // Verificamos que el botón "Anterior" está habilitado
    expect(screen.getByText('Anterior')).not.toBeDisabled();
});
