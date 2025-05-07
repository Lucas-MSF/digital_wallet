import { render, screen, act } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import NotFound from ".";

describe("NotFound page", () => {
  it("renders without crashing", async () => {
    await act(async () => {
      render(
        <MemoryRouter>
          <NotFound />
        </MemoryRouter>
      );
    });
    expect(
      screen.queryAllByText(/404|não encontrado|not found/i).length
    ).toBeGreaterThan(0);
  });
});
