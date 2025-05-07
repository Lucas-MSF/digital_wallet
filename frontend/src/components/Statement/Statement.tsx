import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { FileText, SearchX } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

type Transaction = {
  transaction_id: string;
  id: string;
  type: string;
  amount: string;
  balance_after_transaction: string;
  safe_balance?: string;
  description?: string;
  created_at: string;
};

function translateType(t: Transaction) {
  switch (t.type) {
    case "1":
      return `Transferência`;
    case "2":
      return "Guardado no cofrinho";
    case "3":
      return "Resgatado do cofrinho";
    case "4":
      return "Depósito";
    case "5":
      return "Saque";
    default:
      return t.type;
  }
}

function formatDate(date: string) {
  const d = new Date(date);
  return (
      d.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }) +
      " - " +
      d.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })
  );
}

function getMonthRange(date: Date) {
  const start = new Date(date.getFullYear(), date.getMonth(), 1);
  const end = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  return {
    start: start.toISOString().slice(0, 10),
    end: end.toISOString().slice(0, 10),
  };
}

export default function Statement() {
  const [refDate, setRefDate] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(
        2,
        "0"
    )}`;
  });
  const [loading, setLoading] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [initialBalance, setInitialBalance] = useState(0);
  const [finalBalance, setFinalBalance] = useState(0);
  const [income, setIncome] = useState(0);
  const [outcome, setOutcome] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [, setMeta] = useState<any>(null);
  const [links, setLinks] = useState<any[]>([]);

  useEffect(() => {
    async function fetchStatement() {
      setLoading(true);
      try {
        const [year, month] = refDate.split("-").map(Number);
        const { start, end } = getMonthRange(new Date(year, month - 1));
        const params = new URLSearchParams({
          start,
          end,
          limit: "100",
          page: String(currentPage),
        });
        const response = await fetch(
            `http://backend/api/transactions?${params.toString()}`,
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${localStorage.getItem("@App:token")}`,
                "Content-Type": "application/json",
              },
            }
        );
        if (!response.ok) {
          toast.error("Erro ao buscar extrato. Tente novamente mais tarde.");
          setTransactions([]);
          return;
        }
        const res = await response.json();
        setTransactions(res.data);
        setMeta(res.meta);
        setLinks(res.meta?.links || []);
        setLastPage(res.meta?.last_page || 1);
        if (res.data?.length > 0) {
          const sorted = [...res.data].sort((a, b) =>
              a.created_at.localeCompare(b.created_at)
          );
          const first = sorted[0];
          setInitialBalance(
              parseFloat(first.balance_after_transaction) -
              parseFloat(first.amount)
          );
          setFinalBalance(
              parseFloat(sorted[sorted.length - 1].balance_after_transaction)
          );
          setIncome(
              sorted
                  .filter((t) => parseFloat(t.amount) > 0)
                  .reduce((acc, t) => acc + parseFloat(t.amount), 0)
          );
          setOutcome(
              sorted
                  .filter((t) => parseFloat(t.amount) < 0)
                  .reduce((acc, t) => acc + Math.abs(parseFloat(t.amount)), 0)
          );
        } else {
          setInitialBalance(0);
          setFinalBalance(0);
          setIncome(0);
          setOutcome(0);
        }
      } catch (e) {
        toast.error("Erro de conexão ao buscar extrato.");
        setTransactions([]);
        setInitialBalance(0);
        setFinalBalance(0);
        setIncome(0);
        setOutcome(0);
      } finally {
        setLoading(false);
      }
    }
    fetchStatement();
  }, [refDate, currentPage]);

  function handlePageChange(page: number) {
    if (page >= 1 && page <= lastPage && page !== currentPage) {
      setCurrentPage(page);
    }
  }

  return (
      <div className="border rounded-2xl p-4 flex-2 min-w-[320px] w-full mx-auto">
        <div className="flex items-center justify-between mb-5">
        <span className="font-bold text-lg flex items-center gap-2 mb-5">
          <div className="bg-primary/10 rounded-md p-2">
            <FileText className="size-5 text-primary" />
          </div>{" "}
          Extrato
        </span>
          <div className="flex gap-2 mb-4 items-center">
            <Input
                id="mes"
                type="month"
                value={refDate}
                onChange={(e) => setRefDate(e.target.value)}
                className="w-auto"
            />
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4 text-sm">
          <div className="rounded-lg border p-2 flex flex-col items-start">
            <span className="text-gray-500">Saldo inicial</span>
            <span className="font-bold">
            {initialBalance.toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            })}
          </span>
          </div>
          <div className="rounded-lg border p-2 flex flex-col items-start">
            <span className="text-gray-500">Entradas</span>
            <span className="font-bold text-green-600">
            {income.toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            })}
          </span>
          </div>
          <div className="rounded-lg border p-2 flex flex-col items-start">
            <span className="text-gray-500">Saídas</span>
            <span className="font-bold text-red-600">
            {outcome.toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            })}
          </span>
          </div>
          <div className="rounded-lg border p-2 flex flex-col items-start">
            <span className="text-gray-500">Saldo final</span>
            <span className="font-bold">
            {finalBalance.toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            })}
          </span>
          </div>
        </div>
        <div className="mb-2 text-sm font-semibold text-gray-600">
          Movimentações
        </div>
        {loading ? (
            <div className="flex flex-col gap-2">
              {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-14  w-full" />
              ))}
            </div>
        ) : transactions?.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-2 text-center py-8 text-gray-500">
              <SearchX className="size-10 text-gray-300" />
              Nenhuma transação encontrada.
            </div>
        ) : (
            <>
              <ul className="divide-y">
                {transactions?.map((t) => (
                    <li
                        key={t.transaction_id}
                        className="py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2"
                    >
                      <div>
                        <div className="font-semibold">{translateType(t)}</div>
                        <div className="text-xs text-gray-500">{t.description}</div>
                      </div>
                      <div className="flex flex-col items-end">
                  <span
                      className={
                          "font-bold " +
                          (parseFloat(t.amount) < 0
                              ? "text-red-600"
                              : "text-green-600")
                      }
                  >
                    {parseFloat(t.amount).toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </span>
                        <span className="text-xs text-gray-400">
                    {formatDate(t.created_at)}
                  </span>
                      </div>
                    </li>
                ))}
              </ul>
              {lastPage > 1 && (
                  <div className="flex justify-center gap-2 mt-6">
                    <button
                        className="px-3 py-1 rounded border text-sm disabled:opacity-50"
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                    >
                      Anterior
                    </button>
                    {links?.map((link, idx) =>
                        link.url ? (
                            <button
                                key={idx}
                                className={`px-3 py-1 rounded border text-sm ${
                                    link.active ? "bg-primary text-white" : ""
                                }`}
                                onClick={() => handlePageChange(Number(link.label))}
                                disabled={link.active || isNaN(Number(link.label))}
                            >
                              {link.label}
                            </button>
                        ) : null
                    )}
                    <button
                        className="px-3 py-1 rounded border text-sm disabled:opacity-50"
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === lastPage}
                    >
                      Próxima
                    </button>
                  </div>
              )}
            </>
        )}
      </div>
  );
}
