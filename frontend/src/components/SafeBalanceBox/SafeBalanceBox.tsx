import { useEffect, useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { ArrowDownCircle, ArrowUpCircle, PiggyBank } from "lucide-react";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

const schema = z.object({
  amount: z.coerce.number().positive("Valor deve ser maior que zero"),
});
type FormType = z.infer<typeof schema>;

export default function CofrinhoBox({
  onFeedback,
}: {
  onFeedback: (msg: string) => void;
}) {
  const [balance, setBalance] = useState(0);
  const [safe_balance, setSafeBalance] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [mode, setMode] = useState<"deposit" | "withdraw">("deposit");
  const form = useForm<FormType>({
    resolver: zodResolver(schema),
    defaultValues: { amount: 0 },
  });

  useEffect(() => {
    async function fetchSafeBalance() {
      setIsLoading(true);
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
          toast.error(
            "Erro ao buscar saldo do cofrinho. Tente novamente mais tarde."
          );
          return;
        }
        const json = await response.json();
        setBalance(json.data.balance);
        setSafeBalance(json.data.safe_balance);
      } catch (e) {
        toast.error("Erro de conexão ao buscar saldo do cofrinho.");
      } finally {
        setIsLoading(false);
      }
    }
    fetchSafeBalance();
  }, []);

  async function handleDeposit(amount: number, description?: string) {
    try {
      setIsLoading(true);
      const response = await fetch("http://backend/api/piggy/deposit", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("@App:token")}`,
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify({ amount, description }),
      });
      if (!response.ok) throw new Error("Erro ao depositar no cofrinho");
      const res = await response.json();
      setBalance(res.new_balance);
      setSafeBalance(res.new_safe_balance);
      onFeedback(res.message);
    } catch (e: unknown) {
      toast.error("Erro ao depositar no cofrinho. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleWithdraw(amount: number, description?: string) {
    try {
      setIsLoading(true);
      const response = await fetch("http://backend/api/piggy/withdraw", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("@App:token")}`,
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify({ amount, description }),
      });
      if (!response.ok) throw new Error("Erro ao sacar do cofrinho");
      const res = await response.json();
      setBalance(res.new_balance);
      setSafeBalance(res.new_safe_balance);
      onFeedback(res.message);
    } catch (e: unknown) {
      toast.error("Erro ao sacar do cofrinho. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  }

  function onSubmit(data: FormType) {
    if (mode === "deposit") handleDeposit(data.amount);
    else handleWithdraw(data.amount);
    form.reset();
  }

  return (
    <div className="border rounded-xl p-4 flex-1 h-min relative mb-5 md:sticky top-5">
      <div className="flex items-center justify-between mb-5">
        <span className="font-bold text-lg flex items-center gap-2">
          <div className="bg-primary/10 rounded-md p-2">
            <PiggyBank className="size-5 text-primary" />
          </div>{" "}
          Cofrinho
        </span>
        <span className="text-primary font-bold">
          {isLoading ? (
            <Skeleton className="h-6 w-24" />
          ) : (
            (safe_balance ?? 0).toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            })
          )}
        </span>
      </div>
      <div className="flex gap-2 mb-4">
        <Button
          className="flex-1 gap-2"
          variant={mode === "deposit" ? "default" : "outline"}
          onClick={() => setMode("deposit")}
        >
          <ArrowDownCircle className="h-4 w-4" />
          Depositar
        </Button>
        <Button
          className="flex-1 gap-2"
          variant={mode === "withdraw" ? "default" : "outline"}
          onClick={() => setMode("withdraw")}
        >
          <ArrowUpCircle className="h-4 w-4" />
          Sacar
        </Button>
      </div>
      {isLoading ? (
        <Skeleton className="h-14 w-full mb-2" />
      ) : (
        <Form {...form}>
          <form
            className="flex flex-col gap-2 mb-2"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <FormField
              name="amount"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Valor*</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="R$ 0,00"
                      type="number"
                      min={0}
                      step={0.01}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading
                ? "Carregando..."
                : mode === "deposit"
                ? "Depositar no cofrinho"
                : "Sacar do cofrinho"}
            </Button>
          </form>
        </Form>
      )}
      <div className="text-xs text-gray-500 mt-2">
        Saldo principal:{" "}
        {isLoading ? (
          <Skeleton className="h-4 w-20 inline-block align-middle" />
        ) : (
          (balance ?? 0).toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
          })
        )}
      </div>
    </div>
  );
}
