// src/__test__/App.test.tsx
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from '../store/store';
import App from '../App';

import * as productsHook from '../hooks/useProducts';
import * as transactionsHook from '../hooks/useTransactions';
import { Product } from '../types';

// Mockear useProducts
vi.mock('../hooks/useProducts');
const mockedUseProducts = vi.mocked(productsHook);

// Mockear useTransactions
vi.mock('../hooks/useTransactions');
const mockedUseTransactions = vi.mocked(transactionsHook);

afterEach(() => {
    vi.clearAllMocks();
});


test('Muestra el mensaje de cargando cuando los datos están cargando', () => {
    // Configurar los mocks para que devuelvan el estado de carga
    mockedUseProducts.useProducts.mockReturnValue({
        products: [],
        loading: true,
        error: null,
    });

    mockedUseTransactions.useTransactions.mockReturnValue({
        transactions: [],
        loading: true,
        error: null,
        setTransactions: vi.fn(),
    });

    render(
        <Provider store={store}>
            <MemoryRouter>
                <App />
            </MemoryRouter>
        </Provider>
    );

    expect(screen.getByText(/Cargando datos.../i)).toBeInTheDocument();
});

test('Muestra el mensaje de error cuando hay un error al cargar los datos', () => {
    mockedUseProducts.useProducts.mockReturnValue({
        products: [],
        loading: false,
        error: 'Error al cargar productos',
    });

    mockedUseTransactions.useTransactions.mockReturnValue({
        transactions: [],
        loading: false,
        error: null,
        setTransactions: vi.fn(),
    });

    render(
        <Provider store={store}>
            <MemoryRouter>
                <App />
            </MemoryRouter>
        </Provider>
    );

    expect(screen.getByText(/Error al cargar los datos/i)).toBeInTheDocument();
});

test('Renderiza correctamente cuando los datos se han cargado', () => {
    const mockProducts: Product[] = [
        {
            id: '1',
            name: 'Producto 1',
            description: 'Descripción del producto 1',
            price: 100,
            stockQuantity: 10,
            publicImageURL: 'https://via.placeholder.com/150',
        },
    ];

    mockedUseProducts.useProducts.mockReturnValue({
        products: mockProducts,
        loading: false,
        error: null,
    });

    const mockTransactions: never[] = [];

    mockedUseTransactions.useTransactions.mockReturnValue({
        transactions: mockTransactions,
        loading: false,
        error: null,
        setTransactions: vi.fn(),
    });

    render(
        <Provider store={store}>
            <App />
        </Provider>
    );

    // Verificamos que se muestra el nombre de la tienda
    expect(screen.getByText(/Tony Stark Shop/i)).toBeInTheDocument();

    // Verificamos que se renderiza la lista de productos
    expect(screen.getByText(/Producto 1/i)).toBeInTheDocument();
});
