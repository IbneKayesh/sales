import { useState } from "react";
import { useBanking } from "./useBanking";
import { useToast } from "./useToast";
import {
  childAccountApis,
  childAccountCollections,
} from "../lib/api/repositories";
import { subAccountBalance } from "../lib/domain/aggregates";

export function useSubAccounts() {
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

  const [typeFilter, setTypeFilter] = useState("all");
  const [accountFilter, setAccountFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const query = search.trim().toLowerCase();
  const rows = [...savings, ...dps, ...fd].filter((account) => {
    if (typeFilter !== "all" && account.type !== typeFilter) return false;
    if (accountFilter !== "all" && account.accountId !== accountFilter) return false;
    if (!query) return true;

    return [account.accountNo, account.label, account.bankName].some((field) =>
      (field || "").toLowerCase().includes(query)
    );
  });

  const sum = (list, selector) =>
    list.reduce((total, item) => total + (Number(selector(item)) || 0), 0);

  const stats = {
    savingsBalance: savings.reduce(
      (total, account) => total + subAccountBalance(account, transactions),
      0
    ),
    dpsCount: dps.length,
    dpsPaid: sum(dps, (account) => account.totalPaid),
    dpsInterest: sum(dps, (account) => account.interestEarned),
    fdPrincipal: sum(fd, (account) => account.principal),
    fdMaturity: sum(fd, (account) => account.maturityAmount),
  };

  function openCreate(type = "Savings") {
    setEditing({ type });
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
    const type = editing && editing._id ? editing.type : values.type;
    const parent = accounts.find((item) => item._id === values.accountId);
    const bank = banks.find((item) => item._id === parent?.bankId);

    const payload = {
      ...values,
      type,
      bankId: bank?._id || "",
      bankName: bank?.name || "",
      parentAccountNo: parent?.accountNo || "",
    };

    const api = childAccountApis[type];
    const saved =
      editing && editing._id
        ? await api.update(editing._id, payload)
        : await api.create(payload);

    upsert(childAccountCollections[type], saved);
    toast.success(
      editing && editing._id
        ? `${type} sub account updated`
        : `${type} sub account added`
    );
    closeForm();
    return saved;
  }

  function requestDelete(account) {
    toast.confirm({
      title: `Delete ${account.label}?`,
      message: `${account.type} sub account ${account.accountNo} will be removed.`,
      confirmLabel: "Yes, delete",
      onConfirm: async () => {
        try {
          await childAccountApis[account.type].remove(account._id);
          remove(childAccountCollections[account.type], account._id);
          toast.success("Sub account deleted");
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
    typeFilter,
    setTypeFilter,
    accountFilter,
    setAccountFilter,
    search,
    setSearch,
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
