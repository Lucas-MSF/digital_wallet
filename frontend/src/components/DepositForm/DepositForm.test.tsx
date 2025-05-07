import React from "react";
import { render, screen, act } from "@testing-library/react";
import { Dialog } from "@radix-ui/react-dialog";
import DepositForm from "../DepositForm";

describe("DepositForm", () => {
  it("renders title correctly", async () => {
    await act(async () => {
      render(
        <Dialog open>
          <DepositForm onCancel={() => {}} onSuccess={() => {}} />
        </Dialog>
      );
    });
    expect(screen.getByText("Depósito")).toBeDefined();
  });
});
