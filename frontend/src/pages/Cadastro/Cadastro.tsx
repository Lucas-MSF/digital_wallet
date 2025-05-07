import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import Logo from "@/components/Logo";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { formatCPF } from "@/utils/format";
import { validateEmail, validateCPF } from "@/utils/validators";
import { Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const criteriosSenha = [
  { label: "Mínimo 8 caracteres", test: (s: string) => s.length >= 8 },
  { label: "Letra maiúscula", test: (s: string) => /[A-Z]/.test(s) },
  { label: "Letra minúscula", test: (s: string) => /[a-z]/.test(s) },
  { label: "Número", test: (s: string) => /\d/.test(s) },
];

const schema = z.object({
  name: z.string().min(1, "Nome obrigatório").max(100, "Máx. 100 caracteres"),
  cpf: z
    .string()
    .min(14, "CPF inválido")
    .max(14, "CPF inválido")
    .refine(validateCPF, "CPF inválido"),
  email: z.string().refine(validateEmail, "E-mail inválido"),
  password: z
    .string()
    .min(8, "Mínimo 8 caracteres")
    .refine((v) => /[A-Z]/.test(v), "Letra maiúscula obrigatória")
    .refine((v) => /[a-z]/.test(v), "Letra minúscula obrigatória")
    .refine((v) => /\d/.test(v), "Número obrigatório"),
});
type FormType = z.infer<typeof schema>;

export default function Cadastro() {
  const [sucesso, setSucesso] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");
  const form = useForm<FormType>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", cpf: "", email: "", password: "" },
  });
  const { signIn } = useAuth();

  async function onSubmit(data: FormType) {
    setLoading(true);
    setErro("");
    setSucesso("");
    try {
      // Cadastro
      const res = await fetch("http://backend/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          cpf: data.cpf,
          password: data.password,
        }),
      });
      if (!res.ok) throw new Error("Erro ao cadastrar");
      // Login
      await signIn(data.cpf.replace(/\D/g, ""), data.password);
      setSucesso("Cadastro e login realizados com sucesso!");
      form.reset();
    } catch (e: any) {
      setErro(e.message || "Erro desconhecido");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center justify-center w-screen h-screen max-w-screen relative overflow-hidden">
      <div
        className="hidden md:block h-full flex-2 bg-cover bg-center bg-no-repeat sticky top-0"
        style={{
          backgroundImage: "url('entrar-image.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <Logo className="absolute top-5 left-5" />
      </div>
      <div className="flex-1 h-full p-5 flex flex-col items-center justify-start overflow-y-auto">
        <div className="text-sm text-gray-500 text-right w-full h-min mb-15">
          Já possui uma conta?{" "}
          <Link to="/entrar" className="text-primary">
            Entrar
          </Link>
        </div>
        <div className="w-full max-w-10/12 md:max-w-7/12 lg:max-w-5/12 space-y-4 h-full flex flex-col items-start justify-center">
          <h1 className="text-2xl font-bold mb-4 text-primary">Cadastrar</h1>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full max-w-md space-y-4"
          >
            <div>
              <Label className="mb-2" htmlFor="name">
                Nome*
              </Label>
              <Input
                id="name"
                maxLength={100}
                className="w-full border p-2 rounded"
                {...form.register("name")}
              />
              {form.formState.errors.name && (
                <span className="text-red-500 text-sm">
                  {form.formState.errors.name.message}
                </span>
              )}
            </div>
            <div>
              <Label className="mb-2" htmlFor="cpf">
                CPF*
              </Label>
              <Input
                id="cpf"
                maxLength={14}
                className="w-full border p-2 rounded"
                {...form.register("cpf", {
                  onChange: (e) =>
                    form.setValue("cpf", formatCPF(e.target.value)),
                })}
                placeholder="000.000.000-00"
              />
              {form.formState.errors.cpf && (
                <span className="text-red-500 text-sm">
                  {form.formState.errors.cpf.message}
                </span>
              )}
            </div>
            <div>
              <Label className="mb-2" htmlFor="email">
                E-mail*
              </Label>
              <Input
                id="email"
                className="w-full border p-2 rounded"
                {...form.register("email")}
              />
              {form.formState.errors.email && (
                <span className="text-red-500 text-sm">
                  {form.formState.errors.email.message}
                </span>
              )}
            </div>
            <div>
              <Label className="mb-2" htmlFor="password">
                Senha*
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  className="w-full border p-2 rounded pr-10"
                  {...form.register("password")}
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
              {form.watch("password") && (
                <div className="mt-2 space-y-1">
                  <div className="text-sm font-semibold mb-1">
                    A senha deve conter:
                  </div>
                  {criteriosSenha.map((c, i) => (
                    <div key={i} className="flex items-center text-sm">
                      <span
                        className={
                          c.test(form.watch("password"))
                            ? "text-green-600"
                            : "text-gray-600"
                        }
                      >
                        {c.label}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <Button
              type="submit"
              size="lg"
              className={`w-full bg-primary`}
              disabled={loading}
            >
              {loading ? "Enviando..." : "Cadastrar"}
            </Button>
            {sucesso && <div className="text-green-600 mt-2">{sucesso}</div>}
            {erro && <div className="text-red-600 mt-2">{erro}</div>}
          </form>
        </div>
      </div>
    </div>
  );
}
