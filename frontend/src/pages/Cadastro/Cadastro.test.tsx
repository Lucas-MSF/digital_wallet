import { render, screen, act } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Cadastro from ".";

describe("Cadastro page", () => {
  it("renders without crashing", async () => {
    await act(async () => {
      render(
        <MemoryRouter>
          <Cadastro />
        </MemoryRouter>
      );
    });
    expect(
      screen.queryAllByText(/cadastro|criar conta|nome|email|senha/i).length
    ).toBeGreaterThan(0);
  });
});
