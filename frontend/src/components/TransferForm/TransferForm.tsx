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
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

const transferSchema = z.object({
  accountNumber: z.string().min(1, "Número da conta obrigatório"),
  amount: z.coerce.number().positive("Valor deve ser maior que zero"),
  description: z.string().optional(),
});
type TransferFormType = z.infer<typeof transferSchema>;

export default function TransferForm({
  onCancel,
  onSuccess,
}: {
  onCancel: () => void;
  onSuccess: (msg: string) => void;
}) {
  const form = useForm<TransferFormType>({
    resolver: zodResolver(transferSchema),
    defaultValues: { accountNumber: "", amount: 0, description: "" },
  });

  async function onSubmit(data: TransferFormType) {
    try {
      const response = await fetch("http://backend/api/transfer", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("@App:token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          account: data.accountNumber,
          amount: data.amount,
          description: data.description,
        }),
      });
      if (!response.ok) {
        toast.error("Erro ao transferir. Tente novamente.");
        return;
      }
      onSuccess(
        `Transferência de R$${data.amount.toLocaleString("pt-BR", {
          minimumFractionDigits: 2,
        })} realizada com sucesso!`
      );
      onCancel();
    } catch (e) {
      toast.error("Erro ao transferir. Tente novamente.");
    }
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle>Transferência</DialogTitle>
      </DialogHeader>
      <Form {...form}>
        <form
          className="flex flex-col gap-3"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <FormField
            name="accountNumber"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Número da conta*</FormLabel>
                <FormControl>
                  <Input placeholder="Número da conta" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
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
                  <Input placeholder="Descrição (opcional)" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" type="button" onClick={onCancel}>
                Cancelar
              </Button>
            </DialogClose>
            <Button type="submit">Transferir</Button>
          </DialogFooter>
        </form>
      </Form>
    </>
  );
}
