import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, useNavigate } from 'react-router-dom';;
import { vi } from 'vitest';

import ProductDetails from '../../components/ProductDetails';
import { setSelectedProduct } from '../../store/productSlice';

vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
    return {
        ...actual,
        useNavigate: vi.fn(),
        useParams: () => ({ id: '1' }), // Simulamos que el parámetro id es '1'
    };
});

const mockDispatch = vi.fn();

vi.mock('react-redux', async () => {
    const actual = await vi.importActual<typeof import('react-redux')>('react-redux');
    return {
        ...actual,
        useDispatch: () => mockDispatch,
    };
});


test('Renderiza los detalles del producto correctamente', () => {
    const mockProduct = {
        id: '1',
        name: 'Producto de Prueba',
        description: 'Descripción del producto de prueba',
        price: 100,
        stockQuantity: 10,
        publicImageURL: 'https://via.placeholder.com/150',
    };

    render(
        <MemoryRouter>
            <ProductDetails products={[mockProduct]} />
        </MemoryRouter>
    );

    // Verificamos que el nombre del producto se muestra en el documento
    expect(screen.getByText('Producto de Prueba')).toBeInTheDocument();

    // Verificamos que la descripción del producto se muestra
    expect(screen.getByText('Descripción del producto de prueba')).toBeInTheDocument();

    // Verificamos que el precio se muestra
    expect(screen.getByText('Precio: $ 100')).toBeInTheDocument();

    // Verificamos que el stock se muestra
    expect(screen.getByText('Stock: 10')).toBeInTheDocument();

    // Verificamos que el botón "Comprar con tarjeta de crédito" se muestra
    expect(screen.getByRole('button', { name: /Comprar con tarjeta de crédito/i })).toBeInTheDocument();
});

test('Despacha la acción y navega al checkout al hacer clic en comprar', () => {
    const mockProduct = {
        id: '1',
        name: 'Producto de Prueba',
        description: 'Descripción del producto de prueba',
        price: 100,
        stockQuantity: 10,
        publicImageURL: 'https://via.placeholder.com/150',
    };

    const navigateMock = vi.fn();
    vi.mocked(useNavigate).mockReturnValue(navigateMock);

    render(
        <MemoryRouter>
            <ProductDetails products={[mockProduct]} />
        </MemoryRouter>
    );

    // Simulamos un clic en el botón de comprar
    fireEvent.click(screen.getByRole('button', { name: /Comprar con tarjeta de crédito/i }));

    // Verificamos que se ha despachado la acción setSelectedProduct
    expect(mockDispatch).toHaveBeenCalledWith(setSelectedProduct(mockProduct));

    // Verificamos que se ha navegado a la ruta correcta
    expect(navigateMock).toHaveBeenCalledWith(`/checkout/${mockProduct.id}`);
});
