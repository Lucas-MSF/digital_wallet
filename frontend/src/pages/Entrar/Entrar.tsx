import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import Logo from "@/components/Logo";
import { Eye, EyeOff } from "lucide-react";
import { formatCPF } from "@/utils/format";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const schema = z.object({
  cpf: z.string().min(14, "CPF inválido").max(14, "CPF inválido"),
  password: z.string().min(1, "Senha obrigatória"),
});
type FormType = z.infer<typeof schema>;

export default function Login() {
  const { signIn, isLoading } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const form = useForm<FormType>({
    resolver: zodResolver(schema),
    defaultValues: { cpf: "", password: "" },
  });

  async function onSubmit(data: FormType) {
    setError("");
    try {
      const cpfLimpo = data.cpf.replace(/\D/g, "");
      await signIn(cpfLimpo, data.password);
      navigate("/");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Ocorreu um erro");
    }
  }

  return (
    <div className="flex items-center justify-center w-screen h-screen">
      <div
        className="hidden md:block h-full flex-2 bg-cover bg-center bg-no-repeat relative"
        style={{
          backgroundImage: "url('entrar-image.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <Logo className="absolute top-5 left-5" />
      </div>
      <div className="flex-1 h-full p-5 flex flex-col items-center justify-start">
        <div className="text-sm text-gray-500 text-right w-full h-min">
          Ainda não possui uma conta?{" "}
          <Link to="/cadastrar" className="text-primary">
            Cadastre-se
          </Link>
        </div>
        <div className="w-full max-w-10/12 md:max-w-7/12 lg:max-w-5/12 space-y-4 h-full flex flex-col items-start justify-center">
          <h1 className="text-2xl font-bold mb-4 text-primary">Entrar</h1>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full max-w-md space-y-4"
          >
            <div>
              <Label htmlFor="cpf" className="mb-2">
                CPF
              </Label>
              <Input
                type="text"
                id="cpf"
                autoComplete="cpf"
                maxLength={14}
                className="w-full p-2 border rounded"
                {...form.register("cpf", {
                  onChange: (e) =>
                    form.setValue("cpf", formatCPF(e.target.value)),
                })}
                placeholder="000.000.000-00"
                required
              />
              {form.formState.errors.cpf && (
                <span className="text-red-500 text-sm">
                  {form.formState.errors.cpf.message}
                </span>
              )}
            </div>
            <div>
              <Label htmlFor="password" className="mb-2">
                Senha
              </Label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  autoComplete="current-password"
                  className="w-full p-2 border rounded pr-10"
                  {...form.register("password")}
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute top-1/2 right-2 -translate-y-1/2 h-8 w-8"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
              {form.formState.errors.password && (
                <span className="text-red-500 text-sm">
                  {form.formState.errors.password.message}
                </span>
              )}
            </div>
            {error && <div className={`text-sm text-red-500`}>{error}</div>}
            <Button
              type="submit"
              size="lg"
              className={`w-full bg-primary`}
              disabled={isLoading}
            >
              {isLoading ? "Carregando..." : "Entrar"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
