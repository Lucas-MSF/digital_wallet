import React from "react";
import { Dialog } from "@radix-ui/react-dialog";
import "@testing-library/jest-dom";
import { render, screen, act } from "@testing-library/react";
import TransferForm from "./TransferForm";

describe("TransferForm", () => {
  it("renders transfer form correctly", async () => {
    await act(async () => {
      render(
        <Dialog open>
          <TransferForm onCancel={() => {}} onSuccess={() => {}} />
        </Dialog>
      );
    });
    expect(screen.getByText("Transferência")).toBeInTheDocument();
    expect(screen.getByLabelText(/Número da conta/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Valor/i)).toBeInTheDocument();
  });
});
