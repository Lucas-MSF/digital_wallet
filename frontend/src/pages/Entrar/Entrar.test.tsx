import { render, screen, act } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Entrar from ".";

describe("Entrar page", () => {
  it("renders without crashing", async () => {
    await act(async () => {
      render(
        <MemoryRouter>
          <Entrar />
        </MemoryRouter>
      );
    });
    expect(
      screen.getAllByText(/entrar|login|cpf|senha/i).length
    ).toBeGreaterThan(0);
  });
});
