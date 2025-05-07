import React from "react";
import { render, screen, act } from "@testing-library/react";
import Statement from "./Statement";

beforeEach(() => {
  global.fetch = jest.fn().mockImplementation((url) => {
    if (url.includes("/api/transactions")) {
      return Promise.resolve({
        ok: true,
        json: async () => ({ transactions: [] }),
      });
    }
    if (url.includes("/api/balance")) {
      return Promise.resolve({
        ok: true,
        json: async () => ({ data: { balance: 100, safe_balance: 50 } }),
      });
    }
    if (
      url.includes("/api/piggy/deposit") ||
      url.includes("/api/piggy/withdraw")
    ) {
      return Promise.resolve({
        ok: true,
        json: async () => ({
          new_balance: 90,
          new_safe_balance: 60,
          message: "Operação realizada",
        }),
      });
    }
    return Promise.resolve({
      ok: true,
      json: async () => ({}),
    });
  }) as any;
});

afterEach(() => {
  jest.resetAllMocks();
});

describe("Statement", () => {
  it("correctly renders the title", async () => {
    await act(async () => {
      render(<Statement />);
    });
    expect(screen.getByText("Extrato")).toBeDefined();
  });

  it("displays empty list message", async () => {
    await act(async () => {
      render(<Statement />);
    });
    expect(
      await screen.findByText(/Nenhuma transação encontrada/i)
    ).toBeDefined();
  });
});
