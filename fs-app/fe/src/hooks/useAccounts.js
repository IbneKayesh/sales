import { useState } from "react";
import { useBanking } from "./useBanking";
import { useToast } from "./useToast";
import { accountsApi } from "../lib/api/repositories";
import { accountBalance } from "../lib/domain/aggregates";

export function useAccounts() {
  const {
    accounts,
    banks,
    savings,
    dps,
    fd,
    transactions,
    loading,
    reload,
    upsert,
    remove,
  } = useBanking();
  const toast = useToast();

  const [search, setSearch] = useState("");
  const [bankFilter, setBankFilter] = useState("all");
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const query = search.trim().toLowerCase();
  const rows = accounts.filter((account) => {
    if (bankFilter !== "all" && account.bankId !== bankFilter) return false;
    if (!query) return true;

    return [account.accountName, account.accountNo, account.bankName].some((field) =>
      (field || "").toLowerCase().includes(query)
    );
  });

  const stats = {
    total: accounts.length,
    balance: accounts.reduce(
      (total, account) => total + accountBalance(account, transactions),
      0
    ),
    banks: new Set(accounts.map((account) => account.bankId)).size,
    childCount: savings.length + dps.length + fd.length,
  };

  function openCreate() {
    setEditing(null);
    setFormOpen(true);
  }

  function openEdit(account) {
    setEditing(account);
    setFormOpen(true);
  }

  function closeForm() {
    setFormOpen(false);
    setEditing(null);
  }

  async function save(values) {
    const bank = banks.find((item) => item._id === values.bankId);
    const payload = {
      ...values,
      bankName: bank?.name || "",
      branch: bank?.branch || "",
    };

    const saved = editing
      ? await accountsApi.update(editing._id, payload)
      : await accountsApi.create(payload);

    upsert("accounts", saved);
    toast.success(editing ? "Bank account updated" : "Bank account added");
    closeForm();
    return saved;
  }

  function requestDelete(account) {
    toast.confirm({
      title: `Delete ${account.accountName}?`,
      message: `Bank account ${account.accountNo} will be removed. Its sub accounts stay in storage.`,
      confirmLabel: "Yes, delete",
      onConfirm: async () => {
        try {
          await accountsApi.remove(account._id);
          remove("accounts", account._id);
          toast.success("Bank account deleted");
        } catch (err) {
          toast.error(err.message);
        }
      },
    });
  }

  return {
    rows,
    accounts,
    banks,
    savings,
    dps,
    fd,
    transactions,
    loading,
    reload,
    search,
    setSearch,
    bankFilter,
    setBankFilter,
    stats,
    formOpen,
    editing,
    openCreate,
    openEdit,
    closeForm,
    save,
    requestDelete,
  };
}
