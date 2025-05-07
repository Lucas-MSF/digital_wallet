import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { User, LogOut, Check } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { formatCPF } from "@/utils/format";
import { toast } from "sonner";

const editSchema = z.object({
  name: z.string().min(1, "Nome obrigatório"),
  email: z.string().email("E-mail inválido"),
  cpf: z.string().min(11, "CPF obrigatório"),
});
type EditFormType = z.infer<typeof editSchema>;

export default function UserMenu() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [editOpen, setEditOpen] = useState(false);
  const form = useForm<EditFormType>({
    resolver: zodResolver(editSchema),
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
      cpf: user?.cpf || "",
    },
    values: user
      ? { name: user.name, email: user.email, cpf: user.cpf }
      : undefined,
  });

  const updateUser = async (data: EditFormType) => {
    try {
      const response = await fetch("http://backend/api/user", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("@App:token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: data.name,
          cpf: data.cpf,
          email: data.email,
        }),
      });
      if (!response.ok) {
        toast.error("Erro ao atualizar perfil. Tente novamente.");
        return;
      }
      const res = await response.json();
      const updated = res.data;
      localStorage.setItem("@App:user", JSON.stringify(updated));
      toast.success("Perfil atualizado com sucesso!");
      window.location.reload();
    } catch (e) {
      toast.error("Erro ao atualizar perfil. Tente novamente.");
    }
  };

  const handleSignOut = async () => {
    try {
      await fetch("http://backend/api/logout", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("@App:token")}`,
        },
      });
    } catch (e) {}
    signOut();
    navigate("/entrar");
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  if (!user) {
    return (
      <div className="flex items-center space-x-4">
        <Button variant="ghost" onClick={() => navigate("/entrar")}>
          Entrar
        </Button>
        <Button onClick={() => navigate("/cadastro")}>Cadastrar</Button>
      </div>
    );
  }

  return (
    <>
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              size="icon"
              className="size-12 rounded-full cursor-pointer border-0 bg-primary text-white"
            >
              {getInitials(user.name)}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="rounded-lg">
            <div className="flex flex-col gap-1 items-center p-5">
              <Button
                size="icon"
                className="size-15 rounded-full cursor-pointer border-0 bg-primary text-white text-md"
              >
                {getInitials(user.name)}
              </Button>
              <p className="text-md font-bold mt-2">{user.name}</p>
              <p className="text-sm text-gray-500">{user.email}</p>
            </div>

            <DropdownMenuItem
              onClick={() => setEditOpen(true)}
              className="mx-2 cursor-pointer"
            >
              <User className="mr-2 h-4 w-4" />
              Editar perfil
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={handleSignOut}
              className="text-red-600 mx-2 mb-2 cursor-pointer"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sair
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <DialogContent size="sm">
          <DialogHeader>
            <DialogTitle>Editar dados do usuário</DialogTitle>
          </DialogHeader>
          <form
            className="flex flex-col gap-4 mt-2"
            onSubmit={form.handleSubmit(updateUser)}
          >
            <div>
              <label className="block text-sm font-medium mb-1">Nome*</label>
              <Input {...form.register("name")} />
              {form.formState.errors.name && (
                <span className="text-red-500 text-xs">
                  {form.formState.errors.name.message}
                </span>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">E-mail*</label>
              <Input {...form.register("email")} />
              {form.formState.errors.email && (
                <span className="text-red-500 text-xs">
                  {form.formState.errors.email.message}
                </span>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">CPF*</label>
              <Input
                {...form.register("cpf", {
                  onChange: (e) =>
                    form.setValue("cpf", formatCPF(e.target.value)),
                })}
                maxLength={14}
              />
              {form.formState.errors.cpf && (
                <span className="text-red-500 text-xs">
                  {form.formState.errors.cpf.message}
                </span>
              )}
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline" className="w-full">
                  Cancelar
                </Button>
              </DialogClose>
              <Button type="submit" className="w-full">
                Salvar
                <Check className="size-4 ml-2" />
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
