import { useState } from "react";
import { useBanking } from "./useBanking";
import { useToast } from "./useToast";
import { transactionsApi } from "../lib/api/repositories";
import { transactionFlow } from "../lib/domain/aggregates";

export function useTransactions() {
  const {
    transactions,
    banks,
    accounts,
    savings,
    dps,
    fd,
    loading,
    reload,
    upsert,
    remove,
  } = useBanking();
  const toast = useToast();

  const [bankFilter, setBankFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const query = search.trim().toLowerCase();
  const rows = transactions
    .filter((tx) => {
      if (bankFilter !== "all" && tx.bankId !== bankFilter) return false;
      if (typeFilter !== "all" && tx.type !== typeFilter) return false;
      if (!query) return true;

      const legs = (tx.entries ?? []).map(
        (entry) => `${entry.name || ""} ${entry.accountNo || ""}`
      );

      return [
        tx.bankName,
        tx.description,
        tx.reference,
        tx.type,
        ...legs,
      ].some((field) => (field || "").toLowerCase().includes(query));
    })
    .sort((a, b) => String(b.date).localeCompare(String(a.date)));

  const totals = rows.reduce(
    (acc, tx) => {
      const flow = transactionFlow(tx);
      return {
        totalIn: acc.totalIn + flow.moneyIn,
        totalOut: acc.totalOut + flow.moneyOut,
      };
    },
    { totalIn: 0, totalOut: 0 }
  );

  function openCreate() {
    setEditing(null);
    setFormOpen(true);
  }

  function openEdit(transaction) {
    setEditing(transaction);
    setFormOpen(true);
  }

  function closeForm() {
    setFormOpen(false);
    setEditing(null);
  }

  async function save(values) {
    const saved = editing
      ? await transactionsApi.update(editing._id, values)
      : await transactionsApi.create(values);

    upsert("transactions", saved);
    toast.success(editing ? "Transaction updated" : "Transaction recorded");
    closeForm();
    return saved;
  }

  function requestDelete(transaction) {
    toast.confirm({
      title: "Delete transaction?",
      message: `${transaction.type} of ${transaction.amount} on ${transaction.date} will be removed from the journal.`,
      confirmLabel: "Yes, delete",
      onConfirm: async () => {
        try {
          await transactionsApi.remove(transaction._id);
          remove("transactions", transaction._id);
          toast.success("Transaction deleted");
        } catch (err) {
          toast.error(err.message);
        }
      },
    });
  }

  return {
    rows,
    transactions,
    banks,
    accounts,
    savings,
    dps,
    fd,
    loading,
    reload,
    bankFilter,
    setBankFilter,
    typeFilter,
    setTypeFilter,
    search,
    setSearch,
    stats: {
      count: rows.length,
      total: transactions.length,
      totalIn: totals.totalIn,
      totalOut: totals.totalOut,
      net: totals.totalIn - totals.totalOut,
    },
    formOpen,
    editing,
    openCreate,
    openEdit,
    closeForm,
    save,
    requestDelete,
  };
}
