import { render } from "@testing-library/react";
import Alert from "../../components/Alert";

const mockMessage = "Mensaje de prueba";
const mockOnClose = vi.fn();

describe("Alert", () => {
  it("Hace el render correctamente", () => {
    const { asFragment } = render(<Alert message={mockMessage} onClose={mockOnClose} type="success" />);
    expect(asFragment()).toMatchSnapshot();
  })
});