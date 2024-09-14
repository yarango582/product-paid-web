import { render, screen } from "@testing-library/react";
import NotFound from "../../components/NotFound";
import { MemoryRouter } from "react-router-dom";

test("Hace el render correctamente", () => {
    render(
        <MemoryRouter>
            <NotFound />
        </MemoryRouter>
    );
    expect(screen.getByText(/404 - Página no encontrada/i)).toBeInTheDocument();
    expect(screen.getByText(/Lo sentimos, la página que estás buscando no existe./i)).toBeInTheDocument();
    expect(screen.getByText(/Volver a la página principal/i)).toBeInTheDocument();
});