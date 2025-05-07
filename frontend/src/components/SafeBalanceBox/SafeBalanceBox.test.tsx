import React from "react";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react";
import SafeBalanceBox from "./SafeBalanceBox";

describe("SafeBalanceBox", () => {
  beforeEach(() => {
    global.fetch = jest.fn().mockImplementation((url) => {
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

  it("renders correctly", async () => {
    await act(async () => {
      render(<SafeBalanceBox onFeedback={() => {}} />);
    });
    expect(screen.getByText("Cofrinho")).toBeDefined();
    expect(screen.getByText("Depositar")).toBeDefined();
    expect(screen.getByText("Sacar")).toBeDefined();
  });

  it("changes mode to withdraw", async () => {
    await act(async () => {
      render(<SafeBalanceBox onFeedback={() => {}} />);
    });
    fireEvent.click(screen.getByText("Sacar"));
    expect(screen.getByText("Sacar do cofrinho")).toBeDefined();
  });

  it("changes mode to deposit", async () => {
    await act(async () => {
      render(<SafeBalanceBox onFeedback={() => {}} />);
    });
    fireEvent.click(screen.getByText("Depositar"));
    expect(screen.getByText("Depositar no cofrinho")).toBeDefined();
  });

  it("calls onFeedback when submitting", async () => {
    const onFeedback = jest.fn();
    await act(async () => {
      render(<SafeBalanceBox onFeedback={onFeedback} />);
    });
    const input = screen.getByPlaceholderText("R$ 0,00");
    fireEvent.change(input, { target: { value: "10" } });
    const form = input.closest("form");
    if (!form) throw new Error("Formulário não encontrado");
    fireEvent.submit(form);
    await waitFor(() => {
      expect(onFeedback).toHaveBeenCalled();
    });
  });
});
