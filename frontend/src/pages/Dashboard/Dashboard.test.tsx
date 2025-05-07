import React from "react";
import { render, screen, act } from "@testing-library/react";
import Dashboard from ".";

describe("Dashboard page", () => {
  it("renders without crashing", async () => {
    await act(async () => {
      render(<Dashboard />);
    });
    expect(
      screen.queryAllByText(/dashboard|painel|extrato|saldo/i).length
    ).toBeGreaterThan(0);
  });
});
