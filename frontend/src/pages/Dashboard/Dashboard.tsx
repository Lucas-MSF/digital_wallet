import { useState, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, CheckCircle2, Wallet } from "lucide-react";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import TransferForm from "@/components/TransferForm";
import DepositForm from "@/components/DepositForm";
import SafeBalanceBox from "@/components/SafeBalanceBox/SafeBalanceBox";
import Statement from "@/components/Statement";
import { toast } from "sonner";

export default function Dashboard() {
  const [balance, setBalance] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [transferOpen, setTransferOpen] = useState(false);
  const [depositOpen, setDepositOpen] = useState(false);
  const [successDialog, setSuccessDialog] = useState<{
    open: boolean;
    message: string;
  }>({ open: false, message: "" });

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const response = await fetch("http://backend/api/balance", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("@App:token")}`,
            "Content-Type": "application/json",
            "Accept": "application/json",
          },
        });
        if (!response.ok) {
          toast.error("Erro ao buscar saldo. Tente novamente mais tarde.");
          setIsLoading(false);
          return;
        }
        const json = await response.json();
        setBalance(json.data.balance);
      } catch (e) {
        toast.error("Erro de conexão ao buscar saldo.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchBalance();
  }, []);

  const formatBalance = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  return (
    <div className="flex flex-col gap-10 px-4 md:px-0">
      <div className="flex flex-col md:flex-row gap-4 md:gap-0 items-start justify-between md:items-center">
        <div className="flex flex-col">
          <span className="text-md font-medium text-gray-500">Saldo</span>
          {isLoading ? (
            <Skeleton className="h-8 w-32" />
          ) : (
            <span className="text-xl font-extrabold text-primary">
              {formatBalance(balance)}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2 w-full md:w-auto">
          <Dialog open={transferOpen} onOpenChange={setTransferOpen}>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                className="flex gap-2 flex-col items-start md:items-center md:flex-row h-auto w-full md:w-auto"
                onClick={() => setTransferOpen(true)}
              >
                <ArrowUpRight className="size-6 md:size-4" />
                Transferir
              </Button>
            </DialogTrigger>
            <DialogContent>
              <TransferForm
                onCancel={() => setTransferOpen(false)}
                onSuccess={(msg) =>
                  setSuccessDialog({ open: true, message: msg })
                }
              />
            </DialogContent>
          </Dialog>
          <Button
            className="flex gap-2 flex-col items-start md:items-center md:flex-row h-auto w-full md:w-auto"
            onClick={() => setDepositOpen(true)}
          >
            <Wallet className="size-6 md:size-4" />
            Depositar
          </Button>
          <Dialog open={depositOpen} onOpenChange={setDepositOpen}>
            <DialogContent>
              <DepositForm
                onCancel={() => setDepositOpen(false)}
                onSuccess={(msg) =>
                  setSuccessDialog({ open: true, message: msg })
                }
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <div className="flex flex-col md:flex-row gap-5 flex-wrap relative">
        <SafeBalanceBox
          onFeedback={(msg) => setSuccessDialog({ open: true, message: msg })}
        />
        <Statement />
      </div>
      <Dialog
        open={successDialog.open}
        onOpenChange={(open) => setSuccessDialog((s) => ({ ...s, open }))}
      >
        <DialogContent size="sm">
          <div className="flex flex-col items-center gap-4 py-2">
            <CheckCircle2 className="size-16 text-green-600" />
            <div className="flex flex-col items-center gap-2">
              <h1 className="text-xl font-bold">Operação bem sucedida</h1>
              <span className="text-md text-center text-gray-500">
                {successDialog.message}
              </span>
            </div>
            <Button
              className="w-full"
              onClick={() => setSuccessDialog({ open: false, message: "" })}
            >
              OK
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
