import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import { useState } from "react";

const LIMITE_MAX = 10000;
const schema = z.object({
  amount: z.coerce
    .number()
    .positive("Valor deve ser maior que zero")
    .max(LIMITE_MAX, `Valor máximo é R$ ${LIMITE_MAX.toLocaleString("pt-BR")}`),
  description: z.string().max(140, "Máximo 140 caracteres").optional(),
});
type FormType = z.infer<typeof schema>;

export default function DepositForm({
  onCancel,
  onSuccess,
}: {
  onCancel: () => void;
  onSuccess: (msg: string) => void;
}) {
  const form = useForm<FormType>({
    resolver: zodResolver(schema),
    defaultValues: { amount: 0, description: "" },
  });
  const [isLoading, setIsLoading] = useState(false);

  async function onSubmit(data: FormType) {
    setIsLoading(true);
    try {
      const response = await fetch("http://backend/api/deposit", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("@App:token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: data.amount,
          description: data.description,
        }),
      });
      if (!response.ok) {
        toast.error("Erro ao depositar. Tente novamente.");
        return;
      }
      onSuccess(
        `Depósito de R$${data.amount.toLocaleString("pt-BR", {
          minimumFractionDigits: 2,
        })} realizado com sucesso!`
      );
    } catch (e) {
      toast.error("Erro ao depositar. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle>Depósito</DialogTitle>
      </DialogHeader>
      <Form {...form}>
        <form
          className="flex flex-col gap-3"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <FormField
            name="amount"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Valor*</FormLabel>
                <FormControl>
                  <Input placeholder="Valor" type="number" min="0" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="description"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Descrição</FormLabel>
                <FormControl>
                  <Input placeholder="Descrição" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <DialogFooter>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Carregando..." : "Depositar"}
            </Button>
            <DialogClose asChild>
              <Button variant="outline" type="button" onClick={onCancel}>
                Cancelar
              </Button>
            </DialogClose>
          </DialogFooter>
        </form>
      </Form>
    </>
  );
}
